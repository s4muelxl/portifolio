import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {chromium} from 'playwright';
import {mkdir, writeFile} from 'node:fs/promises';

const output = new URL('../artifacts/audit/', import.meta.url);
await mkdir(output, {recursive: true});
const chrome = await launch({chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']});
const summaries = [];
try {
  for (const [name, path] of [['home', '/'], ['cases', '/projetos.html']]) {
    const result = await lighthouse('http://127.0.0.1:4173' + path, {
      port: chrome.port, output: ['json', 'html'], logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
    });
    if (!result || result.lhr.runtimeError) throw new Error(result?.lhr.runtimeError?.message || 'Auditoria Lighthouse indisponível.');
    await writeFile(new URL(name + '.json', output), result.report[0]);
    await writeFile(new URL(name + '.html', output), result.report[1]);
    const summary = {
      page: name, environment: 'GitHub Actions + servidor local com gzip, simulação mobile',
      lighthouseVersion: result.lhr.lighthouseVersion,
      scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, value.score])),
      lcpMs: result.lhr.audits['largest-contentful-paint'].numericValue,
      cls: result.lhr.audits['cumulative-layout-shift'].numericValue,
      tbtMs: result.lhr.audits['total-blocking-time'].numericValue,
      inp: 'Não medido: a auditoria de navegação não mede INP de usuários reais.'
    };
    summaries.push(summary);
    console.log(JSON.stringify(summary));
  }
  await writeFile(new URL('performance-summary.json', output), JSON.stringify(summaries, null, 2));
} finally { await chrome.kill(); }
