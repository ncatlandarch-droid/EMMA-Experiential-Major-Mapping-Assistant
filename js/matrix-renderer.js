/**
 * EMMA C2C — Matrix Renderer
 * Renders the 4-year phase grid with milestone cards in the center canvas.
 */

const EMMA_MATRIX = (() => {
  /**
   * Render the full phase grid from timeline.json.
   */
  function render() {
    const container = document.getElementById('phase-grid');
    if (!container) return;

    const timeline = EMMA_STATE.get('timeline');
    const branding = EMMA_STATE.get('branding');

    if (!timeline || !timeline.phases) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">⚠️</span>
          <span class="empty-state-title">No Data Loaded</span>
          <span class="empty-state-desc">Select a program to load its experiential map.</span>
        </div>
      `;
      return;
    }

    // Update canvas title
    const titleEl = document.getElementById('canvas-title');
    const subtitleEl = document.getElementById('canvas-subtitle');
    if (titleEl) titleEl.textContent = '4-Year Experiential Map';
    if (subtitleEl && branding) {
      subtitleEl.textContent = `${branding.programName} · ${branding.abbreviation}`;
    }

    // Clear and build
    container.innerHTML = '';

    timeline.phases.forEach((phase, phaseIdx) => {
      const col = document.createElement('div');
      col.className = 'phase-column';
      col.id = `phase-${phase.id}`;
      col.dataset.phaseId = phase.id;

      // Phase header with mini progress ring
      const progress = EMMA_STATE.getPhaseProgress(phase.id);
      col.innerHTML = `
        <div class="phase-header">
          <div class="phase-header-info">
            <span class="phase-name">${escapeHtml(phase.name)}</span>
            <span class="phase-subtitle">${escapeHtml(phase.subtitle || '')}</span>
          </div>
          <div class="phase-ring" id="phase-ring-${phase.id}">
            <svg viewBox="0 0 42 42">
              <circle class="phase-ring-bg" cx="21" cy="21" r="18"/>
              <circle class="phase-ring-fill" cx="21" cy="21" r="18"
                stroke-dasharray="${2 * Math.PI * 18}"
                stroke-dashoffset="${2 * Math.PI * 18 * (1 - progress.percent / 100)}"/>
            </svg>
            <span class="phase-ring-label">${progress.percent}%</span>
          </div>
        </div>
      `;

      // Render milestone cards
      phase.milestones.forEach((milestone, mIdx) => {
        const card = createMilestoneCard(milestone, phase.id);
        col.appendChild(card);
      });

      container.appendChild(col);
    });
  }

  /**
   * Create a single milestone card element.
   */
  function createMilestoneCard(milestone, phaseId) {
    const isChecked = EMMA_STATE.get('checkedMilestones')[milestone.id] || false;
    const branding = EMMA_STATE.get('branding');
    const catInfo = branding?.categoryColors?.[milestone.category] || {};

    const card = document.createElement('div');
    card.className = `milestone-card${isChecked ? ' checked' : ''}`;
    card.id = `milestone-${milestone.id}`;
    card.dataset.milestoneId = milestone.id;
    card.dataset.category = milestone.category;

    // Set category color on left border
    if (catInfo.hex) {
      card.style.borderLeftColor = isChecked ? 'var(--theme-secondary)' : catInfo.hex;
    }

    const isIsla = milestone.isIsla || false;
    const isInternship = milestone.id?.includes('internship');

    card.innerHTML = `
      <div class="milestone-checkbox" role="checkbox" aria-checked="${isChecked}" tabindex="0"></div>
      <div class="milestone-content">
        <span class="milestone-label">${isIsla ? '🏝️ ' : ''}${isInternship ? '💼 ' : ''}${escapeHtml(milestone.label)}</span>
        ${milestone.courseRef ? `<span class="milestone-course-ref">${escapeHtml(milestone.courseRef)}</span>` : ''}
        <div class="milestone-meta">
          <span class="category-badge" data-category="${milestone.category}">
            ${catInfo.emoji || '📌'} ${milestone.category}
          </span>
          ${isIsla ? `<span class="isla-badge">ISLA · ${escapeHtml(milestone.islaExam || 'Exam')} §${milestone.islaSection || ''}</span>` : ''}
          ${isInternship ? '<span class="internship-badge">Internship</span>' : ''}
          ${milestone.credits ? `<span class="credit-badge">${milestone.credits} cr</span>` : ''}
          ${milestone.semester ? `<span class="credit-badge">${capitalize(milestone.semester)}</span>` : ''}
        </div>
      </div>
    `;

    // Checkbox click = toggle milestone
    const checkbox = card.querySelector('.milestone-checkbox');
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMilestoneClick(milestone, card);
    });

    // Keyboard accessibility on checkbox
    checkbox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleMilestoneClick(milestone, card);
      }
    });

    // Card body click = open detail modal
    card.addEventListener('click', () => openMilestoneDetail(milestone));

    return card;
  }

  /**
   * Handle milestone click — toggle, animate, update gauges.
   */
  function handleMilestoneClick(milestone, card) {
    const newState = EMMA_STATE.toggleMilestone(milestone.id);

    // Update card visual
    card.classList.toggle('checked', newState);
    card.querySelector('.milestone-checkbox').setAttribute('aria-checked', newState);

    // Bounce animation
    card.classList.remove('just-checked');
    if (newState) {
      void card.offsetWidth; // Force reflow
      card.classList.add('just-checked');
      setTimeout(() => card.classList.remove('just-checked'), 500);
    }

    // Update border color
    const branding = EMMA_STATE.get('branding');
    const catInfo = branding?.categoryColors?.[milestone.category] || {};
    card.style.borderLeftColor = newState ? 'var(--theme-secondary)' : (catInfo.hex || 'var(--theme-primary)');

    // Update phase ring
    updatePhaseRings();

    // Update header progress
    updateHeaderProgress();

    // Notify validation renderer
    if (typeof EMMA_VALIDATION !== 'undefined') {
      EMMA_VALIDATION.update();
    }

    // Notify Firebase sync
    if (typeof EMMA_SYNC !== 'undefined') {
      EMMA_SYNC.saveProgress();
    }

    // Emma coaching TTS
    if (typeof EMMA_TTS !== 'undefined' && newState) {
      EMMA_TTS.onMilestoneChecked(milestone);
    }

    // Toast + confetti
    if (newState) {
      showToast(`✅ ${milestone.label}`, 'success');

      // Confetti burst
      if (typeof EMMA_CONFETTI !== 'undefined') {
        // Check if phase is complete
        const timeline = EMMA_STATE.get('timeline');
        const phase = timeline?.phases?.find(p => p.milestones?.some(m => m.id === milestone.id));
        const phaseProgress = phase ? EMMA_STATE.getPhaseProgress(phase.id) : null;
        const overallProgress = EMMA_STATE.getOverallProgress();

        if (overallProgress === 100) {
          EMMA_CONFETTI.fire('big');    // 🎉 Full program complete!
          setTimeout(() => EMMA_CONFETTI.fire('big'), 400);
          showToast('🎉 ALL MILESTONES COMPLETE! 🎉', 'success');
        } else if (phaseProgress && phaseProgress.percent === 100) {
          EMMA_CONFETTI.fire('medium'); // Phase complete!
          showToast(`🏆 ${phase.name} complete!`, 'success');
        } else {
          EMMA_CONFETTI.fire('small');  // Single milestone
        }
      }
    }
  }

  /**
   * Update all phase progress rings.
   */
  function updatePhaseRings() {
    const timeline = EMMA_STATE.get('timeline');
    if (!timeline) return;

    timeline.phases.forEach(phase => {
      const progress = EMMA_STATE.getPhaseProgress(phase.id);
      const ring = document.getElementById(`phase-ring-${phase.id}`);
      if (!ring) return;

      const circumference = 2 * Math.PI * 18;
      const fillCircle = ring.querySelector('.phase-ring-fill');
      const label = ring.querySelector('.phase-ring-label');

      if (fillCircle) {
        fillCircle.setAttribute('stroke-dashoffset', circumference * (1 - progress.percent / 100));
      }
      if (label) label.textContent = `${progress.percent}%`;
    });
  }

  /**
   * Update header progress bar.
   */
  function updateHeaderProgress() {
    const percent = EMMA_STATE.getOverallProgress();
    const fill = document.getElementById('header-progress-fill');
    const label = document.getElementById('header-progress-label');
    const countEl = document.getElementById('progress-hero-count');

    if (fill) fill.style.width = `${percent}%`;
    if (label) label.textContent = `${percent}%`;

    // Update count (milestones + resources)
    if (countEl) {
      const timeline = EMMA_STATE.get('timeline');
      const checkedMilestones = EMMA_STATE.get('checkedMilestones') || {};
      const checkedResources = EMMA_STATE.get('checkedResources') || {};
      const resources = EMMA_STATE.get('resources')?.utilityLinks || [];

      const milestoneTotal = (timeline?.phases || []).reduce((sum, p) => sum + (p.milestones?.length || 0), 0);
      const milestoneDone = Object.values(checkedMilestones).filter(Boolean).length;
      const resourceDone = Object.values(checkedResources).filter(Boolean).length;

      const total = milestoneTotal + resources.length;
      const done = milestoneDone + resourceDone;

      countEl.textContent = `${done} / ${total} items`;
    }
  }

  /**
   * Show a toast notification.
   */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  /**
   * Open deep-dive detail modal for a milestone.
   */
  function openMilestoneDetail(milestone) {
    const modal = document.getElementById('milestone-detail-modal');
    const title = document.getElementById('detail-modal-title');
    const body = document.getElementById('detail-modal-body');
    if (!modal || !body) return;

    const branding = EMMA_STATE.get('branding');
    const catInfo = branding?.categoryColors?.[milestone.category] || {};
    const isChecked = EMMA_STATE.get('checkedMilestones')[milestone.id] || false;

    // Extract course prefix for catalog link (e.g., "LDAR 103" → search term)
    const courseCode = milestone.courseRef?.match(/^[A-Z]{2,5}\s*\d{3}/)?.[0] || '';
    const catalogUrl = courseCode
      ? `https://www.ncat.edu/academics/academic-catalog/index.php`
      : '';

    title.textContent = milestone.label;

    body.innerHTML = `
      <!-- Status -->
      <div class="detail-section">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <span style="font-size:1.5rem;">${isChecked ? '✅' : '⬜'}</span>
          <span style="font-size:var(--font-scale-sm); font-weight:600; color:${isChecked ? '#22C55E' : 'var(--theme-text-secondary)'};">
            ${isChecked ? 'Completed' : 'Not yet completed'}
          </span>
          <span class="category-badge" data-category="${milestone.category}" style="margin-left:auto;">
            ${catInfo.emoji || '📌'} ${milestone.category}
          </span>
        </div>
      </div>

      <!-- Course Info -->
      ${milestone.courseRef ? `
        <div class="detail-section">
          <div class="detail-section-title">📚 Course</div>
          <div style="font-size:var(--font-scale-base); font-weight:600; color:var(--theme-text-primary); margin-bottom:4px;">
            ${escapeHtml(milestone.courseRef)}
          </div>
        </div>
      ` : ''}

      <!-- Info Grid -->
      <div class="detail-section">
        <div class="detail-info-grid">
          ${milestone.credits !== undefined ? `
            <div class="detail-info-item">
              <div class="detail-info-label">Credits</div>
              <div class="detail-info-value">${milestone.credits || 'N/A'}</div>
            </div>
          ` : ''}
          ${milestone.semester ? `
            <div class="detail-info-item">
              <div class="detail-info-label">Semester</div>
              <div class="detail-info-value">${capitalize(milestone.semester)}</div>
            </div>
          ` : ''}
          ${milestone.isIsla ? `
            <div class="detail-info-item">
              <div class="detail-info-label">ISLA Exam</div>
              <div class="detail-info-value">${milestone.islaExam} §${milestone.islaSection}</div>
            </div>
          ` : ''}
          <div class="detail-info-item">
            <div class="detail-info-label">Category</div>
            <div class="detail-info-value">${catInfo.emoji || ''} ${milestone.category}</div>
          </div>
        </div>
      </div>

      <!-- Description -->
      ${milestone.description ? `
        <div class="detail-section">
          <div class="detail-section-title">📝 Course Description</div>
          <p class="detail-description">${escapeHtml(milestone.description)}</p>
        </div>
      ` : ''}

      <!-- Learning Objectives -->
      ${milestone.learningObjectives?.length ? `
        <div class="detail-section">
          <div class="detail-section-title">🎓 Course Learning Objectives</div>
          <div class="detail-objectives-list">
            ${milestone.learningObjectives.map(obj => `
              <div class="detail-objective-item">
                <span class="detail-objective-area">${escapeHtml(obj.area)}</span>
                <span class="detail-objective-text">${escapeHtml(obj.text)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Skills -->
      ${milestone.skills?.length ? `
        <div class="detail-section">
          <div class="detail-section-title">🎯 Skills & Competencies</div>
          <div class="detail-skills-grid">
            ${milestone.skills.map(s => `<span class="detail-skill-tag">${escapeHtml(s)}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Accreditation Standards -->
      ${milestone.laabStandards?.length ? `
        <div class="detail-section">
          <div class="detail-section-title">🏛️ LAAB Standards</div>
          <div class="detail-standards-list">
            ${milestone.laabStandards.map(s => `<span class="detail-standard-tag">${escapeHtml(s)}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Course Catalog Link -->
      ${catalogUrl ? `
        <div class="detail-section">
          <a href="${catalogUrl}" target="_blank" rel="noopener" class="detail-catalog-link">
            📖 View in NC A&T Course Catalog →
          </a>
        </div>
      ` : ''}
    `;

    modal.classList.add('active');

    // Close handlers
    document.getElementById('detail-modal-close')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // Public API
  return { render, updatePhaseRings, updateHeaderProgress, showToast };
})();

console.log('[EMMA] Matrix renderer initialized');
