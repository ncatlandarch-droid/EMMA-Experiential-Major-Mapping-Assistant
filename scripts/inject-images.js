#!/usr/bin/env node
/**
 * inject-images.js — Wire up images arrays in DB entries in report.js
 * Scans assets/images/professions/ for _2, _3, _4, _5 variants and
 * adds/updates the images[] array in each DB entry.
 */
const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '..', 'js', 'report.js');
const imgDir = path.join(__dirname, '..', 'assets', 'images', 'professions');
let code = fs.readFileSync(reportPath, 'utf8');

// Build a map of image_slug -> [file1, file2, ...]
const allFiles = fs.readdirSync(imgDir).filter(f => f.endsWith('.png'));

// Map from DB hero filename slug to numbered images
// e.g., prof_accounting -> [prof_accounting_2.png, prof_accounting_3.png, ...]
const imageMap = {};
for (const f of allFiles) {
  const m = f.match(/^(prof_\w+?)_([2-5])\.png$/);
  if (m) {
    const slug = m[1];
    if (!imageMap[slug]) imageMap[slug] = [];
    imageMap[slug].push(`assets/images/professions/${f}`);
  }
}

// Now find each DB entry and inject images
// Match hero paths to find the slug
const heroMatches = [...code.matchAll(/hero:\s*'assets\/images\/professions\/(prof_\w+?)\.png'/g)];
let updated = 0;
let skipped = 0;

for (const hm of heroMatches) {
  const heroSlug = hm[1]; // e.g., "prof_accounting"
  const heroPath = `assets/images/professions/${heroSlug}.png`;
  const extras = imageMap[heroSlug];
  
  if (!extras || extras.length === 0) {
    skipped++;
    continue;
  }

  // Sort extras
  extras.sort();

  // Build images array with hero first, then extras
  const imagesArr = [heroPath, ...extras];
  const imagesStr = `images: [\n        '${imagesArr.join("',\n        '")}'\n      ]`;

  // Find the hero line and check if images already exists right after
  const heroLine = `hero: '${heroPath}'`;
  const heroIdx = code.indexOf(heroLine);
  if (heroIdx === -1) continue;

  // Check if this entry already has an images array
  const entryChunk = code.substring(heroIdx, heroIdx + 2000);
  const existingImages = entryChunk.match(/images:\s*\[[\s\S]*?\]/);
  
  if (existingImages) {
    // Replace existing images array
    const oldImages = existingImages[0];
    const newCode = code.substring(0, heroIdx) + 
      code.substring(heroIdx).replace(oldImages, imagesStr);
    code = newCode;
    console.log(`  ✏️  Updated ${heroSlug} → ${imagesArr.length} images`);
  } else {
    // Insert images after related array closing bracket or after whatYouCanDo
    // Find the 'related:' section end
    const relatedEnd = entryChunk.indexOf('],', entryChunk.indexOf('related:'));
    if (relatedEnd > 0) {
      const insertPoint = heroIdx + relatedEnd + 2;
      code = code.substring(0, insertPoint) + `\n      ${imagesStr},` + code.substring(insertPoint);
      console.log(`  ✅ Added ${heroSlug} → ${imagesArr.length} images`);
    } else {
      console.log(`  ⚠  Could not find insertion point for ${heroSlug}`);
      skipped++;
      continue;
    }
  }
  updated++;
}

fs.writeFileSync(reportPath, code, 'utf8');
console.log(`\n═══ RESULTS ═══`);
console.log(`Updated: ${updated}`);
console.log(`Skipped (no extras): ${skipped}`);
console.log(`Image groups found: ${Object.keys(imageMap).length}`);
Object.entries(imageMap).forEach(([slug, files]) => {
  console.log(`  ${slug}: ${files.length} extras`);
});
