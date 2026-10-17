/* eslint-disable @typescript-eslint/no-require-imports -- Standalone browser verification. */
const { chromium } = require('C:/Users/aplin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const out = path.resolve(__dirname, '../after/links');
const routes = ['/', '/paslaugos/veja', '/paslaugos/apzeldinimas', '/paslaugos/trinkeles', '/paslaugos/laistymas', '/paslaugos/tvenkiniai', '/darbai', '/kontaktai'];
(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = { tests: [], errors: [] };
  async function test(name, callback) {
    try { report.tests.push({ name, passed: true, details: await callback() }); console.log('PASS', name); }
    catch (error) { report.tests.push({ name, passed: false, error: error.message }); console.log('FAIL', name, error.message); }
  }
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await ctx.addInitScript(() => localStorage.setItem('atd-cookie-consent', 'rejected'));
  const page = await ctx.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  try {
    for (const lang of ['lt', 'en']) for (const route of routes) {
      await test(`${lang} ${route}: arrows, labels, layout`, async () => {
        await page.goto(`http://localhost:3100${lang === 'en' ? '/en' : ''}${route === '/' && lang === 'en' ? '' : route}`, { waitUntil: 'networkidle' });
        const details = await page.evaluate(() => ({
          arrows: document.querySelectorAll('.cta-arrow').length,
          underlines: document.querySelectorAll('.link-underline').length,
          overflow: document.documentElement.scrollWidth > innerWidth,
          leakedProps: document.querySelectorAll('a[arrow],a[underline]').length,
          decorative: [...document.querySelectorAll('.cta-arrow')].every(n => n.getAttribute('aria-hidden') === 'true'),
        }));
        assert(!details.overflow && !details.leakedProps && details.decorative);
        assert(details.underlines >= 10);
        assert(details.arrows >= (route === '/kontaktai' ? 0 : 1));
        return details;
      });
    }
    await page.goto('http://localhost:3100/paslaugos/veja', { waitUntil: 'networkidle' });
    await test('Mouse: underline draws, CTA arrow moves 3px without layout shift', async () => {
      const link = page.locator('header nav a[href="/darbai"]');
      const label = link.locator('.link-underline');
      assert.equal(await label.evaluate(n => parseFloat(getComputedStyle(n).backgroundSize)), 0);
      await link.hover();
      await page.waitForTimeout(210);
      assert.equal(await label.evaluate(n => getComputedStyle(n).backgroundSize), '100% 1px');
      const cta = page.locator('main .cta-link').first();
      const before = await cta.boundingBox();
      await cta.hover();
      await page.waitForTimeout(210);
      assert.equal(await cta.locator('.cta-arrow').evaluate(n => getComputedStyle(n).transform), 'matrix(1, 0, 0, 1, 3, 0)');
      assert.deepEqual(await cta.boundingBox(), before);
      await page.screenshot({ path: path.join(out, '1440-cta-hover.png') });
      return { offset: 3, duration: 180, layoutShift: false };
    });
    await test('Keyboard: navigation underline and CTA arrow respond to Tab', async () => {
      await page.mouse.move(1400, 850);
      await page.keyboard.press('Tab');
      const link = page.locator('header nav a[href="/darbai"]');
      await link.focus();
      assert(await link.evaluate(n => n.matches(':focus-visible')));
      await page.waitForTimeout(210);
      assert.equal(await link.locator('.link-underline').evaluate(n => getComputedStyle(n).backgroundSize), '100% 1px');
      const cta = page.locator('main .cta-link').first();
      for (let i = 0; i < 25 && !(await cta.evaluate(n => n === document.activeElement)); i++) await page.keyboard.press('Tab');
      assert(await cta.evaluate(n => n.matches(':focus-visible')));
      await page.waitForTimeout(210);
      assert.equal(await cta.locator('.cta-arrow').evaluate(n => getComputedStyle(n).transform), 'matrix(1, 0, 0, 1, 3, 0)');
    });
    await test('Reduced motion: immediate underline, static arrow', async () => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const cta = page.locator('main .cta-link').first();
      await cta.hover();
      const arrow = await cta.locator('.cta-arrow').evaluate(n => ({ transform: getComputedStyle(n).transform, duration: getComputedStyle(n).transitionDuration }));
      assert.equal(arrow.transform, 'none');
      assert.equal(arrow.duration, '0s');
      const link = page.locator('header nav a[href="/darbai"]');
      await link.hover();
      const label = await link.locator('.link-underline').evaluate(n => ({ size: getComputedStyle(n).backgroundSize, duration: getComputedStyle(n).transitionDuration }));
      assert.equal(label.size, '100% 1px');
      assert.equal(label.duration, '0s');
      return { arrow, label };
    });
    const mobile = await browser.newContext({ viewport: { width: 320, height: 844 }, isMobile: true, hasTouch: true });
    await mobile.addInitScript(() => localStorage.setItem('atd-cookie-consent', 'rejected'));
    const mp = await mobile.newPage();
    mp.on('pageerror', error => report.errors.push(error.message));
    for (const route of ['/', '/paslaugos/veja', '/paslaugos/apzeldinimas', '/en/paslaugos/laistymas', '/darbai']) {
      await test(`320 touch ${route}: CTA fits`, async () => {
        await mp.goto('http://localhost:3100' + route, { waitUntil: 'networkidle' });
        if (route === '/') await mp.waitForFunction(() => Number(getComputedStyle(document.querySelector('.hero-copy')).opacity) > .99, { timeout: 13000 });
        const fits = await mp.locator('.cta-link').evaluateAll(nodes => nodes.every(n => { const r = n.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }));
        assert(fits);
        assert(await mp.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (route === '/') await mp.screenshot({ path: path.join(out, '320-home-cta.png') });
      });
    }
    await mobile.close();
  } finally {
    await browser.close();
    report.passed = report.tests.filter(t => t.passed).length;
    report.failed = report.tests.length - report.passed;
    await fs.writeFile(path.join(out, 'verification.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ passed: report.passed, failed: report.failed, errors: report.errors.length }));
    if (report.failed || report.errors.length) process.exitCode = 1;
  }
})();
