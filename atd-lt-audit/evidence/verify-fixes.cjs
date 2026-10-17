/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node.js CommonJS verification. */
const { chromium } = require('C:/Users/aplin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'atd-lt-audit/after');
const base = 'http://localhost:3100';
const routes = ['/', '/paslaugos/veja', '/paslaugos/apzeldinimas', '/paslaugos/trinkeles', '/paslaugos/laistymas', '/paslaugos/tvenkiniai', '/kontaktai', '/darbai'];
const local = (r, lang) => lang === 'lt' ? r : '/en' + (r === '/' ? '' : r);

(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = { tests: [], pages: [], errors: [], hero: {}, browser: browser.version() };
  async function test(name, callback) {
    try { const details = await callback(); report.tests.push({ name, passed: true, details }); console.log('PASS', name); }
    catch (error) { report.tests.push({ name, passed: false, error: error.message }); console.log('FAIL', name, error.message.slice(0, 240)); }
  }
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
      await context.addInitScript(() => localStorage.setItem('atd-cookie-consent', 'rejected'));
      const page = await context.newPage(); page.setDefaultTimeout(7000);
      page.on('pageerror', error => report.errors.push(error.message));
      for (const lang of ['lt', 'en']) for (const route of routes) {
        const url = local(route, lang);
        await test(`${width} ${url}`, async () => {
          const response = await page.goto(base + url, { waitUntil: 'networkidle', timeout: 25000 });
          assert.equal(response.status(), 200);
          if (route === '/') {
            const video = page.locator('video');
            if (await video.count()) {
              const state = await video.evaluate(v => ({ src: v.currentSrc, rate: v.playbackRate, paused: v.paused, currentTime: v.currentTime, duration: v.duration }));
              report.hero[`${width}-${lang}`] = state;
              if (width === 1440 && lang === 'lt') await page.screenshot({ path: path.join(out, 'doors-intro.png') });
              assert.equal(state.rate, 2);
            }
            await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.hero-copy')).opacity) > .99, { timeout: 13000 });
          }
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(resolve => setTimeout(resolve, 100)); }
            window.scrollTo({ top: 0, behavior: 'instant' });
          });
          await page.waitForTimeout(700);
          const data = await page.evaluate(() => ({ lang: document.documentElement.lang, title: document.title, canonical: document.querySelector('link[rel=canonical]')?.href, h1: [...document.querySelectorAll('h1')].map(e => e.innerText), overflow: document.scrollingElement.scrollWidth > innerWidth, schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map(e => JSON.parse(e.textContent)), og: document.querySelector('meta[property="og:image"]')?.content, internalLinks: [...document.querySelectorAll('main a[href^="/"]')].map(e => e.getAttribute('href')) }));
          assert.equal(data.lang, lang); assert.equal(data.h1.length, 1); assert.equal(data.overflow, false);
          assert.equal(data.canonical, 'https://atd.lt' + url);
          assert.ok(data.og.endsWith('/images/og-atd.jpg'));
          if (lang === 'en') assert.ok(data.internalLinks.every(href => href.startsWith('/en')));
          if (route.startsWith('/paslaugos/')) assert.ok(data.schemas.some(s => s['@type'] === 'Service'));
          report.pages.push({ width, route: url, ...data });
          if (['/', '/darbai', '/kontaktai', '/paslaugos/veja'].includes(route)) await page.screenshot({ path: path.join(out, `${lang}-${route === '/' ? 'home' : route.replaceAll('/', '-').slice(1)}-${width}.png`), fullPage: true });
          return { title: data.title, h1: data.h1[0], canonical: data.canonical };
        });
      }
      await page.goto(base + '/darbai', { waitUntil: 'networkidle' });
      if (width === 1440) {
        await test('keyboard dropdown and pointer gap', async () => {
          const button = page.locator('header').getByRole('button', { name: 'Paslaugos', exact: true });
          await page.mouse.move(1400, 800); await button.focus(); await page.keyboard.press('Enter');
          await page.locator('header a[href="/paslaugos/veja"]').waitFor({ state: 'visible' });
          await page.keyboard.press('Escape'); await page.waitForTimeout(250);
          await button.hover(); await page.waitForTimeout(200); const b = await button.boundingBox();
          await page.mouse.move(b.x + b.width / 2, b.y + b.height + 6); await page.waitForTimeout(200);
          assert.equal(await button.getAttribute('aria-expanded'), 'true');
          await page.keyboard.press('Escape'); await page.mouse.move(1400, 800);
        });
      } else {
        await test('mobile menu Escape and focus', async () => {
          const trigger = page.getByRole('button', { name: 'Atidaryti meniu' }); await trigger.click();
          await page.getByRole('dialog').waitFor({ state: 'visible' });
          assert.ok(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)));
          await page.screenshot({ path: path.join(out, 'mobile-menu.png') });
          await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(), 0);
          assert.equal(await trigger.evaluate(e => e === document.activeElement), true);
        });
      }
      await test(`gallery dialog ${width}`, async () => {
        const trigger = page.getByRole('button', { name: 'Ruloninė veja su dryžiais', exact: true }); await trigger.click();
        await page.getByRole('dialog').waitFor({ state: 'visible' }); assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
        await page.keyboard.press('Tab'); assert.ok(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)));
        await page.screenshot({ path: path.join(out, `lightbox-${width}.png`) });
        await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(), 0);
        assert.equal(await trigger.evaluate(e => e === document.activeElement), true);
        assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
      });
      if (width === 390) await test('mobile hero service strip clear of sticky CTA', async () => {
        await page.goto(base, { waitUntil: 'networkidle' });
        const service = page.getByRole('button', { name: 'Vejos įrengimas', exact: true });
        const b = await service.boundingBox(); const cta = await page.locator('.mobile-sticky-cta').boundingBox(); assert.ok(b.y + b.height <= cta.y);
        await service.click(); await page.getByRole('dialog').waitFor({ state: 'visible' });
        await page.screenshot({ path: path.join(out, 'service-popup-mobile.png') });
        await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(), 0);
      });
      await test(`language links ${width}`, async () => {
        await page.goto(base + '/darbai', { waitUntil: 'networkidle' }); await page.getByRole('link', { name: 'Switch to English' }).first().click();
        await page.waitForURL('**/en/darbai'); await page.getByRole('heading', { name: 'Our Work', exact: true }).waitFor();
        assert.equal(await page.locator('html').getAttribute('lang'), 'en'); assert.ok((await page.title()).includes('Our Work'));
      });
      await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage(); page.setDefaultTimeout(7000);
    await test('cookie settings reopen and reject', async () => {
      await page.goto(base + '/darbai', { waitUntil: 'networkidle' }); await page.getByRole('button', { name: 'Atmesti', exact: true }).click();
      await page.getByRole('button', { name: 'Slapukų nustatymai', exact: true }).click();
      await page.getByRole('region', { name: 'Slapukų pasirinkimas' }).waitFor({ state: 'visible' });
      await page.getByRole('button', { name: 'Sutinku', exact: true }).click();
      await page.getByRole('button', { name: 'Slapukų nustatymai', exact: true }).click(); await page.getByRole('button', { name: 'Atmesti', exact: true }).click();
      assert.equal(await page.evaluate(() => localStorage.getItem('atd-cookie-consent')), 'rejected');
    });
    await test('form error recovery, rate limit and announced success without external writes', async () => {
      let status = 502; const bodies = [];
      await page.route('**/api/lead', async route => { bodies.push(route.request().postDataJSON()); await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ success: status === 200 }) }); });
      await page.goto(base + '/en/kontaktai', { waitUntil: 'networkidle' });
      await page.locator('#name').fill('Test'); await page.locator('#phone').fill('+370 657 85096'); await page.locator('#service').selectOption('tvenkiniai');
      const submit = page.locator('form button[type=submit]'); await submit.click(); await page.locator('form [role="alert"]').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#name').inputValue(), 'Test'); status = 429; await submit.click(); await page.getByText('Too many requests.', { exact: false }).waitFor();
      status = 200; await submit.click(); await page.waitForFunction(() => document.activeElement?.getAttribute('role') === 'status');
      assert.equal(bodies[0].paslauga, 'Tvenkiniai'); assert.equal(await page.locator('form').count(), 0);
    });
    await context.close();
    const reduced = await browser.newContext({ reducedMotion: 'reduce' }); const rp = await reduced.newPage();
    await test('reduced motion has no video or infinite pulse', async () => {
      await rp.goto(base, { waitUntil: 'networkidle' }); await rp.waitForTimeout(2800);
      assert.equal(await rp.locator('video').count(), 0);
      assert.equal(await rp.evaluate(() => document.getAnimations().filter(a => a.effect?.getTiming().iterations === Infinity).length), 0);
    }); await reduced.close();
    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } }); const np = await nojs.newPage();
    await test('no-JS hero copy and real stats visible', async () => {
      await np.goto(base, { waitUntil: 'networkidle' });
      assert.equal(await np.locator('.hero-copy').evaluate(e => getComputedStyle(e).opacity), '1');
      assert.equal(await np.locator('video').evaluate(e => getComputedStyle(e).display), 'none');
      assert.ok((await np.locator('main').innerText()).includes('170+'));
      await np.screenshot({ path: path.join(out, 'no-js-home-mobile.png'), fullPage: true });
    }); await nojs.close();
    const blocked = await browser.newContext(); const bp = await blocked.newPage();
    await test('video failure reveals static hero', async () => {
      await bp.route('**/videos/hero.mp4', route => route.abort()); await bp.goto(base, { waitUntil: 'networkidle' });
      await bp.waitForFunction(() => Number(getComputedStyle(document.querySelector('.hero-copy')).opacity) > .99, { timeout: 13000 });
    }); await blocked.close();
    await test('sitemap 16 canonical language URLs and legacy redirects', async () => {
      const xml = await (await fetch(base + '/sitemap.xml')).text(); assert.equal((xml.match(/<loc>/g) || []).length, 16); assert.ok(xml.includes('hreflang="en"'));
      for (const [url, status, destination] of [['/lt/gallery/old', 308, '/darbai'], ['/lt/pages/2187/old', 308, '/paslaugos/veja'], ['/lt/pages/1936/old', 404], ['/not-a-page', 404]]) {
        const response = await fetch(base + url, { redirect: 'manual' }); assert.equal(response.status, status, url); if (destination) assert.equal(response.headers.get('location'), destination);
      }
    });
    await test('original doors asset unchanged', async () => {
      const hash = data => crypto.createHash('sha256').update(data).digest('hex');
      const current = hash(await fs.readFile(path.join(root, 'public/videos/hero.mp4')));
      const original = hash(execFileSync('git', ['show', 'HEAD:public/videos/hero.mp4'], { cwd: root, maxBuffer: 10000000 })); assert.equal(current, original);
      return { sha256: current };
    });
  } finally {
    report.passed = report.tests.filter(test => test.passed).length; report.failed = report.tests.filter(test => !test.passed).length;
    await fs.writeFile(path.join(out, 'verification.json'), JSON.stringify(report, null, 2)); await browser.close();
    console.log('RESULT', report.passed, 'passed,', report.failed, 'failed,', report.errors.length, 'pageerrors');
    if (report.failed || report.errors.length) process.exitCode = 1;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
