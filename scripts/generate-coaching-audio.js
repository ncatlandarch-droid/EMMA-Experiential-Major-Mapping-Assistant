/**
 * EMMA Pre-recorded Audio Generator
 * ===================================
 * Generates WAV files for all known Emma coaching messages.
 * Uses Gemini TTS API (same model/voice as live app).
 *
 * Usage:
 *   node scripts/generate-coaching-audio.js --api-key=YOUR_GEMINI_KEY
 *
 * Or set env var:
 *   set GEMINI_API_KEY=YOUR_KEY
 *   node scripts/generate-coaching-audio.js
 */

const fs = require('fs');
const path = require('path');

// ── Config ──
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const VOICE_NAME = 'Kore'; // Emma's voice
const BASE_DIR = path.resolve(__dirname, '..'); 
const OUTPUT_DIR = path.join(BASE_DIR, 'assets', 'audio', 'coaching', 'caes-la');

// ── Parse API Key ──
const apiKey = process.argv.find(a => a.startsWith('--api-key='))?.split('=')[1]
  || process.env.GEMINI_API_KEY
  || '';

if (!apiKey) {
  console.error('❌ No API key. Use --api-key=YOUR_KEY or set GEMINI_API_KEY env var.');
  process.exit(1);
}

// ── Load program data ──
const timeline = require(path.join(BASE_DIR, 'data', 'seeds', 'caes-la', 'timeline.json'));
const branding = require(path.join(BASE_DIR, 'data', 'seeds', 'caes-la', 'branding.json'));
const career = branding.careerOutlook || {};
const programName = branding.programName || 'Landscape Architecture';
const totalMilestones = timeline.phases.reduce((s, p) => s + (p.milestones || []).length, 0);

// ── Build coaching scripts ──
function buildCoachingScripts() {
  const scripts = [];

  // Welcome messages
  scripts.push({
    id: 'welcome-first',
    text: `Welcome to ${programName}! I'm Emma, your career mapping assistant. You have ${totalMilestones} experiential milestones ahead of you. ${career.growthRate ? `The Bureau of Labor Statistics projects ${career.growthRate} job growth in this field.` : ''} Let's start your journey from Explore through Launch. Click any milestone to track your progress!`
  });

  scripts.push({
    id: 'welcome-return',
    text: `Welcome back! Great to see you again. Your progress has been saved. Let's keep building your professional portfolio in ${programName}!`
  });

  // Progress reports
  scripts.push({
    id: 'progress-0',
    text: `You're at zero percent in ${programName}. You have ${totalMilestones} milestones ahead of you across four phases: Explore, Engage, Develop, and Launch. Click any milestone to start tracking your journey!`
  });

  scripts.push({
    id: 'progress-25',
    text: `You're at 25 percent in ${programName}! You've completed the Explore phase and are now entering Engage. This is where you build your professional network and deepen your technical skills. Keep going!`
  });

  scripts.push({
    id: 'progress-50',
    text: `Halfway there! You're at 50 percent in ${programName}. You're deep in the Develop phase now. Professional internships and advanced studios are building the skills that employers actually pay for. Outstanding progress!`
  });

  scripts.push({
    id: 'progress-75',
    text: `You're at 75 percent in ${programName}! You're in Launch mode now. Capstone projects, L.A.R.E. exam prep, and career placement are all in sight. ${career.medianSalary ? `You're building toward a career with a median salary of ${career.medianSalary}.` : ''} Almost there!`
  });

  scripts.push({
    id: 'progress-100',
    text: `Congratulations! You've completed 100 percent of ${programName}! All ${totalMilestones} milestones are done. ${career.medianSalary ? `You're ready for a career with a median salary of ${career.medianSalary}.` : 'You are fully prepared for your professional career.'} Time to launch! I'm so proud of your journey.`
  });

  // Milestone-specific coaching
  timeline.phases.forEach(phase => {
    (phase.milestones || []).forEach(m => {
      const desc = (m.description || '').toLowerCase();
      const cat = m.category || '';
      let insight = '';

      if (cat === 'Purpose') {
        if (desc.includes('research')) insight = 'Research experience like this is what separates competitive applicants from the rest. Graduate programs and employers both prioritize candidates with hands-on research.';
        else if (desc.includes('capstone') || desc.includes('senior')) insight = 'Capstone work demonstrates you can apply everything you\'ve learned to a real-world challenge. This is portfolio-ready material.';
        else if (desc.includes('design') || desc.includes('studio')) insight = 'Studio and design work builds the creative problem-solving skills that define top professionals in Landscape Architecture.';
        else if (desc.includes('intern')) insight = 'Professional internship experience is the number one thing employers look for beyond your degree. This puts you ahead of 60 percent of graduates.';
        else if (desc.includes('plant') || desc.includes('soil') || desc.includes('ecology')) insight = 'Understanding natural systems is foundational for Landscape Architecture. This technical knowledge sets you apart in site analysis and environmental assessment.';
        else if (desc.includes('construct') || desc.includes('material') || desc.includes('grading')) insight = 'Technical construction knowledge is what turns a designer into a professional who can actually build what they envision.';
        else if (desc.includes('history') || desc.includes('theory')) insight = 'Understanding the history and theory of your discipline gives your work intellectual depth.';
        else insight = 'This coursework strengthens your technical foundation. Each course builds competencies employers actively seek.';
      } else if (cat === 'Communities') {
        if (desc.includes('mentor') || desc.includes('alumni')) insight = 'Mentorship connections often lead directly to job offers. Alumni who mentor students hire from that same pool.';
        else if (desc.includes('organization') || desc.includes('club') || desc.includes('chapter') || desc.includes('asla') || desc.includes('sasla')) insight = 'Active membership in professional organizations shows employers you are committed to the field beyond just coursework.';
        else if (desc.includes('leadership') || desc.includes('officer')) insight = 'Leadership roles demonstrate management skills that are impossible to teach in a classroom. Employers pay a premium for this.';
        else if (desc.includes('service') || desc.includes('volunteer') || desc.includes('civic')) insight = 'Community service shows character and social responsibility. Many firms prioritize candidates who serve others.';
        else insight = 'Building community connections during college gives you a professional network years before most people start.';
      } else if (cat === 'LocalGlobal') {
        if (desc.includes('abroad') || desc.includes('international') || desc.includes('exchange')) insight = 'International experience is transformative. Professionals with global exposure earn 15 to 25 percent more on average.';
        else if (desc.includes('community') || desc.includes('local') || desc.includes('neighborhood')) insight = 'Local community engagement grounds your education in real-world impact.';
        else insight = 'Broadening your perspective prepares you for the reality of professional practice.';
      } else if (cat === 'Identity') {
        if (desc.includes('resume') || desc.includes('portfolio')) insight = 'A polished portfolio is your calling card. Most hiring managers spend only 7 seconds on a first look. Make yours count.';
        else if (desc.includes('license') || desc.includes('exam') || desc.includes('lare')) insight = 'Licensure preparation puts you on the path to professional credentials. The L.A.R.E. is your gateway to independent practice.';
        else if (desc.includes('career') || desc.includes('handshake') || desc.includes('job')) insight = 'Engaging with career services early puts you ahead of peers who wait until senior year.';
        else insight = 'Building your professional identity defines the professional you become.';
      }

      scripts.push({
        id: `milestone-${m.id}`,
        text: `${m.label} — done! ${insight}`
      });
    });
  });

  // Competency verifications
  const sections = ['Academic & Research Engagement', 'Campus Involvement & Professional Networking', 'International & Community Experiences', 'Professional Development & Career Readiness'];
  sections.forEach((section, i) => {
    scripts.push({
      id: `competency-${i}`,
      text: `${section} section verified! This competency area is now complete. Your validation record has been updated.`
    });
  });

  return scripts;
}

// ── Generate one audio file ──
async function generateAudio(script) {
  const outPath = path.join(OUTPUT_DIR, `${script.id}.wav`);

  // Skip if already generated
  if (fs.existsSync(outPath)) {
    console.log(`  ⏭ ${script.id} — already exists, skipping`);
    return { id: script.id, path: outPath, status: 'skipped' };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: script.text }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_NAME } }
            }
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`API ${response.status}: ${errText.substring(0, 200)}`);
    }

    const json = await response.json();
    const audioData = json.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error('No audio data in response');

    // Decode base64 to WAV
    const buffer = Buffer.from(audioData, 'base64');
    fs.writeFileSync(outPath, buffer);

    const sizeKB = Math.round(buffer.length / 1024);
    console.log(`  ✅ ${script.id} — ${sizeKB}KB saved`);
    return { id: script.id, path: outPath, status: 'generated', sizeKB };

  } catch (err) {
    console.error(`  ❌ ${script.id} — FAILED: ${err.message}`);
    return { id: script.id, status: 'failed', error: err.message };
  }
}

// ── Main ──
async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  EMMA Pre-recorded Audio Generator');
  console.log(`  Program: ${programName}`);
  console.log(`  Voice: ${VOICE_NAME}`);
  console.log(`  Model: ${TTS_MODEL}`);
  console.log('═══════════════════════════════════════════\n');

  // Ensure output dir
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const scripts = buildCoachingScripts();
  console.log(`📝 ${scripts.length} coaching scripts to generate\n`);

  const results = [];
  for (let i = 0; i < scripts.length; i++) {
    console.log(`[${i + 1}/${scripts.length}] Generating: ${scripts[i].id}`);
    const result = await generateAudio(scripts[i]);
    results.push(result);

    // Rate limit: 300ms between calls
    if (result.status === 'generated') {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // Save manifest
  const manifest = results
    .filter(r => r.status !== 'failed')
    .map(r => ({
      id: r.id,
      path: `assets/audio/coaching/caes-la/${r.id}.wav`
    }));

  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // Summary
  const generated = results.filter(r => r.status === 'generated').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const failed = results.filter(r => r.status === 'failed').length;

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`  ✅ Generated: ${generated}`);
  console.log(`  ⏭ Skipped:   ${skipped}`);
  console.log(`  ❌ Failed:    ${failed}`);
  console.log(`  📄 Manifest:  ${manifestPath}`);
  console.log(`═══════════════════════════════════════════\n`);

  // Generate the JS lookup map for tts.js
  const jsMapPath = path.join(OUTPUT_DIR, 'pre-recorded-map.js');
  const jsMap = `// Auto-generated by generate-coaching-audio.js\n// Paste into tts.js PRE_RECORDED_COACHING object\nconst PRE_RECORDED_COACHING = {\n${manifest.map(m => `  '${m.id}': '${m.path}'`).join(',\n')}\n};\n`;
  fs.writeFileSync(jsMapPath, jsMap);
  console.log(`📋 JS lookup map: ${jsMapPath}`);
  console.log('   Copy this into tts.js to enable pre-recorded coaching!\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
