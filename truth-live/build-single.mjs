/**
 * Bundle the route into one self-contained file for pasting into a Zo Space
 * route editor, which takes a single component file.
 *
 *   node truth-live/build-single.mjs
 *
 * Output keeps React as the only import. Edit the source modules, not the
 * generated file.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const here = (f) => new URL(f, import.meta.url);
const read = (f) => readFileSync(here(f), 'utf8');

const stripExports = (src) => src.replace(/^export (const|function|default function|class)\b/gm, '$1');

const wire = stripExports(read('./wire.js'));

// styles.js is a single `export const CSS = \`...\`` — keep the declaration, drop the export
const styles = stripExports(read('./styles.js'));

const rawComponent = read('./TruthLive.jsx');

// grab the React import first: the local-import patterns below would otherwise
// span from the file's first `import {` and swallow it
const reactImport = rawComponent.match(/^import \{[^}]*\} from 'react';$/m)[0];

const component = rawComponent
  .replace(/^import \{[^}]*\} from 'react';\n/m, '')
  .replace(/^import \{ CSS \} from '\.\/styles\.js';\n/m, '')
  .replace(/^import \{[^}]*\} from '\.\/wire\.js';\n/m, '');

const out = `/**
 * The DJT Wire — the /truth-live route.
 *
 * GENERATED FILE. Built from TruthLive.jsx + wire.js + styles.js by
 * truth-live/build-single.mjs. Edit those, not this.
 *
 * Self-contained: React is the only import. Polls /api/truth-posts-live
 * every 30s. See truth-live/README.md for what it does and why.
 */
${reactImport}

/* ------------------------------------------------------------------ styles */
${styles.replace(/^\/\*\*[\s\S]*?\*\/\n/, '')}

/* ------------------------------------------------------------- feed rules */
${wire.replace(/^\/\*\*[\s\S]*?\*\/\n/, '')}

/* ---------------------------------------------------------------- the route */
${component}
`;

writeFileSync(here('./TruthLive.single.jsx'), out);
console.log(`TruthLive.single.jsx written — ${out.split('\n').length} lines, ${(out.length / 1024).toFixed(1)} KB`);
