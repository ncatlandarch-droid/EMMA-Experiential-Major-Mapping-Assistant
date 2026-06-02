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
      programs: [
        { slug: 'cobe-acct', name: 'B.S. in Accounting', dept: 'Accounting & Finance' },
        { slug: 'cobe-fin', name: 'B.S. in Finance', dept: 'Accounting & Finance' },
        { slug: 'cobe-econ', name: 'B.S. in Economics', dept: 'Economics' },
        { slug: 'cobe-econ-biz', name: 'B.S. in Economics — Business', dept: 'Economics' },
        { slug: 'cobe-econ-law', name: 'B.S. in Economics — Law', dept: 'Economics' },
        { slug: 'cobe-mgmt', name: 'B.S. in Management — Business Admin', dept: 'Management' },
        { slug: 'cobe-mgmt-ent', name: 'B.S. in Management — Entrepreneurship', dept: 'Management' },
        { slug: 'cobe-mgmt-intl', name: 'B.S. in Management — International', dept: 'Management' },
        { slug: 'cobe-bit', name: 'B.S. in Business Information Technology', dept: 'Business Info Systems & Analytics' },
        { slug: 'cobe-mktg', name: 'B.S. in Marketing', dept: 'Marketing & Supply Chain Management' },
        { slug: 'cobe-mktg-sales', name: 'B.S. in Marketing — Sales', dept: 'Marketing & Supply Chain Management' },
        { slug: 'cobe-scm', name: 'B.S. in Supply Chain Management', dept: 'Marketing & Supply Chain Management' }
      ]
    },
    {
      college: 'College of Engineering',
      collegeAbbr: 'CoE',
      collegeSlug: 'coe',
      collegeColor: '#BC5C45',
      collegeIcon: 'assets/images/college-icons/icon-engineering-color.svg',
      programs: [
        { slug: 'coe-bioe', name: 'B.S. in Bioengineering', dept: 'Chemical, Biological & Bio Engineering' },
        { slug: 'coe-che', name: 'B.S. in Chemical Engineering', dept: 'Chemical, Biological & Bio Engineering' },
        { slug: 'coe-ae', name: 'B.S. in Architectural Engineering', dept: 'Civil, Architectural & Env Engineering' },
        { slug: 'coe-ce', name: 'B.S. in Civil Engineering', dept: 'Civil, Architectural & Env Engineering' },
        { slug: 'coe-cs', name: 'B.S. in Computer Science', dept: 'Computer Science' },
        { slug: 'coe-cpe', name: 'B.S. in Computer Engineering', dept: 'Electrical & Computer Engineering' },
        { slug: 'coe-ee', name: 'B.S. in Electrical Engineering', dept: 'Electrical & Computer Engineering' },
        { slug: 'coe-ise', name: 'B.S. in Industrial & Systems Engineering', dept: 'Industrial & Systems Engineering' },
        { slug: 'coe-me', name: 'B.S. in Mechanical Engineering', dept: 'Mechanical Engineering' },
        { slug: 'coe-ai', name: 'B.S. in Artificial Intelligence', dept: 'Interdisciplinary' }
      ]
    },
    {
      college: 'Hairston College of Health & Human Sciences',
      collegeAbbr: 'CHHS',
      collegeSlug: 'chhs',
      collegeColor: '#5CB8DC',
      collegeIcon: 'assets/images/college-icons/icon-health-color.svg',
      programs: [
        { slug: 'chhs-nurs', name: 'B.S.N. in Nursing', dept: 'School of Nursing' },
        { slug: 'chhs-slpa', name: 'B.A. in Speech-Language Pathology & Audiology', dept: 'Communication Sciences & Disorders' },
        { slug: 'chhs-comm', name: 'B.A. in Speech Communication Studies', dept: 'Communication Sciences & Disorders' },
        { slug: 'chhs-kin-ex', name: 'B.S. in Kinesiology — Exercise Science', dept: 'Kinesiology' },
        { slug: 'chhs-kin-rsm', name: 'B.S. in Kinesiology — Recreation & Sport Mgmt', dept: 'Kinesiology' },
        { slug: 'chhs-kin-pre', name: 'B.S. in Kinesiology — Pre-Professional', dept: 'Kinesiology' },
        { slug: 'chhs-hsm', name: 'B.S. in Health Services Management', dept: 'Population Health Mgmt & Policy' },
        { slug: 'chhs-psych', name: 'B.A. in Psychology', dept: 'Psychology' },
        { slug: 'chhs-soc', name: 'B.A. in Sociology', dept: 'Social Work & Sociology' },
        { slug: 'chhs-sw', name: 'B.S.W. in Social Work', dept: 'Social Work & Sociology' }
      ]
    },
    {
      college: 'College of Arts, Humanities & Social Sciences',
      collegeAbbr: 'CAHSS',
      collegeSlug: 'cahss',
      collegeColor: '#D9A9B0',
      collegeIcon: 'assets/images/college-icons/icon-arts-color.svg',
      programs: [
        { slug: 'cahss-cj', name: 'B.S. in Criminal Justice', dept: 'Criminal Justice' },
        { slug: 'cahss-eng-afam', name: 'B.A. in English — African American Lit', dept: 'English' },
        { slug: 'cahss-eng-cw', name: 'B.A. in English — Creative Writing', dept: 'English' },
        { slug: 'cahss-eng-tw', name: 'B.A. in English — Technical Writing', dept: 'English' },
        { slug: 'cahss-eng-pro', name: 'B.A. in English — Professional English', dept: 'English' },
        { slug: 'cahss-hist', name: 'B.A. in History', dept: 'History & Political Science' },
        { slug: 'cahss-poli', name: 'B.A. in Political Science', dept: 'History & Political Science' },
        { slug: 'cahss-jmc-mmj', name: 'B.S. in Journalism — Multimedia', dept: 'Journalism & Mass Communication' },
        { slug: 'cahss-jmc-mmp', name: 'B.S. in Journalism — Mass Media Production', dept: 'Journalism & Mass Communication' },
        { slug: 'cahss-jmc-pr', name: 'B.S. in Journalism — Public Relations', dept: 'Journalism & Mass Communication' },
        { slug: 'cahss-lib-afam', name: 'B.A. in Liberal Studies — African American', dept: 'Liberal Studies' },
        { slug: 'cahss-lib-act', name: 'B.A. in Liberal Studies — Applied Cultural Thought', dept: 'Liberal Studies' },
        { slug: 'cahss-lib-law', name: 'B.A. in Liberal Studies — Pre-Law', dept: 'Liberal Studies' },
        { slug: 'cahss-art-des', name: 'B.A. in Visual Arts — Design', dept: 'Visual & Performing Arts' },
        { slug: 'cahss-art-gd', name: 'B.A. in Visual Arts — Graphic Design', dept: 'Visual & Performing Arts' },
        { slug: 'cahss-music', name: 'B.A. in Music', dept: 'Visual & Performing Arts' },
        { slug: 'cahss-thtr-act', name: 'B.F.A. in Professional Theatre — Acting', dept: 'Visual & Performing Arts' },
        { slug: 'cahss-thtr-tech', name: 'B.F.A. in Professional Theatre — Tech', dept: 'Visual & Performing Arts' }
      ]
    },
    {
      college: 'College of Education',
      collegeAbbr: 'CEd',
      collegeSlug: 'ced',
      collegeColor: '#FDB827',
      collegeIcon: 'assets/images/college-icons/icon-education-color.svg',
      programs: [
        { slug: 'ced-elem', name: 'B.S. in Elementary Education', dept: 'Educator Preparation' },
        { slug: 'ced-edst-tech', name: 'B.S. in Educational Studies — Tech & Innovation', dept: 'Educator Preparation' },
        { slug: 'ced-edst-lead', name: 'B.S. in Educational Studies — Leadership & Policy', dept: 'Educator Preparation' },
        { slug: 'ced-edst-fam', name: 'B.S. in Educational Studies — Family & Community', dept: 'Educator Preparation' }
      ]
    },
    {
      college: 'College of Science & Technology',
      collegeAbbr: 'CoST',
      collegeSlug: 'cost',
      collegeColor: '#9A86A9',
      collegeIcon: 'assets/images/college-icons/icon-science-color.svg',
      programs: [
        { slug: 'cost-aet', name: 'B.S. in Applied Engineering Technology', dept: 'Applied Engineering Technology' },
        { slug: 'cost-auto', name: 'B.S. in Automotive Engineering Technology', dept: 'Applied Engineering Technology' },
        { slug: 'cost-bio', name: 'B.S. in Biology', dept: 'Biology' },
        { slug: 'cost-bio-pre', name: 'B.S. in Biology — Pre-Medical', dept: 'Biology' },
        { slug: 'cost-bio-law', name: 'B.S. in Biology — Pre-Law', dept: 'Biology' },
        { slug: 'cost-cm', name: 'B.S. in Construction Management', dept: 'Built Environment' },
        { slug: 'cost-ehs-mgmt', name: 'B.S. in Environmental Health & Safety — Mgmt', dept: 'Built Environment' },
        { slug: 'cost-ehs-sci', name: 'B.S. in Environmental Health & Safety — Science', dept: 'Built Environment' },
        { slug: 'cost-geo', name: 'B.S. in Geomatics', dept: 'Built Environment' },
        { slug: 'cost-chem', name: 'B.S. in Chemistry — ACS Certified', dept: 'Chemistry' },
        { slug: 'cost-chem-bio', name: 'B.S. in Chemistry — Biochemistry', dept: 'Chemistry' },
        { slug: 'cost-elec', name: 'B.S. in Electronics Technology', dept: 'Computer Systems Technology' },
        { slug: 'cost-it', name: 'B.S. in Information Technology', dept: 'Computer Systems Technology' },
        { slug: 'cost-cgt-td', name: 'B.S. in Computer Graphics Tech — Technical Design', dept: 'Applied Engineering Technology' },
        { slug: 'cost-cgt-ux', name: 'B.S. in Computer Graphics Tech — UX', dept: 'Applied Engineering Technology' },
        { slug: 'cost-math-app', name: 'B.S. in Mathematics — Applied', dept: 'Mathematics & Statistics' },
        { slug: 'cost-math-pure', name: 'B.S. in Mathematics — Pure', dept: 'Mathematics & Statistics' },
        { slug: 'cost-math-ds', name: 'B.S. in Mathematics — Data Science', dept: 'Mathematics & Statistics' },
        { slug: 'cost-atms', name: 'B.S. in Atmospheric Sciences & Meteorology', dept: 'Physics' },
        { slug: 'cost-phys', name: 'B.S. in Physics', dept: 'Physics' },
        { slug: 'cost-phys-eng', name: 'B.S. in Physics — Engineering', dept: 'Physics' },
        { slug: 'cost-phys-bio', name: 'B.S. in Physics — Biological', dept: 'Physics' },
        { slug: 'cost-ai', name: 'B.S. in Artificial Intelligence — Applied AI', dept: 'Interdisciplinary' }
      ]
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
