/* eslint-disable @typescript-eslint/no-require-imports -- Transpile the real proxy for HTTP behavior checks. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { NextRequest } = require('next/server');
// This Next build still exports the earlier helper name despite the proxy docs.
const { unstable_doesMiddlewareMatch: doesProxyMatch, getRewrittenUrl } = require('next/experimental/testing/server');

function load(file, overrides = {}) {
  const absolute = path.resolve(file);
  const loaded = new Module(absolute, module);
  loaded.paths = module.paths;
  loaded.require = id => id in overrides ? overrides[id] : require(id);
  loaded._compile(ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, absolute);
  return loaded.exports;
}
const projects = require('../src/lib/gallery-projects.json');
const navigation = load('src/lib/navigation.ts');
const messages = load('src/lib/translations.ts', { './contact': load('src/lib/contact.ts'), './gallery-projects.json': projects });
const { proxy, config } = load('src/proxy.ts', {
  '@/lib/navigation': navigation, '@/lib/gallery-projects.json': projects, '@/lib/translations': messages,
});

function request(host, page, method = 'GET') {
  return new NextRequest(`https://${host}${page}`, { headers: { host }, method });
}

test('retired shop, private API and static-looking URLs all return410 without redirecting to unrelated content', async () => {
  for (const page of ['/', '/en/shop?order=name+asc', '/web/login', '/contactus', '/sitemap.xml', '/favicon.ico', '/api/lead', '/_next/static/old.js']) {
    assert(doesProxyMatch({ config, nextConfig: {}, url: `https://news.atd.lt${page}`, headers: { host: 'news.atd.lt' } }), page);
    const response = proxy(request('news.atd.lt', page));
    assert.equal(response.status, 410, page);
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    const text = await response.text();
    assert(text.includes(messages.retiredWebsiteMessage.lt));
    assert(text.includes(messages.retiredWebsiteMessage.en));
  }
  assert.equal(proxy(request('news.atd.lt', '/api/lead', 'POST')).status, 410);
});

test('retired host robots allows crawlers to discover the permanent removal', async () => {
  const response = proxy(request('news.atd.lt', '/robots.txt'));
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'User-agent: *\nAllow: /\n');
});

test('live, preview and unrelated hosts keep their existing routing and API/static exclusions', () => {
  for (const host of ['atd.lt', 'new.atd.lt', 'atd-lt.vercel.app', 'news.atd.lt.example.com']) {
    assert.equal(getRewrittenUrl(proxy(request(host, '/darbai'))), `https://${host}/lt/darbai`);
    for (const page of ['/api/lead', '/robots.txt', '/sitemap.xml', '/_next/static/app.js']) {
      assert.equal(doesProxyMatch({ config, nextConfig: {}, url: `https://${host}${page}`, headers: { host } }), false, host + page);
    }
  }
});
