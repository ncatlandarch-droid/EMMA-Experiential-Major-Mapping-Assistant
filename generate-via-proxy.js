/**
 * Generate EMMA pre-recorded WAVs via the deployed Netlify proxy.
 * Run: node generate-via-proxy.js
 * 
 * Uses the LIVE deployed proxy (which has the API key server-side).
 * Downloads WAV files to assets/audio/coaching/caes-la/
 */

const fs = require('fs');
const path = require('path');

const PROXY_URL = 'https://thinkemma.netlify.app/.netlify/functions/gemini-tts-proxy';
const OUTPUT_DIR = path.join(__dirname, 'assets', 'audio', 'coaching', 'caes-la');
const VOICE = 'Kore';

const SCRIPTS = [
  { id: 'welcome-first', text: `Welcome to the Bachelor of Science in Landscape Architecture at NC A&T! I'm Emma, your experiential mapping assistant. You have over 24 milestones ahead of you across four phases: Explore, Engage, Develop, and Launch. The Bureau of Labor Statistics projects 4% job growth for landscape architects, with a median salary of over $73,000. Let's start your journey — click any milestone to begin tracking your progress!` },
  { id: 'welcome-returning-early', text: `Welcome back! You're still in the early stages of your landscape architecture journey. Every milestone you complete builds your experiential portfolio and moves you closer to professional practice. Keep exploring — there's so much to discover!` },
  { id: 'welcome-returning-mid', text: `Great to see you again! You're making solid progress through the program. You're deep in the Engage or Develop phase now, building real professional competencies. Keep checking off those milestones — you're building toward a career with a median salary of $73,210.` },
  { id: 'welcome-returning-late', text: `Almost there! You're in the home stretch of your landscape architecture degree. The Launch phase is where everything comes together — capstone, portfolio, and career preparation. Employers are looking for graduates just like you. Let's close out strong!` },
  { id: 'phase-explore', text: `Year 1 is the Explore phase. This is where you build your foundation — understanding design fundamentals, natural systems, and what landscape architecture is all about. Every studio course, every site visit, every sketch builds the creative toolkit you'll use for the next three years and beyond.` },
  { id: 'phase-engage', text: `Year 2 is the Engage phase. Now you start connecting with communities, joining professional organizations, and applying your skills to real problems. This is where mentorships begin, where you find your professional voice, and where your network starts growing.` },
  { id: 'phase-develop', text: `Year 3 is the Develop phase. This is where your technical skills deepen — site engineering, construction documentation, advanced design studios. You're no longer learning the basics; you're becoming a professional. Study abroad opportunities and research projects open up in this phase too.` },
  { id: 'phase-launch', text: `Year 4 is the Launch phase. Everything comes together — capstone project, professional portfolio, licensure preparation, and career search. This is your runway. Employers are watching, and your body of work speaks for itself. You've built something incredible across four years. Now it's time to show the world.` },
  { id: 'category-purpose', text: `Purpose and Self-Discovery milestones are about research, studio work, and foundational courses that build your design identity. These experiences help you discover who you are as a designer and what kind of impact you want to make in the world.` },
  { id: 'category-communities', text: `Communities and Service milestones involve collaborative projects, service-learning, and community engagement. Landscape architecture is a people-centered profession — these experiences teach you to listen, collaborate, and design for real communities.` },
  { id: 'category-localglobal', text: `Local and Global Engagement milestones take you beyond campus — study abroad, field work, and real-world site applications. Professionals with international experience earn 15 to 25% more on average and bring perspectives that local-only candidates simply can't.` },
  { id: 'category-identity', text: `Professional Identity milestones prepare you for career success — resume building, portfolio development, licensure readiness, and professional networking. These are the experiences that transform a student into a professional.` },
  { id: 'career-outlook', text: `Landscape architects are in high demand. The Bureau of Labor Statistics reports a median salary of $73,210 with 4% job growth projected through 2032. That's about 25,500 jobs nationwide. Top employers include architecture and engineering firms, government agencies, and self-employed practitioners. As an HBCU graduate, you bring unique perspectives to green infrastructure, climate adaptation, and sustainable development.` },
  { id: 'org-asla', text: `The American Society of Landscape Architects, or ASLA, is the national professional association for landscape architects. They offer student membership, design competitions, career resources, and annual awards that set the standard for the profession. Joining ASLA as a student is one of the smartest career moves you can make.` },
  { id: 'org-blan', text: `The Black Landscape Architecture Network, or BLAN, is dedicated to advancing Black professionals in landscape architecture. They provide mentorship, community, visibility, and a powerful support network. As an NC A&T student, connecting with BLAN connects you to a legacy of excellence in design.` },
  { id: 'sfric-stormwater', text: `The Stormwater and Green Infrastructure Research project at the Small Farm Research and Innovation Center focuses on bioretention, rain gardens, and stormwater capture systems. Students design and test green infrastructure solutions that address real flooding and water quality challenges on agricultural land.` },
  { id: 'sfric-pollinator', text: `The Pollinator Habitat and Ecological Design project creates structured habitats for native pollinators. Students apply ecological design principles to build pollinator gardens, meadows, and corridors that support biodiversity while serving as beautiful landscape features.` },
  { id: 'sfric-outdoor-classroom', text: `The Outdoor Classroom and Interpretive Landscape project transforms the SFRIC campus into a living learning environment. Students design interpretive signage, educational trails, and outdoor gathering spaces that connect visitors with sustainable agriculture and environmental science.` },
  { id: 'sfric-master-plan', text: `The SFRIC Campus Master Plan is a community-scale planning effort where students conduct stakeholder interviews, precedent analysis, and phased master planning. This project builds professional skills in site analysis, community engagement, and strategic spatial frameworks.` },
  { id: 'progress-25', text: `You just hit 25% — congratulations! You've completed the Explore phase and you're moving into Engage. This is where things get exciting. Start looking for mentors, joining organizations, and connecting your coursework to real communities.` },
  { id: 'progress-50', text: `Halfway there! 50% of your experiential milestones are complete. You've entered the Develop phase, where your technical skills deepen and your portfolio starts taking shape. You're building something impressive — keep the momentum!` },
  { id: 'progress-75', text: `75% complete — you're in Launch mode now! The finish line is visible. Capstone, portfolio, licensure prep, and career search are all on the horizon. Everything you've done across three years has led to this moment.` },
  { id: 'progress-100', text: `100%! You've completed every experiential milestone in the program! This is an incredible achievement. You are fully prepared for professional practice in landscape architecture. The profession needs your talent, your perspective, and your drive. Go make your mark on the world!` },
  { id: 'asla-awards-intro', text: `The ASLA Student Awards recognize outstanding work across six categories: General Design, Residential Design, Analysis and Planning, Communications, Research, and Student Community Service. These awards are the gold standard for student achievement in landscape architecture. Your capstone project could be an award submission — aim high!` },
  { id: 'celebration-milestone', text: `Great work! Another milestone checked off. Every experience you complete strengthens your professional portfolio and brings you closer to your career goals. Keep going — you're building something special.` },
  { id: 'celebration-competency', text: `Outstanding! You've verified an entire competency section. This aligns with professional certification standards and demonstrates mastery that employers actively seek. That's a major achievement!` }
];

function pcmToWav(pcmData, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcmData.copy(buffer, 44);
  return buffer;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const manifest = [];
  let success = 0, errors = 0;

  for (let i = 0; i < SCRIPTS.length; i++) {
    const script = SCRIPTS[i];
    process.stdout.write(`(${i + 1}/${SCRIPTS.length}) ${script.id}... `);

    try {
      const resp = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: script.text, voice: VOICE })
      });

      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${err.substring(0, 100)}`);
      }

      const data = await resp.json();
      const audioB64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioB64) throw new Error('No audio data');

      const pcmBuffer = Buffer.from(audioB64, 'base64');
      const wavBuffer = pcmToWav(pcmBuffer);
      const filepath = path.join(OUTPUT_DIR, `${script.id}.wav`);
      fs.writeFileSync(filepath, wavBuffer);

      manifest.push({ id: script.id, path: `assets/audio/coaching/caes-la/${script.id}.wav` });
      console.log(`✅ (${(wavBuffer.length / 1024).toFixed(1)}KB)`);
      success++;

      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.log(`❌ ${err.message}`);
      errors++;
    }
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Done! ${success} clips, ${errors} errors`);
  console.log(`Manifest: ${path.join(OUTPUT_DIR, 'manifest.json')}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
