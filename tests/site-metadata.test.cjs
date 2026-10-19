const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const sharp = require('sharp');

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
const translations = load('src/lib/translations.ts', {
  './contact': load('src/lib/contact.ts'), './gallery-projects.json': projects,
});
function metadata(flag, environment) {
  if (flag === undefined) delete process.env.ATD_INDEXING_ENABLED;
  else process.env.ATD_INDEXING_ENABLED = flag;
  process.env.VERCEL_ENV = environment;
  return load('src/lib/site-metadata.ts', { './navigation': navigation, './tips-content': translations });
}

test('review-site sharing identities stay on the working host for every LT/EN page', () => {
  const site = metadata(undefined, 'production');
  for (const page of navigation.PAGE_PATHS) for (const lang of ['lt', 'en']) {
    const result = site.pageMetadata(page, lang);
    const expected = 'https://new.atd.lt' + navigation.localizedPath(page, lang);
    assert.equal(result.openGraph.url, expected);
    assert.equal(result.alternates.canonical, expected);
    for (const url of Object.values(result.alternates.languages)) assert(new URL(url).hostname === 'new.atd.lt');
    assert.equal(result.openGraph.images[0].url, 'https://new.atd.lt/images/og-atd-home-20261019.jpg');
    assert.equal(result.twitter.images[0], result.openGraph.images[0].url);
    assert.equal(site.SITE_ROBOTS.index, false);
  }
});

test('primary launch switches identities to atd.lt while branch previews stay noindex', () => {
  const liveSite = metadata('true', 'production');
  const live = liveSite.pageMetadata('/atsiliepimai', 'lt');
  assert.equal(live.openGraph.url, 'https://atd.lt/atsiliepimai');
  assert.equal(live.alternates.canonical, live.openGraph.url);
  assert(live.openGraph.images[0].url.startsWith('https://atd.lt/'));
  assert.equal(liveSite.SITE_ROBOTS.index, true);
  const previewSite = metadata('true', 'preview');
  const preview = previewSite.pageMetadata('/atsiliepimai', 'lt');
  assert.equal(preview.openGraph.url, 'https://new.atd.lt/atsiliepimai');
  assert.equal(previewSite.SITE_ROBOTS.index, false);
});

test('project stories retain project covers and use the working page host', () => {
  const site = metadata(undefined, 'production');
  const gallery = load('src/lib/gallery-seo.ts', {
    './gallery-projects.json': projects, './site-metadata': site, './navigation': navigation,
  });
  const project = projects.find(p => p.id === 'nok-nok-home');
  const result = gallery.projectMetadata(project, 'en');
  assert.equal(result.openGraph.url, 'https://new.atd.lt/en/darbai/nok-nok-home');
  assert.equal(result.alternates.canonical, result.openGraph.url);
  assert(result.openGraph.images[0].url.includes('/images/projects/nok-nok-home/'));
});

test('shared homepage image is a decodable 1200 by 630 JPEG, including the previous asset URL', async () => {
  const current = fs.readFileSync('public/images/og-atd-home-20261019.jpg');
  assert.deepEqual(fs.readFileSync('public/images/og-atd.jpg'), current);
  const image = await sharp(current).metadata();
  assert.equal(image.width, 1200); assert.equal(image.height, 630); assert.equal(image.format, 'jpeg');
  assert(current.length < 1000000);
});
