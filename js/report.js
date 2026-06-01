/**
 * EMMA C2C — Premium Magazine Journey Map Report
 * Multi-page, chart-rich, magazine-quality brochure with:
 * - Full-bleed cover imagery
 * - Salary/growth/employment charts (inline SVG)
 * - Top 5-6 career paths per profession
 * - Related majors/minors cross-mapping
 * - QR code to thinkemma.app
 * - 4-phase journey map with progress
 *
 * © Think! Design and Planning, LLC
 */

const EMMA_REPORT = (() => {

  /* ══════════════════════════════════════════════════
     PROFESSION DATABASE
     ══════════════════════════════════════════════════ */

  const DB = {
    'landscape': {
      hero: 'assets/images/professions/prof_landscape_arch.png',
      title: 'Landscape Architecture',
      tagline: 'Designing the Future of Our Built & Natural Environments',
      overview: 'Landscape architects design outdoor spaces that bring communities together — parks, campuses, urban plazas, greenways, and resilient infrastructure. As a licensed landscape architect, you\'ll shape environments that are beautiful, sustainable, and equitable. NC A&T\'s BSLA is the only LAAB-accredited landscape architecture program at an HBCU in the nation.',
      blsSalary: 73210,
      blsGrowth: 5,
      blsEmployment: 26200,
      nationalMedian: 48060,
      careers: [
        { title: 'Urban Designer & Master Planner', salary: '$75K – $130K+', icon: '🏙️', desc: 'Create master plans for neighborhoods, downtowns, and campuses — integrating parks, transit, and public spaces into cohesive communities.' },
        { title: 'Park & Recreation Designer', salary: '$65K – $110K', icon: '🌳', desc: 'Design public parks, playgrounds, trails, and greenways that serve diverse communities and promote health and well-being.' },
        { title: 'Green Infrastructure Specialist', salary: '$70K – $120K', icon: '🌿', desc: 'Design bioswales, rain gardens, green roofs, and living shorelines that protect communities from flooding while creating beauty.' },
        { title: 'Community Design & Equity Planner', salary: '$60K – $100K', icon: '🤝', desc: 'Lead participatory design processes to ensure equitable access to quality public spaces. Environmental justice at its core.' },
        { title: 'Site Designer & Construction Admin', salary: '$65K – $115K', icon: '🏗️', desc: 'Create detailed grading, drainage, and planting plans, then oversee construction to bring the design vision to life.' },
        { title: 'Environmental Restoration Ecologist', salary: '$60K – $95K', icon: '🦋', desc: 'Restore degraded landscapes — wetlands, forests, prairies — using ecological design principles and native plant communities.' }
      ],
      images: [
        'assets/images/professions/prof_la_urban_design.png',
        'assets/images/professions/prof_la_park_design.png',
        'assets/images/professions/prof_la_sustainability.png',
        'assets/images/professions/prof_la_community.png',
        'assets/images/professions/prof_la_site_construction.png'
      ],
      related: [
        { name: 'Environmental Studies', why: 'Shared focus on ecological systems and sustainability' },
        { name: 'Civil Engineering', why: 'Complementary site grading, drainage, and infrastructure skills' },
        { name: 'Architectural Engineering', why: 'Building-landscape integration and site design' },
        { name: 'Construction Management', why: 'Manage landscape construction projects end-to-end' },
        { name: 'Biological Engineering', why: 'Green infrastructure and bioengineered solutions' },
        { name: 'Visual Arts — Design', why: 'Shared foundation in design thinking and visual communication' }
      ],
      whatYouCanDo: [
        'Design public parks and urban plazas for millions to enjoy',
        'Lead climate resilience projects that protect vulnerable communities',
        'Create healing gardens for hospitals and therapeutic landscapes',
        'Plan campus environments for universities worldwide',
        'Design green infrastructure that manages stormwater naturally',
        'Restore damaged ecosystems to healthy, thriving landscapes',
        'Open your own landscape architecture firm',
        'Shape national park master plans and trail systems',
        'Consult on LEED and SITES sustainability certifications',
        'Teach the next generation of designers at universities'
      ]
    },
    'animal': {
      hero: 'assets/images/professions/prof_animal_science.png',
      title: 'Animal Science',
      tagline: 'Advancing Animal Health, Welfare & Agricultural Innovation',
      overview: 'Animal scientists improve animal health, welfare, and production systems. From veterinary research to livestock management and biotechnology, this field offers diverse paths into veterinary school, pharmaceutical research, agricultural extension, and food safety leadership.',
      blsSalary: 74100, blsGrowth: 6, blsEmployment: 30700, nationalMedian: 48060,
      careers: [
        { title: 'Veterinarian', salary: '$100K – $170K', icon: '🩺', desc: 'Diagnose and treat animal diseases. Requires DVM after bachelor\'s.' },
        { title: 'Animal Nutritionist', salary: '$60K – $95K', icon: '🥬', desc: 'Formulate optimal diets for livestock, companion animals, and zoo animals.' },
        { title: 'Livestock Production Manager', salary: '$55K – $90K', icon: '🐄', desc: 'Manage breeding, feeding, and health programs for commercial livestock operations.' },
        { title: 'Pharmaceutical Research Scientist', salary: '$75K – $130K', icon: '🔬', desc: 'Develop vaccines, therapeutics, and diagnostic tools for animal health.' },
        { title: 'Wildlife Biologist', salary: '$55K – $85K', icon: '🦅', desc: 'Study wild animal populations, conservation, and habitat management.' },
        { title: 'Food Safety Inspector', salary: '$50K – $80K', icon: '🛡️', desc: 'Ensure safety of meat, poultry, and dairy products for USDA/FDA.' }
      ],
      images: ['assets/images/professions/prof_animal_science.png'],
      related: [
        { name: 'Biology — Pre-Med', why: 'Strong foundation for veterinary school' },
        { name: 'Food & Nutritional Sciences', why: 'Animal-to-table food safety pipeline' },
        { name: 'Biological Engineering', why: 'Biotech applications in animal health' }
      ],
      whatYouCanDo: [
        'Practice veterinary medicine for companion or large animals',
        'Develop animal vaccines and therapeutics',
        'Manage commercial livestock operations',
        'Work in zoo and wildlife management',
        'Lead USDA food safety inspection programs',
        'Research animal genetics and biotechnology',
        'Teach animal science at universities',
        'Consult on sustainable animal agriculture'
      ]
    },
    'bioe': {
      hero: 'assets/images/professions/prof_bio_engineering.png',
      title: 'Biological Engineering',
      tagline: 'Engineering Solutions at the Intersection of Biology & Technology',
      overview: 'Biological engineers design systems that solve real-world problems — from water treatment and biofuel production to medical devices and environmental remediation. Whether in bioprocess engineering or natural resource engineering, you\'ll apply engineering principles to living systems.',
      blsSalary: 99550, blsGrowth: 5, blsEmployment: 19200, nationalMedian: 48060,
      careers: [
        { title: 'Bioprocess Engineer', salary: '$75K – $130K', icon: '⚗️', desc: 'Design and optimize production of biofuels, pharmaceuticals, and food products.' },
        { title: 'Environmental Engineer', salary: '$70K – $120K', icon: '💧', desc: 'Design water treatment and waste management systems for communities.' },
        { title: 'Quality Assurance Engineer', salary: '$65K – $100K', icon: '✅', desc: 'Ensure pharmaceutical and food manufacturing meets safety standards.' },
        { title: 'Biomedical Device Engineer', salary: '$80K – $140K', icon: '🦾', desc: 'Design medical devices, prosthetics, and diagnostic equipment.' },
        { title: 'Sustainability Consultant', salary: '$65K – $110K', icon: '♻️', desc: 'Help companies reduce environmental impact through engineering solutions.' }
      ],
      images: ['assets/images/professions/prof_bio_engineering.png'],
      related: [
        { name: 'Chemical Engineering', why: 'Shared process engineering fundamentals' },
        { name: 'Environmental Studies', why: 'Environmental remediation applications' },
        { name: 'Food & Nutritional Sciences', why: 'Food processing and safety engineering' }
      ],
      whatYouCanDo: ['Design bioreactors for pharmaceutical production','Engineer clean water systems for developing nations','Develop renewable biofuel technologies','Create biosensors for medical diagnostics','Lead environmental remediation projects','Work in FDA-regulated manufacturing','Research tissue engineering and biomaterials']
    },
    'food': {
      hero: 'assets/images/professions/prof_food_nutrition.png',
      title: 'Food & Nutritional Sciences',
      tagline: 'Nourishing Communities Through Science & Innovation',
      overview: 'Food scientists and nutritionists ensure our food is safe, nutritious, and sustainable. From developing new food products to clinical nutrition counseling, this field addresses food security, public health, and agricultural innovation.',
      blsSalary: 66750, blsGrowth: 7, blsEmployment: 16500, nationalMedian: 48060,
      careers: [
        { title: 'Food Product Developer', salary: '$60K – $110K', icon: '🧪', desc: 'Create innovative food products from concept through commercialization.' },
        { title: 'Registered Dietitian', salary: '$55K – $85K', icon: '🍎', desc: 'Provide medical nutrition therapy in hospitals, clinics, and private practice.' },
        { title: 'Quality Control Manager', salary: '$65K – $100K', icon: '🔍', desc: 'Oversee food safety systems, HACCP plans, and regulatory compliance.' },
        { title: 'Public Health Nutritionist', salary: '$50K – $80K', icon: '🏥', desc: 'Design community nutrition programs to address food deserts and malnutrition.' },
        { title: 'Food Scientist', salary: '$60K – $95K', icon: '🔬', desc: 'Research food chemistry, microbiology, and preservation methods.' }
      ],
      images: ['assets/images/professions/prof_food_nutrition.png'],
      related: [
        { name: 'Biology', why: 'Strong science foundation for food microbiology' },
        { name: 'Chemistry', why: 'Food chemistry and analytical methods' },
        { name: 'Animal Science', why: 'Meat science and food safety pipeline' }
      ],
      whatYouCanDo: ['Develop innovative food products for global brands','Counsel patients on medical nutrition therapy','Lead food safety programs for major manufacturers','Research solutions to global food insecurity','Start a nutrition consulting practice','Work in USDA or FDA food regulation']
    },
    'fashion': {
      hero: 'assets/images/professions/prof_fashion_design.png',
      title: 'Fashion Merchandising & Design',
      tagline: 'Creating, Curating & Bringing Style to Market',
      overview: 'Fashion professionals blend creativity with business — designing apparel, managing retail operations, and driving brand strategy. From luxury fashion houses to sustainable clothing startups, this field values creative vision, trend forecasting, and cultural influence.',
      blsSalary: 58700, blsGrowth: 3, blsEmployment: 25300, nationalMedian: 48060,
      careers: [
        { title: 'Fashion Designer', salary: '$50K – $120K', icon: '✂️', desc: 'Design clothing and accessories collections for brands and private labels.' },
        { title: 'Fashion Buyer', salary: '$55K – $95K', icon: '🛍️', desc: 'Select merchandise for retail stores, managing budgets and trend analysis.' },
        { title: 'Visual Merchandiser', salary: '$45K – $75K', icon: '🎨', desc: 'Create compelling in-store displays and visual brand experiences.' },
        { title: 'Brand Manager', salary: '$65K – $120K', icon: '💎', desc: 'Build and manage fashion brand identity, marketing, and growth strategy.' },
        { title: 'Sustainable Fashion Consultant', salary: '$55K – $90K', icon: '🌱', desc: 'Help brands adopt ethical sourcing, sustainable materials, and circular design.' }
      ],
      images: ['assets/images/professions/prof_fashion_design.png'],
      related: [
        { name: 'Marketing', why: 'Brand strategy and consumer behavior' },
        { name: 'Visual Arts — Design', why: 'Shared design and visual communication skills' },
        { name: 'Supply Chain Management', why: 'Apparel supply chain and sourcing' }
      ],
      whatYouCanDo: ['Launch your own fashion label','Style celebrities and editorial shoots','Manage buying for major retailers','Lead sustainability for fashion brands','Forecast global fashion trends','Design costumes for film and theatre']
    },
    'child': {
      hero: 'assets/images/professions/prof_child_dev.png',
      title: 'Child Development & Family Studies',
      tagline: 'Strengthening Families & Empowering Communities',
      overview: 'Child development and family studies professionals shape the lives of children and families through counseling, education, policy, and advocacy. Whether pursuing B-K teacher licensure or family relations, you\'ll make a lasting impact on community well-being.',
      blsSalary: 52000, blsGrowth: 8, blsEmployment: 44200, nationalMedian: 48060,
      careers: [
        { title: 'Early Childhood Educator (B-K)', salary: '$40K – $65K', icon: '👶', desc: 'Teach and nurture children from birth to kindergarten in licensed programs.' },
        { title: 'Family & Marriage Therapist', salary: '$55K – $90K', icon: '💞', desc: 'Counsel families and couples through challenges. Requires graduate degree.' },
        { title: 'Child Life Specialist', salary: '$45K – $70K', icon: '🏥', desc: 'Help children cope with hospitalization and medical procedures.' },
        { title: 'Social Services Program Manager', salary: '$50K – $80K', icon: '📋', desc: 'Manage programs for families in need — WIC, Head Start, family shelters.' },
        { title: 'Child Advocacy & Policy Analyst', salary: '$50K – $85K', icon: '⚖️', desc: 'Shape public policy to protect children\'s rights and family welfare.' }
      ],
      images: ['assets/images/professions/prof_child_dev.png'],
      related: [
        { name: 'Psychology', why: 'Understanding child and adolescent development' },
        { name: 'Social Work', why: 'Family services and community advocacy' },
        { name: 'Elementary Education', why: 'Classroom teaching and curriculum design' }
      ],
      whatYouCanDo: ['Teach in preschool and kindergarten classrooms','Counsel families through difficult transitions','Direct childcare centers and early learning programs','Advocate for children in the foster care system','Design parenting education programs','Research child brain development and learning']
    },
    'aged': {
      hero: 'assets/images/professions/prof_ag_education.png',
      title: 'Agricultural Education',
      tagline: 'Inspiring the Next Generation of Agricultural Leaders',
      overview: 'Agricultural educators teach and inspire — in classrooms, communities, and Extension programs. Whether pursuing secondary teaching licensure or professional service, you\'ll connect people to the land and food systems that sustain us all.',
      blsSalary: 55000, blsGrowth: 4, blsEmployment: 35000, nationalMedian: 48060,
      careers: [
        { title: 'High School Agriculture Teacher', salary: '$45K – $70K', icon: '📚', desc: 'Teach agriculture, FFA leadership, and career development in secondary schools.' },
        { title: 'Extension Agent', salary: '$45K – $75K', icon: '🌾', desc: 'Bring university research directly to farmers and communities through Cooperative Extension.' },
        { title: 'Agricultural Communications Specialist', salary: '$45K – $70K', icon: '📡', desc: 'Tell the story of agriculture through media, marketing, and public relations.' },
        { title: '4-H Program Coordinator', salary: '$40K – $60K', icon: '🍀', desc: 'Lead youth development programs in agriculture, STEM, and leadership.' },
        { title: 'Agricultural Policy Analyst', salary: '$55K – $90K', icon: '📊', desc: 'Analyze and shape farm policy, subsidies, and food system legislation.' }
      ],
      images: ['assets/images/professions/prof_ag_education.png'],
      related: [
        { name: 'Elementary Education', why: 'Shared teaching pedagogy and licensure pathway' },
        { name: 'Agribusiness', why: 'Agricultural economics and farm management' },
        { name: 'Environmental Studies', why: 'Natural resource education and stewardship' }
      ],
      whatYouCanDo: ['Inspire students as a high school agriculture teacher','Lead 4-H and FFA youth development programs','Serve communities through Cooperative Extension','Develop agricultural curriculum and training materials','Advocate for agricultural policy at state and federal levels']
    },
    'agbm': {
      hero: 'assets/images/professions/prof_agribusiness.png',
      title: 'Agribusiness',
      tagline: 'Leading the Business of Agriculture & Food Systems',
      overview: 'Agribusiness professionals manage the economic engine of agriculture — from farm operations and supply chain logistics to agricultural finance and policy. This field combines business acumen with agricultural expertise to feed the world sustainably.',
      blsSalary: 68000, blsGrowth: 5, blsEmployment: 28000, nationalMedian: 48060,
      careers: [
        { title: 'Farm Business Manager', salary: '$55K – $95K', icon: '🏡', desc: 'Manage financial operations, marketing, and strategic planning for farm enterprises.' },
        { title: 'Agricultural Loan Officer', salary: '$55K – $90K', icon: '🏦', desc: 'Evaluate and approve agricultural loans for Farm Credit and commercial banks.' },
        { title: 'Commodity Trader', salary: '$65K – $150K+', icon: '📈', desc: 'Trade agricultural commodities on futures markets — grains, livestock, coffee.' },
        { title: 'Food Supply Chain Analyst', salary: '$55K – $85K', icon: '🚛', desc: 'Optimize food distribution networks from farm to grocery shelf.' },
        { title: 'Agricultural Sales Representative', salary: '$50K – $100K', icon: '🤝', desc: 'Sell seeds, equipment, technology, and crop protection to farmers.' }
      ],
      images: ['assets/images/professions/prof_agribusiness.png'],
      related: [
        { name: 'Finance', why: 'Agricultural finance and investment analysis' },
        { name: 'Supply Chain Management', why: 'Food supply chain logistics' },
        { name: 'Economics', why: 'Agricultural economics and market analysis' }
      ],
      whatYouCanDo: ['Manage multi-million dollar farm operations','Trade commodities on global markets','Lead agricultural finance at major banks','Optimize food supply chains','Start an agricultural technology company','Shape agricultural policy and trade agreements']
    },
    'envs': {
      hero: 'assets/images/professions/prof_environmental.png',
      title: 'Environmental Studies',
      tagline: 'Protecting Our Natural Resources for Future Generations',
      overview: 'Environmental scientists protect our air, water, soil, and ecosystems. From environmental impact assessments to conservation planning and sustainability consulting, this career puts you on the front lines of climate action.',
      blsSalary: 63980, blsGrowth: 6, blsEmployment: 32600, nationalMedian: 48060,
      careers: [
        { title: 'Environmental Consultant', salary: '$55K – $100K', icon: '📋', desc: 'Advise companies and governments on environmental compliance and sustainability.' },
        { title: 'Conservation Scientist', salary: '$55K – $85K', icon: '🌲', desc: 'Manage forests, rangelands, and natural resources for sustainable use.' },
        { title: 'Environmental Impact Analyst', salary: '$55K – $90K', icon: '📊', desc: 'Assess environmental effects of development projects under NEPA.' },
        { title: 'Sustainability Director', salary: '$70K – $130K', icon: '♻️', desc: 'Lead corporate sustainability programs and ESG reporting.' },
        { title: 'Water Resources Specialist', salary: '$60K – $95K', icon: '💧', desc: 'Manage water quality, watershed planning, and stormwater systems.' }
      ],
      images: ['assets/images/professions/prof_environmental.png'],
      related: [
        { name: 'Landscape Architecture', why: 'Green infrastructure and ecological design' },
        { name: 'Biological Engineering', why: 'Environmental remediation engineering' },
        { name: 'Biology', why: 'Ecology and conservation biology' }
      ],
      whatYouCanDo: ['Lead environmental impact assessments for major projects','Direct corporate sustainability programs','Manage national forests and wildlife refuges','Design wetland restoration projects','Consult on environmental compliance and permitting','Research climate change adaptation strategies']
    }
  };

  // Also map alternate keys
  DB['slfs'] = DB['envs'];
  DB['lab'] = DB['animal'];
  DB['cons'] = DB['fashion'];

  function matchKey(slug) {
    slug = (slug || '').toLowerCase();
    for (const k of Object.keys(DB)) { if (slug.includes(k)) return k; }
    return 'landscape';
  }

  const CAT_ICONS = {'course':'📘','field':'🌿','professional':'💼','community':'🤝','research':'🔬','certification':'🏆','award':'🏅','leadership':'👑'};
  const PHASE_CLR = ['#2d5016','#003366','#b8651a','#7b2d8e'];

  /* ══════════════════════════════════════════════════
     SVG CHART GENERATORS
     ══════════════════════════════════════════════════ */

  function salaryBarChart(profSalary, nationalMedian) {
    const max = Math.max(profSalary, nationalMedian) * 1.2;
    const pw = (profSalary / max) * 100;
    const nw = (nationalMedian / max) * 100;
    return `<svg viewBox="0 0 320 80" class="chart-svg">
      <text x="0" y="16" class="chart-label">This Profession</text>
      <rect x="105" y="4" width="${pw * 2}" height="18" rx="4" fill="#003366"/>
      <text x="${108 + pw * 2}" y="17" class="chart-val">$${(profSalary/1000).toFixed(0)}K</text>
      <text x="0" y="50" class="chart-label">National Median</text>
      <rect x="105" y="38" width="${nw * 2}" height="18" rx="4" fill="#94a3b8"/>
      <text x="${108 + nw * 2}" y="51" class="chart-val">$${(nationalMedian/1000).toFixed(0)}K</text>
      <text x="0" y="73" class="chart-label" fill="#22c55e" font-weight="900">+${(((profSalary - nationalMedian)/nationalMedian)*100).toFixed(0)}% above median</text>
    </svg>`;
  }

  function growthGauge(pct) {
    const r = 38; const c = 2 * Math.PI * r;
    const clr = pct >= 8 ? '#22c55e' : pct >= 4 ? '#FF9800' : '#ef4444';
    return `<svg viewBox="0 0 100 100" class="gauge-svg">
      <circle cx="50" cy="50" r="${r}" stroke="#e2e8f0" stroke-width="8" fill="none"/>
      <circle cx="50" cy="50" r="${r}" stroke="${clr}" stroke-width="8" fill="none"
        stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.min(pct,20)/20)}"
        stroke-linecap="round" transform="rotate(-90 50 50)"/>
      <text x="50" y="45" text-anchor="middle" font-size="18" font-weight="900" fill="#1a1a2e">${pct}%</text>
      <text x="50" y="60" text-anchor="middle" font-size="7" font-weight="700" fill="#94a3b8">10yr Growth</text>
    </svg>`;
  }

  function employmentStat(num) {
    const formatted = num >= 1000 ? `${(num/1000).toFixed(1)}K` : num.toString();
    return `<div class="emp-stat"><div class="emp-num">${formatted}</div><div class="emp-lbl">Jobs in the U.S.</div></div>`;
  }

  /* ══════════════════════════════════════════════════
     QR CODE (via API)
     ══════════════════════════════════════════════════ */
  function qrCodeImg(url, size = 200) {
    return `<img src="https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=003366&bgcolor=ffffff" alt="QR Code" class="qr-img" />`;
  }

  /* ══════════════════════════════════════════════════
     GENERATE REPORT
     ══════════════════════════════════════════════════ */

  function generate() {
    const timeline = EMMA_STATE.get('timeline');
    const branding = EMMA_STATE.get('branding');
    const program  = EMMA_STATE.get('currentProgram');
    const checked  = EMMA_STATE.get('checkedMilestones') || {};
    if (!timeline || !branding) { EMMA_MATRIX?.showToast('⚠️ Load a program first', 'error'); return; }

    const key  = matchKey(program);
    const prof = DB[key];
    const overall = EMMA_STATE.getOverallProgress();
    const totalMs = timeline.phases.reduce((s,p) => s + p.milestones.length, 0);
    const doneMs  = Object.values(checked).filter(Boolean).length;
    const today   = new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'});
    const circum  = 2 * Math.PI * 42;
    const ringClr = overall >= 75 ? '#22c55e' : overall >= 50 ? '#FF9800' : '#003366';

    // Career cards (top 5-6)
    const careerHTML = prof.careers.map((c, i) =>
      `<div class="cr-card">
        <div class="cr-rank">${c.icon}</div>
        <div class="cr-body">
          <div class="cr-title">${c.title}</div>
          <div class="cr-desc">${c.desc}</div>
          <div class="cr-sal">${c.salary}</div>
        </div>
      </div>`
    ).join('');

    // What you can do bullets
    const doHTML = prof.whatYouCanDo.map(d => `<li>${d}</li>`).join('');

    // Related majors
    const relHTML = prof.related.map(r =>
      `<div class="rel-card"><div class="rel-name">${r.name}</div><div class="rel-why">${r.why}</div></div>`
    ).join('');

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

    // Profession image gallery (for career paths page)
    const galleryImgs = prof.images || [prof.hero];
    const galleryHTML = galleryImgs.slice(0, 3).map(img =>
      `<img src="${img}" class="gal-img" alt="Career" onerror="this.style.display='none'" />`
    ).join('');

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>${prof.title} — Experiential Journey Map | NC A&T</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--b:#003366;--g:#FDB827;--t:#1a1a2e;--t2:#475569;--t3:#94a3b8;--bd:#e2e8f0;--bg:#f8fafc;--gr:#22c55e}
body{font-family:'Inter',sans-serif;color:var(--t);background:#fff;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:letter;margin:0}
.pg{page-break-after:always;min-height:100vh;position:relative;overflow:hidden}
.pg:last-child{page-break-after:auto}

/* ─── COVER ─── */
.cover{display:flex;flex-direction:column;justify-content:flex-end;min-height:100vh}
.cover-bg{position:absolute;inset:0;object-fit:cover;width:100%;height:100%;filter:brightness(0.3) saturate(1.2)}
.cover-ov{position:relative;z-index:2;padding:4rem 4rem 3.5rem;color:#fff}
.cover-bar{width:5rem;height:5px;background:var(--g);margin-bottom:1.5rem;border-radius:3px}
.cover-badge{font-size:0.6rem;font-weight:900;text-transform:uppercase;letter-spacing:0.35em;color:var(--g);margin-bottom:0.8rem}
.cover h1{font-size:3.2rem;font-weight:900;letter-spacing:-0.04em;line-height:1.1;max-width:32rem}
.cover .tag{font-size:1.05rem;font-weight:600;margin-top:0.6rem;opacity:0.85;max-width:30rem}
.cover-gold{position:absolute;bottom:0;left:0;right:0;height:8px;background:var(--g);z-index:3}
.cover-logo{position:absolute;top:2.5rem;right:3rem;z-index:3;text-align:right;color:rgba(255,255,255,0.9)}
.cover-logo .uni{font-size:0.65rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:var(--g)}
.cover-logo .sub{font-size:0.5rem;font-weight:600;opacity:0.7;margin-top:0.1rem}

/* ─── PAGE 2: DATA & CHARTS ─── */
.data-pg{padding:3rem 3.5rem}
.sec-badge{font-size:0.5rem;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:var(--g);background:var(--b);display:inline-block;padding:0.3rem 0.9rem;border-radius:4px;margin-bottom:0.6rem}
.sec-h2{font-size:1.6rem;font-weight:900;color:var(--b);margin-bottom:0.15rem;letter-spacing:-0.03em}
.sec-sub{font-size:0.78rem;color:var(--t2);font-weight:500;margin-bottom:1.5rem;max-width:34rem}
.ov-row{display:flex;gap:2rem;align-items:flex-start;margin-bottom:1.5rem}
.ov-img{width:280px;height:200px;border-radius:14px;object-fit:cover;flex-shrink:0;box-shadow:0 6px 30px rgba(0,0,0,0.12)}
.ov-txt{flex:1}.ov-txt p{font-size:0.82rem;color:var(--t2);font-weight:500;line-height:1.75}
.charts-row{display:flex;gap:1.25rem;margin-top:1.25rem}
.chart-box{flex:1;background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:1rem 1.25rem}
.chart-box .ch-title{font-size:0.55rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:var(--t3);margin-bottom:0.5rem}
.chart-svg{width:100%;height:auto}
.chart-label{font-size:7px;fill:var(--t2);font-weight:700}
.chart-val{font-size:8px;fill:var(--b);font-weight:900}
.gauge-svg{width:90px;height:90px;display:block;margin:0 auto}
.emp-stat{text-align:center;padding-top:0.5rem}
.emp-num{font-size:1.8rem;font-weight:900;color:var(--b)}
.emp-lbl{font-size:0.6rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:0.1em}
.do-section{margin-top:1.5rem;padding:1.25rem;background:var(--bg);border-radius:12px;border:1px solid var(--bd)}
.do-title{font-size:0.55rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:var(--b);margin-bottom:0.6rem}
.do-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.25rem}
.do-grid li{font-size:0.72rem;font-weight:600;color:var(--t2);list-style:none;padding:0.2rem 0;padding-left:1.2em;position:relative}
.do-grid li::before{content:'→';position:absolute;left:0;color:var(--g);font-weight:900}

/* ─── PAGE 3: CAREERS ─── */
.careers-pg{padding:3rem 3.5rem}
.cr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;margin-top:1rem}
.cr-card{display:flex;gap:0.75rem;align-items:flex-start;padding:0.9rem;border:1px solid var(--bd);border-radius:10px;background:#fff}
.cr-rank{font-size:1.5rem;flex-shrink:0;width:2.2rem;text-align:center}
.cr-body{flex:1;min-width:0}
.cr-title{font-size:0.8rem;font-weight:900;color:var(--b);margin-bottom:0.2rem}
.cr-desc{font-size:0.68rem;color:var(--t2);font-weight:500;line-height:1.5}
.cr-sal{font-size:0.65rem;font-weight:800;color:var(--gr);margin-top:0.3rem}
.gal-row{display:flex;gap:0.75rem;margin-top:1.5rem}
.gal-img{flex:1;height:140px;object-fit:cover;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.1)}

/* ─── PAGE 4: JOURNEY MAP ─── */
.map-pg{padding:3rem 3.5rem}
.map-prog{display:flex;align-items:center;gap:1.5rem;margin:1rem 0 1.5rem;padding:1rem 1.25rem;background:var(--bg);border-radius:12px;border:1px solid var(--bd)}
.ring{width:4.5rem;height:4.5rem;position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ring svg{position:absolute;width:100%;height:100%;transform:rotate(-90deg)}
.ring .pct{font-size:1.2rem;font-weight:900;color:var(--b)}
.prog-t .prog-big{font-size:1rem;font-weight:900;color:var(--b)}
.prog-t .prog-sm{font-size:0.65rem;color:var(--t2);font-weight:500}
.ph{margin-bottom:0.75rem;page-break-inside:avoid}
.ph-h{padding:0.5rem 0.8rem;border-radius:7px;margin-bottom:0.35rem}
.ph-r{display:flex;justify-content:space-between;align-items:center}
.ph-r h3{font-size:0.8rem;font-weight:900;text-transform:uppercase;letter-spacing:0.04em}
.ph-p{font-size:0.5rem;font-weight:800;color:#fff;padding:0.12rem 0.5rem;border-radius:20px}
.ph-d{font-size:0.55rem;color:var(--t2);margin-top:0.15rem;font-weight:500}
.ms-g{display:grid;grid-template-columns:1fr 1fr;gap:0.25rem}
.ms{display:flex;align-items:center;gap:0.3rem;padding:0.3rem 0.4rem;border:1px solid var(--bd);border-radius:4px;font-size:0.6rem}
.ms-d{background:#f0fdf4;border-color:#bbf7d0}
.ms-c{font-size:0.65rem;flex-shrink:0}.ms-i{font-size:0.6rem;flex-shrink:0}
.ms-t{display:flex;flex-direction:column;min-width:0}
.ms-l{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ms-cr{font-size:0.45rem;color:var(--t3);font-weight:600}

/* ─── PAGE 5: RELATED + QR ─── */
.rel-pg{padding:3rem 3.5rem}
.rel-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-top:0.8rem}
.rel-card{padding:0.8rem;border:2px solid var(--bd);border-radius:10px;transition:all 0.2s}
.rel-name{font-size:0.85rem;font-weight:900;color:var(--b)}
.rel-why{font-size:0.68rem;color:var(--t2);font-weight:500;margin-top:0.15rem}
.qr-section{margin-top:2rem;padding:2rem;background:linear-gradient(135deg,var(--b) 0%,#1a4d80 100%);border-radius:16px;display:flex;align-items:center;gap:2rem;color:#fff}
.qr-img{width:140px;height:140px;border-radius:10px;border:4px solid var(--g);flex-shrink:0}
.qr-txt h3{font-size:1.25rem;font-weight:900;margin-bottom:0.3rem}
.qr-txt p{font-size:0.8rem;font-weight:500;opacity:0.85;line-height:1.6}
.qr-txt .qr-url{font-size:0.9rem;font-weight:900;color:var(--g);margin-top:0.5rem;letter-spacing:0.05em}

/* ─── FOOTER ─── */
.rpt-ft{padding:1rem 3.5rem;border-top:5px solid var(--g);display:flex;justify-content:space-between;align-items:center;font-size:0.5rem;color:var(--t3);font-weight:600}
.rpt-ft .stamp{font-weight:900;color:var(--b);text-transform:uppercase;letter-spacing:0.12em;font-size:0.6rem}

/* ─── PRINT ─── */
@media print{.no-print{display:none!important}.ph{page-break-inside:avoid}}
.pbar{position:fixed;bottom:0;left:0;right:0;background:var(--b);padding:0.6rem 3rem;display:flex;justify-content:center;gap:1rem;z-index:100;box-shadow:0 -4px 20px rgba(0,0,0,0.3)}
.pbar button{padding:0.65rem 2rem;font-size:0.8rem;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;text-transform:uppercase;letter-spacing:0.1em}
.btn-p{background:var(--g);color:var(--b)}.btn-c{background:rgba(255,255,255,0.15);color:#fff}
</style></head><body>

<div class="pbar no-print">
  <button class="btn-p" onclick="window.print()">🖨️ Print / Save PDF</button>
  <button class="btn-c" onclick="window.close()">✕ Close</button>
</div>

<!-- PAGE 1: COVER -->
<div class="pg cover">
  <img src="${prof.hero}" class="cover-bg" alt="${prof.title}"/>
  <div class="cover-logo"><div class="uni">North Carolina A&T State University</div><div class="sub">College of Agriculture & Environmental Sciences</div></div>
  <div class="cover-ov">
    <div class="cover-bar"></div>
    <div class="cover-badge">Experiential Journey Map · EMMA Platform</div>
    <h1>${prof.title}</h1>
    <div class="tag">${prof.tagline}</div>
  </div>
  <div class="cover-gold"></div>
</div>

<!-- PAGE 2: DATA & CHARTS -->
<div class="pg data-pg">
  <div class="sec-badge">Career Overview</div>
  <h2 class="sec-h2">${prof.title}</h2>
  <p class="sec-sub">${prof.tagline}</p>
  <div class="ov-row">
    <img src="${prof.hero}" class="ov-img" alt="${prof.title}"/>
    <div class="ov-txt"><p>${prof.overview}</p></div>
  </div>
  <div class="charts-row">
    <div class="chart-box"><div class="ch-title">💰 Salary Comparison</div>${salaryBarChart(prof.blsSalary, prof.nationalMedian)}</div>
    <div class="chart-box"><div class="ch-title">📈 Job Growth</div>${growthGauge(prof.blsGrowth)}</div>
    <div class="chart-box"><div class="ch-title">🏢 Employment</div>${employmentStat(prof.blsEmployment)}</div>
  </div>
  <div class="do-section">
    <div class="do-title">🚀 What You Can Do With This Degree</div>
    <ul class="do-grid">${doHTML}</ul>
  </div>
</div>

<!-- PAGE 3: TOP CAREERS -->
<div class="pg careers-pg">
  <div class="sec-badge">What You Can Become</div>
  <h2 class="sec-h2">Top Career Paths in ${prof.title}</h2>
  <p class="sec-sub">Your degree opens doors to diverse, rewarding careers. Here are the top paths where NC A&T graduates are making an impact.</p>
  <div class="cr-grid">${careerHTML}</div>
  <div class="gal-row">${galleryHTML}</div>
</div>

<!-- PAGE 4: JOURNEY MAP -->
<div class="pg map-pg">
  <div class="sec-badge">Your Journey</div>
  <h2 class="sec-h2">Experiential Journey Map</h2>
  <p class="sec-sub">Track your progress across the four-phase experiential framework.</p>
  <div class="map-prog">
    <div class="ring">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" stroke="#e2e8f0" stroke-width="7" fill="none"/>
        <circle cx="50" cy="50" r="42" stroke="${ringClr}" stroke-width="7" fill="none" stroke-dasharray="${circum}" stroke-dashoffset="${circum*(1-overall/100)}" stroke-linecap="round"/>
      </svg>
      <span class="pct">${overall}%</span>
    </div>
    <div class="prog-t">
      <div class="prog-big">${doneMs} of ${totalMs} Milestones Completed</div>
      <div class="prog-sm">Generated ${today} · ${branding.programName || prof.title}</div>
    </div>
  </div>
  ${phasesHTML}
</div>

<!-- PAGE 5: RELATED FIELDS + QR -->
<div class="pg rel-pg">
  <div class="sec-badge">Explore Related Fields</div>
  <h2 class="sec-h2">Students Who Love ${prof.title} Also Explore</h2>
  <p class="sec-sub">Your interests connect to many fields. Consider a minor or double major in a related area to strengthen your career portfolio.</p>
  <div class="rel-grid">${relHTML}</div>

  <div class="qr-section">
    ${qrCodeImg('https://thinkemma.app')}
    <div class="qr-txt">
      <h3>Start Your Journey Today</h3>
      <p>Scan the QR code to open EMMA — your Experiential Major Mapping Assistant. Track your milestones, explore career paths, and build your experiential portfolio.</p>
      <div class="qr-url">thinkemma.app</div>
    </div>
  </div>

  <div class="rpt-ft" style="margin-top:3rem">
    <div><span class="stamp">Aggies Do! 💙💛</span> · Generated by EMMA — Experiential Major Mapping Assistant · ${today}</div>
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

console.log('[EMMA] Premium Magazine Report initialized');
