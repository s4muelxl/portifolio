import {readFile, writeFile} from 'node:fs/promises';
import postcss from 'postcss';
import cssnano from 'cssnano';

// Preserve the existing cascade order; source files remain readable and editable.
const files = ['styles/tokens.css', 'styles/foundations.css', 'styles/components.css', 'styles/presentation.css'];
const sources = await Promise.all(files.map(file => readFile(new URL('../' + file, import.meta.url), 'utf8')));
const result = await postcss([cssnano({preset: 'default'})]).process(sources.join('\n'), {
  from: undefined, to: 'portfolio.bundle.css', map: false
});
const target = new URL('../portfolio.bundle.css', import.meta.url);
if (process.argv.includes('--check')) {
  if (await readFile(target, 'utf8') !== result.css + '\n') throw new Error('Execute npm run build:css para sincronizar o CSS publicado.');
} else {
  await writeFile(target, result.css + '\n');
}
console.log(`CSS consolidado: ${Buffer.byteLength(result.css + '\n')} bytes.`);
