/**
 * EMMA C2C — Firebase Sync
 * Saves and restores milestone progress to/from Firestore.
 */

const EMMA_SYNC = (() => {
  let _saveTimeout = null;
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
          console.log('[EMMA Sync] Saved to Firestore');
        } catch (err) {
          console.warn('[EMMA Sync] Firestore save failed:', err.message);
        }
      }
    }, DEBOUNCE_MS);
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
  return { init, saveProgress, loadProgress };
})();

console.log('[EMMA] Firebase sync initialized');
