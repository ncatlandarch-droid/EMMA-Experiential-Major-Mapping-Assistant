/**
 * EMMA C2C — Firebase Sync
 * Saves and restores milestone progress AND admin timeline edits to/from Firestore.
 */

const EMMA_SYNC = (() => {
  let _saveTimeout = null;
  let _timelineSaveTimeout = null;
  const DEBOUNCE_MS = 1500;
  let _userId = null;

  /**
   * Initialize auth and load saved progress.
   */
  async function init() {
    try {
      // Sign in anonymously for students (no login required)
      const result = await auth.signInAnonymously();
      _userId = result.user.uid;
      EMMA_STATE.set('user', result.user);
      console.log('[EMMA Sync] Authenticated anonymously:', _userId);

      // Try to load saved progress
      await loadProgress();
    } catch (err) {
      console.warn('[EMMA Sync] Auth failed, running offline:', err.message);
      // Fall back to localStorage
      loadFromLocalStorage();
    }
  }

  /**
   * Save progress to Firestore (debounced).
   */
  function saveProgress() {
    clearTimeout(_saveTimeout);
    _saveTimeout = setTimeout(async () => {
      const snapshot = EMMA_STATE.getSnapshot();
      const program = snapshot.program;

      if (!program) return;

      // Always save to localStorage as backup
      saveToLocalStorage(snapshot);

      // Save to Firestore if authenticated
      if (_userId) {
        try {
          await db.collection('progress')
            .doc(_userId)
            .collection('programs')
            .doc(program)
            .set(snapshot, { merge: true });
          console.log('[EMMA Sync] Saved progress to Firestore');
        } catch (err) {
          console.warn('[EMMA Sync] Firestore save failed:', err.message);
        }
      }
    }, DEBOUNCE_MS);
  }

  /**
   * Save admin timeline edits to Firestore (debounced).
   * Called whenever milestones are added, edited, deleted, or reordered.
   */
  function saveTimeline() {
    clearTimeout(_timelineSaveTimeout);
    _timelineSaveTimeout = setTimeout(async () => {
      const timeline = EMMA_STATE.get('timeline');
      const program = EMMA_STATE.get('currentProgram');
      if (!timeline || !program) return;

      // Save to localStorage
      try {
        localStorage.setItem(`emma-timeline-${program}`, JSON.stringify(timeline));
        console.log('[EMMA Sync] Timeline saved to localStorage');
      } catch (e) {
        console.warn('[EMMA Sync] Timeline localStorage save failed');
      }

      // Save to Firestore
      if (_userId) {
        try {
          await db.collection('timelines')
            .doc(program)
            .collection('edits')
            .doc(_userId)
            .set({
              timeline: JSON.stringify(timeline),
              updatedAt: new Date().toISOString(),
              updatedBy: _userId
            });
          // Also save a shared version (last editor wins for now)
          await db.collection('timelines')
            .doc(program)
            .set({
              timeline: JSON.stringify(timeline),
              updatedAt: new Date().toISOString(),
              updatedBy: _userId
            });
          console.log('[EMMA Sync] Timeline saved to Firestore');
        } catch (err) {
          console.warn('[EMMA Sync] Timeline Firestore save failed:', err.message);
        }
      }
    }, DEBOUNCE_MS);
  }

  /**
   * Load saved timeline edits from Firestore (or localStorage fallback).
   * Returns the saved timeline or null if none exists.
   */
  async function loadTimeline(program) {
    if (!program) return null;

    // Try Firestore first
    if (_userId) {
      try {
        const doc = await db.collection('timelines').doc(program).get();
        if (doc.exists && doc.data().timeline) {
          const timeline = JSON.parse(doc.data().timeline);
          console.log('[EMMA Sync] Restored timeline from Firestore');
          return timeline;
        }
      } catch (err) {
        console.warn('[EMMA Sync] Timeline Firestore load failed:', err.message);
      }
    }

    // Fallback to localStorage
    try {
      const saved = localStorage.getItem(`emma-timeline-${program}`);
      if (saved) {
        console.log('[EMMA Sync] Restored timeline from localStorage');
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('[EMMA Sync] Timeline localStorage load failed');
    }

    return null;
  }

  /**
   * Load progress from Firestore.
   */
  async function loadProgress() {
    const program = EMMA_STATE.get('currentProgram');
    if (!_userId || !program) return;

    try {
      const doc = await db.collection('progress')
        .doc(_userId)
        .collection('programs')
        .doc(program)
        .get();

      if (doc.exists) {
        const data = doc.data();
        if (data.checkedMilestones) {
          EMMA_STATE.restoreChecked(data.checkedMilestones);
          console.log(`[EMMA Sync] Restored ${Object.values(data.checkedMilestones).filter(Boolean).length} checked milestones from Firestore`);
        }
      } else {
        // No Firestore data, try localStorage
        loadFromLocalStorage();
      }
    } catch (err) {
      console.warn('[EMMA Sync] Firestore load failed:', err.message);
      loadFromLocalStorage();
    }
  }

  /**
   * Save to localStorage as offline backup.
   */
  function saveToLocalStorage(snapshot) {
    try {
      localStorage.setItem(`emma-progress-${snapshot.program}`, JSON.stringify(snapshot));
    } catch (e) {
      console.warn('[EMMA Sync] localStorage save failed');
    }
  }

  /**
   * Load from localStorage as fallback.
   */
  function loadFromLocalStorage() {
    const program = EMMA_STATE.get('currentProgram');
    if (!program) return;

    try {
      const saved = localStorage.getItem(`emma-progress-${program}`);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.checkedMilestones) {
          EMMA_STATE.restoreChecked(data.checkedMilestones);
          console.log(`[EMMA Sync] Restored from localStorage`);
        }
      }
    } catch (e) {
      console.warn('[EMMA Sync] localStorage load failed');
    }
  }

  // Public API
  return { init, saveProgress, loadProgress, saveTimeline, loadTimeline };
})();

console.log('[EMMA] Firebase sync initialized');
