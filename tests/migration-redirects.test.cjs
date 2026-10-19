/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS test harness loads the transpiled Next config. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const ts = require('typescript');
const { unstable_getResponseFromNextConfig, getRedirectUrl } = require('next/experimental/testing/server');

const configFile = path.resolve('next.config.ts');
const loaded = new Module(configFile, module);
loaded.paths = module.paths;
loaded._compile(ts.transpileModule(fs.readFileSync(configFile, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, configFile);
const nextConfig = loaded.exports.default;

test('legacy work, community and groundworks links reach their specific content in one permanent hop', async () => {
  const cases = [
    [1945, '/darbai'],
    [1949, '/darbai/kuo-vardu-tavo-zuvis'],
    [1936, '/paslaugos/apzeldinimas#grunto-darbai'],
  ];
  for (const [id, target] of cases) for (const prefix of ['/lt/pages/', '/lt/lt/pages/']) {
    for (const suffix of ['', '/aplinkos-tvarkymas/old-title']) {
      // Next's experimental test helper appends queries after destination hashes.
      // Hash + query preservation is checked against the running HTTP server.
      const query = target.includes('#') ? '' : '?utm_source=old-link';
      const response = await unstable_getResponseFromNextConfig({
        url: `https://atd.lt${prefix}${id}${suffix}${query}`, nextConfig,
      });
      assert.equal(response.status, 308);
      const destination = new URL(getRedirectUrl(response));
      assert.equal(destination.origin, 'https://atd.lt');
      assert.equal(destination.pathname + destination.hash, target);
      if (query) assert.equal(destination.searchParams.get('utm_source'), 'old-link');
    }
  }
});

test('every mapped legacy topic also supports the broken doubled language prefix without chains', async () => {
  const rules = await nextConfig.redirects();
  const canonicalRules = rules.filter(rule => rule.source.startsWith('/lt/pages/'));
  for (const rule of canonicalRules) {
    const source = rule.source.replace('/lt/pages/', '/lt/lt/pages/').replace('/:path*', '/old/nested/title');
    const response = await unstable_getResponseFromNextConfig({ url: `https://atd.lt${source}`, nextConfig });
    assert.equal(response.status, 308, source);
    const target = new URL(getRedirectUrl(response));
    assert.equal(target.pathname + target.hash, rule.destination, source);
    assert(!target.pathname.startsWith('/lt/'), source + ' must reach the final public route');
  }
});

test('unverified old topics are not swept into unrelated homepage redirects', async () => {
  for (const id of [1938, 2131, 2192, 2132, 2189, 2195, 1935, 2198]) {
    for (const prefix of ['/lt/pages/', '/lt/lt/pages/']) {
      const response = await unstable_getResponseFromNextConfig({ url: `https://atd.lt${prefix}${id}/old`, nextConfig });
      assert.equal(getRedirectUrl(response), null, `${prefix}${id}`);
    }
  }
});
