/**
 * EMMA C2C — Validation Renderer
 * Renders the right-panel Credential Validation Bridge with gauge rings.
 */

const EMMA_VALIDATION = (() => {
  /**
   * Render the full validation bridge from matrix.json.
   */
  function render() {
    const matrix = EMMA_STATE.get('matrix');
    const branding = EMMA_STATE.get('branding');
    if (!matrix || !matrix.validationTracks) return;

    // Update header — keep ISLA brand, update subtitle with program-specific exam info
    const subtitleEl = document.getElementById('validation-subtitle');
    if (subtitleEl && branding) {
      const examLabel = branding.validationLabel || 'Competency Verification';
      subtitleEl.textContent = `Tracking: ${examLabel}. ISLA maps your coursework to the professional exams and accreditation standards your program requires. As you complete milestones, your mastery gauges fill automatically.`;
    }

    // Render track tabs
    renderTrackTabs(matrix.validationTracks);

    // Render gauge cards for active track
    renderGauges(matrix.validationTracks[EMMA_STATE.get('activeValidationTrack')]);
  }

  /**
   * Render track tabs.
   */
  function renderTrackTabs(tracks) {
    const tabContainer = document.getElementById('validation-track-tabs');
    if (!tabContainer) return;

    tabContainer.innerHTML = '';
    const activeIdx = EMMA_STATE.get('activeValidationTrack');

    tracks.forEach((track, idx) => {
      const tab = document.createElement('button');
      tab.className = `track-tab${idx === activeIdx ? ' active' : ''}`;
      tab.textContent = track.name;
      tab.dataset.trackIndex = idx;
      tab.id = `track-tab-${idx}`;

      tab.addEventListener('click', () => {
        EMMA_STATE.set('activeValidationTrack', idx);

        // Update tab active states
        tabContainer.querySelectorAll('.track-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Re-render gauges
        renderGauges(tracks[idx]);
      });

      tabContainer.appendChild(tab);
    });
  }

  /**
   * Render gauge cards for a specific validation track.
   */
  function renderGauges(track) {
    const container = document.getElementById('gauge-cards-container');
    if (!container || !track) return;

    container.innerHTML = '';

    track.sections.forEach(section => {
      const progress = EMMA_STATE.getValidationProgress(section);
      const card = createGaugeCard(section, progress);
      container.appendChild(card);
    });
  }

  /**
   * Create a single gauge card.
   */
  function createGaugeCard(section, progress) {
    const circumference = 2 * Math.PI * 30; // radius 30 for gauge ring
    const offset = circumference * (1 - progress.percent / 100);
    const statusClass = progress.isVerified ? 'verified' : (progress.percent > 0 ? 'in-progress' : 'pending');
    const statusText = progress.isVerified ? '✅ Verified' : (progress.percent > 0 ? `🔄 ${progress.completed}/${progress.required}` : '⏳ Not Started');

    const card = document.createElement('div');
    card.className = `gauge-card${progress.isVerified ? ' verified' : ''}`;
    card.id = `gauge-${section.id}`;

    card.innerHTML = `
      <div class="gauge-top">
        <div class="gauge-ring-wrap">
          <svg viewBox="0 0 72 72">
            <circle class="gauge-ring-bg" cx="36" cy="36" r="30"/>
            <circle class="gauge-ring-fill" cx="36" cy="36" r="30"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}"/>
          </svg>
          <span class="gauge-percent">${progress.percent}%</span>
        </div>
        <div class="gauge-info">
          <span class="gauge-name">${escapeHtml(section.name)}</span>
          <span class="gauge-desc">${escapeHtml(section.description || '')}</span>
          <span class="gauge-status ${statusClass}">${statusText}</span>
        </div>
      </div>
      <div class="gauge-milestones" id="gauge-milestones-${section.id}">
        ${renderMilestoneChips(section)}
      </div>
    `;

    // If just verified, add celebration
    if (progress.isVerified) {
      card.innerHTML += `<span class="verified-badge">🏆 Competency Verified</span>`;
    }

    return card;
  }

  /**
   * Render tiny chips showing which milestones are complete.
   */
  function renderMilestoneChips(section) {
    const checked = EMMA_STATE.get('checkedMilestones');
    const timeline = EMMA_STATE.get('timeline');
    if (!timeline) return '';

    const allMilestones = timeline.phases.flatMap(p => p.milestones);

    return section.requiredMilestoneIds.map(id => {
      const m = allMilestones.find(ms => ms.id === id);
      const label = m ? (m.courseRef ? m.courseRef.split('—')[0].trim() : m.label.substring(0, 20)) : id;
      const isComplete = checked[id];
      return `<span class="gauge-milestone-chip${isComplete ? ' complete' : ''}">${escapeHtml(label)}</span>`;
    }).join('');
  }

  /**
   * Update gauges after a milestone is toggled (called from matrix-renderer).
   */
  function update() {
    const matrix = EMMA_STATE.get('matrix');
    if (!matrix || !matrix.validationTracks) return;

    const activeTrack = matrix.validationTracks[EMMA_STATE.get('activeValidationTrack')];
    if (!activeTrack) return;

    const container = document.getElementById('gauge-cards-container');
    if (!container) return;

    // Check for newly verified sections
    activeTrack.sections.forEach(section => {
      const progress = EMMA_STATE.getValidationProgress(section);
      const existingCard = document.getElementById(`gauge-${section.id}`);

      if (existingCard && progress.isVerified && !existingCard.classList.contains('verified')) {
        // CELEBRATION! Section just got verified
        existingCard.classList.add('verified');
        spawnConfetti(existingCard);

        // TTS celebration
        if (typeof EMMA_TTS !== 'undefined') {
          EMMA_TTS.onCompetencyVerified(section);
        }

        // Toast
        if (typeof EMMA_MATRIX !== 'undefined') {
          EMMA_MATRIX.showToast(`🏆 ${section.name} — Competency Verified!`, 'success');
        }
      }
    });

    // Re-render all gauges cleanly
    renderGauges(activeTrack);
  }

  /**
   * Spawn confetti particles around a gauge card.
   */
  function spawnConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#fdb927', '#FFD700', '#004684', '#22c55e', '#7C3AED'];

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 80}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDelay = `${Math.random() * 0.3}s`;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1200);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // Public API
  return { render, update };
})();

console.log('[EMMA] Validation renderer initialized');
