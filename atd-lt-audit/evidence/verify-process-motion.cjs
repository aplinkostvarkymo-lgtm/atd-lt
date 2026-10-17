/* eslint-disable @typescript-eslint/no-require-imports -- Standalone browser verification. */
const { chromium } = require('C:/Users/aplin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const out = path.resolve(__dirname, '../after/process');
const routes = ['veja', 'apzeldinimas', 'trinkeles', 'laistymas', 'tvenkiniai'];

(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = { tests: [], errors: [] };
  async function test(name, run) {
    try { report.tests.push({ name, passed: true, details: await run() }); console.log('PASS', name); }
    catch (error) { report.tests.push({ name, passed: false, error: error.message }); console.log('FAIL', name, error.message); }
  }
  async function context(options) {
    const ctx = await browser.newContext(options);
    await ctx.addInitScript(() => localStorage.setItem('atd-cookie-consent', 'rejected'));
    const page = await ctx.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    return { ctx, page };
  }
  async function reveal(page) {
    await page.locator('.process-steps').evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 190, behavior: 'instant' }));
  }
  async function state(page) {
    return page.locator('.process-steps').evaluate(el => ({
      motion: el.dataset.motion,
      opacity: [...el.querySelectorAll('.process-number')].map(n => Number(getComputedStyle(n).opacity)),
      animations: el.getAnimations({ subtree: true }).map(a => ({ start: a.startTime, state: a.playState, ...a.effect.getTiming() })),
      lines: [...el.querySelectorAll('.process-connector')].slice(0, 2).map(n => {
        const rect = n.getBoundingClientRect();
        return { width: rect.width, height: rect.height, color: getComputedStyle(n).backgroundColor };
      }),
      text: [...el.querySelectorAll('h3')].map(n => n.textContent),
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
  }
  try {
    for (const width of [1440, 390]) {
      const { ctx, page } = await context({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
      for (const lang of width === 1440 ? ['lt', 'en'] : ['lt']) {
        for (const route of routes) {
          await test(`${width} ${lang} ${route}: sequence, alignment, no replay`, async () => {
            const response = await page.goto(`http://localhost:3100/${lang === 'en' ? 'en/' : ''}paslaugos/${route}`, { waitUntil: 'networkidle' });
            assert.equal(response.status(), 200);
            assert.equal(await page.locator('.process-step').count(), 3);
            const before = await state(page);
            assert.equal(before.motion, 'pending');
            assert.deepEqual(before.opacity, [0, 0, 0]);
            await reveal(page);
            await page.waitForFunction(() => document.querySelector('.process-steps').dataset.motion === 'playing');
            if (width === 1440 && lang === 'lt' && route === 'veja') {
              await page.waitForTimeout(130);
              const during = await state(page);
              assert(during.opacity[0] > 0 && during.opacity[2] === 0, 'Numbers must reveal in order');
            }
            await page.waitForTimeout(900);
            const after = await state(page);
            assert.deepEqual(after.opacity, [1, 1, 1]);
            assert.equal(after.animations.length, 5);
            assert(after.animations.every(a => a.iterations === 1 && a.state === 'finished'));
            assert(Math.max(...after.animations.map(a => a.delay + a.duration)) <= 800);
            assert(!after.overflow);
            assert(after.lines.every(l => width === 390 ? l.width === 1 && l.height > 48 : l.height === 1 && l.width > 48));
            const aligned = await page.locator('.process-steps').evaluate(el => {
              const badges = [...el.querySelectorAll('.process-number')].map(n => n.getBoundingClientRect());
              return [...el.querySelectorAll('.process-connector')].slice(0, 2).every((n, i) => {
                const r = n.getBoundingClientRect(), next = badges[i + 1];
                return innerWidth < 768 ? Math.abs(r.bottom - (next.top + 24)) < 1 : Math.abs(r.right - (next.left + 24)) < 1;
              });
            });
            assert(aligned, 'Lines must end at the next number centre');
            if (route === 'veja' && lang === 'lt') {
              await page.locator('.process-steps').locator('xpath=../..').screenshot({ path: path.join(out, `${width}-process.png`) });
            }
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
            await page.waitForTimeout(100);
            await reveal(page);
            await page.waitForTimeout(100);
            const replay = await state(page);
            assert.deepEqual(replay.animations.map(a => a.start), after.animations.map(a => a.start));
            return after;
          });
        }
      }
      await ctx.close();
    }
    for (const width of [1440, 390]) {
      const { ctx, page } = await context({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await test(`${width}: reduced motion immediately visible`, async () => {
        await page.goto('http://localhost:3100/paslaugos/veja', { waitUntil: 'networkidle' });
        await reveal(page);
        const current = await state(page);
        assert.deepEqual(current.opacity, [1, 1, 1]);
        assert.equal(current.animations.length, 0);
        return current;
      });
      await ctx.close();
    }
    const { ctx, page } = await context({ viewport: { width: 390, height: 900 }, javaScriptEnabled: false });
    await test('No JavaScript: readable steps and static lines', async () => {
      await page.goto('http://localhost:3100/paslaugos/veja');
      await reveal(page);
      const current = await state(page);
      assert.deepEqual(current.opacity, [1, 1, 1]);
      assert.equal(current.animations.length, 0);
      assert(current.text.every(Boolean));
      return current;
    });
    await ctx.close();
    const live = await context({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    await test('Live reduced-motion preference change reveals pending steps', async () => {
      await live.page.goto('http://localhost:3100/paslaugos/veja', { waitUntil: 'networkidle' });
      assert.equal((await state(live.page)).motion, 'pending');
      await live.page.emulateMedia({ reducedMotion: 'reduce' });
      await live.page.waitForTimeout(100);
      const current = await state(live.page);
      assert.deepEqual(current.opacity, [1, 1, 1]);
      assert.equal(current.animations.length, 0);
      return current;
    });
    await live.ctx.close();
  } finally {
    await browser.close();
    report.passed = report.tests.filter(t => t.passed).length;
    report.failed = report.tests.length - report.passed;
    await fs.writeFile(path.join(out, 'verification.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ passed: report.passed, failed: report.failed, pageErrors: report.errors.length }));
    if (report.failed || report.errors.length) process.exitCode = 1;
  }
})();
