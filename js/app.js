/**
 * EMMA C2C — App Orchestrator
 * Boots the application: loads config, initializes modules, wires events.
 * 
 * © 2026 Think! Design and Planning, LLC. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized use, copying, or distribution prohibited.
 */

const EMMA_APP = (() => {
  const DEFAULT_PROGRAM = 'caes-la'; // Load CAES LA by default

  /**
   * Boot the application.
   */
  async function boot() {
    console.log('[EMMA] ═══════════════════════════════════════');
    console.log('[EMMA] EMMA — Experiential Major Mapping Assistant');
    console.log('[EMMA] Curriculum-to-Credentials (C2C) Engine v1.0');
    console.log('[EMMA] Think! Design and Planning, LLC');
    console.log('[EMMA] ═══════════════════════════════════════');

    // 1. Initialize TTS
    EMMA_TTS.init();

    // 2. Initialize Chat
    EMMA_CHAT.init();

    // 2b. Initialize Confetti
    if (typeof EMMA_CONFETTI !== 'undefined') EMMA_CONFETTI.init();

    // 3. Wire up event listeners
    wireEvents();

    // 4. Initialize Firebase auth
    await EMMA_SYNC.init();

    // 5. Load default program
    await EMMA_CONFIG.loadProgram(DEFAULT_PROGRAM);
    EMMA_TTS.loadCoachingManifest(DEFAULT_PROGRAM); // Pre-load coaching audio

    // 5b. Fetch live career data (BLS) — async, non-blocking
    const branding = EMMA_STATE.get('branding');
    if (branding?.careerOutlook?.blsCode) {
      EMMA_DATA.fetchBLSData(branding.careerOutlook.blsCode).then(blsData => {
        if (blsData) {
          EMMA_DATA.mergeCareerData(branding, blsData);
          renderCareerOutlook(); // Update strip with live data
          console.log('[EMMA] Live BLS data merged — salary data is now live');
        }
      });
    }

    // 6. Render all panels
    renderAll();
    updateCollegeBadge();

    // 7. Restore saved progress (re-render after restore)
    await EMMA_SYNC.loadProgress();
    renderAll();

    console.log('[EMMA] ✅ Boot complete');

    // Default to Admin mode for demo (everyone gets edit controls)
    setDemoRole('admin');
    const roleSelect = document.getElementById('role-select');
    if (roleSelect) roleSelect.value = 'admin';
  }

  /**
   * Render all three panels.
   */
  function renderAll() {
    EMMA_UTILITY.render();
    EMMA_MATRIX.render();
    EMMA_VALIDATION.render();
    renderCareerOutlook();
  }

  /**
   * Populate the Career Outlook strip from branding data.
   */
  function renderCareerOutlook() {
    const branding = EMMA_STATE.get('branding');
    const career = branding?.careerOutlook;

    const salary = document.getElementById('outlook-salary');
    const growth = document.getElementById('outlook-growth');
    const employment = document.getElementById('outlook-employment');
    const field = document.getElementById('outlook-field');

    if (salary) salary.textContent = career?.medianSalary || '—';
    if (growth) growth.textContent = career?.growthRate || '—';
    if (employment) employment.textContent = career?.totalJobs || career?.totalEmployment || '—';
    if (field) field.textContent = career?.field || branding?.programName || '—';
  }

  /**
   * Wire up all global event listeners.
   */
  function wireEvents() {
    // ── Export buttons ──
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => EMMA_EXPORT.exportPDF());
    document.getElementById('btn-export-audit')?.addEventListener('click', () => EMMA_EXPORT.exportPDF());
    document.getElementById('btn-export-word-form')?.addEventListener('click', () => EMMA_EXPORT.exportWordForm());
    document.getElementById('btn-export-word-form-header')?.addEventListener('click', () => EMMA_EXPORT.exportWordForm());

    // ── Avatar Click: Speak / Stop (universal pattern) ──
    const avatar = document.getElementById('emma-avatar');
    avatar?.addEventListener('click', (e) => {
      // If the voice badge was clicked, let it handle mute/unmute (stopPropagation)
      if (e.target.classList.contains('voice-badge')) return;

      // If speaking → stop
      if (EMMA_TTS.isSpeaking && EMMA_TTS.isSpeaking()) {
        EMMA_TTS.stop();
        EMMA_MATRIX.showToast('Emma stopped', 'info');
        return;
      }

      // Force unmute (clicking avatar = user wants to hear her)
      if (EMMA_TTS.isMuted()) {
        EMMA_TTS.forceUnmute ? EMMA_TTS.forceUnmute() : EMMA_TTS.toggleMute();
      }

      // Speak contextual welcome
      EMMA_TTS.speak('welcome');
    });

    // ── Progress Bar Click → Emma Progress Report ──
    document.getElementById('progress-hero')?.addEventListener('click', () => {
      if (typeof EMMA_TTS !== 'undefined') {
        EMMA_TTS.onProgressClicked();
      }
    });

    // ── Program Selector Modal ──
    const selectorBtn = document.getElementById('program-selector-btn');
    const modal = document.getElementById('program-modal');
    const modalClose = document.getElementById('program-modal-close');

    selectorBtn?.addEventListener('click', () => {
      openProgramModal();
      modal?.classList.add('active');
    });

    modalClose?.addEventListener('click', () => {
      modal?.classList.remove('active');
    });

    // Close modal on overlay click
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    // ── Settings Modal ──
    const settingsBtn = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const settingsClose = document.getElementById('settings-modal-close');
    const settingsSave = document.getElementById('settings-save-btn');
    const settingsKey = document.getElementById('settings-gemini-key');

    settingsBtn?.addEventListener('click', () => {
      // Load current key into field
      if (settingsKey) {
        settingsKey.value = localStorage.getItem('EMMA_GEMINI_KEY') || '';
      }
      settingsModal?.classList.add('active');
    });

    settingsClose?.addEventListener('click', () => {
      settingsModal?.classList.remove('active');
    });

    settingsModal?.addEventListener('click', (e) => {
      if (e.target === settingsModal) settingsModal.classList.remove('active');
    });

    settingsSave?.addEventListener('click', () => {
      const key = settingsKey?.value?.trim() || '';
      localStorage.setItem('EMMA_GEMINI_KEY', key);
      settingsModal?.classList.remove('active');
      EMMA_MATRIX.showToast(key ? '🔑 API key saved — Emma\'s voice + chat enabled!' : '🔇 API key removed.', 'success');
    });

    // Close any modal on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });

    // ── Intro Modal ──
    const introBtn = document.getElementById('btn-intro-video');
    const introModal = document.getElementById('intro-modal');
    const introClose = document.getElementById('intro-modal-close');
    const introGetStarted = document.getElementById('intro-get-started');
    const introDontShow = document.getElementById('intro-dont-show');

    introBtn?.addEventListener('click', () => introModal?.classList.add('active'));
    introClose?.addEventListener('click', () => {
      introModal?.classList.remove('active');
      document.getElementById('intro-video')?.pause();
    });
    introModal?.addEventListener('click', (e) => {
      if (e.target === introModal) {
        introModal.classList.remove('active');
        document.getElementById('intro-video')?.pause();
      }
    });
    introGetStarted?.addEventListener('click', () => {
      introModal?.classList.remove('active');
      document.getElementById('intro-video')?.pause();
      if (introDontShow?.checked) localStorage.setItem('emma_hide_intro', 'true');
    });

    // Show intro on first visit
    if (localStorage.getItem('emma_hide_intro') !== 'true') {
      setTimeout(() => introModal?.classList.add('active'), 800);
    }

    // ── Role Switcher ──
    const roleSelect = document.getElementById('role-select');
    roleSelect?.addEventListener('change', (e) => {
      setDemoRole(e.target.value);
    });

    // ── Mobile Tab Bar ──
    document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => handleMobileTab(btn.dataset.tab));
    });

    // ── State listeners ──
    EMMA_STATE.on('checkedMilestones', () => {
      EMMA_MATRIX.updatePhaseRings();
      EMMA_MATRIX.updateHeaderProgress();
    });
  }

  /**
   * Open and populate the program selector modal.
   */
  function openProgramModal() {
    const container = document.getElementById('program-list');
    if (!container) return;
    showCollegeLevel(container);
  }

  /**
   * Level 1: Show all colleges as elegant cards.
   */
  function showCollegeLevel(container) {
    container.innerHTML = '';
    const registry = EMMA_CONFIG.getRegistry();

    // Level label
    const levelLabel = document.createElement('div');
    levelLabel.className = 'selector-level-label';
    levelLabel.innerHTML = '<span class="selector-step">Step 1 of 3</span> Choose Your College';
    container.appendChild(levelLabel);

    const grid = document.createElement('div');
    grid.className = 'college-grid';

    registry.forEach(college => {
      const card = document.createElement('div');
      card.className = 'college-card';
      const isShell = college.programs.length === 0;

      card.innerHTML = `
        <div class="college-card-icon" style="background:${college.collegeColor}22;">
          <img src="${college.collegeIcon}" alt="${college.collegeAbbr}" style="width:36px; height:36px;">
        </div>
        <div class="college-card-info">
          <div class="college-card-name">${college.college}</div>
          <div class="college-card-abbr">${college.collegeAbbr}</div>
        </div>
        ${isShell
          ? '<span class="college-badge-coming">Coming Soon</span>'
          : `<span class="college-badge-count">${college.programs.length} programs</span>`
        }
      `;

      if (isShell) {
        card.classList.add('shell');
      } else {
        card.addEventListener('click', () => showDeptLevel(container, college));
      }

      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  /**
   * Level 2: Show departments within a college.
   */
  function showDeptLevel(container, college) {
    container.innerHTML = '';

    // Back button
    const back = document.createElement('button');
    back.className = 'selector-back-btn';
    back.innerHTML = '← All Colleges';
    back.addEventListener('click', () => showCollegeLevel(container));
    container.appendChild(back);

    // Level label
    const levelLabel = document.createElement('div');
    levelLabel.className = 'selector-level-label';
    levelLabel.innerHTML = `
      <span class="selector-step">Step 2 of 3</span>
      <span style="display:inline-flex; align-items:center; gap:6px;">
        <img src="${college.collegeIcon}" alt="" style="width:22px; height:22px;">
        ${college.collegeAbbr} — Choose Department
      </span>
    `;
    container.appendChild(levelLabel);

    // Group programs by department
    const deptMap = {};
    college.programs.forEach(p => {
      if (!deptMap[p.dept]) deptMap[p.dept] = [];
      deptMap[p.dept].push(p);
    });

    const deptList = document.createElement('div');
    deptList.className = 'dept-list';

    Object.keys(deptMap).forEach(deptName => {
      const programs = deptMap[deptName];
      const card = document.createElement('div');
      card.className = 'dept-card';
      card.innerHTML = `
        <div class="dept-card-info">
          <div class="dept-card-name">${deptName}</div>
          <div class="dept-card-count">${programs.length} program${programs.length > 1 ? 's' : ''}</div>
        </div>
        <span class="dept-card-arrow">→</span>
      `;
      card.addEventListener('click', () => showProgramLevel(container, college, deptName, programs));
      deptList.appendChild(card);
    });

    container.appendChild(deptList);
  }

  /**
   * Level 3: Show programs within a department.
   */
  function showProgramLevel(container, college, deptName, programs) {
    container.innerHTML = '';
    const currentProgram = EMMA_STATE.get('currentProgram');

    // Back button
    const back = document.createElement('button');
    back.className = 'selector-back-btn';
    back.innerHTML = `← ${college.collegeAbbr} Departments`;
    back.addEventListener('click', () => showDeptLevel(container, college));
    container.appendChild(back);

    // Level label
    const levelLabel = document.createElement('div');
    levelLabel.className = 'selector-level-label';
    levelLabel.innerHTML = `
      <span class="selector-step">Step 3 of 3</span>
      <span style="display:inline-flex; align-items:center; gap:6px;">
        <img src="${college.collegeIcon}" alt="" style="width:22px; height:22px;">
        ${deptName} — Choose Program
      </span>
    `;
    container.appendChild(levelLabel);

    const list = document.createElement('div');
    list.className = 'program-pick-list';

    programs.forEach(program => {
      const item = document.createElement('div');
      item.className = `program-pick-item${program.slug === currentProgram ? ' active' : ''}`;
      item.innerHTML = `
        <div class="program-pick-icon" style="background:${college.collegeColor}22; color:${college.collegeColor};">🎓</div>
        <div class="program-pick-info">
          <div class="program-pick-name">${program.name}</div>
          <div class="program-pick-dept">${deptName}</div>
        </div>
        ${program.slug === currentProgram ? '<span class="program-pick-active">Active</span>' : '<span class="program-pick-select">Select →</span>'}
      `;

      if (program.slug !== currentProgram) {
        item.addEventListener('click', async () => {
          await EMMA_CONFIG.loadProgram(program.slug);
          renderAll();
          await EMMA_SYNC.loadProgress();
          renderAll();
          document.getElementById('program-modal')?.classList.remove('active');
          updateCollegeBadge();
          EMMA_MATRIX.showToast(`🎓 Loaded: ${program.name}`, 'success');
          // Load pre-recorded coaching audio for this program
          EMMA_TTS.loadCoachingManifest(program.slug);

          // Fetch live BLS career data for the new program
          const newBranding = EMMA_STATE.get('branding');
          if (newBranding?.careerOutlook?.blsCode) {
            EMMA_DATA.fetchBLSData(newBranding.careerOutlook.blsCode).then(blsData => {
              if (blsData) {
                EMMA_DATA.mergeCareerData(newBranding, blsData);
                renderCareerOutlook();
                console.log(`[EMMA] Live BLS data merged for ${program.slug}`);
              }
            });
          } else {
            // Still render career strip from static data
            renderCareerOutlook();
          }
        });
      }

      list.appendChild(item);
    });

    container.appendChild(list);
  }

  /**
   * Handle mobile tab switching.
   */
  function handleMobileTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Show/hide panels
    const canvas = document.getElementById('center-canvas');
    const validation = document.getElementById('validation-bridge');
    const utility = document.getElementById('utility-panel');

    // Reset
    canvas?.classList.remove('tab-hidden');
    validation?.classList.remove('tab-visible');

    if (tab === 'canvas') {
      canvas?.classList.remove('tab-hidden');
      validation?.classList.remove('tab-visible');
      if (utility) utility.style.display = 'none';
    } else if (tab === 'validation') {
      canvas?.classList.add('tab-hidden');
      validation?.classList.add('tab-visible');
      if (utility) utility.style.display = 'none';
    } else if (tab === 'utility') {
      canvas?.classList.add('tab-hidden');
      validation?.classList.remove('tab-visible');
      if (utility) {
        utility.style.display = 'flex';
        utility.style.width = '100%';
        utility.style.borderRight = 'none';
      }
    }
  }

  /**
   * Update the college badge in the header based on current program.
   */
  function updateCollegeBadge() {
    const currentProgram = EMMA_STATE.get('currentProgram');
    if (!currentProgram) return;

    const registry = EMMA_CONFIG.getRegistry();
    for (const college of registry) {
      const match = college.programs.find(p => p.slug === currentProgram);
      if (match) {
        const iconEl = document.getElementById('college-badge-icon');
        const labelEl = document.getElementById('college-badge-label');
        const canvasIcon = document.getElementById('canvas-selector-icon');

        // Render SVG icon instead of emoji
        if (iconEl) iconEl.innerHTML = `<img src="${college.collegeIcon}" alt="${college.collegeAbbr}" style="width:24px; height:24px;">`;
        if (labelEl) labelEl.textContent = college.collegeAbbr || college.collegeSlug.toUpperCase();
        if (canvasIcon) canvasIcon.innerHTML = `<img src="${college.collegeIcon}" alt="" style="width:20px; height:20px;">`;
        break;
      }
    }
  }

  /**
   * Set demo role and toggle UI visibility.
   */
  function setDemoRole(role) {
    document.body.className = document.body.className.replace(/role-\w+/g, '');
    document.body.classList.add(`role-${role}`);
    
    // Toggle admin-only elements via CSS class (not inline style)
    document.querySelectorAll('.admin-only').forEach(el => {
      el.classList.toggle('admin-visible', role === 'admin');
    });

    // Activate/deactivate admin CRUD controls
    if (typeof EMMA_ADMIN !== 'undefined') {
      EMMA_ADMIN.setAdminMode(role === 'admin');
    }

    // Show role-specific toast
    const labels = {
      student: '👩‍🎓 Student View — Track your milestones and explore resources',
      advisor: '👨‍🏫 Advisor View — Monitor cohort progress and approve milestones',
      admin: '🔧 Admin View — Edit milestones, manage projects, configure program'
    };
    EMMA_MATRIX.showToast(labels[role] || 'View changed', 'success');
    console.log(`[EMMA] Demo role: ${role}`);
  }

  // Public API
  return { boot, renderAll };
})();

// ── BOOT ON DOM READY ──
document.addEventListener('DOMContentLoaded', () => {
  EMMA_APP.boot().catch(err => {
    console.error('[EMMA] Boot failed:', err);
  });
});

console.log('[EMMA] App orchestrator loaded');
