#!/usr/bin/env node
/**
 * inject-images-v2.js — Wire up images arrays by mapping DB keys to image slugs
 * Direct mapping from DB key to the image slug pattern on disk.
 */
const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '..', 'js', 'report.js');
const imgDir = path.join(__dirname, '..', 'assets', 'images', 'professions');
let code = fs.readFileSync(reportPath, 'utf8');

// Map: DB key -> image file slug (without prof_ prefix and .png)
const KEY_TO_SLUG = {
  'acct': 'accounting',
  'fin': 'finance',
  'econ': 'economics',
  'mgmt': 'management',
  'mktg': 'marketing',
  'scm': 'supply_chain',
  'bit': 'info_tech',
  'coe-eng': 'applied_eng',
  'cs': 'computer_science',
  'ise': 'applied_eng',
  'nurs': 'nursing',
  'slpa': 'speech_path',
  'comm': 'comm_studies',
  'kin': 'kinesiology',
  'hsm': 'health_mgmt',
  'psych': 'psychology',
  'soc': 'sociology',
  'sw': 'social_work',
  'cj': 'criminal_justice',
  'eng': 'english',
  'hist': 'history',
  'poli': 'political_science',
  'jmc': 'journalism',
  'lib': 'liberal_studies',
  'art': 'visual_arts',
  'music': 'music',
  'thtr': 'theatre',
  'elem': 'education',
  'edst': 'education',
  'aet': 'applied_eng',
  'auto': 'auto_eng',
  'bio': 'biology',
  'cm': 'construction_mgmt',
  'ehs': 'env_health',
  'geo': 'geomatics',
  'chem': 'chemistry',
  'elec': 'electronics',
  'it': 'info_tech',
  'cgt': 'comp_graphics',
  'math': 'mathematics',
  'atms': 'meteorology',
  'phys': 'physics',
  'animal': 'lab_animal',
  'bioe': 'bio_engineering',
  'food': 'food_nutrition',
  'fashion': 'fashion_design',
  'child': 'child_dev',
  'aged': 'ag_education',
  'agbm': 'agribusiness',
  'envs': 'environmental',
};

let updated = 0;
let skipped = 0;

for (const [dbKey, imgSlug] of Object.entries(KEY_TO_SLUG)) {
  const heroFile = `prof_${imgSlug}.png`;
  const heroPath = `assets/images/professions/${heroFile}`;
  
  // Find numbered extras on disk
  const extras = [];
  for (let n = 2; n <= 5; n++) {
    const extraFile = `prof_${imgSlug}_${n}.png`;
    if (fs.existsSync(path.join(imgDir, extraFile))) {
      extras.push(`assets/images/professions/${extraFile}`);
    }
  }
  
  if (extras.length === 0) {
    skipped++;
    continue;
  }
  
  // Build images array
  const allImages = [heroPath, ...extras];
  const imagesStr = `images: [\n        '${allImages.join("',\n        '")}'\n      ]`;
  
  // Find the DB entry
  const entryRegex = new RegExp(`'${dbKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{`);
  const entryMatch = code.match(entryRegex);
  if (!entryMatch) {
    console.log(`  ⚠ DB key not found: ${dbKey}`);
    skipped++;
    continue;
  }
  
  const entryIdx = code.indexOf(entryMatch[0]);
  const entryChunk = code.substring(entryIdx, entryIdx + 3000);
  
  // Check if already has images array
  const existingImages = entryChunk.match(/images:\s*\[[\s\S]*?\]/);
  if (existingImages) {
    // Replace existing
    code = code.substring(0, entryIdx) + 
      code.substring(entryIdx).replace(existingImages[0], imagesStr);
    console.log(`  ✏️  ${dbKey} → ${allImages.length} images (updated)`);
  } else {
    // Insert after whatYouCanDo closing bracket
    const wydIdx = entryChunk.indexOf('whatYouCanDo:');
    if (wydIdx > 0) {
      // Find the closing bracket of whatYouCanDo array
      let bracketCount = 0;
      let pos = entryChunk.indexOf('[', wydIdx);
      for (let i = pos; i < entryChunk.length; i++) {
        if (entryChunk[i] === '[') bracketCount++;
        if (entryChunk[i] === ']') {
          bracketCount--;
          if (bracketCount === 0) {
            pos = i;
            break;
          }
        }
      }
      const insertPoint = entryIdx + pos + 1;
      code = code.substring(0, insertPoint) + `,\n      ${imagesStr}` + code.substring(insertPoint);
      console.log(`  ✅ ${dbKey} → ${allImages.length} images (added)`);
    } else {
      console.log(`  ⚠ Could not find insertion point for: ${dbKey}`);
      skipped++;
      continue;
    }
  }
  updated++;
}

fs.writeFileSync(reportPath, code, 'utf8');
console.log(`\n═══ RESULTS ═══`);
console.log(`Updated: ${updated}`);
console.log(`Skipped: ${skipped}`);
