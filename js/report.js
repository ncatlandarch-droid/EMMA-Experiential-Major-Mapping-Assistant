/**
 * EMMA C2C — Magazine-Style Journey Map Report
 * Multi-page, full-bleed, brochure-quality printable report.
 * Shows profession career paths with aspirational imagery,
 * career overviews, BLS data, and the 4-phase journey map.
 *
 * © Think! Design and Planning, LLC
 */

const EMMA_REPORT = (() => {

  /* ── Career paths per profession (expanded for LA) ── */
  const CAREER_PATHS = {
    'landscape': [
      {
        image: 'assets/images/professions/prof_la_urban_design.png',
        title: 'Urban Designer & Master Planner',
        desc: 'Shape the future of cities. Urban designers create master plans for neighborhoods, downtowns, and mixed-use developments — integrating parks, transit, and public spaces into cohesive communities. Firms like SWA, AECOM, and Sasaki lead this work globally.',
        salary: '$75K – $130K+'
      },
      {
        image: 'assets/images/professions/prof_la_park_design.png',
        title: 'Park & Recreation Designer',
        desc: 'Design the spaces where memories are made. Park designers create public parks, playgrounds, trails, and greenways that serve diverse communities. From pocket parks to national park master plans, your designs bring joy and health to millions.',
        salary: '$65K – $110K'
      },
      {
        image: 'assets/images/professions/prof_la_sustainability.png',
        title: 'Green Infrastructure & Resilience Specialist',
        desc: 'Lead the fight against climate change through design. Green infrastructure specialists design bioswales, rain gardens, green roofs, and living shorelines that protect communities from flooding while creating beautiful landscapes.',
        salary: '$70K – $120K'
      },
      {
        image: 'assets/images/professions/prof_la_community.png',
        title: 'Community Design & Equity Planner',
        desc: 'Give voice to underserved communities. Community designers facilitate charrettes, lead participatory design processes, and ensure equitable access to quality public spaces. This work is at the heart of environmental justice.',
        salary: '$60K – $100K'
      },
      {
        image: 'assets/images/professions/prof_la_site_construction.png',
        title: 'Site Designer & Construction Administrator',
        desc: 'Bring designs to life in the field. Site designers create detailed grading, drainage, and planting plans, then oversee construction to ensure the vision is built right. This role combines technical expertise with creative problem-solving.',
        salary: '$65K – $115K'
      }
    ],
    'animal': [
      {
        image: 'assets/images/professions/prof_animal_science.png',
        title: 'Veterinary Researcher & Scientist',
        desc: 'Advance animal health through biomedical research. Animal scientists work in pharmaceutical labs, universities, and government agencies to develop vaccines, treatments, and improve livestock genetics.',
        salary: '$65K – $120K'
      }
    ],
    'bioe': [
      {
        image: 'assets/images/professions/prof_bio_engineering.png',
        title: 'Bioprocess & Environmental Engineer',
        desc: 'Design systems that solve real-world problems — from biofuel production to water treatment. Biological engineers apply engineering principles to living systems, working at the cutting edge of sustainability and biotechnology.',
        salary: '$70K – $130K'
      }
    ],
    'food': [
      {
        image: 'assets/images/professions/prof_food_nutrition.png',
        title: 'Food Scientist & Nutritionist',
        desc: 'Ensure our food is safe, nutritious, and innovative. Food scientists develop new products, analyze nutritional content, and lead quality assurance in the food industry. Nutritionists counsel individuals and shape public health policy.',
        salary: '$55K – $100K'
      }
    ],
    'fashion': [
      {
        image: 'assets/images/professions/prof_fashion_design.png',
        title: 'Fashion Designer & Merchandiser',
        desc: 'Blend creativity with business. Fashion professionals design apparel, manage retail operations, and drive brand strategy — from luxury houses to sustainable startups.',
        salary: '$50K – $110K'
      }
    ],
    'child': [
      {
        image: 'assets/images/professions/prof_child_dev.png',
        title: 'Child Development & Family Specialist',
        desc: 'Shape the lives of children and families through counseling, education, and advocacy. Work in schools, clinics, nonprofits, and government agencies to strengthen communities.',
        salary: '$45K – $85K'
      }
    ],
    'aged': [
      {
        image: 'assets/images/professions/prof_ag_education.png',
        title: 'Agricultural Educator & Extension Agent',
        desc: 'Inspire the next generation. Agricultural educators teach in classrooms and communities, connecting people to land and food systems. Extension agents bring university research directly to farmers and families.',
        salary: '$45K – $80K'
      }
    ],
    'agbm': [
      {
        image: 'assets/images/professions/prof_agribusiness.png',
        title: 'Agribusiness Manager & Analyst',
        desc: 'Lead the business of agriculture. From farm operations and supply chain logistics to agricultural finance and policy, agribusiness professionals feed the world sustainably.',
        salary: '$55K – $110K'
      }
    ],
    'envs': [
      {
        image: 'assets/images/professions/prof_environmental.png',
        title: 'Environmental Scientist & Planner',
        desc: 'Protect our air, water, soil, and ecosystems. Environmental professionals lead impact assessments, conservation planning, and sustainability consulting on the front lines of our most critical challenges.',
        salary: '$55K – $100K'
      }
    ]
  };

  const PROFESSION_META = {
    'landscape': { title: 'Landscape Architecture', tagline: 'Designing the Future of Our Built & Natural Environments', hero: 'assets/images/professions/prof_landscape_arch.png', overview: 'Landscape architects design outdoor spaces that bring communities together — parks, campuses, urban plazas, greenways, and resilient infrastructure. As a licensed landscape architect, you\'ll shape environments that are beautiful, sustainable, and equitable. NC A&T\'s BSLA is the only LAAB-accredited landscape architecture program at an HBCU in the nation — producing the next generation of design leaders who reflect the communities they serve.' },
    'animal': { title: 'Animal Science', tagline: 'Advancing Animal Health, Welfare & Agricultural Innovation', hero: 'assets/images/professions/prof_animal_science.png', overview: 'Animal scientists improve animal health, welfare, and production systems. From veterinary research to livestock management and biotechnology, this field offers diverse paths. Graduates enter veterinary school, pharmaceutical research, agricultural extension, and food safety leadership.' },
    'lab': { title: 'Laboratory Animal Science', tagline: 'Ensuring Ethical & Humane Research Standards', hero: 'assets/images/professions/prof_animal_science.png', overview: 'Laboratory animal scientists manage the care and ethical treatment of research animals, playing a vital role in biomedical breakthroughs — from cancer treatments to vaccine development.' },
    'bioe': { title: 'Biological Engineering', tagline: 'Engineering Solutions at the Intersection of Biology & Technology', hero: 'assets/images/professions/prof_bio_engineering.png', overview: 'Biological engineers design systems that solve real-world problems — from water treatment and biofuel production to medical devices and environmental remediation.' },
    'food': { title: 'Food & Nutritional Sciences', tagline: 'Nourishing Communities Through Science & Innovation', hero: 'assets/images/professions/prof_food_nutrition.png', overview: 'Food scientists and nutritionists ensure our food is safe, nutritious, and sustainable. From developing new food products to clinical nutrition counseling, this field addresses food security, public health, and agricultural innovation.' },
    'fashion': { title: 'Fashion Merchandising & Design', tagline: 'Creating, Curating & Bringing Style to Market', hero: 'assets/images/professions/prof_fashion_design.png', overview: 'Fashion professionals blend creativity with business — designing apparel, managing retail operations, and driving brand strategy. From luxury fashion houses to sustainable clothing startups.' },
    'child': { title: 'Child Development & Family Studies', tagline: 'Strengthening Families & Empowering Communities', hero: 'assets/images/professions/prof_child_dev.png', overview: 'Child development and family studies professionals shape the lives of children and families through counseling, education, policy, and advocacy.' },
    'aged': { title: 'Agricultural Education', tagline: 'Inspiring the Next Generation of Agricultural Leaders', hero: 'assets/images/professions/prof_ag_education.png', overview: 'Agricultural educators teach and inspire — in classrooms, communities, and Extension programs. Whether pursuing secondary teaching licensure or professional service, you\'ll connect people to the land.' },
    'agbm': { title: 'Agribusiness', tagline: 'Leading the Business of Agriculture & Food Systems', hero: 'assets/images/professions/prof_agribusiness.png', overview: 'Agribusiness professionals manage the economic engine of agriculture — from farm operations and supply chain logistics to agricultural finance and policy.' },
    'envs': { title: 'Environmental Studies', tagline: 'Protecting Our Natural Resources for Future Generations', hero: 'assets/images/professions/prof_environmental.png', overview: 'Environmental scientists protect our air, water, soil, and ecosystems. From impact assessments to conservation planning and sustainability consulting.' },
    'slfs': { title: 'Sustainable Land & Food Systems', tagline: 'Building Resilient Communities Through Sustainable Agriculture', hero: 'assets/images/professions/prof_environmental.png', overview: 'Sustainable land and food systems professionals integrate soil science, agroecology, and land management to build resilient food systems.' },
    'cons': { title: 'Consumer Sciences', tagline: 'Understanding Consumer Behavior & Market Dynamics', hero: 'assets/images/professions/prof_fashion_design.png', overview: 'Consumer scientists analyze how people make decisions and interact with products and services, driving innovation in product development and market research.' }
  };

  function matchKey(slug) {
    slug = (slug || '').toLowerCase();
    for (const k of Object.keys(PROFESSION_META)) { if (slug.includes(k)) return k; }
    return 'landscape';
  }

  const CAT_ICONS = {'course':'📘','field':'🌿','professional':'💼','community':'🤝','research':'🔬','certification':'🏆','award':'🏅','leadership':'👑'};
  const PHASE_CLR = ['#2d5016','#003366','#b8651a','#7b2d8e'];

  function generate() {
    const timeline = EMMA_STATE.get('timeline');
    const branding = EMMA_STATE.get('branding');
    const program  = EMMA_STATE.get('currentProgram');
    const checked  = EMMA_STATE.get('checkedMilestones') || {};
    if (!timeline || !branding) { EMMA_MATRIX?.showToast('⚠️ Load a program first', 'error'); return; }

    const key   = matchKey(program);
    const meta  = PROFESSION_META[key];
    const paths = CAREER_PATHS[key] || CAREER_PATHS['landscape'];
    const overall = EMMA_STATE.getOverallProgress();
    const totalMs = timeline.phases.reduce((s,p) => s + p.milestones.length, 0);
    const doneMs  = Object.values(checked).filter(Boolean).length;
    const today   = new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'});
    const salary  = document.getElementById('career-salary')?.textContent || 'N/A';
    const growth  = document.getElementById('career-growth')?.textContent || 'N/A';
    const employ  = document.getElementById('career-employment')?.textContent || 'N/A';
    const circum  = 2 * Math.PI * 42;
    const ringClr = overall >= 75 ? '#22c55e' : overall >= 50 ? '#FF9800' : '#003366';

    // Career paths spread
    const pathsHTML = paths.map((p, i) => `
      <div class="cp-card ${i % 2 === 0 ? 'cp-left' : 'cp-right'}">
        <img src="${p.image}" class="cp-img" alt="${p.title}" onerror="this.style.background='linear-gradient(135deg,#003366,#1a6d99)'" />
        <div class="cp-body">
          <div class="cp-num">0${i + 1}</div>
          <h3 class="cp-title">${p.title}</h3>
          <p class="cp-desc">${p.desc}</p>
          <div class="cp-salary">Salary Range: <strong>${p.salary}</strong></div>
        </div>
      </div>`).join('');

    // Journey phases
    const phasesHTML = timeline.phases.map((phase, idx) => {
      const c = PHASE_CLR[idx % 4];
      const pp = EMMA_STATE.getPhaseProgress(phase.id);
      const msHTML = phase.milestones.map(m => {
        const d = checked[m.id]; const ic = CAT_ICONS[m.category] || '📌';
        return `<div class="ms ${d?'ms-d':''}"><span class="ms-c">${d?'✅':'⬜'}</span><span class="ms-i">${ic}</span><div class="ms-t"><span class="ms-l">${m.label}</span>${m.credits?`<span class="ms-cr">${m.credits} cr</span>`:''}</div></div>`;
      }).join('');
      return `<div class="ph"><div class="ph-h" style="border-left:6px solid ${c};background:${c}08"><div class="ph-r"><h3 style="color:${c}">${phase.name}</h3><span class="ph-p" style="background:${c}">${pp.checked}/${pp.total} · ${pp.percent}%</span></div>${phase.description?`<p class="ph-d">${phase.description}</p>`:''}</div><div class="ms-g">${msHTML}</div></div>`;
    }).join('');

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>${meta.title} — Experiential Journey Map | NC A&T</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--b:#003366;--g:#FDB827;--t:#1a1a2e;--t2:#475569;--t3:#94a3b8;--bd:#e2e8f0;--bg:#f8fafc}
body{font-family:'Inter',sans-serif;color:var(--t);background:#fff;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:letter;margin:0}
.page{page-break-after:always;min-height:100vh;position:relative;overflow:hidden}
.page:last-child{page-break-after:auto}

/* ─── PAGE 1: COVER ─── */
.cover{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end}
.cover-bg{position:absolute;inset:0;object-fit:cover;width:100%;height:100%;filter:brightness(0.35)}
.cover-content{position:relative;z-index:2;padding:4rem 4rem 3rem;color:#fff}
.cover-stripe{width:5rem;height:5px;background:var(--g);margin-bottom:1.5rem;border-radius:3px}
.cover-badge{font-size:0.65rem;font-weight:900;text-transform:uppercase;letter-spacing:0.35em;color:var(--g);margin-bottom:1rem}
.cover h1{font-size:3.5rem;font-weight:900;letter-spacing:-0.04em;line-height:1.1;max-width:36rem}
.cover .tag{font-size:1.1rem;font-weight:600;margin-top:0.75rem;opacity:0.85;max-width:32rem}
.cover-gold{position:absolute;bottom:0;left:0;right:0;height:8px;background:var(--g);z-index:3}
.cover-logo{position:absolute;top:2.5rem;right:3rem;z-index:3;text-align:right;color:rgba(255,255,255,0.9)}
.cover-logo .uni{font-size:0.7rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:var(--g)}
.cover-logo .sub{font-size:0.55rem;font-weight:600;opacity:0.7;margin-top:0.15rem}

/* ─── PAGE 2: OVERVIEW ─── */
.overview{padding:4rem}
.ov-badge{font-size:0.55rem;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:var(--g);background:var(--b);display:inline-block;padding:0.35rem 1rem;border-radius:4px;margin-bottom:1.5rem}
.ov-split{display:flex;gap:2.5rem;align-items:flex-start;margin-bottom:2.5rem}
.ov-img{width:320px;height:240px;border-radius:16px;object-fit:cover;flex-shrink:0;box-shadow:0 8px 40px rgba(0,0,0,0.15)}
.ov-text h2{font-size:1.8rem;font-weight:900;color:var(--b);line-height:1.2;margin-bottom:0.75rem}
.ov-text p{font-size:0.9rem;color:var(--t2);font-weight:500;line-height:1.8}
.career-row{display:flex;gap:1rem;margin-top:1.5rem}
.cr-card{flex:1;background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:1.25rem;text-align:center}
.cr-card .lb{font-size:0.55rem;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:var(--t3)}
.cr-card .vl{font-size:1.6rem;font-weight:900;color:var(--b);margin:0.25rem 0}
.cr-card .sr{font-size:0.5rem;color:var(--t3)}
.ov-quote{margin-top:2.5rem;padding:2rem 2.5rem;background:linear-gradient(135deg,var(--b) 0%,#1a4d80 100%);border-radius:16px;color:#fff;text-align:center}
.ov-quote q{font-size:1rem;font-weight:600;font-style:italic;line-height:1.7;display:block}
.ov-quote .attr{font-size:0.6rem;font-weight:900;color:var(--g);margin-top:0.6rem;text-transform:uppercase;letter-spacing:0.15em}

/* ─── PAGE 3: CAREER PATHS ─── */
.paths-page{padding:3.5rem 4rem}
.paths-title{font-size:0.6rem;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:var(--g);background:var(--b);display:inline-block;padding:0.3rem 1rem;border-radius:4px;margin-bottom:0.5rem}
.paths-h2{font-size:2rem;font-weight:900;color:var(--b);margin-bottom:0.3rem}
.paths-sub{font-size:0.85rem;color:var(--t2);font-weight:500;margin-bottom:2rem;max-width:36rem}
.cp-card{display:flex;gap:2rem;align-items:center;margin-bottom:1.75rem;page-break-inside:avoid}
.cp-right{flex-direction:row-reverse}
.cp-img{width:220px;height:160px;border-radius:14px;object-fit:cover;flex-shrink:0;box-shadow:0 6px 30px rgba(0,0,0,0.12)}
.cp-body{flex:1}
.cp-num{font-size:2.5rem;font-weight:900;color:var(--bd);line-height:1;margin-bottom:0.15rem}
.cp-title{font-size:1.05rem;font-weight:900;color:var(--b);margin-bottom:0.4rem}
.cp-desc{font-size:0.78rem;color:var(--t2);font-weight:500;line-height:1.65}
.cp-salary{margin-top:0.5rem;font-size:0.7rem;color:var(--t3);font-weight:600}
.cp-salary strong{color:var(--b)}

/* ─── PAGE 4: JOURNEY MAP ─── */
.map-page{padding:3.5rem 4rem}
.map-badge{font-size:0.6rem;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:var(--g);background:var(--b);display:inline-block;padding:0.3rem 1rem;border-radius:4px;margin-bottom:0.5rem}
.map-h2{font-size:1.8rem;font-weight:900;color:var(--b);margin-bottom:0.25rem}
.map-sub{font-size:0.8rem;color:var(--t2);margin-bottom:1.5rem}
.map-progress{display:flex;align-items:center;gap:1.5rem;margin-bottom:2rem;padding:1.25rem 1.5rem;background:var(--bg);border-radius:14px;border:1px solid var(--bd)}
.ring{width:5rem;height:5rem;position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ring svg{position:absolute;width:100%;height:100%;transform:rotate(-90deg)}
.ring .pct{font-size:1.3rem;font-weight:900;color:var(--b)}
.prog-txt .prog-big{font-size:1.1rem;font-weight:900;color:var(--b)}
.prog-txt .prog-sm{font-size:0.7rem;color:var(--t2);font-weight:500}
.ph{margin-bottom:1rem;page-break-inside:avoid}
.ph-h{padding:0.6rem 1rem;border-radius:8px;margin-bottom:0.4rem}
.ph-r{display:flex;justify-content:space-between;align-items:center}
.ph-r h3{font-size:0.85rem;font-weight:900;text-transform:uppercase;letter-spacing:0.04em}
.ph-p{font-size:0.55rem;font-weight:800;color:#fff;padding:0.15rem 0.6rem;border-radius:20px}
.ph-d{font-size:0.6rem;color:var(--t2);margin-top:0.2rem;font-weight:500}
.ms-g{display:grid;grid-template-columns:1fr 1fr;gap:0.3rem}
.ms{display:flex;align-items:center;gap:0.35rem;padding:0.35rem 0.45rem;border:1px solid var(--bd);border-radius:5px;font-size:0.65rem}
.ms-d{background:#f0fdf4;border-color:#bbf7d0}
.ms-c{font-size:0.7rem;flex-shrink:0}.ms-i{font-size:0.65rem;flex-shrink:0}
.ms-t{display:flex;flex-direction:column;min-width:0}
.ms-l{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ms-cr{font-size:0.5rem;color:var(--t3);font-weight:600}

/* ─── FOOTER ─── */
.rpt-ft{padding:1.25rem 4rem;border-top:5px solid var(--g);display:flex;justify-content:space-between;align-items:center;font-size:0.55rem;color:var(--t3);font-weight:600}
.rpt-ft .stamp{font-weight:900;color:var(--b);text-transform:uppercase;letter-spacing:0.12em;font-size:0.65rem}

/* ─── PRINT ─── */
@media print{.no-print{display:none!important}}
.pbar{position:fixed;bottom:0;left:0;right:0;background:var(--b);padding:0.7rem 3rem;display:flex;justify-content:center;gap:1rem;z-index:100;box-shadow:0 -4px 20px rgba(0,0,0,0.3)}
.pbar button{padding:0.7rem 2.5rem;font-size:0.85rem;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;text-transform:uppercase;letter-spacing:0.1em}
.btn-p{background:var(--g);color:var(--b)}.btn-c{background:rgba(255,255,255,0.15);color:#fff}
</style></head><body>

<div class="pbar no-print">
  <button class="btn-p" onclick="window.print()">🖨️ Print / Save PDF</button>
  <button class="btn-c" onclick="window.close()">✕ Close</button>
</div>

<!-- PAGE 1: COVER -->
<div class="page cover">
  <img src="${meta.hero}" class="cover-bg" alt="${meta.title}" />
  <div class="cover-logo">
    <div class="uni">North Carolina A&T State University</div>
    <div class="sub">College of Agriculture & Environmental Sciences</div>
  </div>
  <div class="cover-content">
    <div class="cover-stripe"></div>
    <div class="cover-badge">Experiential Journey Map · EMMA Platform</div>
    <h1>${meta.title}</h1>
    <div class="tag">${meta.tagline}</div>
  </div>
  <div class="cover-gold"></div>
</div>

<!-- PAGE 2: PROFESSION OVERVIEW -->
<div class="page overview">
  <div class="ov-badge">Career Overview</div>
  <div class="ov-split">
    <img src="${meta.hero}" class="ov-img" alt="${meta.title}" />
    <div class="ov-text">
      <h2>${meta.title}</h2>
      <p>${meta.overview}</p>
    </div>
  </div>
  <div class="career-row">
    <div class="cr-card"><div class="lb">Median Salary</div><div class="vl">${salary}</div><div class="sr">Bureau of Labor Statistics</div></div>
    <div class="cr-card"><div class="lb">Job Growth</div><div class="vl">${growth}</div><div class="sr">10-Year Projected</div></div>
    <div class="cr-card"><div class="lb">U.S. Employment</div><div class="vl">${employ}</div><div class="sr">Bureau of Labor Statistics</div></div>
    <div class="cr-card"><div class="lb">Your Progress</div><div class="vl">${doneMs}/${totalMs}</div><div class="sr">Milestones Completed</div></div>
  </div>
  <div class="ov-quote">
    <q>Your degree is the foundation, but your experiences are the blueprint for your career. Map it. Own it. Build it.</q>
    <div class="attr">— EMMA · Experiential Major Mapping Assistant</div>
  </div>
</div>

<!-- PAGE 3: CAREER PATHS -->
<div class="page paths-page">
  <div class="paths-title">What You Can Become</div>
  <h2 class="paths-h2">Career Paths in ${meta.title}</h2>
  <p class="paths-sub">Your degree opens doors to diverse, rewarding careers. Here are just a few of the paths where NC A&T graduates are making an impact.</p>
  ${pathsHTML}
</div>

<!-- PAGE 4: JOURNEY MAP -->
<div class="page map-page">
  <div class="map-badge">Your Journey Map</div>
  <h2 class="map-h2">Experiential Journey Map</h2>
  <p class="map-sub">Track your progress across the four-phase experiential framework.</p>
  <div class="map-progress">
    <div class="ring">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" stroke="#e2e8f0" stroke-width="7" fill="none"/>
        <circle cx="50" cy="50" r="42" stroke="${ringClr}" stroke-width="7" fill="none" stroke-dasharray="${circum}" stroke-dashoffset="${circum*(1-overall/100)}" stroke-linecap="round"/>
      </svg>
      <span class="pct">${overall}%</span>
    </div>
    <div class="prog-txt">
      <div class="prog-big">${doneMs} of ${totalMs} Milestones Completed</div>
      <div class="prog-sm">Generated ${today} · ${branding.programName || meta.title}</div>
    </div>
  </div>
  ${phasesHTML}
  <div class="rpt-ft">
    <div><span class="stamp">Aggies Do! 💙💛</span> · Generated by EMMA — Experiential Major Mapping Assistant</div>
    <div>© ${new Date().getFullYear()} Think! Design and Planning, LLC · thinkemma.app</div>
  </div>
</div>

</body></html>`;

    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
    else { EMMA_MATRIX?.showToast('⚠️ Pop-up blocked — allow pop-ups', 'error'); }
  }

  return { generate };
})();

console.log('[EMMA] Magazine Journey Map Report initialized');
