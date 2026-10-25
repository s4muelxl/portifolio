import {chromium, webkit} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {mkdir, writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const output = new URL('../artifacts/audit/', import.meta.url);
await mkdir(output, {recursive: true});
const reports = [];
const failures = [];
for (const [engineName, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch({headless: true});
  try {
    const context = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
    for (const path of ['/', '/projetos.html']) {
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:4173' + path, {waitUntil: 'networkidle'});
      // Ensure below-the-fold content is included in the automated audit.
      await page.addStyleTag({content: '.case-detail,.cert-grid{content-visibility:visible!important}'});
      await page.evaluate(() => document.fonts.ready);
      for (const state of ['page', 'menu', 'lightbox']) {
        if (state === 'menu') await page.locator('#navToggle').click();
        if (state === 'lightbox') {
          await page.keyboard.press('Escape');
          await page.locator('[data-carousel-open]').first().click();
        }
        const result = await new AxeBuilder({page})
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        const label = `${engineName}/${path}/${state}`;
        reports.push({label, violations: result.violations, incomplete: result.incomplete});
        for (const violation of result.violations) {
          failures.push(`${label}: ${violation.id} - ${violation.help} - ${violation.nodes.map(node => node.target.join(' ')).join('; ')}`);
        }
      }
      // Reflow equivalent to a 1280px viewport at 200% browser zoom.
      await page.keyboard.press('Escape');
      await page.setViewportSize({width: 640, height: 450});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${engineName}/${path}: reflow`);
      await page.locator('#navToggle').click();
      const toggleBox = await page.locator('#navToggle').boundingBox();
      assert.ok(toggleBox && toggleBox.x >= 0 && toggleBox.y >= 0
        && toggleBox.x + toggleBox.width <= 640 && toggleBox.y + toggleBox.height <= 450);
      await page.keyboard.press('Escape');
      // The first keyboard action from a fresh document must expose the skip link.
      await page.goto('http://127.0.0.1:4173' + path, {waitUntil: 'networkidle'});
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'conteudo');
      await page.setViewportSize({width: 1440, height: 900});
      await page.goto('http://127.0.0.1:4173' + path, {waitUntil: 'networkidle'});
      await page.addStyleTag({content: '.case-detail,.cert-grid{content-visibility:visible!important}'});
      await page.evaluate(() => document.fonts.ready);
      const desktop = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      reports.push({label: `${engineName}/${path}/desktop`, violations: desktop.violations, incomplete: desktop.incomplete});
      for (const violation of desktop.violations) {
        failures.push(`${engineName}/${path}/desktop: ${violation.id} - ${violation.nodes.map(node => node.target.join(' ')).join('; ')}`);
      }
      await page.setViewportSize({width: 390, height: 844});
      await page.close();
    }
    await context.close();
  } finally { await browser.close(); }
}
await writeFile(new URL('accessibility.json', output), JSON.stringify(reports, null, 2));
console.log(`Acessibilidade automatizada: ${reports.length} estados auditados; ${failures.length} violações.`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
