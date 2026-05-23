/**
 * EMMA C2C — TTS Engine (Gemini Neural)
 * Now powered by ThinkAvatarTTS universal module.
 * EMMA-specific: coaching logic, milestone insights, progress reports.
 * Audio engine: ThinkAvatarTTS handles queue, PCM→WAV, Web Audio, speaking ring.
 * Voice: Kore (warm female, natural)
 *
 * NO browser speechSynthesis — robotic voices degrade UX.
 * If Gemini API fails, skip silently.
 */

const EMMA_TTS = (() => {
  // ── Audio Engine (universal module) ──
  let _engine = null;

  // Pre-recorded coaching keys (WAV files in assets/audio/)
  const PRE_RECORDED = {
    'welcome': 'assets/audio/en-welcome.wav',
    'milestone-checked': 'assets/audio/en-milestone-checked.wav',
    'competency-verified': 'assets/audio/en-competency-verified.wav',
    'export-ready': 'assets/audio/en-export-ready.wav'
  };

  // Pre-recorded per-milestone coaching (loaded from manifest)
  // Keys: 'welcome-first', 'progress-25', 'milestone-{id}', etc.
  let PRE_RECORDED_COACHING = {};
  let _coachingLoaded = false;

  // Contextual coaching messages — UNIQUE per milestone
  const COACHING = {
    milestoneChecked: (milestone) => {
      const branding = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('branding') : null;
      const programName = branding?.programName || 'your program';
      const career = branding?.careerOutlook || {};
      const timeline = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('timeline') : null;
      const checked = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('checkedMilestones') : {};

      // Calculate progress
      const totalMilestones = timeline?.phases?.reduce((sum, p) => sum + (p.milestones?.length || 0), 0) || 0;
      const completedCount = Object.values(checked || {}).filter(Boolean).length;
      const pct = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

      const name = milestone.label || 'this milestone';
      const cat = milestone.category || '';
      const desc = milestone.description || '';
      const year = milestone.year || '';
      const sem = milestone.semester || '';

      // Build a unique opener referencing the specific milestone
      const openers = [
        `You just completed ${name}!`,
        `${name} — checked off!`,
        `Nice work on ${name}!`,
        `${name} is done!`,
        `That's ${name} in the books!`
      ];
      const opener = openers[Math.floor(Math.random() * openers.length)];

      // Build category-specific insight about THIS milestone
      let insight = '';
      switch (cat) {
        case 'Purpose':
          if (desc.toLowerCase().includes('research')) {
            insight = `Research experience like this is what separates competitive applicants from the rest. Graduate programs and employers both prioritize candidates with hands-on research.`;
          } else if (desc.toLowerCase().includes('capstone') || desc.toLowerCase().includes('senior')) {
            insight = `Capstone work demonstrates you can apply everything you've learned to a real-world challenge. This is portfolio-ready material.`;
          } else if (desc.toLowerCase().includes('design') || desc.toLowerCase().includes('studio')) {
            insight = `Studio and design work builds the creative problem-solving skills that define top professionals in ${career.field || 'your field'}.`;
          } else if (desc.toLowerCase().includes('intern')) {
            insight = `Professional internship experience is the number one thing employers look for beyond your degree. This puts you ahead of 60% of graduates.`;
          } else if (desc.toLowerCase().includes('plant') || desc.toLowerCase().includes('soil') || desc.toLowerCase().includes('ecology')) {
            insight = `Understanding natural systems is foundational for ${career.field || 'your profession'}. This technical knowledge sets you apart in site analysis and environmental assessment.`;
          } else if (desc.toLowerCase().includes('construct') || desc.toLowerCase().includes('material') || desc.toLowerCase().includes('grading')) {
            insight = `Technical construction knowledge is what turns a designer into a professional who can actually build what they envision. Contractors respect this expertise.`;
          } else if (desc.toLowerCase().includes('history') || desc.toLowerCase().includes('theory')) {
            insight = `Understanding the history and theory of your discipline gives your work intellectual depth. The best professionals know where their field came from.`;
          } else {
            insight = `This coursework strengthens your technical foundation in ${career.field || 'your discipline'}. Each course builds competencies employers actively seek.`;
          }
          break;

        case 'Communities':
          if (desc.toLowerCase().includes('mentor') || desc.toLowerCase().includes('alumni')) {
            insight = `Mentorship connections often lead directly to job offers. Alumni who mentor students hire from that same pool — you're building your professional pipeline.`;
          } else if (desc.toLowerCase().includes('organization') || desc.toLowerCase().includes('club') || desc.toLowerCase().includes('chapter')) {
            insight = `Active membership in professional organizations shows employers you're committed to the field beyond just coursework. This goes on your resume.`;
          } else if (desc.toLowerCase().includes('leadership') || desc.toLowerCase().includes('officer') || desc.toLowerCase().includes('president')) {
            insight = `Leadership roles demonstrate management skills that are impossible to teach in a classroom. Employers pay a premium for candidates who can lead teams.`;
          } else if (desc.toLowerCase().includes('greek') || desc.toLowerCase().includes('fraternity') || desc.toLowerCase().includes('sorority')) {
            insight = `Greek life builds professional networks that last decades. The connections you make now will open doors throughout your entire career.`;
          } else if (desc.toLowerCase().includes('service') || desc.toLowerCase().includes('volunteer') || desc.toLowerCase().includes('civic')) {
            insight = `Community service shows character and social responsibility. Many firms prioritize candidates who demonstrate commitment to serving others.`;
          } else {
            insight = `Building community connections during college gives you a professional network years before most people start. That's a massive career advantage.`;
          }
          break;

        case 'LocalGlobal':
          if (desc.toLowerCase().includes('abroad') || desc.toLowerCase().includes('international') || desc.toLowerCase().includes('exchange')) {
            insight = `International experience is transformative. Professionals with global exposure earn 15 to 25% more on average and bring perspectives that local-only candidates simply can't.`;
          } else if (desc.toLowerCase().includes('community') || desc.toLowerCase().includes('local') || desc.toLowerCase().includes('neighborhood')) {
            insight = `Local community engagement grounds your education in real-world impact. Understanding the communities you serve makes your work more meaningful and more effective.`;
          } else if (desc.toLowerCase().includes('travel') || desc.toLowerCase().includes('field trip') || desc.toLowerCase().includes('site visit')) {
            insight = `Field experience gives you firsthand exposure to how professionals work in practice. You learn things on-site that no textbook can teach.`;
          } else if (desc.toLowerCase().includes('culture') || desc.toLowerCase().includes('divers') || desc.toLowerCase().includes('equity')) {
            insight = `Cultural competency is a must-have skill in today's global workforce. Understanding diverse perspectives makes you a better collaborator and problem solver.`;
          } else {
            insight = `Broadening your perspective beyond campus prepares you for the reality of professional practice, where projects span communities, regions, and even countries.`;
          }
          break;

        case 'Identity':
          if (desc.toLowerCase().includes('resume') || desc.toLowerCase().includes('portfolio')) {
            insight = `A polished portfolio or resume is your calling card. This is what gets you through the door. Most hiring managers spend only 7 seconds on a first look — make yours count.`;
          } else if (desc.toLowerCase().includes('headshot') || desc.toLowerCase().includes('attire') || desc.toLowerCase().includes('professional')) {
            insight = `Professional presentation matters more than people think. First impressions are formed in under a second, and looking the part signals confidence and readiness.`;
          } else if (desc.toLowerCase().includes('license') || desc.toLowerCase().includes('exam') || desc.toLowerCase().includes('certification') || desc.toLowerCase().includes('lare')) {
            insight = `Licensure preparation puts you on the path to professional credentials.${career.certifications ? ` The ${career.certifications[0]} is your gateway to independent practice and higher earning potential.` : ''}`;
          } else if (desc.toLowerCase().includes('handshake') || desc.toLowerCase().includes('career') || desc.toLowerCase().includes('job')) {
            insight = `Engaging with career services early puts you ahead of peers who wait until senior year. The students who start earliest get the best placement outcomes.`;
          } else if (desc.toLowerCase().includes('network') || desc.toLowerCase().includes('interview') || desc.toLowerCase().includes('mock')) {
            insight = `Interview and networking skills are trainable — and you're training them now. Professionals who practice interviewing negotiate salaries 10-20% higher on average.`;
          } else {
            insight = `Building your professional identity is an ongoing process. ${career.medianSalary ? `Professionals in ${career.field || 'your field'} earn a median salary of ${career.medianSalary} — and it starts with steps like this.` : 'Every step you take now defines the professional you become.'}`;
          }
          break;

        default:
          insight = `Every milestone you complete builds your experiential portfolio. You're ${pct}% through ${programName} — keep going!`;
      }

      // Add progress context at the end for milestone landmarks
      let progressNote = '';
      if (pct === 25) progressNote = ` You just hit 25% — the Engage phase awaits!`;
      else if (pct === 50) progressNote = ` Halfway there! You've entered the Develop phase.`;
      else if (pct === 75) progressNote = ` 75% done — you're in Launch mode now!`;
      else if (pct >= 95) progressNote = ` You're almost at 100%! The finish line is right there!`;

      return `${opener} ${insight}${progressNote}`;
    },

    competencyVerified: (section) => {
      const branding = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('branding') : null;
      const career = branding?.careerOutlook || {};
      return `Outstanding! You've verified ${section.name}. ${career.certifications ? `This competency aligns with ${career.certifications[0] || 'professional certification'} standards.` : 'That is a major professional achievement!'} Keep pushing forward!`;
    },

    welcome: () => {
      return buildSmartWelcome();
    }
  };

  /**
   * Build a unique, context-aware welcome message.
   */
  function buildSmartWelcome() {
    const branding = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('branding') : null;
    const timeline = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('timeline') : null;
    const checked = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('checkedMilestones') : {};

    if (!branding || !timeline) {
      return `Welcome! I'm Emma, your experiential mapping assistant. Select a program to get started, and I'll guide you through every milestone from Explore through Launch.`;
    }

    const programName = branding.programName || 'your program';
    const career = branding.careerOutlook || {};
    const totalMilestones = timeline.phases?.reduce((sum, p) => sum + (p.milestones?.length || 0), 0) || 0;
    const completedCount = Object.values(checked || {}).filter(Boolean).length;
    const pct = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

    // Phase detection
    let currentPhase = 'Explore';
    if (pct > 75) currentPhase = 'Launch';
    else if (pct > 50) currentPhase = 'Develop';
    else if (pct > 25) currentPhase = 'Engage';

    if (completedCount === 0) {
      // First time
      const field = career.field ? ` in ${career.field}` : '';
      const growth = career.growthRate ? ` The Bureau of Labor Statistics projects ${career.growthRate} job growth${field}. ` : ' ';
      return `Welcome to ${programName}! I'm Emma, your career mapping assistant. You have ${totalMilestones} experiential milestones ahead of you.${growth}Let's start your journey from Explore through Launch. Click any milestone to track your progress!`;
    } else if (pct < 30) {
      return `Welcome back! You're in the ${currentPhase} phase of ${programName}, with ${completedCount} of ${totalMilestones} milestones complete. ${career.field ? `Keep going — ${career.field} professionals are in high demand!` : 'Great momentum — keep exploring!'} Let me know if you have questions about any milestone.`;
    } else if (pct < 70) {
      return `Looking good! You're ${pct}% through ${programName}, deep in the ${currentPhase} phase. ${career.medianSalary ? `You're building toward a career with a median salary of ${career.medianSalary}.` : `You're building a strong professional foundation.`} Keep checking off those milestones!`;
    } else {
      return `Almost there! ${pct}% of ${programName} complete — you're in the ${currentPhase} phase! ${career.topEmployers ? `Employers like ${career.topEmployers[0]} are looking for graduates just like you.` : 'The finish line is in sight!'} Let's close out strong!`;
    }
  }

  // ── Public API ─────────────────────────────────────────────

  /**
   * Initialize the TTS engine using ThinkAvatarTTS universal module.
   */
  function init() {
    // Inject speaking ring CSS
    ThinkAvatarTTS.injectSpeakingCSS('#003366');

    // Create the engine instance
    _engine = ThinkAvatarTTS.create({
      name: 'EMMA',
      voice: 'Kore',
      avatarId: 'emma-avatar',
      muteKey: 'emma_tts_muted',
      proxyUrl: '/.netlify/functions/gemini-tts-proxy',
      apiKeySource: () => localStorage.getItem('EMMA_GEMINI_KEY') || '',
      preRecorded: PRE_RECORDED,
      speakingClass: 'speaking',
      onSpeakStart: () => {
        const wave = document.getElementById('emma-speaking-wave');
        if (wave) wave.style.display = 'flex';
      },
      onSpeakEnd: () => {
        const wave = document.getElementById('emma-speaking-wave');
        if (wave) wave.style.display = 'none';
      },
      onMuteChanged: (muted) => {
        const voiceStatus = document.getElementById('emma-voice-status');
        if (voiceStatus) {
          voiceStatus.textContent = muted ? '🔇 Voice Off' : '🔊 Voice On';
        }
      }
    });

    // Set initial voice status
    const voiceStatus = document.getElementById('emma-voice-status');
    if (voiceStatus) {
      voiceStatus.textContent = _engine.isMuted() ? '🔇 Voice Off' : '🔊 Voice On';
    }

    console.log('[EMMA TTS] Initialized via ThinkAvatarTTS universal module');
  }

  /**
   * Toggle mute state. Avatar click handler.
   */
  function toggleMute() {
    if (!_engine) return false;

    // If speaking, stop instead of toggling
    if (_engine.isSpeaking()) {
      _engine.stop();
      postToChat('(Emma stopped)');
      return _engine.isMuted();
    }

    const muted = _engine.toggleMute();
    console.log(`[EMMA TTS] toggleMute → muted=${muted}`);

    if (!muted) {
      speak('welcome');
    }

    return muted;
  }

  /**
   * Main speak function — queue text for playback.
   * @param {string} textOrKey - Pre-recorded key OR raw text
   * @param {object} opts - { skipChat: bool, coachingKey: string }
   */
  function speak(textOrKey, opts) {
    // Support legacy boolean arg for skipChat
    if (typeof opts === 'boolean') opts = { skipChat: opts };
    opts = opts || {};

    // Resolve text from coaching key
    let text = textOrKey;
    if (textOrKey === 'welcome') text = COACHING.welcome();

    // Always post to chat (unless already posted by caller)
    if (!opts.skipChat) postToChat(text);

    if (!_engine || _engine.isMuted()) {
      console.log(`[EMMA TTS] speak() blocked — engine=${!!_engine}, muted=${_engine?.isMuted()}`);
      return;
    }

    // Delegate audio to universal engine
    console.log(`[EMMA TTS] speak() → delegating to engine, text length=${text.length}`);
    _engine.speak(text, { coachingKey: opts.coachingKey || null });
  }

  /**
   * Post Emma's coaching text to the chat panel AND the center ticker.
   * Always posts regardless of mute state.
   */
  function postToChat(text) {
    // 1. Left panel chat bubble
    const container = document.getElementById('chat-messages');
    if (container) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-msg emma';
      const bubble = document.createElement('div');
      bubble.className = 'chat-msg-bubble';
      bubble.textContent = text;
      msgDiv.appendChild(bubble);
      container.appendChild(msgDiv);
      container.scrollTop = container.scrollHeight;
    }

    // 2. Center canvas "Emma Says" box (always visible)
    const ticker = document.getElementById('emma-ticker-text');
    const tickerWrap = document.getElementById('emma-says-box');
    if (ticker) {
      ticker.textContent = text;
      // Brief highlight animation
      tickerWrap?.classList.add('updated');
      setTimeout(() => tickerWrap?.classList.remove('updated'), 2000);
    }
  }

  /**
   * Called when a milestone is checked.
   * Always posts text to chat. Voice only if unmuted.
   */
  function onMilestoneChecked(milestone) {
    const text = COACHING.milestoneChecked(milestone);
    postToChat(text);
    if (!_isMuted) speak(text, { skipChat: true, coachingKey: `milestone-${milestone.id}` });
  }

  /**
   * Called when a validation section is verified.
   */
  function onCompetencyVerified(section) {
    const text = COACHING.competencyVerified(section);
    postToChat(text);
    if (!_isMuted) speak(text, { skipChat: true, coachingKey: `competency-${section.index || 0}` });
  }

  /**
   * Called when user clicks the progress bar.
   * Emma gives a detailed progress report.
   */
  function onProgressClicked() {
    const branding = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('branding') : null;
    const timeline = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('timeline') : null;
    const checked = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('checkedMilestones') : {};
    const checkedResources = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('checkedResources') : {};
    const resources = typeof EMMA_STATE !== 'undefined' ? (EMMA_STATE.get('resources')?.utilityLinks || []) : [];
    const career = branding?.careerOutlook || {};

    if (!timeline?.phases) {
      const fallback = `Select a program to see your progress!`;
      postToChat(fallback);
      if (!_isMuted) speak(fallback);
      return;
    }

    const programName = branding?.programName || 'your program';

    // Use the SAME calculation as the progress bar
    const pct = EMMA_STATE.getOverallProgress();

    // Count totals (milestones + resources) — matches progress bar
    const milestoneTotal = timeline.phases.reduce((sum, p) => sum + (p.milestones?.length || 0), 0);
    const milestoneDone = Object.values(checked || {}).filter(Boolean).length;
    const resourceDone = Object.values(checkedResources || {}).filter(Boolean).length;
    const totalItems = milestoneTotal + resources.length;
    const doneItems = milestoneDone + resourceDone;

    // Phase-by-phase breakdown (milestones only)
    const phaseBreakdown = timeline.phases.map(phase => {
      const phaseTotal = phase.milestones?.length || 0;
      const phaseDone = (phase.milestones || []).filter(m => checked[m.id]).length;
      return { name: phase.label || phase.id, done: phaseDone, total: phaseTotal };
    });

    // Current phase detection
    let currentPhase = 'Explore';
    if (pct > 75) currentPhase = 'Launch';
    else if (pct > 50) currentPhase = 'Develop';
    else if (pct > 25) currentPhase = 'Engage';

    // Build the report
    let report = '';

    if (doneItems === 0) {
      report = `You're at 0% in ${programName}. You have ${totalItems} items to complete — ${milestoneTotal} milestones and ${resources.length} resources. Click any milestone to start tracking your journey!`;
    } else if (pct === 100) {
      report = `Congratulations! You've completed 100% of ${programName}! All ${totalItems} items are done. ${career.medianSalary ? `You're ready for a career with a median salary of ${career.medianSalary}.` : 'You are fully prepared for your professional career.'} Time to launch!`;
    } else {
      // Phase breakdown
      const phaseReport = phaseBreakdown.map(p => `${p.name}: ${p.done} of ${p.total}`).join('. ');

      report = `You're at ${pct}% in ${programName} — ${doneItems} of ${totalItems} items complete. `;
      report += `That's ${milestoneDone} milestones and ${resourceDone} resources checked. `;
      report += `You're currently in the ${currentPhase} phase. Phase breakdown: ${phaseReport}. `;

      // Find next unchecked milestone
      for (const phase of timeline.phases) {
        for (const m of (phase.milestones || [])) {
          if (!checked[m.id]) {
            report += `Your next milestone is "${m.label}" in the ${phase.label || phase.id} phase. `;
            break;
          }
        }
        if (report.includes('next milestone')) break;
      }

      // Career motivation
      if (career.medianSalary && pct > 40) {
        report += `Keep going — you're building toward a career with a median salary of ${career.medianSalary}.`;
      } else if (career.field) {
        report += `Every milestone brings you closer to professional practice in ${career.field}.`;
      }
    }

    // Progress reports are always live (not pre-recorded)
    postToChat(report);
    if (_engine && !_engine.isMuted()) speak(report, { skipChat: true });
  }

  /**
   * Stop current speech + clear queue.
   */
  function stop() {
    if (_engine) _engine.stop();
  }

  /**
   * Check mute state.
   */
  function isMuted() {
    return _engine ? _engine.isMuted() : true;
  }

  // ── Internal ───────────────────────────────────────────────

  /**
   * Load pre-recorded coaching manifest for current program.
   * Registers files with the universal engine.
   */
  async function loadCoachingManifest(programSlug) {
    try {
      const manifestUrl = `assets/audio/coaching/${programSlug}/manifest.json`;
      const resp = await fetch(manifestUrl);
      if (!resp.ok) {
        console.log(`[EMMA TTS] No coaching manifest for ${programSlug}`);
        return;
      }
      const manifest = await resp.json();
      const map = {};
      manifest.forEach(entry => {
        map[entry.id] = entry.path;
      });
      // Register with universal engine
      if (_engine) _engine.registerPreRecorded(map);
      _coachingLoaded = true;
      console.log(`[EMMA TTS] Loaded ${manifest.length} pre-recorded coaching files for ${programSlug}`);
    } catch (e) {
      console.log('[EMMA TTS] Coaching manifest load failed:', e.message);
    }
  }

  // Public API
  return {
    init,
    speak,
    toggleMute,
    onMilestoneChecked,
    onCompetencyVerified,
    onProgressClicked,
    loadCoachingManifest,
    stop,
    isMuted
  };
})();

console.log('[EMMA] TTS engine initialized');
