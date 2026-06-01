/**
 * EMMA C2C — Journey Map Brochure Report Generator
 * Generates a printable, NC A&T-branded experiential journey brochure.
 * Features aspirational profession imagery, career overviews, 4-phase
 * journey map, BLS data, and student progress tracking.
 *
 * © Think! Design and Planning, LLC
 */

const EMMA_REPORT = (() => {

  /* ── Profession data: images, overviews, career descriptions ── */
  const PROFESSIONS = {
    'landscape': {
      image: 'assets/images/professions/prof_landscape_arch.png',
      title: 'Landscape Architecture',
      tagline: 'Designing the Future of Our Built & Natural Environments',
      overview: 'Landscape architects design outdoor spaces that bring communities together — parks, campuses, urban plazas, greenways, and resilient infrastructure. As a licensed landscape architect, you\'ll shape environments that are beautiful, sustainable, and equitable. NC A&T\'s program is the only LAAB-accredited landscape architecture program at an HBCU.'
    },
    'animal': {
      image: 'assets/images/professions/prof_animal_science.png',
      title: 'Animal Science',
      tagline: 'Advancing Animal Health, Welfare & Agricultural Innovation',
      overview: 'Animal scientists improve animal health, welfare, and production systems. From veterinary research to livestock management and biotechnology, this field offers diverse paths. Graduates enter veterinary school, pharmaceutical research, agricultural extension, and food safety leadership.'
    },
    'lab': {
      image: 'assets/images/professions/prof_animal_science.png',
      title: 'Laboratory Animal Science',
      tagline: 'Ensuring Ethical & Humane Research Standards',
      overview: 'Laboratory animal scientists manage the care and ethical treatment of research animals. They play a vital role in biomedical breakthroughs — from cancer treatments to vaccine development. This specialized career combines compassion with cutting-edge science.'
    },
    'bioe': {
      image: 'assets/images/professions/prof_bio_engineering.png',
      title: 'Biological Engineering',
      tagline: 'Engineering Solutions at the Intersection of Biology & Technology',
      overview: 'Biological engineers design systems that solve real-world problems — from water treatment and biofuel production to medical devices and environmental remediation. Whether in bioprocess engineering or natural resource engineering, you\'ll apply engineering principles to living systems.'
    },
    'food': {
      image: 'assets/images/professions/prof_food_nutrition.png',
      title: 'Food & Nutritional Sciences',
      tagline: 'Nourishing Communities Through Science & Innovation',
      overview: 'Food scientists and nutritionists ensure our food is safe, nutritious, and sustainable. From developing new food products to clinical nutrition counseling, this field addresses food security, public health, and agricultural innovation. Graduates lead in food industry R&D, dietetics, and public health.'
    },
    'fashion': {
      image: 'assets/images/professions/prof_fashion_design.png',
      title: 'Fashion Merchandising & Design',
      tagline: 'Creating, Curating & Bringing Style to Market',
      overview: 'Fashion professionals blend creativity with business — designing apparel, managing retail operations, and driving brand strategy. From luxury fashion houses to sustainable clothing startups, this field values creative vision, trend forecasting, and cultural influence.'
    },
    'child': {
      image: 'assets/images/professions/prof_child_dev.png',
      title: 'Child Development & Family Studies',
      tagline: 'Strengthening Families & Empowering Communities',
      overview: 'Child development and family studies professionals shape the lives of children and families through counseling, education, policy, and advocacy. Whether pursuing B-K teacher licensure or family relations, you\'ll make a lasting impact on community well-being.'
    },
    'aged': {
      image: 'assets/images/professions/prof_ag_education.png',
      title: 'Agricultural Education',
      tagline: 'Inspiring the Next Generation of Agricultural Leaders',
      overview: 'Agricultural educators teach and inspire — in classrooms, communities, and Extension programs. Whether pursuing secondary teaching licensure or professional service, you\'ll connect people to the land and food systems that sustain us all.'
    },
    'agbm': {
      image: 'assets/images/professions/prof_agribusiness.png',
      title: 'Agribusiness',
      tagline: 'Leading the Business of Agriculture & Food Systems',
      overview: 'Agribusiness professionals manage the economic engine of agriculture — from farm operations and supply chain logistics to agricultural finance and policy. This field combines business acumen with agricultural expertise to feed the world sustainably.'
    },
    'envs': {
      image: 'assets/images/professions/prof_environmental.png',
      title: 'Environmental Studies',
      tagline: 'Protecting Our Natural Resources for Future Generations',
      overview: 'Environmental scientists and specialists protect our air, water, soil, and ecosystems. From environmental impact assessments to conservation planning and sustainability consulting, this career puts you on the front lines of the most critical challenge of our time.'
    },
    'slfs': {
      image: 'assets/images/professions/prof_environmental.png',
      title: 'Sustainable Land & Food Systems',
      tagline: 'Building Resilient Communities Through Sustainable Agriculture',
      overview: 'Sustainable land and food systems professionals integrate soil science, agroecology, and land management to build resilient food systems. Graduates lead urban farming, conservation planning, and food sovereignty initiatives.'
    },
    'cons': {
      image: 'assets/images/professions/prof_fashion_design.png',
      title: 'Consumer Sciences',
      tagline: 'Understanding Consumer Behavior & Market Dynamics',
      overview: 'Consumer scientists analyze how people make purchasing decisions and interact with products and services. This field drives innovation in product development, consumer protection, and market research.'
    }
  };

  /* ── Match program slug to profession data ── */
  function matchProfession(slug) {
    slug = (slug || '').toLowerCase();
    for (const [key, data] of Object.entries(PROFESSIONS)) {
      if (slug.includes(key)) return data;
    }
    return PROFESSIONS['landscape']; // fallback
  }

  /* ── Category icons ── */
  const CATEGORY_ICONS = {
    'course': '📘', 'field': '🌿', 'professional': '💼',
    'community': '🤝', 'research': '🔬', 'certification': '🏆',
    'award': '🏅', 'leadership': '👑'
  };

  /* ── Generate Report ── */
  function generate() {
    const timeline = EMMA_STATE.get('timeline');
    const branding = EMMA_STATE.get('branding');
    const program = EMMA_STATE.get('currentProgram');
    const checked = EMMA_STATE.get('checkedMilestones') || {};

    if (!timeline || !branding) {
      if (typeof EMMA_MATRIX !== 'undefined') {
        EMMA_MATRIX.showToast('⚠️ Load a program first before generating a report', 'error');
      }
      return;
    }

    const overall = EMMA_STATE.getOverallProgress();
    const totalMs = timeline.phases.reduce((s, p) => s + p.milestones.length, 0);
    const doneMs = Object.values(checked).filter(Boolean).length;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const prof = matchProfession(program);

    // BLS data from DOM
    const salary = document.getElementById('career-salary')?.textContent || 'N/A';
    const growth = document.getElementById('career-growth')?.textContent || 'N/A';
    const employment = document.getElementById('career-employment')?.textContent || 'N/A';

    // Convert image to base64 for the report window
    const imgPath = prof.image;

    // Phase colors
    const PHASE_COLORS = ['#2d5016', '#003366', '#b8651a', '#7b2d8e'];

    // Build phases
    const phasesHTML = timeline.phases.map((phase, idx) => {
      const color = PHASE_COLORS[idx % 4];
      const pp = EMMA_STATE.getPhaseProgress(phase.id);
      const msHTML = phase.milestones.map(m => {
        const done = checked[m.id];
        const icon = CATEGORY_ICONS[m.category] || '📌';
        return `<div class="ms ${done ? 'ms-done' : ''}">
          <span class="ms-chk">${done ? '✅' : '⬜'}</span>
          <span class="ms-ico">${icon}</span>
          <div class="ms-info">
            <span class="ms-lbl">${m.label}</span>
            ${m.credits ? `<span class="ms-cr">${m.credits} cr</span>` : ''}
          </div>
        </div>`;
      }).join('');

      return `<div class="phase" style="page-break-inside:avoid;">
        <div class="phase-hd" style="border-left:6px solid ${color}; background: ${color}08;">
          <div class="phase-row">
            <h3 class="phase-nm" style="color:${color}">${phase.name}</h3>
            <span class="phase-pg" style="background:${color}">${pp.checked}/${pp.total} · ${pp.percent}%</span>
          </div>
          ${phase.description ? `<p class="phase-dsc">${phase.description}</p>` : ''}
        </div>
        <div class="ms-grid">${msHTML}</div>
      </div>`;
    }).join('');

    // Progress ring
    const circum = 2 * Math.PI * 42;
    const ringColor = overall >= 75 ? '#22c55e' : overall >= 50 ? '#FF9800' : '#003366';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${prof.title} — Experiential Journey Map | NC A&T</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--blue:#003366;--gold:#FDB827;--txt:#1a1a2e;--txt2:#475569;--txt3:#94a3b8;--bdr:#e2e8f0;--bg:#f8fafc}
body{font-family:'Inter',sans-serif;color:var(--txt);background:#fff;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:letter;margin:0.5in 0.6in}

/* ── COVER HEADER ── */
.cover{background:var(--blue);color:#fff;position:relative;overflow:hidden}
.cover-img{width:100%;height:280px;object-fit:cover;display:block;filter:brightness(0.55);position:absolute;top:0;left:0}
.cover-overlay{position:relative;z-index:2;padding:3.5rem 3rem 2.5rem;min-height:280px;display:flex;flex-direction:column;justify-content:flex-end}
.cover-badge{font-size:0.55rem;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:var(--gold);margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem}
.cover-badge::before{content:'';width:2rem;height:3px;background:var(--gold);display:inline-block}
.cover h1{font-size:2.2rem;font-weight:900;letter-spacing:-0.04em;line-height:1.15;text-shadow:0 2px 20px rgba(0,0,0,0.5)}
.cover .tagline{font-size:0.95rem;font-weight:600;margin-top:0.5rem;opacity:0.9;max-width:38rem}
.cover-bar{height:6px;background:var(--gold);position:relative;z-index:3}

/* ── PROGRAM INFO ── */
.prog-row{display:flex;align-items:center;justify-content:space-between;padding:1.75rem 3rem;background:var(--bg);border-bottom:1px solid var(--bdr)}
.prog-info h2{font-size:1.15rem;font-weight:900;color:var(--blue)}
.prog-info .dept{font-size:0.7rem;color:var(--txt2);font-weight:600;margin-top:0.1rem}
.ring{width:5.5rem;height:5.5rem;position:relative;display:flex;align-items:center;justify-content:center}
.ring svg{position:absolute;width:100%;height:100%;transform:rotate(-90deg)}
.ring .pct{font-size:1.4rem;font-weight:900;color:var(--blue)}

/* ── PROFESSION OVERVIEW ── */
.prof-section{padding:1.75rem 3rem;display:flex;gap:2rem;align-items:flex-start;page-break-inside:avoid}
.prof-img{width:240px;height:180px;border-radius:14px;object-fit:cover;flex-shrink:0;border:3px solid var(--bdr);box-shadow:0 4px 20px rgba(0,0,0,0.1)}
.prof-txt{flex:1}
.prof-txt h3{font-size:0.6rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:var(--gold);background:var(--blue);display:inline-block;padding:0.3rem 0.8rem;border-radius:4px;margin-bottom:0.6rem}
.prof-txt p{font-size:0.82rem;color:var(--txt2);font-weight:500;line-height:1.7}

/* ── CAREER DATA ── */
.career{display:flex;gap:0.75rem;padding:0 3rem 1.5rem;page-break-inside:avoid}
.career-card{flex:1;background:var(--bg);border:1px solid var(--bdr);border-radius:10px;padding:1rem;text-align:center}
.career-card .lbl{font-size:0.55rem;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:var(--txt3)}
.career-card .val{font-size:1.4rem;font-weight:900;color:var(--blue);margin:0.2rem 0}
.career-card .src{font-size:0.5rem;color:var(--txt3)}

/* ── JOURNEY MAP ── */
.map-title{margin:0 3rem;padding:1rem 0 0.6rem;font-size:0.6rem;font-weight:900;text-transform:uppercase;letter-spacing:0.25em;color:var(--blue);border-bottom:3px solid var(--gold)}
.phase{padding:1rem 3rem}
.phase-hd{padding:0.6rem 1rem;border-radius:8px;margin-bottom:0.5rem}
.phase-row{display:flex;justify-content:space-between;align-items:center}
.phase-nm{font-size:0.9rem;font-weight:900;text-transform:uppercase;letter-spacing:0.04em}
.phase-pg{font-size:0.6rem;font-weight:800;color:#fff;padding:0.15rem 0.6rem;border-radius:20px}
.phase-dsc{font-size:0.65rem;color:var(--txt2);margin-top:0.25rem;font-weight:500}
.ms-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.35rem}
.ms{display:flex;align-items:center;gap:0.4rem;padding:0.4rem 0.5rem;border:1px solid var(--bdr);border-radius:5px;font-size:0.68rem}
.ms-done{background:#f0fdf4;border-color:#bbf7d0}
.ms-chk{font-size:0.75rem;flex-shrink:0}
.ms-ico{font-size:0.7rem;flex-shrink:0}
.ms-info{display:flex;flex-direction:column;min-width:0}
.ms-lbl{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ms-cr{font-size:0.55rem;color:var(--txt3);font-weight:600}

/* ── QUOTE ── */
.quote-bar{padding:1.25rem 3rem;margin:0.5rem 3rem;background:linear-gradient(135deg,var(--blue) 0%,#1a4d80 100%);border-radius:12px;color:#fff;text-align:center;page-break-inside:avoid}
.quote-bar q{font-size:0.85rem;font-weight:600;font-style:italic;line-height:1.6}
.quote-bar .attr{font-size:0.6rem;font-weight:900;color:var(--gold);margin-top:0.4rem;text-transform:uppercase;letter-spacing:0.15em}

/* ── FOOTER ── */
.rpt-footer{padding:1.25rem 3rem;border-top:4px solid var(--gold);display:flex;justify-content:space-between;align-items:center;font-size:0.55rem;color:var(--txt3);font-weight:600;margin-top:1.5rem}
.rpt-footer .stamp{font-weight:900;color:var(--blue);text-transform:uppercase;letter-spacing:0.12em;font-size:0.65rem}

/* ── PRINT ── */
@media print{.no-print{display:none!important}.phase{page-break-inside:avoid}}
.print-bar{position:fixed;bottom:0;left:0;right:0;background:var(--blue);padding:0.75rem 3rem;display:flex;justify-content:center;gap:1rem;z-index:100;box-shadow:0 -4px 20px rgba(0,0,0,0.3)}
.print-bar button{padding:0.7rem 2.5rem;font-size:0.85rem;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;text-transform:uppercase;letter-spacing:0.1em}
.btn-p{background:var(--gold);color:var(--blue)}
.btn-c{background:rgba(255,255,255,0.15);color:#fff}
</style>
</head>
<body>

<div class="print-bar no-print">
  <button class="btn-p" onclick="window.print()">🖨️ Print / Save PDF</button>
  <button class="btn-c" onclick="window.close()">✕ Close</button>
</div>

<!-- COVER -->
<div class="cover">
  <img src="${imgPath}" class="cover-img" alt="${prof.title}" onerror="this.style.display='none'" />
  <div class="cover-overlay">
    <div class="cover-badge">North Carolina A&T State University · Experiential Journey Map</div>
    <h1>${prof.title}</h1>
    <div class="tagline">${prof.tagline}</div>
  </div>
</div>
<div class="cover-bar"></div>

<!-- PROGRAM ROW -->
<div class="prog-row">
  <div class="prog-info">
    <h2>${branding.programName || prof.title}</h2>
    <div class="dept">${branding.department || branding.collegeName || 'College of Agriculture & Environmental Sciences'}</div>
  </div>
  <div class="ring">
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" stroke="#e2e8f0" stroke-width="7" fill="none"/>
      <circle cx="50" cy="50" r="42" stroke="${ringColor}" stroke-width="7" fill="none"
        stroke-dasharray="${circum}" stroke-dashoffset="${circum * (1 - overall/100)}" stroke-linecap="round"/>
    </svg>
    <span class="pct">${overall}%</span>
  </div>
</div>

<!-- PROFESSION OVERVIEW -->
<div class="prof-section">
  <img src="${imgPath}" class="prof-img" alt="${prof.title}" onerror="this.style.display='none'" />
  <div class="prof-txt">
    <h3>Career Overview</h3>
    <p>${prof.overview}</p>
  </div>
</div>

<!-- CAREER DATA -->
<div class="career">
  <div class="career-card">
    <div class="lbl">Median Salary</div>
    <div class="val">${salary}</div>
    <div class="src">Bureau of Labor Statistics</div>
  </div>
  <div class="career-card">
    <div class="lbl">Job Growth (10yr)</div>
    <div class="val">${growth}</div>
    <div class="src">Bureau of Labor Statistics</div>
  </div>
  <div class="career-card">
    <div class="lbl">U.S. Employment</div>
    <div class="val">${employment}</div>
    <div class="src">Bureau of Labor Statistics</div>
  </div>
  <div class="career-card">
    <div class="lbl">Journey Progress</div>
    <div class="val">${doneMs}/${totalMs}</div>
    <div class="src">Milestones Completed</div>
  </div>
</div>

<!-- INSPIRATIONAL QUOTE -->
<div class="quote-bar">
  <q>Your degree is the foundation, but your experiences are the blueprint for your career. Map it. Own it. Build it.</q>
  <div class="attr">— EMMA · Experiential Major Mapping Assistant</div>
</div>

<!-- JOURNEY MAP -->
<div class="map-title">Your Experiential Journey Map · ${timeline.phases.length}-Phase Framework</div>
${phasesHTML}

<!-- FOOTER -->
<div class="rpt-footer">
  <div>
    <span class="stamp">Aggies Do! 💙💛</span>
    &nbsp;·&nbsp; Generated by EMMA — Experiential Major Mapping Assistant &nbsp;·&nbsp; ${today}
  </div>
  <div>© ${new Date().getFullYear()} Think! Design and Planning, LLC &nbsp;·&nbsp; thinkemma.app</div>
</div>

</body>
</html>`;

    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
    else { EMMA_MATRIX.showToast('⚠️ Pop-up blocked — allow pop-ups for this site', 'error'); }
  }

  return { generate };
})();

console.log('[EMMA] Journey Map Brochure Report initialized');
