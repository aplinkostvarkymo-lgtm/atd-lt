/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node.js CommonJS test harness. */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('../../node_modules/typescript');
const base = path.resolve(__dirname, '../..');
const results = [];

function setup({ emailStatus = 200, storageFails = false, redisFails = false } = {}) {
  const callbacks = [], saved = [], errors = [], calls = [], cache = new Map();
  const env = { RESEND_API_KEY: 'MOCK_ONLY', ...(redisFails ? { UPSTASH_REDIS_REST_URL: 'https://redis.test', UPSTASH_REDIS_REST_TOKEN: 'MOCK_ONLY' } : {}) };
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const auditModule = { exports: {} }; cache.set(file, auditModule);
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const customRequire = name => {
      if (name === 'next/server') return { after: callback => callbacks.push(callback) };
      if (name === '@/lib/airtable') return { saveLead: async data => { if (storageFails) throw new Error('MOCK storage failure'); saved.push(data); } };
      if (name.startsWith('node:')) return require(name);
      return load(name.startsWith('@/') ? path.join(base, 'src', name.slice(2) + '.ts') : path.resolve(path.dirname(file), name + '.ts'));
    };
    vm.runInNewContext(source, { module: auditModule, exports: auditModule.exports, require: customRequire, process: { env }, Request, Response, TextDecoder, AbortSignal, Date, console: { error: (...args) => errors.push(args.map(String)), warn() {} }, fetch: async (url, options) => {
      calls.push({ url, options });
      if (url === 'https://redis.test') return new Response('{}', { status: 503 });
      assert.equal(url, 'https://api.resend.com/emails');
      return new Response('{}', { status: emailStatus });
    } });
    return auditModule.exports;
  }
  return { ...load(path.join(base, 'src/app/api/lead/route.ts')), callbacks, saved, errors, calls };
}
const valid = { vardas: 'Bandomasis vardas', telefonas: '+370 657 85096', email: 'test@example.test' };
const request = data => new Request('http://localhost/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

(async () => {
  const cases = [
    ['honeypot', { ...valid, company: 'Bot' }, 200, 0],
    ['missing-phone', { vardas: 'Test' }, 400, 0],
    ['invalid-phone', { ...valid, telefonas: 'x' }, 400, 0],
    ['invalid-email', { ...valid, email: 'not-email' }, 400, 0],
    ['negative-area', { ...valid, plotas: '-100' }, 400, 0],
    ['nonfinite-area', { ...valid, plotas: 'Infinity' }, 400, 0],
    ['unknown-service', { ...valid, paslauga: 'unknown' }, 400, 0],
    ['long-service', { ...valid, paslauga: 'x'.repeat(1000) }, 400, 0],
    ['wrong-type', { ...valid, vardas: 123 }, 400, 0],
    ['valid', { ...valid, plotas: '250.5', paslauga: 'Tvenkiniai' }, 200, 1],
  ];
  for (const [name, data, status, saveCount] of cases) {
    const route = setup(); const response = await route.POST(request(data));
    assert.equal(response.status, status, name); assert.equal(route.saved.length, saveCount, name);
    results.push({ name, status, saved: saveCount });
  }
  const large = setup();
  assert.equal((await large.POST(request({ ...valid, zinute: 'x'.repeat(20000) }))).status, 413);
  results.push({ name: 'bounded-stream', status: 413 });
  const repeated = setup();
  const statuses = [];
  for (let i = 0; i < 6; i++) statuses.push((await repeated.POST(request(valid))).status);
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]); assert.equal(repeated.saved.length, 5);
  results.push({ name: 'rate-limit-before-provider', statuses, saved: repeated.saved.length });
  const failedEmail = setup({ emailStatus: 429 });
  assert.equal((await failedEmail.POST(request(valid))).status, 200);
  assert.equal(failedEmail.callbacks.length, 1); assert.equal(failedEmail.calls.length, 0);
  await failedEmail.callbacks[0](); assert.equal(failedEmail.errors.length, 1);
  results.push({ name: 'email-after-response-registered-and-http-error-logged', callbacks: 1, errors: 1 });
  const failedStorage = setup({ storageFails: true });
  assert.equal((await failedStorage.POST(request(valid))).status, 502); assert.equal(failedStorage.callbacks.length, 0);
  results.push({ name: 'storage-failure-no-email', status: 502 });
  const failedRedis = setup({ redisFails: true });
  assert.equal((await failedRedis.POST(request(valid))).status, 503); assert.equal(failedRedis.saved.length, 0);
  results.push({ name: 'configured-shared-limit-fails-closed', status: 503 });
  const result = { passed: results.length, externalWrites: 0, cases: results };
  fs.writeFileSync(path.join(__dirname, 'lead-fixes-results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
