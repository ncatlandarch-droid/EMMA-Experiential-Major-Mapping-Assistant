/**
 * EMMA C2C — TTS Engine (Gemini Neural)
 * Emma's voice coaching using the proven AVA/Tia pattern from gemini-tts-engine skill:
 * speak(key) → hasPreRecording(key)? → playFile() → fallback: generateLiveAudio()
 * Voice: Aoede (calm female, soothing)
 *
 * NO browser speechSynthesis — robotic voices degrade UX.
 * If Gemini API fails, skip silently.
 */

const EMMA_TTS = (() => {
  let _isMuted = false;
  let _isSpeaking = false;
  let _audioContext = null;
  let _currentSource = null;
  let _queue = [];
  let _processing = false;

  const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
  const VOICE_NAME = 'Kore';

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
   * Initialize the TTS engine.
   */
  function init() {
    // Defer AudioContext creation until first user interaction
    // (Chrome autoplay policy requires user gesture)
    _isMuted = localStorage.getItem('emma_tts_muted') === 'true';

    // Avatar click is handled by app.js wireEvents()

    // Update badge to reflect stored mute state
    updateBadge();

    // Set initial voice status in Emma Says box
    const voiceStatus = document.getElementById('emma-voice-status');
    if (voiceStatus) {
      voiceStatus.textContent = _isMuted ? '🔇 Voice Off' : '🔊 Voice On';
    }

    console.log(`[EMMA TTS] Initialized — Voice: ${VOICE_NAME}, Muted: ${_isMuted}`);
  }

  /**
   * Toggle mute state. Avatar click handler.
   */
  function toggleMute() {
    // If she's currently speaking, just stop her (don't toggle mute)
    if (_isSpeaking) {
      stop();
      postToChat('(Emma stopped)');
      return _isMuted;
    }

    // Otherwise toggle mute state
    _isMuted = !_isMuted;
    localStorage.setItem('emma_tts_muted', _isMuted);
    updateBadge();

    // Update the "Emma Says" voice status badge
    const voiceStatus = document.getElementById('emma-voice-status');
    if (voiceStatus) {
      voiceStatus.textContent = _isMuted ? '🔇 Voice Off' : '🔊 Voice On';
    }

    if (!_isMuted) {
      speak('welcome');
    }

    console.log(`[EMMA TTS] ${_isMuted ? 'Muted' : 'Unmuted'}`);
    return _isMuted;
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

    if (_isMuted) return;

    // Stop current speech to prevent talking over herself
    if (_isSpeaking) {
      stop();
    }

    _queue.push({ key: textOrKey, text, coachingKey: opts.coachingKey || null });
    if (!_processing) processQueue();
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
    if (!_isMuted) speak(report, { skipChat: true });
  }

  /**
   * Stop current speech + clear queue.
   */
  function stop() {
    _queue = [];
    _processing = false;
    if (_currentSource) {
      try { _currentSource.stop(); } catch (e) {}
      _currentSource = null;
    }
    setSpeaking(false);
  }

  /**
   * Check mute state.
   */
  function isMuted() {
    return _isMuted;
  }

  // ── Internal ───────────────────────────────────────────────

  /**
   * Load pre-recorded coaching manifest for current program.
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
      PRE_RECORDED_COACHING = {};
      manifest.forEach(entry => {
        PRE_RECORDED_COACHING[entry.id] = entry.path;
      });
      _coachingLoaded = true;
      console.log(`[EMMA TTS] Loaded ${manifest.length} pre-recorded coaching files for ${programSlug}`);
    } catch (e) {
      console.log('[EMMA TTS] Coaching manifest load failed:', e.message);
    }
  }

  /**
   * Process items in the queue one at a time.
   * 3-tier lookup: (1) generic pre-recorded → (2) coaching pre-recorded → (3) live Gemini TTS
   */
  async function processQueue() {
    if (_processing || _queue.length === 0) return;
    _processing = true;

    while (_queue.length > 0) {
      const item = _queue.shift();
      try {
        // 1. Try generic pre-recorded WAV first (welcome, etc.)
        if (PRE_RECORDED[item.key]) {
          try {
            await playFile(PRE_RECORDED[item.key]);
            continue;
          } catch (e) {
            console.log(`[EMMA TTS] Pre-recorded not found for "${item.key}", trying coaching...`);
          }
        }

        // 2. Try per-milestone coaching pre-recorded WAV
        const coachingKey = item.coachingKey;
        if (coachingKey && PRE_RECORDED_COACHING[coachingKey]) {
          try {
            await playFile(PRE_RECORDED_COACHING[coachingKey]);
            continue;
          } catch (e) {
            console.log(`[EMMA TTS] Coaching file not found for "${coachingKey}", trying live...`);
          }
        }

        // 3. Fallback: Gemini Neural TTS (uses API tokens)
        await generateLiveAudio(item.text);

      } catch (err) {
        // Skill says: "If API fails, skip silently."
        console.warn('[EMMA TTS] Playback failed, skipping:', err.message);
        setSpeaking(false);
      }
    }

    _processing = false;
  }

  /**
   * Get or create AudioContext (deferred until user interaction).
   */
  function getAudioContext() {
    if (!_audioContext || _audioContext.state === 'closed') {
      _audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return _audioContext;
  }

  /**
   * Get the Gemini API key — stored in localStorage via Settings.
   */
  function getApiKey() {
    return localStorage.getItem('EMMA_GEMINI_KEY') || '';
  }

  /**
   * Play a pre-recorded WAV file via Web Audio API.
   * Uses decodeAudioData to prevent static (proven pattern).
   */
  function playFile(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const audioCtx = getAudioContext();
        if (audioCtx.state === 'suspended') await audioCtx.resume();

        setSpeaking(true);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        _currentSource = audioCtx.createBufferSource();
        _currentSource.buffer = audioBuffer;
        _currentSource.connect(audioCtx.destination);

        _currentSource.onended = () => {
          _currentSource = null;
          setSpeaking(false);
          resolve();
        };

        _currentSource.start(0);
      } catch (err) {
        setSpeaking(false);
        reject(err);
      }
    });
  }

  /**
   * Call Gemini TTS API and play the returned audio.
   * Follows the exact pattern from gemini-tts-engine skill.
   */
  async function generateLiveAudio(text) {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.log('[EMMA TTS] No API key set — open Settings to enable voice.');
      return;
    }

    const audioCtx = getAudioContext();
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    setSpeaking(true);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
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
      throw new Error(`Gemini TTS API ${response.status}: ${errText.substring(0, 200)}`);
    }

    const data = await response.json();
    const audioPart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (!audioPart?.inlineData) {
      throw new Error('No audio data in Gemini response');
    }

    await playLiveAudio(audioPart.inlineData, audioCtx);
  }

  /**
   * Convert raw PCM from Gemini into WAV and play via Web Audio API.
   * CRITICAL: WAV wrapper + decodeAudioData eliminates static noise.
   */
  function playLiveAudio(inlineData, audioCtx) {
    return new Promise(async (resolve, reject) => {
      try {
        // Decode base64 PCM
        const raw = atob(inlineData.data);
        const pcmBytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) pcmBytes[i] = raw.charCodeAt(i);

        // Parse sample rate from mimeType (e.g., "audio/L16;rate=24000")
        const mime = inlineData.mimeType || '';
        const rateMatch = mime.match(/rate=(\d+)/);
        const sampleRate = rateMatch ? parseInt(rateMatch[1]) : 24000;

        // Build WAV header (44 bytes)
        const dataSize = pcmBytes.length;
        const wavBuffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(wavBuffer);
        const writeStr = (off, s) => {
          for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
        };

        writeStr(0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeStr(8, 'WAVE');
        writeStr(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);      // PCM format
        view.setUint16(22, 1, true);      // Mono
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true); // byte rate
        view.setUint16(32, 2, true);      // block align
        view.setUint16(34, 16, true);     // bits per sample
        writeStr(36, 'data');
        view.setUint32(40, dataSize, true);
        new Uint8Array(wavBuffer, 44).set(pcmBytes);

        // Browser-native decoding — eliminates static
        const audioBuffer = await audioCtx.decodeAudioData(wavBuffer);

        _currentSource = audioCtx.createBufferSource();
        _currentSource.buffer = audioBuffer;
        _currentSource.connect(audioCtx.destination);

        _currentSource.onended = () => {
          _currentSource = null;
          setSpeaking(false);
          resolve();
        };

        _currentSource.start(0);
      } catch (err) {
        setSpeaking(false);
        reject(err);
      }
    });
  }

  /**
   * Set speaking state and update avatar animation.
   */
  function setSpeaking(speaking) {
    _isSpeaking = speaking;
    const avatar = document.getElementById('emma-avatar');
    if (avatar) {
      avatar.classList.toggle('speaking', speaking);
    }
    // Speaking wave bar animation
    const wave = document.getElementById('emma-speaking-wave');
    if (wave) {
      wave.style.display = speaking ? 'flex' : 'none';
    }
  }

  /**
   * Update the voice badge icon.
   */
  function updateBadge() {
    const avatar = document.getElementById('emma-avatar');
    const badge = avatar?.querySelector('.voice-badge');
    if (badge) {
      badge.textContent = _isMuted ? '🔇' : '🔊';
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
