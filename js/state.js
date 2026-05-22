/**
 * EMMA C2C — State Manager
 * Reactive state store for the entire application.
 * All components read from and write to this single source of truth.
 */

const EMMA_STATE = (() => {
  // Private state
  let _state = {
    currentProgram: null,     // e.g., "caes-la"
    branding: null,           // parsed branding.json
    timeline: null,           // parsed timeline.json
    matrix: null,             // parsed matrix.json
    resources: null,          // parsed resources.json
    checkedMilestones: {},    // { "y1-ldar103": true, "y2-ldar247": false, ... }
    checkedResources: {},     // { "handshake-core": true, "study-abroad": false, ... }
    activeValidationTrack: 0, // index into matrix.validationTracks
    isVoiceEnabled: true,
    user: null,               // Firebase user (null = anonymous)
    isAdmin: false,           // Faculty edit mode
    loading: true,
    error: null
  };

  // Listeners for reactive updates
  const _listeners = {};

  /**
   * Subscribe to state changes on a specific key.
   * @param {string} key - State property name
   * @param {Function} callback - Called with (newValue, oldValue)
   * @returns {Function} unsubscribe function
   */
  function on(key, callback) {
    if (!_listeners[key]) _listeners[key] = [];
    _listeners[key].push(callback);
    return () => {
      _listeners[key] = _listeners[key].filter(fn => fn !== callback);
    };
  }

  /**
   * Get current value of a state property.
   */
  function get(key) {
    return _state[key];
  }

  /**
   * Set a state property and notify listeners.
   */
  function set(key, value) {
    const oldValue = _state[key];
    _state[key] = value;
    if (_listeners[key]) {
      _listeners[key].forEach(fn => {
        try { fn(value, oldValue); }
        catch (e) { console.error(`[EMMA State] Listener error on "${key}":`, e); }
      });
    }
  }

  /**
   * Toggle a milestone's checked state.
   * @param {string} milestoneId
   * @returns {boolean} new checked state
   */
  function toggleMilestone(milestoneId) {
    const checked = { ..._state.checkedMilestones };
    checked[milestoneId] = !checked[milestoneId];
    set('checkedMilestones', checked);
    return checked[milestoneId];
  }

  /**
   * Calculate overall progress percentage.
   * @returns {number} 0–100
   */
  function getOverallProgress() {
    if (!_state.timeline) return 0;
    let total = 0;
    let checked = 0;
    _state.timeline.phases.forEach(phase => {
      phase.milestones.forEach(m => {
        total++;
        if (_state.checkedMilestones[m.id]) checked++;
      });
    });
    // Include resource checkmarks
    const resources = _state.resources?.utilityLinks || [];
    total += resources.length;
    resources.forEach(r => {
      if (_state.checkedResources[r.id]) checked++;
    });
    return total === 0 ? 0 : Math.round((checked / total) * 100);
  }

  /**
   * Calculate progress for a specific phase.
   * @param {string} phaseId
   * @returns {{ checked: number, total: number, percent: number }}
   */
  function getPhaseProgress(phaseId) {
    if (!_state.timeline) return { checked: 0, total: 0, percent: 0 };
    const phase = _state.timeline.phases.find(p => p.id === phaseId);
    if (!phase) return { checked: 0, total: 0, percent: 0 };
    let total = phase.milestones.length;
    let checked = phase.milestones.filter(m => _state.checkedMilestones[m.id]).length;
    return { checked, total, percent: total === 0 ? 0 : Math.round((checked / total) * 100) };
  }

  /**
   * Calculate completion for a validation section.
   * @param {object} section - from matrix.json
   * @returns {{ completed: number, required: number, percent: number, isVerified: boolean }}
   */
  function getValidationProgress(section) {
    const completed = section.requiredMilestoneIds.filter(
      id => _state.checkedMilestones[id]
    ).length;
    const required = section.totalRequired || section.requiredMilestoneIds.length;
    const percent = required === 0 ? 0 : Math.round((completed / required) * 100);
    return { completed, required, percent, isVerified: completed >= required };
  }

  /**
   * Get all milestones in a flat array.
   */
  function getAllMilestones() {
    if (!_state.timeline) return [];
    return _state.timeline.phases.flatMap(p => p.milestones);
  }

  /**
   * Restore checked milestones from a saved object.
   */
  function restoreChecked(savedChecked) {
    set('checkedMilestones', savedChecked || {});
  }

  /**
   * Toggle a resource's checked state.
   * @param {string} resourceId
   * @returns {boolean} new checked state
   */
  function toggleResource(resourceId) {
    const checked = { ..._state.checkedResources };
    checked[resourceId] = !checked[resourceId];
    set('checkedResources', checked);
    return checked[resourceId];
  }

  /**
   * Get resource completion counts.
   */
  function getResourceProgress() {
    const resources = _state.resources?.utilityLinks || [];
    const total = resources.length;
    const done = resources.filter(r => _state.checkedResources[r.id]).length;
    return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
  }

  /**
   * Restore checked resources from saved object.
   */
  function restoreCheckedResources(saved) {
    set('checkedResources', saved || {});
  }

  /**
   * Get a serializable snapshot for export/save.
   */
  function getSnapshot() {
    return {
      program: _state.currentProgram,
      checkedMilestones: { ..._state.checkedMilestones },
      checkedResources: { ..._state.checkedResources },
      timestamp: new Date().toISOString(),
      overallProgress: getOverallProgress()
    };
  }

  // Public API
  return {
    on,
    get,
    set,
    toggleMilestone,
    toggleResource,
    getOverallProgress,
    getPhaseProgress,
    getValidationProgress,
    getResourceProgress,
    getAllMilestones,
    restoreChecked,
    restoreCheckedResources,
    getSnapshot
  };
})();

console.log('[EMMA] State manager initialized');
