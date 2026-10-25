import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';

const base = 'http://127.0.0.1:4173';

async function verifyMenu(page) {
  const toggle = page.locator('#navToggle');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('main').evaluate(el => el.inert), true);
  const links = page.locator('#navMenu a');
  await links.last().focus();
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'navToggle');
  await page.keyboard.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'navToggle');
  assert.equal(await page.locator('main').evaluate(el => el.inert), false);
}

for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch({headless: true});
  try {
    const context = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'no-preference'});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/', '/projetos.html']) {
      await page.goto(base + route, {waitUntil: 'networkidle'});
      await verifyMenu(page);
      // Change the preference while below-the-fold elements are still pending.
      await page.emulateMedia({reducedMotion: 'reduce'});
      await page.waitForFunction(() => !document.querySelector('.reveal-pending'));

      const gallery = page.locator('[data-carousel]').first();
      const opener = gallery.locator('[data-carousel-open]');
      await opener.click();
      await page.locator('#mediaLightbox').waitFor({state: 'visible'});
      assert.equal(await page.locator('main').evaluate(el => el.inert), true);
      const count = await page.locator('#lightboxCount').textContent();
      await page.keyboard.press('ArrowRight');
      assert.notEqual(await page.locator('#lightboxCount').textContent(), count);
      await page.locator('#lightboxNext').focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'lightboxClose');
      await page.keyboard.press('Escape');
      assert.equal(await opener.evaluate(el => document.activeElement === el), true);

      const demo = page.locator('[data-receipt-demo]');
      await demo.locator('form').waitFor({state: 'visible'});
      await demo.locator('[name="quantity"]').first().fill('0,5');
      await page.waitForFunction(() => document.querySelector('[data-demo-total]').textContent.replace(/\s/g, ' ') === 'R$ 79,85');
      await demo.locator('[name="price"]').first().fill('-1');
      assert.equal(await demo.locator('[data-demo-download]').isDisabled(), true);
      await page.emulateMedia({reducedMotion: 'no-preference'});
    }
    assert.deepEqual(errors, [], `${name}: unhandled errors`);
    await context.close();

    // A failed optional import must leave navigation and static receipt usable.
    for (const brokenDemo of ['network', 'markup']) {
      const failureContext = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
      const failurePage = await failureContext.newPage();
      const unhandled = [];
      failurePage.on('pageerror', error => unhandled.push(error.message));
      if (brokenDemo === 'network') {
        await failurePage.route('**/receipt-demo.mjs*', route => route.abort());
      } else {
        await failurePage.route(base + '/', async route => {
          const response = await route.fetch();
          const html = (await response.text()).replace('<form class="receipt-demo-form"', '<div class="receipt-demo-form"').replace('</form>', '</div>');
          await route.fulfill({response, body: html});
        });
      }
      await failurePage.goto(base, {waitUntil: 'networkidle'});
      await verifyMenu(failurePage);
      assert.equal(await failurePage.locator('[data-demo-fallback]').isVisible(), true);
      assert.deepEqual(unhandled, [], `${name}/${brokenDemo}: unhandled errors`);
      await failureContext.close();
    }
    console.log(`${name}: keyboard, lightbox, live reduced motion, receipt and optional-failure isolation passed.`);
  } finally {
    await browser.close();
  }
}
