/**
 * Verify all 93 program slugs map to a career profile
 */
const fs = require('fs');

// Extract slugs from config-loader
const configSrc = fs.readFileSync('js/config-loader.js', 'utf8');
const slugMatches = configSrc.matchAll(/slug:\s*'([^']+)'/g);
const slugs = [];
for (const m of slugMatches) slugs.push(m[1]);

// Extract DB from report.js
const reportSrc = fs.readFileSync('js/report.js', 'utf8');

// Extract all DB keys (primary + aliases)
const primaryKeys = [...reportSrc.matchAll(/'(\w[\w-]*)'\s*:\s*\{/g)].map(m => m[1]);
const aliasKeys = [...reportSrc.matchAll(/DB\['([\w-]+)'\]\s*=\s*DB\[/g)].map(m => m[1]);
const allKeys = new Set([...primaryKeys, ...aliasKeys]);

console.log(`Primary DB keys: ${primaryKeys.length}`);
console.log(`Alias keys: ${aliasKeys.length}`);
console.log(`Total keys: ${allKeys.size}\n`);

// Check each slug
let defaults = [];
let matched = [];

for (const slug of slugs) {
  const s = slug.toLowerCase();
  let found = false;
  for (const k of allKeys) {
    if (s.includes(k)) { found = true; matched.push(`${slug} -> ${k}`); break; }
  }
  if (!found) defaults.push(slug);
}

console.log(`✅ Matched: ${matched.length} / ${slugs.length}`);
if (defaults.length > 0) {
  console.log(`\n⚠️ Defaulting to 'landscape' (${defaults.length}):`);
  defaults.forEach(d => console.log(`  - ${d}`));
} else {
  console.log('\n🎉 All programs have career profiles! No defaults to landscape.');
}
