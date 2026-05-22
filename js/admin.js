/**
 * EMMA C2C — Admin CRUD Module
 * Provides milestone editing, creation, deletion, reordering, and phase movement
 * when in Admin mode. Locked fields (description, credits, objectives, courseRef)
 * are displayed read-only since they're submitted to the university system.
 */

const EMMA_ADMIN = (() => {
  let _isAdminMode = false;
  let _dragSource = null;

  /* ───────────── Helpers ───────────── */

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function getTimeline() { return EMMA_STATE.get('timeline'); }
  function getBranding() { return EMMA_STATE.get('branding'); }

  function findMilestone(milestoneId) {
    const timeline = getTimeline();
    for (const phase of timeline.phases) {
      const ms = phase.milestones.find(m => m.id === milestoneId);
      if (ms) return { milestone: ms, phase };
    }
    return null;
  }

  /* ───────────── Admin Mode Toggle ───────────── */

  function setAdminMode(enabled) {
    _isAdminMode = enabled;
    document.body.classList.toggle('emma-admin-mode', enabled);
    if (enabled) {
      injectAdminControls();
      initDragDrop();
    } else {
      removeAdminControls();
    }
  }

  /* ───────────── Inject Admin Controls ───────────── */

  function injectAdminControls() {
    // Add controls to each milestone card
    document.querySelectorAll('.milestone-card').forEach(card => {
      if (card.querySelector('.admin-card-controls')) return; // already injected
      const milestoneId = card.dataset.milestoneId;
      if (!milestoneId) return;

      const controls = document.createElement('div');
      controls.className = 'admin-card-controls admin-only admin-visible';
      controls.innerHTML = `
        <button class="admin-btn admin-btn-edit" data-action="edit" title="Edit milestone">✏️</button>
        <button class="admin-btn admin-btn-move" data-action="move" title="Move to another year">↔️</button>
        <button class="admin-btn admin-btn-delete" data-action="delete" title="Delete milestone">🗑️</button>
        <span class="admin-drag-handle" title="Drag to reorder">⠿</span>
      `;
      card.style.position = 'relative';
      card.appendChild(controls);

      // Wire events
      controls.querySelector('[data-action="edit"]').addEventListener('click', e => {
        e.stopPropagation();
        openEditModal(milestoneId);
      });
      controls.querySelector('[data-action="move"]').addEventListener('click', e => {
        e.stopPropagation();
        openMoveMenu(milestoneId, e.currentTarget);
      });
      controls.querySelector('[data-action="delete"]').addEventListener('click', e => {
        e.stopPropagation();
        deleteMilestone(milestoneId);
      });
    });

    // Add "Add Milestone" button to each phase
    document.querySelectorAll('.phase-column').forEach(section => {
      if (section.querySelector('.admin-add-btn')) return;
      const phaseId = section.dataset.phaseId;
      if (!phaseId) return;

      const addBtn = document.createElement('button');
      addBtn.className = 'admin-add-btn admin-only admin-visible';
      addBtn.innerHTML = '➕ Add Milestone';
      addBtn.title = 'Add a new milestone to this phase';
      addBtn.addEventListener('click', () => openAddModal(phaseId));
      section.appendChild(addBtn);
    });
  }

  function removeAdminControls() {
    document.querySelectorAll('.admin-card-controls').forEach(el => el.remove());
    document.querySelectorAll('.admin-add-btn').forEach(el => el.remove());
  }

  /* ───────────── Edit Modal ───────────── */

  function openEditModal(milestoneId) {
    const result = findMilestone(milestoneId);
    if (!result) return;
    showModal(result.milestone, result.phase.id, false);
  }

  function openAddModal(phaseId) {
    const newMilestone = {
      id: '',
      label: '',
      courseRef: '',
      credits: 3,
      category: 'Purpose',
      semester: 'fall',
      instructor: '',
      description: '',
      learningObjectives: [],
      laabStandards: [],
      skills: []
    };
    showModal(newMilestone, phaseId, true);
  }

  function showModal(milestone, phaseId, isNew) {
    // Remove any existing modal
    document.getElementById('admin-edit-modal')?.remove();

    const branding = getBranding();
    const categories = ['Purpose', 'Communities', 'LocalGlobal', 'Identity'];
    const semesters = ['fall', 'spring', 'summer'];
    const timeline = getTimeline();

    const modal = document.createElement('div');
    modal.id = 'admin-edit-modal';
    modal.className = 'admin-modal-overlay';
    modal.innerHTML = `
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h3>${isNew ? '➕ Add New Milestone' : '✏️ Edit Milestone'}</h3>
          <button class="admin-modal-close" title="Close">✕</button>
        </div>
        <div class="admin-modal-body">
          <form id="admin-milestone-form">

            ${!isNew ? `
            <!-- 🔒 LOCKED SECTION -->
            <div class="admin-locked-section">
              <div class="admin-locked-header">🔒 University-Submitted (Read Only)</div>
              <div class="admin-locked-field">
                <label>Course Reference</label>
                <div class="admin-locked-value">${escapeHtml(milestone.courseRef) || 'N/A'}</div>
              </div>
              <div class="admin-locked-field">
                <label>Credit Hours</label>
                <div class="admin-locked-value">${milestone.credits || 'N/A'}</div>
              </div>
              <div class="admin-locked-field">
                <label>Course Description</label>
                <div class="admin-locked-value admin-locked-description">${escapeHtml(milestone.description) || 'No description'}</div>
              </div>
              ${milestone.learningObjectives?.length ? `
                <div class="admin-locked-field">
                  <label>Course Learning Objectives</label>
                  <div class="admin-locked-objectives">
                    ${milestone.learningObjectives.map(obj => `
                      <div class="admin-locked-objective">
                        <strong>${escapeHtml(obj.area)}:</strong> ${escapeHtml(obj.text)}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
            ` : `
            <!-- New milestone — all fields editable -->
            <div class="admin-field">
              <label for="admin-courseRef">Course Reference</label>
              <input type="text" id="admin-courseRef" value="${escapeHtml(milestone.courseRef)}" placeholder="e.g., LDAR 500 — New Course Title">
            </div>
            <div class="admin-field">
              <label for="admin-credits">Credit Hours</label>
              <input type="number" id="admin-credits" value="${milestone.credits}" min="0" max="12">
            </div>
            <div class="admin-field">
              <label for="admin-description">Course Description</label>
              <textarea id="admin-description" rows="4" placeholder="Official catalog description...">${escapeHtml(milestone.description)}</textarea>
            </div>
            `}

            <!-- ✏️ EDITABLE SECTION -->
            <div class="admin-editable-section">
              <div class="admin-editable-header">✏️ Editable Fields</div>

              <div class="admin-field">
                <label for="admin-label">Display Label</label>
                <input type="text" id="admin-label" value="${escapeHtml(milestone.label)}" placeholder="What shows on the milestone card">
              </div>

              <div class="admin-field-row">
                <div class="admin-field">
                  <label for="admin-category">Category</label>
                  <select id="admin-category">
                    ${categories.map(c => `<option value="${c}" ${milestone.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                  </select>
                </div>
                <div class="admin-field">
                  <label for="admin-semester">Semester</label>
                  <select id="admin-semester">
                    ${semesters.map(s => `<option value="${s}" ${milestone.semester === s ? 'selected' : ''}>${s}</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="admin-field">
                <label for="admin-instructor">Instructor</label>
                <input type="text" id="admin-instructor" value="${escapeHtml(milestone.instructor || '')}" placeholder="Faculty name">
              </div>

              <div class="admin-field">
                <label for="admin-laab">LAAB Standards (comma-separated)</label>
                <input type="text" id="admin-laab" value="${(milestone.laabStandards || []).join(', ')}" placeholder="e.g., 3.A, 3.B.2, 3.B.3">
              </div>

              <div class="admin-field">
                <label for="admin-skills">Skills & Competencies (comma-separated)</label>
                <input type="text" id="admin-skills" value="${(milestone.skills || []).join(', ')}" placeholder="e.g., Site analysis, Design thinking">
              </div>
            </div>
          </form>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-modal-btn admin-modal-cancel">Cancel</button>
          <button class="admin-modal-btn admin-modal-save">${isNew ? 'Add Milestone' : 'Save Changes'}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('active'));

    // Wire close
    modal.querySelector('.admin-modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.admin-modal-cancel').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); });

    // Wire save
    modal.querySelector('.admin-modal-save').addEventListener('click', () => {
      saveMilestone(milestone, phaseId, isNew, modal);
    });
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }

  function saveMilestone(original, phaseId, isNew, modal) {
    const timeline = getTimeline();
    const phase = timeline.phases.find(p => p.id === phaseId);
    if (!phase) return;

    // Read editable fields
    const label = document.getElementById('admin-label')?.value.trim();
    const category = document.getElementById('admin-category')?.value;
    const semester = document.getElementById('admin-semester')?.value;
    const instructor = document.getElementById('admin-instructor')?.value.trim();
    const laabStr = document.getElementById('admin-laab')?.value || '';
    const skillsStr = document.getElementById('admin-skills')?.value || '';

    const laabStandards = laabStr.split(',').map(s => s.trim()).filter(Boolean);
    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    if (!label) {
      EMMA_MATRIX.showToast('⚠️ Display label is required', 'error');
      return;
    }

    if (isNew) {
      // Read additional new-only fields
      const courseRef = document.getElementById('admin-courseRef')?.value.trim() || '';
      const credits = parseInt(document.getElementById('admin-credits')?.value) || 3;
      const description = document.getElementById('admin-description')?.value.trim() || '';

      const id = `${phaseId}-custom-${Date.now()}`;
      const newMs = {
        id, label, courseRef, credits, category, semester, instructor,
        description, learningObjectives: [], laabStandards, skills
      };
      phase.milestones.push(newMs);
      EMMA_MATRIX.showToast(`✅ Added: ${label}`, 'success');
    } else {
      // Update existing (only editable fields)
      original.label = label;
      original.category = category;
      original.semester = semester;
      original.instructor = instructor;
      original.laabStandards = laabStandards;
      original.skills = skills;
      EMMA_MATRIX.showToast(`✅ Updated: ${label}`, 'success');
    }

    EMMA_STATE.set('timeline', timeline);
    closeModal(modal);
    EMMA_MATRIX.render();
    // Re-inject admin controls after re-render
    setTimeout(() => { if (_isAdminMode) injectAdminControls(); initDragDrop(); }, 100);
  }

  /* ───────────── Delete ───────────── */

  function deleteMilestone(milestoneId) {
    const result = findMilestone(milestoneId);
    if (!result) return;

    const confirmed = confirm(
      `Delete "${result.milestone.label}"?\n\n` +
      `Course: ${result.milestone.courseRef}\n` +
      `This cannot be undone.`
    );
    if (!confirmed) return;

    const timeline = getTimeline();
    const phase = timeline.phases.find(p => p.id === result.phase.id);
    phase.milestones = phase.milestones.filter(m => m.id !== milestoneId);

    EMMA_STATE.set('timeline', timeline);
    EMMA_MATRIX.showToast(`🗑️ Deleted: ${result.milestone.label}`, 'success');
    EMMA_MATRIX.render();
    setTimeout(() => { if (_isAdminMode) injectAdminControls(); initDragDrop(); }, 100);
  }

  /* ───────────── Move Between Phases ───────────── */

  function openMoveMenu(milestoneId, anchorEl) {
    // Close any existing move menu
    document.querySelectorAll('.admin-move-menu').forEach(el => el.remove());

    const result = findMilestone(milestoneId);
    if (!result) return;

    const timeline = getTimeline();
    const menu = document.createElement('div');
    menu.className = 'admin-move-menu';

    timeline.phases.forEach(phase => {
      if (phase.id === result.phase.id) return; // skip current
      const btn = document.createElement('button');
      btn.className = 'admin-move-option';
      btn.textContent = `→ ${phase.name} (${phase.subtitle})`;
      btn.addEventListener('click', () => {
        moveMilestone(milestoneId, result.phase.id, phase.id);
        menu.remove();
      });
      menu.appendChild(btn);
    });

    // Position near the anchor
    const rect = anchorEl.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.left = `${rect.left}px`;
    menu.style.zIndex = '10000';
    document.body.appendChild(menu);

    // Close on outside click
    const closeHandler = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  function moveMilestone(milestoneId, fromPhaseId, toPhaseId) {
    const timeline = getTimeline();
    const fromPhase = timeline.phases.find(p => p.id === fromPhaseId);
    const toPhase = timeline.phases.find(p => p.id === toPhaseId);
    if (!fromPhase || !toPhase) return;

    const idx = fromPhase.milestones.findIndex(m => m.id === milestoneId);
    if (idx === -1) return;

    const [ms] = fromPhase.milestones.splice(idx, 1);
    toPhase.milestones.push(ms);

    EMMA_STATE.set('timeline', timeline);
    EMMA_MATRIX.showToast(`↔️ Moved to ${toPhase.name}`, 'success');
    EMMA_MATRIX.render();
    setTimeout(() => { if (_isAdminMode) injectAdminControls(); initDragDrop(); }, 100);
  }

  /* ───────────── Drag-and-Drop Reorder ───────────── */

  function initDragDrop() {
    document.querySelectorAll('.milestone-card').forEach(card => {
      const handle = card.querySelector('.admin-drag-handle');
      if (!handle) return;

      card.setAttribute('draggable', 'true');

      card.addEventListener('dragstart', e => {
        _dragSource = card;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.dataset.milestoneId);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        _dragSource = null;
      });

      card.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (_dragSource && _dragSource !== card) {
          card.classList.add('drag-over');
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });

      card.addEventListener('drop', e => {
        e.preventDefault();
        card.classList.remove('drag-over');
        if (!_dragSource || _dragSource === card) return;

        const sourceId = _dragSource.dataset.milestoneId;
        const targetId = card.dataset.milestoneId;
        reorderMilestones(sourceId, targetId);
      });
    });
  }

  function reorderMilestones(sourceId, targetId) {
    const timeline = getTimeline();

    // Find both milestones and their phases
    let sourcePhase, targetPhase, sourceIdx, targetIdx;
    for (const phase of timeline.phases) {
      const si = phase.milestones.findIndex(m => m.id === sourceId);
      if (si !== -1) { sourcePhase = phase; sourceIdx = si; }
      const ti = phase.milestones.findIndex(m => m.id === targetId);
      if (ti !== -1) { targetPhase = phase; targetIdx = ti; }
    }

    if (!sourcePhase || !targetPhase) return;

    if (sourcePhase === targetPhase) {
      // Same phase — reorder
      const [ms] = sourcePhase.milestones.splice(sourceIdx, 1);
      const newTargetIdx = sourcePhase.milestones.findIndex(m => m.id === targetId);
      sourcePhase.milestones.splice(newTargetIdx, 0, ms);
    } else {
      // Cross-phase move via drag
      const [ms] = sourcePhase.milestones.splice(sourceIdx, 1);
      targetPhase.milestones.splice(targetIdx, 0, ms);
    }

    EMMA_STATE.set('timeline', timeline);
    EMMA_MATRIX.render();
    setTimeout(() => { if (_isAdminMode) injectAdminControls(); initDragDrop(); }, 100);
  }

  /* ───────────── Save / Export ───────────── */

  function saveChanges() {
    const timeline = getTimeline();
    const blob = new Blob([JSON.stringify(timeline, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timeline.json';
    a.click();
    URL.revokeObjectURL(url);
    EMMA_MATRIX.showToast('💾 timeline.json downloaded — replace your seed file to persist changes', 'success');
  }

  /* ───────────── Public API ───────────── */
  return {
    setAdminMode,
    openEditModal,
    openAddModal,
    deleteMilestone,
    saveChanges,
    injectAdminControls,
    initDragDrop
  };
})();

console.log('[EMMA] Admin CRUD module loaded');
