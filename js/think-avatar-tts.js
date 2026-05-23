/**
 * Think! Avatar TTS — Universal Speaking Engine v1.0
 * ═══════════════════════════════════════════════════
 * Drop-in Gemini Neural TTS module for any Think! Design project.
 * Proven across: AVA (Kore), Tia TM (Sulafat), EMMA (Aoede), GRANT (Gacrux)
 *
 * Usage:
 *   const avatar = ThinkAvatarTTS.create({
 *     name: 'EMMA',
 *     voice: 'Kore',
 *     avatarId: 'emma-avatar',
 *     apiKeySource: () => localStorage.getItem('EMMA_GEMINI_KEY') || '',
 *     speakingClass: 'speaking',
 *     onSpeakStart: () => {},
 *     onSpeakEnd: () => {},
 *     onTextGenerated: (text) => {}   // hook for posting to chat panels
 *   });
 *
 *   avatar.speak('Hello world');       // Live Gemini TTS
 *   avatar.speak('welcome');           // Pre-recorded WAV lookup
 *   avatar.toggleMute();               // Toggle with UI update
 *   avatar.stop();                     // Stop + clear queue
 *   avatar.isMuted();                  // Check state
 *
 * Architecture:
 *   speak(textOrKey)
 *     ├─ hasPreRecording(key)? → playFile(path) → fallback: generateLive(text)
 *     └─ else → generateLive(text) → PCM→WAV→decodeAudioData→play
 *
 * NO browser speechSynthesis — robotic voices degrade UX.
 * If Gemini API fails, skip silently.
 */

const ThinkAvatarTTS = (() => {

  /**
   * Create a new avatar TTS instance.
   * Each project gets its own instance with its own queue, voice, and config.
   */
  function create(config = {}) {
    // ── Config ──
    const NAME = config.name || 'Avatar';
    const VOICE_NAME = config.voice || 'Kore';
    const TTS_MODEL = config.model || 'gemini-2.5-flash-preview-tts';
    const AVATAR_ID = config.avatarId || null;
    const SPEAKING_CLASS = config.speakingClass || 'speaking';
    const MUTE_STORAGE_KEY = config.muteKey || `${NAME.toLowerCase()}_tts_muted`;
    const getApiKey = config.apiKeySource || (() => '');

    // ── Callbacks ──
    const onSpeakStart = config.onSpeakStart || (() => {});
    const onSpeakEnd = config.onSpeakEnd || (() => {});
    const onTextGenerated = config.onTextGenerated || (() => {});
    const onMuteChanged = config.onMuteChanged || (() => {});

    // ── State ──
    let _isMuted = false;
    let _isSpeaking = false;
    let _audioContext = null;
    let _currentSource = null;
    let _queue = [];
    let _processing = false;

    // Pre-recorded WAV mapping { key: 'path/to/file.wav' }
    let _preRecorded = config.preRecorded || {};

    // ═══════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════

    function init() {
      _isMuted = localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
      _updateAvatarState();
      console.log(`[${NAME} TTS] Initialized — Voice: ${VOICE_NAME}, Muted: ${_isMuted}`);
    }

    // ═══════════════════════════════════════
    // SPEAK — Main public entry point
    // ═══════════════════════════════════════

    /**
     * Queue text for playback.
     * @param {string} textOrKey - Pre-recorded key OR raw text
     * @param {object} opts - { coachingKey: string }
     */
    function speak(textOrKey, opts = {}) {
      console.log(`[${NAME} TTS Engine] speak() called — muted=${_isMuted}, text="${String(textOrKey).substring(0,50)}..."`);
      if (_isMuted) {
        console.log(`[${NAME} TTS Engine] BLOCKED — muted`);
        return;
      }

      // Stop current speech to prevent talking over herself
      if (_isSpeaking) stop();

      _queue.push({
        key: textOrKey,
        text: textOrKey,
        coachingKey: opts.coachingKey || null
      });

      console.log(`[${NAME} TTS Engine] Queued. Queue length=${_queue.length}, processing=${_processing}`);
      if (!_processing) _processQueue();
    }

    // ═══════════════════════════════════════
    // QUEUE PROCESSOR — Sequential, no overlap
    // ═══════════════════════════════════════

    async function _processQueue() {
      if (_processing || _queue.length === 0) return;
      _processing = true;
      console.log(`[${NAME} TTS Engine] Processing queue...`);

      while (_queue.length > 0) {
        const item = _queue.shift();
        try {
          // 1. Try pre-recorded WAV
          if (_preRecorded[item.key]) {
            console.log(`[${NAME} TTS Engine] Trying pre-recorded: ${item.key}`);
            try {
              await _playFile(_preRecorded[item.key]);
              continue;
            } catch (e) {
              console.log(`[${NAME} TTS Engine] Pre-recorded not found: "${item.key}", trying live...`);
            }
          }

          // 2. Fallback: Live Gemini Neural TTS
          console.log(`[${NAME} TTS Engine] Calling Gemini TTS API...`);
          await _generateLiveAudio(item.text);
          console.log(`[${NAME} TTS Engine] Gemini TTS complete.`);

        } catch (err) {
          console.error(`[${NAME} TTS Engine] Playback FAILED:`, err.message, err);
          _setSpeaking(false);
        }
      }

      _processing = false;
    }

    // ═══════════════════════════════════════
    // AUDIO CONTEXT — Deferred until user gesture
    // ═══════════════════════════════════════

    function _getAudioContext() {
      if (!_audioContext || _audioContext.state === 'closed') {
        _audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      return _audioContext;
    }

    // ═══════════════════════════════════════
    // PRE-RECORDED WAV PLAYBACK
    // ═══════════════════════════════════════

    function _playFile(url) {
      return new Promise(async (resolve, reject) => {
        try {
          const audioCtx = _getAudioContext();
          if (audioCtx.state === 'suspended') await audioCtx.resume();

          _setSpeaking(true);

          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

          _currentSource = audioCtx.createBufferSource();
          _currentSource.buffer = audioBuffer;
          _currentSource.connect(audioCtx.destination);

          _currentSource.onended = () => {
            _currentSource = null;
            _setSpeaking(false);
            resolve();
          };

          _currentSource.start(0);
        } catch (err) {
          _setSpeaking(false);
          reject(err);
        }
      });
    }

    // ═══════════════════════════════════════
    // LIVE GEMINI TTS — API call + PCM→WAV
    // ═══════════════════════════════════════

    async function _generateLiveAudio(text) {
      const apiKey = getApiKey();
      console.log(`[${NAME} TTS Engine] API key present: ${!!apiKey} (len=${apiKey.length})`);
      if (!apiKey) {
        console.log(`[${NAME} TTS Engine] No API key — voice disabled.`);
        return;
      }

      const audioCtx = _getAudioContext();
      if (audioCtx.state === 'suspended') await audioCtx.resume();

      _setSpeaking(true);

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

      await _playLiveAudio(audioPart.inlineData, audioCtx);
    }

    // ═══════════════════════════════════════
    // PCM → WAV CONVERSION (In-Memory)
    // CRITICAL: WAV wrapper + decodeAudioData eliminates static
    // ═══════════════════════════════════════

    function _playLiveAudio(inlineData, audioCtx) {
      return new Promise(async (resolve, reject) => {
        try {
          const raw = atob(inlineData.data);
          const pcmBytes = new Uint8Array(raw.length);
          for (let i = 0; i < raw.length; i++) pcmBytes[i] = raw.charCodeAt(i);

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
          view.setUint32(28, sampleRate * 2, true);
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
            _setSpeaking(false);
            resolve();
          };

          _currentSource.start(0);
        } catch (err) {
          _setSpeaking(false);
          reject(err);
        }
      });
    }

    // ═══════════════════════════════════════
    // MUTE / UNMUTE
    // ═══════════════════════════════════════

    function toggleMute() {
      // If speaking, stop instead of toggling
      if (_isSpeaking) {
        stop();
        return _isMuted;
      }

      _isMuted = !_isMuted;
      localStorage.setItem(MUTE_STORAGE_KEY, _isMuted);
      _updateAvatarState();
      onMuteChanged(_isMuted);

      console.log(`[${NAME} TTS] ${_isMuted ? 'Muted' : 'Unmuted'}`);
      return _isMuted;
    }

    function isMuted() {
      return _isMuted;
    }

    function isSpeaking() {
      return _isSpeaking;
    }

    // ═══════════════════════════════════════
    // STOP — Clear queue + halt playback
    // ═══════════════════════════════════════

    function stop() {
      _queue = [];
      _processing = false;
      if (_currentSource) {
        try { _currentSource.stop(); } catch (e) {}
        _currentSource = null;
      }
      _setSpeaking(false);
    }

    // ═══════════════════════════════════════
    // AVATAR STATE — Speaking ring + badge
    // ═══════════════════════════════════════

    function _setSpeaking(speaking) {
      _isSpeaking = speaking;
      if (speaking) onSpeakStart();
      else onSpeakEnd();
      _updateAvatarState();
    }

    function _updateAvatarState() {
      if (!AVATAR_ID) return;
      const avatar = document.getElementById(AVATAR_ID);
      if (!avatar) return;

      // Speaking ring
      avatar.classList.toggle(SPEAKING_CLASS, _isSpeaking);

      // Voice badge
      const badge = avatar.querySelector('.voice-badge');
      if (badge) {
        badge.textContent = _isMuted ? '🔇' : '🔊';
      }
    }

    // ═══════════════════════════════════════
    // PRE-RECORDED MANAGEMENT
    // ═══════════════════════════════════════

    /**
     * Register pre-recorded WAV files.
     * @param {object} map - { key: 'path/to/file.wav', ... }
     */
    function registerPreRecorded(map) {
      _preRecorded = { ..._preRecorded, ...map };
    }

    /**
     * Load a coaching manifest JSON file.
     * Format: [{ id: 'key', path: 'assets/audio/key.wav' }, ...]
     */
    async function loadManifest(url) {
      try {
        const resp = await fetch(url);
        if (!resp.ok) {
          console.log(`[${NAME} TTS] No manifest at ${url}`);
          return;
        }
        const manifest = await resp.json();
        manifest.forEach(entry => {
          _preRecorded[entry.id] = entry.path;
        });
        console.log(`[${NAME} TTS] Loaded ${manifest.length} pre-recorded files`);
      } catch (e) {
        console.log(`[${NAME} TTS] Manifest load failed:`, e.message);
      }
    }

    // ═══════════════════════════════════════
    // INIT on creation
    // ═══════════════════════════════════════
    init();

    // ═══════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════
    return {
      speak,
      stop,
      toggleMute,
      isMuted,
      isSpeaking,
      registerPreRecorded,
      loadManifest,
      init
    };
  }

  // ═══════════════════════════════════════
  // SPEAKING RING CSS (inject once)
  // ═══════════════════════════════════════

  function injectSpeakingCSS(brandColor = '#003366') {
    if (document.getElementById('think-avatar-tts-css')) return;
    const style = document.createElement('style');
    style.id = 'think-avatar-tts-css';
    style.textContent = `
      .speaking {
        border-color: #22c55e !important;
        animation: thinkAvatarPulse 1.2s ease-in-out infinite;
      }
      @keyframes thinkAvatarPulse {
        0%, 100% { box-shadow: 0 0 12px 2px rgba(34,197,94,0.25); transform: scale(1); }
        50% { box-shadow: 0 0 40px 10px rgba(34,197,94,0.2); transform: scale(1.02); }
      }
      .voice-badge {
        position: absolute; bottom: 4px; right: 4px;
        background: rgba(0,0,0,0.7); border-radius: 50%;
        width: 30px; height: 30px; display: flex;
        align-items: center; justify-content: center;
        font-size: 14px; border: 2px solid white;
        cursor: pointer; z-index: 2;
      }
    `;
    document.head.appendChild(style);
  }

  // Factory + CSS injector
  return { create, injectSpeakingCSS };

})();

console.log('[Think! Avatar TTS] Universal module loaded v1.0');
