/**
 * EMMA C2C — Live Data Service
 * Fetches career outlook data from public APIs:
 * - BLS Public Data API (no key needed, 25 queries/day)
 * - CareerOneStop (requires free API key — future)
 * - Handshake RSS (requires university RSS URL — future)
 * 
 * Falls back gracefully to static branding.careerOutlook data.
 * Caches results in localStorage for 24 hours.
 */

window.EMMA_DATA = (() => {
  'use strict';

  const CACHE_KEY = 'emma_live_career_data';
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  // BLS series ID patterns for OES (Occupational Employment Statistics)
  // Format: OEUS + area(6) + industry(6) + soc(8) + datatype(2)
  // DataType: 01=employment, 03=hourly mean, 04=annual mean, 07=annual median
  function buildBLSSeries(socCode) {
    const soc = socCode.replace('-', '').padEnd(8, '0');
    return {
      annualMean:   `OEUS000000000000${soc}04`,
      annualMedian: `OEUS000000000000${soc}07`,
      employment:   `OEUS000000000000${soc}01`
    };
  }

  /**
   * Fetch live BLS wage data for a SOC code.
   * Uses BLS Public Data API v2 (no registration needed, 25/day limit).
   */
  async function fetchBLSData(socCode) {
    if (!socCode) return null;

    // Check cache first
    const cached = getCache(socCode);
    if (cached) {
      console.log('[EMMA Data] Using cached BLS data for', socCode);
      return cached;
    }

    const series = buildBLSSeries(socCode);

    try {
      const response = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seriesid: [series.annualMedian, series.annualMean, series.employment],
          startyear: String(new Date().getFullYear() - 1),
          endyear: String(new Date().getFullYear())
        })
      });

      if (!response.ok) throw new Error(`BLS API ${response.status}`);

      const data = await response.json();

      if (data.status !== 'REQUEST_SUCCEEDED' || !data.Results?.series) {
        throw new Error('BLS returned no data');
      }

      const result = { source: 'BLS', fetchedAt: Date.now(), socCode };

      data.Results.series.forEach(s => {
        const latest = s.data?.[0]; // Most recent year
        if (!latest) return;

        if (s.seriesID === series.annualMedian) {
          result.liveMedianSalary = `$${Number(latest.value).toLocaleString()}`;
        } else if (s.seriesID === series.annualMean) {
          result.liveMeanSalary = `$${Number(latest.value).toLocaleString()}`;
        } else if (s.seriesID === series.employment) {
          result.liveEmployment = Number(latest.value).toLocaleString();
        }

        result.dataYear = latest.year;
      });

      // Cache it
      setCache(socCode, result);
      console.log('[EMMA Data] Live BLS data fetched:', result);
      return result;

    } catch (err) {
      console.warn('[EMMA Data] BLS fetch failed, using static data:', err.message);
      return null;
    }
  }

  /**
   * Merge live BLS data into the branding.careerOutlook.
   * Live data takes priority over static data when available.
   */
  function mergeCareerData(branding, blsData) {
    if (!branding?.careerOutlook || !blsData) return;

    const career = branding.careerOutlook;

    if (blsData.liveMedianSalary) {
      career._staticMedianSalary = career.medianSalary; // Keep original
      career.medianSalary = blsData.liveMedianSalary;
      career.dataSource = 'live';
      career.dataYear = blsData.dataYear;
    }
    if (blsData.liveMeanSalary) {
      career.meanSalary = blsData.liveMeanSalary;
    }
    if (blsData.liveEmployment) {
      career.totalJobs = blsData.liveEmployment;
    }

    console.log('[EMMA Data] Career data merged — source:', career.dataSource || 'static');
  }

  /**
   * Build the live opportunities feed.
   * Currently uses curated NC A&T resources.
   * When Handshake RSS URL is provided, this will parse live listings.
   */
  function getOpportunities(programSlug) {
    // Curated opportunities mapped to program categories
    const baseOpportunities = [
      {
        type: 'internship',
        icon: '💼',
        title: 'Summer Internships',
        source: 'Handshake',
        url: 'https://ncat.joinhandshake.com/login',
        description: 'Search internships filtered by your major',
        live: false
      },
      {
        type: 'job',
        icon: '🏢',
        title: 'Full-Time Positions',
        source: 'Handshake',
        url: 'https://ncat.joinhandshake.com/login',
        description: 'Browse full-time jobs for graduating seniors',
        live: false
      },
      {
        type: 'event',
        icon: '📅',
        title: 'Career Fairs & Events',
        source: 'NC A&T Career Services',
        url: 'https://www.ncat.edu/campus-life/index.php',
        description: 'Upcoming career fairs, workshops, and employer info sessions',
        live: false
      },
      {
        type: 'volunteer',
        icon: '🤝',
        title: 'Service & Volunteering',
        source: 'Student Development',
        url: 'https://www.ncat.edu/campus-life/index.php',
        description: 'Community service and civic engagement opportunities',
        live: false
      },
      {
        type: 'research',
        icon: '🔬',
        title: 'Undergraduate Research',
        source: 'OURSCA',
        url: 'https://www.ncat.edu/research/index.php',
        description: 'Faculty mentorship and research lab positions',
        live: false
      },
      {
        type: 'study-abroad',
        icon: '✈️',
        title: 'Study Abroad Programs',
        source: 'International Programs',
        url: 'https://www.ncat.edu/academics/international-affairs/index.php',
        description: 'Global exchange and study abroad experiences',
        live: false
      }
    ];

    // Program-specific additions
    const programSpecific = {
      'caes-la': [
        { type: 'industry', icon: '🏛️', title: 'ASLA Student Chapter', source: 'Professional', url: 'https://www.asla.org/studentchapters.aspx', description: 'American Society of Landscape Architects — networking, competitions, mentorship', live: false },
        { type: 'licensure', icon: '📋', title: 'LARE Exam Prep', source: 'ISLA Platform', url: '#', description: 'Start preparing for the Landscape Architect Registration Exam', live: false }
      ]
    };

    return [...baseOpportunities, ...(programSpecific[programSlug] || [])];
  }

  // ── Cache helpers ──
  function getCache(socCode) {
    try {
      const raw = localStorage.getItem(`${CACHE_KEY}_${socCode}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.fetchedAt > CACHE_TTL) {
        localStorage.removeItem(`${CACHE_KEY}_${socCode}`);
        return null;
      }
      return parsed;
    } catch { return null; }
  }

  function setCache(socCode, data) {
    try {
      localStorage.setItem(`${CACHE_KEY}_${socCode}`, JSON.stringify(data));
    } catch { /* localStorage full, ignore */ }
  }

  return {
    fetchBLSData,
    mergeCareerData,
    getOpportunities
  };
})();

console.log('[EMMA] Live data service initialized');
