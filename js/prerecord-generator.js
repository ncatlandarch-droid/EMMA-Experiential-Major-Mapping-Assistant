/**
 * EMMA Pre-Recorded TTS Generator
 * ================================
 * Generates WAV files for all static coaching messages using the Gemini TTS proxy.
 * Run this once per program to create the audio cache.
 * 
 * Usage: 
 *   1. Deploy to Netlify first (needs the proxy function)
 *   2. Open browser console on the deployed site
 *   3. Paste this entire script and run it
 *   4. Download the generated ZIP of WAV files
 *   5. Place files in assets/audio/coaching/{programSlug}/
 *
 * Or run via Node.js with the GEMINI_API_KEY env var set.
 */

const EMMA_PRERECORD = (() => {

  // ── Static Scripts ──────────────────────────────────────
  // These never change per student — pre-record once, play forever.

  const SCRIPTS = [
    // ═══════════════════════════════════════════════════════
    // WELCOME MESSAGES
    // ═══════════════════════════════════════════════════════
    {
      id: 'welcome-first',
      category: 'welcome',
      text: `Welcome to the Bachelor of Science in Landscape Architecture at NC A&T! I'm Emma, your experiential mapping assistant. You have over 24 milestones ahead of you across four phases: Explore, Engage, Develop, and Launch. The Bureau of Labor Statistics projects 4% job growth for landscape architects, with a median salary of over $73,000. Let's start your journey — click any milestone to begin tracking your progress!`
    },
    {
      id: 'welcome-returning-early',
      category: 'welcome',
      text: `Welcome back! You're still in the early stages of your landscape architecture journey. Every milestone you complete builds your experiential portfolio and moves you closer to professional practice. Keep exploring — there's so much to discover!`
    },
    {
      id: 'welcome-returning-mid',
      category: 'welcome',
      text: `Great to see you again! You're making solid progress through the program. You're deep in the Engage or Develop phase now, building real professional competencies. Keep checking off those milestones — you're building toward a career with a median salary of $73,210.`
    },
    {
      id: 'welcome-returning-late',
      category: 'welcome',
      text: `Almost there! You're in the home stretch of your landscape architecture degree. The Launch phase is where everything comes together — capstone, portfolio, and career preparation. Employers are looking for graduates just like you. Let's close out strong!`
    },

    // ═══════════════════════════════════════════════════════
    // PHASE INTRODUCTIONS
    // ═══════════════════════════════════════════════════════
    {
      id: 'phase-explore',
      category: 'phase',
      text: `Year 1 is the Explore phase. This is where you build your foundation — understanding design fundamentals, natural systems, and what landscape architecture is all about. Every studio course, every site visit, every sketch builds the creative toolkit you'll use for the next three years and beyond.`
    },
    {
      id: 'phase-engage',
      category: 'phase',
      text: `Year 2 is the Engage phase. Now you start connecting with communities, joining professional organizations, and applying your skills to real problems. This is where mentorships begin, where you find your professional voice, and where your network starts growing.`
    },
    {
      id: 'phase-develop',
      category: 'phase',
      text: `Year 3 is the Develop phase. This is where your technical skills deepen — site engineering, construction documentation, advanced design studios. You're no longer learning the basics; you're becoming a professional. Study abroad opportunities and research projects open up in this phase too.`
    },
    {
      id: 'phase-launch',
      category: 'phase',
      text: `Year 4 is the Launch phase. Everything comes together — capstone project, professional portfolio, licensure preparation, and career search. This is your runway. Employers are watching, and your body of work speaks for itself. You've built something incredible across four years. Now it's time to show the world.`
    },

    // ═══════════════════════════════════════════════════════
    // CATEGORY EXPLANATIONS
    // ═══════════════════════════════════════════════════════
    {
      id: 'category-purpose',
      category: 'category',
      text: `Purpose and Self-Discovery milestones are about research, studio work, and foundational courses that build your design identity. These experiences help you discover who you are as a designer and what kind of impact you want to make in the world.`
    },
    {
      id: 'category-communities',
      category: 'category',
      text: `Communities and Service milestones involve collaborative projects, service-learning, and community engagement. Landscape architecture is a people-centered profession — these experiences teach you to listen, collaborate, and design for real communities.`
    },
    {
      id: 'category-localglobal',
      category: 'category',
      text: `Local and Global Engagement milestones take you beyond campus — study abroad, field work, and real-world site applications. Professionals with international experience earn 15 to 25% more on average and bring perspectives that local-only candidates simply can't.`
    },
    {
      id: 'category-identity',
      category: 'category',
      text: `Professional Identity milestones prepare you for career success — resume building, portfolio development, licensure readiness, and professional networking. These are the experiences that transform a student into a professional.`
    },

    // ═══════════════════════════════════════════════════════
    // CAREER OUTLOOK
    // ═══════════════════════════════════════════════════════
    {
      id: 'career-outlook',
      category: 'career',
      text: `Landscape architects are in high demand. The Bureau of Labor Statistics reports a median salary of $73,210 with 4% job growth projected through 2032. That's about 25,500 jobs nationwide. Top employers include architecture and engineering firms, government agencies, and self-employed practitioners. As an HBCU graduate, you bring unique perspectives to green infrastructure, climate adaptation, and sustainable development.`
    },

    // ═══════════════════════════════════════════════════════
    // PROFESSIONAL ORGANIZATIONS
    // ═══════════════════════════════════════════════════════
    {
      id: 'org-asla',
      category: 'org',
      text: `The American Society of Landscape Architects, or ASLA, is the national professional association for landscape architects. They offer student membership, design competitions, career resources, and annual awards that set the standard for the profession. Joining ASLA as a student is one of the smartest career moves you can make.`
    },
    {
      id: 'org-blan',
      category: 'org',
      text: `The Black Landscape Architecture Network, or BLAN, is dedicated to advancing Black professionals in landscape architecture. They provide mentorship, community, visibility, and a powerful support network. As an NC A&T student, connecting with BLAN connects you to a legacy of excellence in design.`
    },

    // ═══════════════════════════════════════════════════════
    // SFRIC PROJECTS
    // ═══════════════════════════════════════════════════════
    {
      id: 'sfric-stormwater',
      category: 'sfric',
      text: `The Stormwater and Green Infrastructure Research project at the Small Farm Research and Innovation Center focuses on bioretention, rain gardens, and stormwater capture systems. Students design and test green infrastructure solutions that address real flooding and water quality challenges on agricultural land.`
    },
    {
      id: 'sfric-pollinator',
      category: 'sfric',
      text: `The Pollinator Habitat and Ecological Design project creates structured habitats for native pollinators. Students apply ecological design principles to build pollinator gardens, meadows, and corridors that support biodiversity while serving as beautiful landscape features.`
    },
    {
      id: 'sfric-outdoor-classroom',
      category: 'sfric',
      text: `The Outdoor Classroom and Interpretive Landscape project transforms the SFRIC campus into a living learning environment. Students design interpretive signage, educational trails, and outdoor gathering spaces that connect visitors with sustainable agriculture and environmental science.`
    },
    {
      id: 'sfric-master-plan',
      category: 'sfric',
      text: `The SFRIC Campus Master Plan is a community-scale planning effort where students conduct stakeholder interviews, precedent analysis, and phased master planning. This project builds professional skills in site analysis, community engagement, and strategic spatial frameworks.`
    },

    // ═══════════════════════════════════════════════════════
    // PROGRESS MILESTONES
    // ═══════════════════════════════════════════════════════
    {
      id: 'progress-25',
      category: 'progress',
      text: `You just hit 25% — congratulations! You've completed the Explore phase and you're moving into Engage. This is where things get exciting. Start looking for mentors, joining organizations, and connecting your coursework to real communities.`
    },
    {
      id: 'progress-50',
      category: 'progress',
      text: `Halfway there! 50% of your experiential milestones are complete. You've entered the Develop phase, where your technical skills deepen and your portfolio starts taking shape. You're building something impressive — keep the momentum!`
    },
    {
      id: 'progress-75',
      category: 'progress',
      text: `75% complete — you're in Launch mode now! The finish line is visible. Capstone, portfolio, licensure prep, and career search are all on the horizon. Everything you've done across three years has led to this moment.`
    },
    {
      id: 'progress-100',
      category: 'progress',
      text: `100%! You've completed every experiential milestone in the program! This is an incredible achievement. You are fully prepared for professional practice in landscape architecture. The profession needs your talent, your perspective, and your drive. Go make your mark on the world!`
    },

    // ═══════════════════════════════════════════════════════
    // ASLA AWARD CATEGORIES
    // ═══════════════════════════════════════════════════════
    {
      id: 'asla-awards-intro',
      category: 'asla',
      text: `The ASLA Student Awards recognize outstanding work across six categories: General Design, Residential Design, Analysis and Planning, Communications, Research, and Student Community Service. These awards are the gold standard for student achievement in landscape architecture. Your capstone project could be an award submission — aim high!`
    },

    // ═══════════════════════════════════════════════════════
    // GENERIC CELEBRATIONS
    // ═══════════════════════════════════════════════════════
    {
      id: 'celebration-milestone',
      category: 'celebration',
      text: `Great work! Another milestone checked off. Every experience you complete strengthens your professional portfolio and brings you closer to your career goals. Keep going — you're building something special.`
    },
    {
      id: 'celebration-competency',
      category: 'celebration',
      text: `Outstanding! You've verified an entire competency section. This aligns with professional certification standards and demonstrates mastery that employers actively seek. That's a major achievement!`
    }
  ];

  // ── Generation Logic ────────────────────────────────────

  /**
   * Generate all pre-recorded WAV files via the TTS proxy.
   * Call this from the browser console on the deployed site.
   */
  async function generateAll(proxyUrl = '/.netlify/functions/gemini-tts-proxy') {
    const results = [];
    const errors = [];

    console.log(`[PRERECORD] Starting generation of ${SCRIPTS.length} clips...`);

    for (let i = 0; i < SCRIPTS.length; i++) {
      const script = SCRIPTS[i];
      console.log(`[PRERECORD] (${i + 1}/${SCRIPTS.length}) Generating: ${script.id}`);

      try {
        const resp = await fetch(proxyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: script.text,
            voice: 'Kore',
            model: 'gemini-2.5-flash-preview-tts'
          })
        });

        if (!resp.ok) {
          errors.push({ id: script.id, error: `HTTP ${resp.status}` });
          continue;
        }

        const data = await resp.json();
        const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioData) {
          errors.push({ id: script.id, error: 'No audio data in response' });
          continue;
        }

        // Convert base64 PCM to WAV
        const pcmBytes = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
        const wavBytes = pcmToWav(pcmBytes, 24000, 1, 16);

        results.push({
          id: script.id,
          category: script.category,
          filename: `${script.id}.wav`,
          blob: new Blob([wavBytes], { type: 'audio/wav' }),
          size: wavBytes.length
        });

        console.log(`[PRERECORD] ✅ ${script.id} (${(wavBytes.length / 1024).toFixed(1)}KB)`);

        // Rate limit: 200ms between calls
        await new Promise(r => setTimeout(r, 200));

      } catch (err) {
        errors.push({ id: script.id, error: err.message });
        console.error(`[PRERECORD] ❌ ${script.id}:`, err.message);
      }
    }

    console.log(`[PRERECORD] Done! ${results.length} success, ${errors.length} errors`);
    if (errors.length) console.table(errors);

    return { results, errors, manifest: buildManifest(results) };
  }

  /**
   * Download all generated WAVs as individual files.
   */
  async function downloadAll(results) {
    for (const r of results) {
      const url = URL.createObjectURL(r.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = r.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      await new Promise(r => setTimeout(r, 100));
    }
  }

  /**
   * Build the manifest.json for loadCoachingManifest().
   */
  function buildManifest(results) {
    return results.map(r => ({
      id: r.id,
      category: r.category,
      path: `assets/audio/coaching/caes-la/${r.filename}`
    }));
  }

  /**
   * PCM (raw 16-bit LE mono) → WAV conversion
   */
  function pcmToWav(pcmData, sampleRate, channels, bitsPerSample) {
    const byteRate = sampleRate * channels * (bitsPerSample / 8);
    const blockAlign = channels * (bitsPerSample / 8);
    const dataSize = pcmData.length;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');

    // fmt chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // data chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Copy PCM data
    const output = new Uint8Array(buffer);
    output.set(pcmData, 44);

    return output;
  }

  function writeString(view, offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // ── Public API ──
  return {
    SCRIPTS,
    generateAll,
    downloadAll,
    buildManifest
  };
})();

// Usage instructions
console.log(`
╔══════════════════════════════════════════════════════════════╗
║  EMMA Pre-Recorded TTS Generator                            ║
║                                                              ║
║  Run in browser console on deployed site:                    ║
║                                                              ║
║  const r = await EMMA_PRERECORD.generateAll();               ║
║  // Then download all WAV files:                             ║
║  await EMMA_PRERECORD.downloadAll(r.results);                ║
║  // Copy manifest for manifest.json:                         ║
║  console.log(JSON.stringify(r.manifest, null, 2));           ║
║                                                              ║
║  ${EMMA_PRERECORD.SCRIPTS.length} clips ready to generate                              ║
╚══════════════════════════════════════════════════════════════╝
`);
