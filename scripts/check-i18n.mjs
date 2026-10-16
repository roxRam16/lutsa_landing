// Verifica que los textos en español e inglés tengan LA MISMA estructura (mismas claves y mismo número de
// elementos en listas de objetos), para que al agregar un texto en un idioma no se olvide el otro.
//
//   npm run check:i18n
//
// Las listas de líneas de texto (['Conectamos', 'puertos,', …]) pueden tener distinto número de líneas
// entre idiomas porque el inglés se corta distinto; solo se comparan las listas de objetos.
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = resolve(import.meta.dirname, '..');
const dir = await mkdtemp(join(tmpdir(), 'lutsa-i18n-'));
const out = join(dir, 'translations.mjs');
await build({ entryPoints: [join(root, 'src/i18n/translations.ts')], outfile: out, bundle: true, format: 'esm', platform: 'node', logLevel: 'silent' });
const { translations } = await import(pathToFileURL(out).href);
await rm(dir, { recursive: true, force: true });

const problems = [];
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function compare(a, b, path) {
  if (isObject(a) && isObject(b)) {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(key in a)) problems.push(`${path}${key}: falta en español`);
      else if (!(key in b)) problems.push(`${path}${key}: falta en inglés`);
      else compare(a[key], b[key], `${path}${key}.`);
    }
  } else if (Array.isArray(a) && Array.isArray(b)) {
    const hasObjects = [...a, ...b].some(isObject);
    if (hasObjects) {
      if (a.length !== b.length) problems.push(`${path.slice(0, -1)}: ${a.length} elementos en español y ${b.length} en inglés`);
      a.forEach((item, i) => b[i] !== undefined && compare(item, b[i], `${path}${i}.`));
    }
  } else if (typeof a !== typeof b) {
    problems.push(`${path.slice(0, -1)}: tipo distinto (${typeof a} vs ${typeof b})`);
  } else if (typeof a === 'string' && (a.trim() === '') !== (b.trim() === '')) {
    problems.push(`${path.slice(0, -1)}: texto vacío solo en uno de los idiomas`);
  }
}

compare(translations.es, translations.en, '');

if (problems.length) {
  console.error(`i18n: ${problems.length} diferencia(s) entre es y en:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('i18n: es y en tienen la misma estructura.');
