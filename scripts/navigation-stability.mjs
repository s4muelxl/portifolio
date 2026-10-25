import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';

const base = 'http://127.0.0.1:4173';
for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch({headless: true});
  try {
    for (const path of ['/', '/projetos.html']) {
      const context = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
      const page = await context.newPage();
      let releaseModule;
      const moduleGate = new Promise(resolve => { releaseModule = resolve; });
      await page.route('**/portfolio.js*', async route => {
        await moduleGate;
        await route.continue();
      });
      try {
        await page.goto(base + path, {waitUntil: 'commit'});
        // Wait for CSS/fonts while keeping the enhancement entry point pending.
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.nav-menu')).position === 'fixed');
        await page.evaluate(() => document.fonts.ready);
        const before = await page.locator('main').boundingBox();
        assert.ok(before);
        assert.equal(await page.locator('#navMenu').isVisible(), false);
        releaseModule();
        await page.waitForLoadState('networkidle');
        const after = await page.locator('main').boundingBox();
        assert.ok(after && Math.abs(after.y - before.y) < 1, `${name}/${path}: header must not move main after scripts load`);

        // A desktop link must never keep focus when the mobile menu hides it.
        await page.setViewportSize({width: 1440, height: 900});
        await page.locator('#navMenu .nav-link').first().focus();
        await page.setViewportSize({width: 390, height: 844});
        await page.waitForFunction(() => document.activeElement.id === 'navToggle');
        assert.equal(await page.locator('main').evaluate(el => el.inert), false);

        // The toggle disappears on desktop; move focus to visible navigation.
        await page.locator('#navToggle').click();
        await page.locator('#navToggle').focus();
        await page.setViewportSize({width: 1440, height: 900});
        await page.waitForFunction(() => document.activeElement.matches('#navMenu .nav-link'));
        assert.equal(await page.locator('main').evaluate(el => el.inert), false);
        assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'), 'false');

        // Downloads close the menu and return focus to a visible control.
        await page.setViewportSize({width: 390, height: 844});
        await page.locator('#navToggle').click();
        const download = page.waitForEvent('download');
        await page.locator('#navMenu a[download]').click();
        await download;
        assert.equal(await page.evaluate(() => document.activeElement.id), 'navToggle');
        assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'), 'false');
      } finally {
        releaseModule();
        await context.close();
      }

      const staticContext = await browser.newContext({viewport: {width: 390, height: 844}, javaScriptEnabled: false});
      try {
        const staticPage = await staticContext.newPage();
        await staticPage.goto(base + path, {waitUntil: 'networkidle'});
        assert.equal(await staticPage.locator('#navToggle').isVisible(), false);
        const links = staticPage.locator('#navMenu .nav-link');
        assert.ok(await links.count() >= 5);
        for (const link of await links.all()) assert.equal(await link.isVisible(), true);
        assert.equal(await staticPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
        if (path === '/') {
          await staticPage.locator('#navMenu a[href="#contato"]').click();
          assert.equal(new URL(staticPage.url()).hash, '#contato');
        }
      } finally { await staticContext.close(); }
    }
    console.log(`${name}: stable header before module load, responsive focus, download focus and navigation without JavaScript passed.`);
  } finally { await browser.close(); }
}
