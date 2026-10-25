import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';

const base = 'http://127.0.0.1:4173';

async function verifyMenu(page) {
  const toggle = page.locator('#navToggle');
  const isInViewport = async () => {
    const box = await toggle.boundingBox();
    return box && box.y >= -1 && box.y + box.height <= page.viewportSize().height + 1;
  };
  assert.ok(await isInViewport(), 'menu toggle must remain visible after scrolling');
  await toggle.click();
  assert.ok(await isInViewport(), 'menu toggle must remain visible while scroll is locked');
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
    const externalFontRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) externalFontRequests.push(request.url());
    });
    for (const route of ['/', '/projetos.html']) {
      await page.goto(base + route, {waitUntil: 'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.fonts.check('650 16px Manrope')), true);
      assert.equal(await page.evaluate(() => document.fonts.check('500 12px "Fira Code"')), true);
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
      await verifyMenu(page);
      await page.emulateMedia({reducedMotion: 'no-preference'});
    }
    assert.deepEqual(errors, [], `${name}: unhandled errors`);
    assert.deepEqual(externalFontRequests, [], `${name}: fonts must load locally`);
    await context.close();

    // A failed optional import must leave navigation and static receipt usable.
    for (const brokenDemo of ['network', 'markup', 'galleryModule']) {
      const failureContext = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
      const failurePage = await failureContext.newPage();
      const unhandled = [];
      failurePage.on('pageerror', error => unhandled.push(error.message));
      if (brokenDemo === 'network') {
        await failurePage.route('**/receipt-demo.mjs*', route => route.abort());
      } else if (brokenDemo === 'galleryModule') {
        await failurePage.route('**/interactions/galleries.mjs', route => route.abort());
      } else {
        await failurePage.route(base + '/', async route => {
          const response = await route.fetch();
          const html = (await response.text()).replace('<form class="receipt-demo-form"', '<div class="receipt-demo-form"').replace('</form>', '</div>');
          await route.fulfill({response, body: html});
        });
      }
      await failurePage.goto(base, {waitUntil: 'networkidle'});
      await verifyMenu(failurePage);
      if (brokenDemo !== 'galleryModule') {
        assert.equal(await failurePage.locator('[data-demo-fallback]').isVisible(), true);
      }
      assert.deepEqual(unhandled, [], `${name}/${brokenDemo}: unhandled errors`);
      await failureContext.close();
    }
    const mediaContext = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
    const mediaPage = await mediaContext.newPage();
    const mediaErrors = [];
    mediaPage.on('pageerror', error => mediaErrors.push(error.message));
    await mediaPage.route('**/assets/gallery/**', route => route.abort());
    await mediaPage.goto(base, {waitUntil: 'networkidle'});
    await mediaPage.locator('[data-carousel-open]').first().click();
    await mediaPage.locator('.media-error-message').waitFor({state: 'visible'});
    await mediaPage.keyboard.press('ArrowRight');
    await mediaPage.locator('.media-error-message').waitFor({state: 'visible'});
    await mediaPage.keyboard.press('Escape');
    await verifyMenu(mediaPage);
    assert.deepEqual(mediaErrors, [], `${name}: media failures must remain recoverable`);
    await mediaContext.close();

    const dataContext = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
    await dataContext.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', {value: {saveData: true, effectiveType: '2g'}, configurable: true});
    });
    const dataPage = await dataContext.newPage();
    const neighborRequests = [];
    dataPage.on('request', request => {
      if (/nexo-(02|13)-/.test(request.url())) neighborRequests.push(request.url());
    });
    await dataPage.route(base + '/', async route => {
      const response = await route.fetch();
      await route.fulfill({response, body: (await response.text()).replace('data-mode="mobile"', 'data-mode="invalid"')});
    });
    await dataPage.goto(base, {waitUntil: 'networkidle'});
    const nexo = dataPage.locator('[data-carousel="nexo"]');
    assert.equal(await nexo.getAttribute('data-mode'), 'mobile');
    await nexo.scrollIntoViewIfNeeded();
    await dataPage.waitForFunction(() => {
      const image = document.querySelector('[data-carousel-frame]');
      return image.complete && image.naturalWidth > 0;
    });
    assert.deepEqual(neighborRequests, [], `${name}: saveData must prevent neighbor prefetch`);
    assert.equal(await dataPage.locator('link[data-portfolio-prefetch]').count(), 0);
    await verifyMenu(dataPage);
    await dataContext.close();
    console.log(`${name}: keyboard, lightbox, live reduced motion, receipt and optional-failure isolation passed.`);
  } finally {
    await browser.close();
  }
}
