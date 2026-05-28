/**
 * EMMA C2C — Config Loader
 * Fetches branding.json, timeline.json, matrix.json, and resources.json
 * then injects CSS custom properties and populates state.
 */

const EMMA_CONFIG = (() => {
  const BASE_PATH = 'data/seeds';
  const RESOURCE_PATH = 'data/resources.json';

  // Available programs registry — CAES fully loaded, other colleges as shells
  const PROGRAM_REGISTRY = [
    {
      college: 'College of Agriculture & Environmental Sciences',
      collegeAbbr: 'CAES',
      collegeSlug: 'caes',
      collegeColor: '#95CB89',
      collegeIcon: 'assets/images/college-icons/icon-agriculture-color.svg',
      programs: [
        { slug: 'caes-la', name: 'B.S. in Landscape Architecture', dept: 'Natural Resources & Environmental Design' },
        { slug: 'caes-ansc', name: 'B.S. in Animal Science', dept: 'Animal Sciences' },
        { slug: 'caes-lasc', name: 'B.S. in Laboratory Animal Science', dept: 'Animal Sciences' },
        { slug: 'caes-agbm', name: 'B.S. in Ag & Env Systems — Agribusiness', dept: 'Agribusiness, Applied Econ & AgEd' },
        { slug: 'caes-aged-sec', name: 'B.S. in Agricultural Education — Secondary', dept: 'Agribusiness, Applied Econ & AgEd' },
        { slug: 'caes-aged-pro', name: 'B.S. in Agricultural Education — Professional Service', dept: 'Agribusiness, Applied Econ & AgEd' },
        { slug: 'caes-cdfs-fam', name: 'B.S. in Child Dev & Family Studies — Family Relations', dept: 'Family & Consumer Sciences' },
        { slug: 'caes-cdfs-bk', name: 'B.S. in Child Dev & Family Studies — B-K Licensure', dept: 'Family & Consumer Sciences' },
        { slug: 'caes-fcs-fash', name: 'B.S. in FCS — Fashion Merchandising & Design', dept: 'Family & Consumer Sciences' },
        { slug: 'caes-fcs-cons', name: 'B.S. in FCS — Consumer Sciences', dept: 'Family & Consumer Sciences' },
        { slug: 'caes-fns-food', name: 'B.S. in Food & Nutritional Sciences — Food Science', dept: 'Family & Consumer Sciences' },
        { slug: 'caes-fns-nutr', name: 'B.S. in Food & Nutritional Sciences — Human Nutrition', dept: 'Family & Consumer Sciences' },
        { slug: 'caes-bioe-bio', name: 'B.S. in Biological Engineering — Bioprocess', dept: 'Natural Resources & Environmental Design' },
        { slug: 'caes-bioe-nr', name: 'B.S. in Biological Engineering — Natural Resources', dept: 'Natural Resources & Environmental Design' },
        { slug: 'caes-aes-envs', name: 'B.S. in Ag & Env Systems — Environmental Studies', dept: 'Natural Resources & Environmental Design' },
        { slug: 'caes-aes-slfs', name: 'B.S. in Ag & Env Systems — Sustainable Land & Food', dept: 'Natural Resources & Environmental Design' }
      ]
    },
    {
      college: 'Willie A. Deese College of Business & Economics',
      collegeAbbr: 'CoBE',
      collegeSlug: 'cobe',
      collegeColor: '#888890',
      collegeIcon: 'assets/images/college-icons/icon-business-color.svg',
      programs: []
    },
    {
      college: 'College of Engineering',
      collegeAbbr: 'CoE',
      collegeSlug: 'coe',
      collegeColor: '#BC5C45',
      collegeIcon: 'assets/images/college-icons/icon-engineering-color.svg',
      programs: []
    },
    {
      college: 'Hairston College of Health & Human Sciences',
      collegeAbbr: 'CHHS',
      collegeSlug: 'chhs',
      collegeColor: '#5CB8DC',
      collegeIcon: 'assets/images/college-icons/icon-health-color.svg',
      programs: []
    },
    {
      college: 'College of Arts, Humanities & Social Sciences',
      collegeAbbr: 'CAHSS',
      collegeSlug: 'cahss',
      collegeColor: '#D9A9B0',
      collegeIcon: 'assets/images/college-icons/icon-arts-color.svg',
      programs: []
    },
    {
      college: 'College of Education',
      collegeAbbr: 'CEd',
      collegeSlug: 'ced',
      collegeColor: '#FDB827',
      collegeIcon: 'assets/images/college-icons/icon-education-color.svg',
      programs: []
    },
    {
      college: 'College of Science & Technology',
      collegeAbbr: 'CoST',
      collegeSlug: 'cost',
      collegeColor: '#9A86A9',
      collegeIcon: 'assets/images/college-icons/icon-science-color.svg',
      programs: []
    },
    {
      college: 'Joint School of Nanoscience & Nanoengineering',
      collegeAbbr: 'JSNN',
      collegeSlug: 'jsnn',
      collegeColor: '#DF8738',
      collegeIcon: 'assets/images/college-icons/icon-nano-color.svg',
      programs: []
    }
  ];

  /**
   * Load all config files for a given program slug.
   * @param {string} programSlug - e.g., "caes-la"
   */
  async function loadProgram(programSlug) {
    EMMA_STATE.set('loading', true);
    EMMA_STATE.set('error', null);

    try {
      const [branding, timeline, matrix, resources] = await Promise.all([
        fetchJSON(`${BASE_PATH}/${programSlug}/branding.json`),
        fetchJSON(`${BASE_PATH}/${programSlug}/timeline.json`),
        fetchJSON(`${BASE_PATH}/${programSlug}/matrix.json`),
        fetchJSON(RESOURCE_PATH)
      ]);

      // Update state
      EMMA_STATE.set('branding', branding);
      EMMA_STATE.set('matrix', matrix);
      EMMA_STATE.set('resources', resources);
      EMMA_STATE.set('currentProgram', programSlug);

      // Check for saved admin timeline edits (Firestore/localStorage)
      let activeTimeline = timeline;
      if (typeof EMMA_SYNC !== 'undefined' && EMMA_SYNC.loadTimeline) {
        const savedTimeline = await EMMA_SYNC.loadTimeline(programSlug);
        if (savedTimeline && savedTimeline.phases) {
          activeTimeline = savedTimeline;
          console.log('[EMMA Config] Using saved admin timeline edits');
        }
      }
      EMMA_STATE.set('timeline', activeTimeline);

      // Initialize checked milestones (all unchecked)
      const allMilestones = activeTimeline.phases.flatMap(p => p.milestones);
      const checked = {};
      allMilestones.forEach(m => { checked[m.id] = false; });
      EMMA_STATE.restoreChecked(checked);

      // Inject CSS theme from branding
      injectTheme(branding);

      // Update header
      updateHeader(branding);

      EMMA_STATE.set('loading', false);
      console.log(`[EMMA Config] Loaded program: ${programSlug} (${allMilestones.length} milestones)`);
    } catch (err) {
      console.error('[EMMA Config] Failed to load program:', err);
      EMMA_STATE.set('error', `Failed to load program data: ${err.message}`);
      EMMA_STATE.set('loading', false);
    }
  }

  /**
   * Fetch and parse a JSON file with error handling.
   */
  async function fetchJSON(path) {
    const resp = await fetch(path);
    if (!resp.ok) throw new Error(`HTTP ${resp.status} loading ${path}`);
    return resp.json();
  }

  /**
   * Inject CSS custom properties from branding.json into :root.
   */
  function injectTheme(branding) {
    const root = document.documentElement;
    const c = branding.brandingColors;

    // Brand colors
    root.style.setProperty('--theme-primary', c.primaryHex);
    root.style.setProperty('--theme-primary-rgb', c.primaryRgb);
    root.style.setProperty('--theme-secondary', c.secondaryHex);
    root.style.setProperty('--theme-secondary-rgb', c.secondaryRgb);
    root.style.setProperty('--theme-bg', c.backgroundHex);
    root.style.setProperty('--theme-surface', c.surfaceHex);
    root.style.setProperty('--theme-text-primary', c.textPrimaryHex);
    root.style.setProperty('--theme-text-secondary', c.textSecondaryHex);

    // Category colors
    if (branding.categoryColors) {
      const cats = branding.categoryColors;
      if (cats.Purpose) {
        root.style.setProperty('--cat-purpose', cats.Purpose.hex);
        root.style.setProperty('--cat-purpose-rgb', cats.Purpose.rgb);
      }
      if (cats.Communities) {
        root.style.setProperty('--cat-communities', cats.Communities.hex);
        root.style.setProperty('--cat-communities-rgb', cats.Communities.rgb);
      }
      if (cats.LocalGlobal) {
        root.style.setProperty('--cat-localglobal', cats.LocalGlobal.hex);
        root.style.setProperty('--cat-localglobal-rgb', cats.LocalGlobal.rgb);
      }
      if (cats.Identity) {
        root.style.setProperty('--cat-identity', cats.Identity.hex);
        root.style.setProperty('--cat-identity-rgb', cats.Identity.rgb);
      }
    }

    // Update header gradient with new primary
    const header = document.getElementById('app-header');
    if (header) {
      const darkPrimary = darkenColor(c.primaryHex, 0.4);
      const lightPrimary = lightenColor(c.primaryHex, 0.1);
      header.style.background = `linear-gradient(135deg, ${darkPrimary}, ${c.primaryHex}, ${lightPrimary}, ${c.primaryHex}, ${darkPrimary})`;
      header.style.backgroundSize = '300% 300%';
    }

    console.log('[EMMA Config] Theme injected:', c.primaryHex, '/', c.secondaryHex);
  }

  /**
   * Update header text from branding.
   */
  function updateHeader(branding) {
    const taglineEl = document.getElementById('header-brand-tagline');
    const selectorLabel = document.getElementById('program-selector-label');

    // Don't overwrite the styled EMMA acronym — only update subtitle
    if (taglineEl) {
      taglineEl.textContent = `Curriculum-to-Credentials Engine · North Carolina A&T State University`;
    }
    if (selectorLabel) selectorLabel.textContent = branding.programName || 'Select Program';
  }

  /**
   * Darken a hex color by a factor.
   */
  function darkenColor(hex, factor) {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(
      Math.round(r * (1 - factor)),
      Math.round(g * (1 - factor)),
      Math.round(b * (1 - factor))
    );
  }

  /**
   * Lighten a hex color by a factor.
   */
  function lightenColor(hex, factor) {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(
      Math.min(255, Math.round(r + (255 - r) * factor)),
      Math.min(255, Math.round(g + (255 - g) * factor)),
      Math.min(255, Math.round(b + (255 - b) * factor))
    );
  }

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16)
    ];
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get the program registry for the selector modal.
   */
  function getRegistry() {
    return PROGRAM_REGISTRY;
  }

  // Public API
  return {
    loadProgram,
    getRegistry,
    injectTheme,
    PROGRAM_REGISTRY
  };
})();

console.log('[EMMA] Config loader initialized');
