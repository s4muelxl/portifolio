import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {chromium, webkit} from 'playwright';
import {projects} from '../data/projects.mjs';

const base = 'http://127.0.0.1:4173';
const output = 'artifacts/cases';
await mkdir(output, {recursive: true});
const measurements = [];
for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch({headless: true});
  try {
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({viewport: {width, height: 900}, reducedMotion: 'reduce'});
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      await page.goto(base + '/projetos.html', {waitUntil: 'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({content: '.case-detail{content-visibility:visible!important}'});
      for (const project of projects) {
        const article = page.locator('#' + project.id);
        const synopsis = article.locator('.case-proof-summary');
        const panel = article.locator('.engineering-panel');
        const summary = panel.locator('summary');
        assert.deepEqual(await synopsis.locator('dt').allTextContents(), ['Problema', 'Minha contribuição', 'Como verificar']);
        assert.equal(await panel.evaluate(el => el.open), false);
        const collapsed = await article.boundingBox();
        assert.ok(collapsed);
        const contribution = await synopsis.locator('dd').nth(1).boundingBox();
        assert.ok(contribution && contribution.y + contribution.height - collapsed.y < 816,
          `${name}/${width}/${project.id}: contribution must appear before the gallery`);
        await synopsis.locator('a').click();
        assert.equal(new URL(page.url()).hash, '#' + project.evidenceTarget);
        assert.equal(await page.evaluate(() => document.activeElement.id), project.evidenceTarget);
        if (name === 'chromium') {
          await page.evaluate(id => document.getElementById(id).scrollIntoView({block: 'start'}), project.id);
          await page.evaluate(() => scrollBy(0, -90));
          await page.screenshot({path: `${output}/${project.id}-${width}-overview.png`, animations: 'disabled'});
        }
        await summary.focus();
        await page.keyboard.press('Enter');
        assert.equal(await panel.evaluate(el => el.open), true);
        assert.equal(await panel.locator('.case-columns h3').count(), 5);
        const expanded = await article.boundingBox();
        assert.ok(expanded && expanded.height > collapsed.height);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true,
          `${name}/${width}/${project.id}: expanded content must reflow`);
        if (name === 'chromium') {
          await summary.scrollIntoViewIfNeeded();
          await page.evaluate(() => scrollBy(0, -90));
          await page.screenshot({path: `${output}/${project.id}-${width}-details.png`, animations: 'disabled'});
        }
        await summary.focus();
        await page.keyboard.press('Enter');
        assert.equal(await panel.evaluate(el => el.open), false);
        assert.equal(await summary.evaluate(el => document.activeElement === el), true);
        measurements.push({engine: name, width, case: project.id, collapsedHeight: collapsed.height, expandedHeight: expanded.height});
      }
      await context.close();
    }
    const staticContext = await browser.newContext({viewport: {width: 390, height: 844}, javaScriptEnabled: false});
    const page = await staticContext.newPage();
    page.setDefaultTimeout(15000);
    await page.goto(base + '/projetos.html', {waitUntil: 'networkidle'});
    for (const project of projects) {
      const panel = page.locator('#' + project.id + ' .engineering-panel');
      await panel.locator('summary').click();
      assert.equal(await panel.evaluate(el => el.open), true);
      assert.equal(await panel.locator('.case-columns').isVisible(), true);
    }
    await staticContext.close();
    console.log(`${name}: five cases in four widths, evidence anchors, keyboard disclosure and full narratives without JavaScript passed.`);
  } finally { await browser.close(); }
}
await writeFile('artifacts/cases/reading.json', JSON.stringify(measurements, null, 2));
