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
      ncatHistory: 'Founded in 2015, NC A&T\'s Landscape Architecture program is the only LAAB-accredited program at an HBCU in the nation. Born from the university\'s land-grant mission to serve communities, it prepares students to design equitable, sustainable environments. The program continues A&T\'s 130+ year legacy of empowering African Americans to shape the built world.',
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
      ncatHistory: 'NC A&T\'s Animal Science program traces its roots to the university\'s 1891 founding as a land-grant institution. The program has produced generations of veterinarians, animal nutritionists, and agricultural scientists. A&T\'s 600-acre University Farm provides hands-on learning that directly connects to the university\'s agricultural heritage.',
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
    },

    'acct': {
      hero: 'assets/images/professions/prof_economics.png',
      title: 'Accounting',
      tagline: 'The Language of Business & Financial Decision-Making',
      overview: 'Accountants are the backbone of every organization — tracking financial performance, ensuring compliance, and guiding strategic decisions. From Big Four firms to forensic investigation, accounting offers stability, upward mobility, and global demand. NC A&T\'s program is AACSB-accredited, the gold standard in business education.',
      blsSalary: 79880, blsGrowth: 6, blsEmployment: 1538400, nationalMedian: 48060,
      careers: [
        { title: 'Certified Public Accountant (CPA)', salary: '$65K – $120K', icon: '📊', desc: 'Audit financial statements, prepare taxes, and advise clients on financial strategy.' },
        { title: 'Forensic Accountant', salary: '$70K – $130K', icon: '🔍', desc: 'Investigate financial fraud, embezzlement, and white-collar crime for law enforcement and firms.' },
        { title: 'Tax Manager', salary: '$80K – $140K', icon: '🏛️', desc: 'Lead corporate tax planning, compliance, and strategy for organizations.' },
        { title: 'Internal Auditor', salary: '$65K – $110K', icon: '🛡️', desc: 'Evaluate internal controls, risk management, and operational efficiency.' },
        { title: 'Controller / CFO', salary: '$100K – $250K+', icon: '💼', desc: 'Oversee all financial operations, reporting, and strategy for an organization.' }
      ],
      images: [
        'assets/images/professions/prof_accounting.png',
        'assets/images/professions/prof_accounting_2.png',
        'assets/images/professions/prof_accounting_3.png',
        'assets/images/professions/prof_accounting_4.png'
      ],
      related: [
        { name: 'Finance', why: 'Complementary financial analysis and investment skills' },
        { name: 'Economics', why: 'Macroeconomic context for financial decision-making' },
        { name: 'Business Information Technology', why: 'Accounting information systems and ERP' }
      ],
      whatYouCanDo: ['Audit Fortune 500 companies at a Big Four firm','Investigate financial crimes for the FBI or SEC','Lead tax strategy for multinational corporations','Become CFO of a major company','Start your own accounting practice','Advise startups on financial planning and growth']
    },
    'fin': {
      hero: 'assets/images/professions/prof_economics.png',
      title: 'Finance',
      tagline: 'Managing Capital, Building Wealth & Driving Growth',
      overview: 'Finance professionals manage money — from personal wealth to global capital markets. Whether you pursue investment banking, corporate finance, or financial planning, this field offers lucrative careers in the engine of the global economy.',
      blsSalary: 96220, blsGrowth: 8, blsEmployment: 681700, nationalMedian: 48060,
      careers: [
        { title: 'Investment Banking Analyst', salary: '$85K – $200K+', icon: '🏦', desc: 'Advise corporations on mergers, acquisitions, and capital raising.' },
        { title: 'Financial Analyst', salary: '$65K – $110K', icon: '📈', desc: 'Evaluate investments, build financial models, and guide business decisions.' },
        { title: 'Wealth Manager / Financial Advisor', salary: '$60K – $150K+', icon: '💰', desc: 'Help individuals and families build and protect wealth through strategic planning.' },
        { title: 'Portfolio Manager', salary: '$90K – $200K+', icon: '📊', desc: 'Manage investment portfolios for institutional and private clients.' },
        { title: 'Risk Analyst', salary: '$70K – $120K', icon: '⚖️', desc: 'Identify and mitigate financial risks for banks and corporations.' }
      ],
      images: [
        'assets/images/professions/prof_finance.png',
        'assets/images/professions/prof_finance_2.png',
        'assets/images/professions/prof_finance_3.png',
        'assets/images/professions/prof_finance_4.png'
      ],
      related: [
        { name: 'Accounting', why: 'Financial statement analysis and audit foundations' },
        { name: 'Economics', why: 'Market theory and quantitative methods' },
        { name: 'Mathematics — Data Science', why: 'Quantitative finance and modeling' }
      ],
      whatYouCanDo: ['Trade on Wall Street at a top investment bank','Manage billion-dollar portfolios','Launch a financial advisory practice','Lead corporate finance at a Fortune 500 company','Analyze risk for global banks','Drive private equity and venture capital investments']
    },
    'econ': {
      hero: 'assets/images/professions/prof_economics.png',
      title: 'Economics',
      tagline: 'Understanding Markets, Policy & the Forces That Shape Our World',
      overview: 'Economists analyze data to understand how societies allocate resources, make decisions, and create prosperity. Whether in government policy, banking, consulting, or academia, economists are among the most sought-after analysts in the workforce.',
      blsSalary: 113940, blsGrowth: 6, blsEmployment: 21000, nationalMedian: 48060,
      careers: [
        { title: 'Economist', salary: '$80K – $150K', icon: '📉', desc: 'Research economic trends, forecast markets, and advise on policy.' },
        { title: 'Policy Analyst', salary: '$60K – $100K', icon: '🏛️', desc: 'Evaluate government programs and propose evidence-based policy solutions.' },
        { title: 'Data Analyst / Quantitative Researcher', salary: '$70K – $130K', icon: '📊', desc: 'Use statistical methods to extract insights from large datasets.' },
        { title: 'Management Consultant', salary: '$75K – $160K', icon: '💼', desc: 'Advise firms on strategy, operations, and market positioning.' },
        { title: 'Market Research Analyst', salary: '$55K – $95K', icon: '🔍', desc: 'Study consumer behavior and competitive landscapes to guide business strategy.' }
      ],
      images: [
        'assets/images/professions/prof_economics.png',
        'assets/images/professions/prof_economics_2.png',
        'assets/images/professions/prof_economics_3.png',
        'assets/images/professions/prof_economics_4.png'
      ],
      related: [
        { name: 'Finance', why: 'Applied financial economics and modeling' },
        { name: 'Mathematics — Applied', why: 'Quantitative and statistical foundations' },
        { name: 'Political Science', why: 'Public policy analysis and governance' }
      ],
      whatYouCanDo: ['Advise the Federal Reserve on monetary policy','Forecast markets for global investment firms','Lead economic research at think tanks','Consult for McKinsey, Deloitte, or BCG','Drive data-driven decision making at tech companies','Teach economics at universities']
    },
    'mgmt': {
      hero: 'assets/images/professions/prof_economics.png',
      title: 'Management',
      tagline: 'Leading People, Processes & Organizations to Excellence',
      overview: 'Management professionals lead teams, drive strategy, and build organizations. With concentrations in entrepreneurship and international business, NC A&T\'s program prepares leaders who can launch startups, manage global operations, and transform industries.',
      blsSalary: 102000, blsGrowth: 6, blsEmployment: 3452000, nationalMedian: 48060,
      careers: [
        { title: 'Operations Manager', salary: '$65K – $120K', icon: '⚙️', desc: 'Oversee daily operations, supply chains, and process improvements.' },
        { title: 'Entrepreneur / Business Owner', salary: '$50K – $500K+', icon: '🚀', desc: 'Launch and grow your own business — from tech startups to franchise operations.' },
        { title: 'Human Resources Manager', salary: '$65K – $130K', icon: '👥', desc: 'Lead talent acquisition, culture development, and employee engagement.' },
        { title: 'Project Manager', salary: '$70K – $130K', icon: '📋', desc: 'Plan, execute, and deliver projects on time and within budget.' },
        { title: 'Management Consultant', salary: '$75K – $160K', icon: '💡', desc: 'Advise organizations on strategy, structure, and performance improvement.' }
      ],
      images: [
        'assets/images/professions/prof_management.png',
        'assets/images/professions/prof_management_2.png',
        'assets/images/professions/prof_management_3.png',
        'assets/images/professions/prof_management_4.png'
      ],
      related: [
        { name: 'Marketing', why: 'Brand strategy and customer acquisition' },
        { name: 'Supply Chain Management', why: 'Operations and logistics integration' },
        { name: 'Accounting', why: 'Financial management and budgeting' }
      ],
      whatYouCanDo: ['Launch and scale your own startup','Lead operations at a Fortune 500 company','Manage international business teams','Drive organizational transformation as a consultant','Build corporate culture as an HR executive','Direct nonprofit or government agencies']
    },
    'bit': {
      hero: 'assets/images/professions/prof_economics.png',
      title: 'Business Information Technology',
      tagline: 'Bridging Business Strategy & Digital Innovation',
      overview: 'BIT professionals live at the intersection of business and technology — designing information systems, managing databases, leading digital transformation, and securing enterprise networks. In today\'s data-driven world, every industry needs tech-savvy business leaders.',
      blsSalary: 98740, blsGrowth: 10, blsEmployment: 482000, nationalMedian: 48060,
      careers: [
        { title: 'Business Systems Analyst', salary: '$65K – $110K', icon: '🔄', desc: 'Translate business needs into technology solutions and system designs.' },
        { title: 'IT Project Manager', salary: '$80K – $140K', icon: '📋', desc: 'Lead software development and technology implementation projects.' },
        { title: 'Database Administrator', salary: '$70K – $120K', icon: '🗄️', desc: 'Design, secure, and optimize enterprise database systems.' },
        { title: 'Cybersecurity Analyst', salary: '$75K – $130K', icon: '🔒', desc: 'Protect organizations from cyber threats and data breaches.' },
        { title: 'ERP Consultant', salary: '$80K – $150K', icon: '⚙️', desc: 'Implement and customize enterprise resource planning systems (SAP, Oracle).' }
      ],
      images: [
        'assets/images/professions/prof_info_tech.png',
        'assets/images/professions/prof_info_tech_2.png',
        'assets/images/professions/prof_info_tech_3.png',
        'assets/images/professions/prof_info_tech_4.png'
      ],
      related: [
        { name: 'Computer Science', why: 'Deeper programming and algorithm design' },
        { name: 'Information Technology', why: 'Infrastructure and network administration' },
        { name: 'Management', why: 'Leading technology-driven organizations' }
      ],
      whatYouCanDo: ['Lead digital transformation at major corporations','Design and implement enterprise software systems','Manage IT operations for global companies','Launch a tech consulting firm','Drive cybersecurity strategy for financial institutions','Architect cloud computing solutions']
    },
    'mktg': {
      hero: 'assets/images/professions/prof_economics.png',
      title: 'Marketing',
      tagline: 'Connecting Brands to People & Driving Market Impact',
      overview: 'Marketing professionals drive growth by understanding consumers, building brands, and creating compelling campaigns. With concentrations in professional selling and digital marketing, this field spans creative strategy, data analytics, and customer experience.',
      blsSalary: 76080, blsGrowth: 6, blsEmployment: 346900, nationalMedian: 48060,
      careers: [
        { title: 'Brand Manager', salary: '$70K – $130K', icon: '💎', desc: 'Build and manage brand identity, positioning, and growth strategy.' },
        { title: 'Digital Marketing Manager', salary: '$65K – $120K', icon: '📱', desc: 'Lead SEO, social media, content, and paid advertising campaigns.' },
        { title: 'Market Research Analyst', salary: '$55K – $95K', icon: '📊', desc: 'Analyze consumer data and competitive intelligence to guide strategy.' },
        { title: 'Sales Director', salary: '$80K – $180K+', icon: '🤝', desc: 'Lead sales teams and revenue growth for organizations.' },
        { title: 'Advertising Creative Director', salary: '$75K – $140K', icon: '🎨', desc: 'Lead creative campaigns across TV, digital, print, and experiential channels.' }
      ],
      images: [
        'assets/images/professions/prof_marketing.png',
        'assets/images/professions/prof_marketing_2.png',
        'assets/images/professions/prof_marketing_3.png',
        'assets/images/professions/prof_marketing_4.png'
      ],
      related: [
        { name: 'Visual Arts — Graphic Design', why: 'Design skills for brand and campaign visuals' },
        { name: 'Journalism — PR', why: 'Public relations and media strategy' },
        { name: 'Psychology', why: 'Consumer behavior and persuasion science' }
      ],
      whatYouCanDo: ['Lead brand strategy for Nike, Apple, or Coca-Cola','Launch viral digital marketing campaigns','Build a personal brand and consultancy','Drive sales for tech startups','Run advertising for a global agency','Analyze market trends for Fortune 500 companies']
    },
    'scm': {
      hero: 'assets/images/professions/prof_economics.png',
      title: 'Supply Chain Management',
      tagline: 'Moving the World\'s Products From Source to Shelf',
      overview: 'Supply chain professionals ensure products reach consumers efficiently — managing logistics, procurement, warehousing, and global distribution. In a world shaped by e-commerce and global trade, supply chain managers are critical to every industry.',
      blsSalary: 77520, blsGrowth: 18, blsEmployment: 218300, nationalMedian: 48060,
      careers: [
        { title: 'Supply Chain Manager', salary: '$70K – $130K', icon: '🚛', desc: 'Oversee end-to-end supply chain operations from sourcing to delivery.' },
        { title: 'Logistics Analyst', salary: '$55K – $90K', icon: '📦', desc: 'Optimize transportation routes, warehouse operations, and inventory management.' },
        { title: 'Procurement Manager', salary: '$70K – $120K', icon: '🤝', desc: 'Negotiate with suppliers and manage purchasing strategy for organizations.' },
        { title: 'Operations Research Analyst', salary: '$75K – $130K', icon: '📈', desc: 'Use data and mathematical models to improve operational efficiency.' },
        { title: 'Global Trade Compliance Specialist', salary: '$65K – $110K', icon: '🌍', desc: 'Navigate international trade regulations, tariffs, and import/export compliance.' }
      ],
      images: [
        'assets/images/professions/prof_supply_chain.png',
        'assets/images/professions/prof_supply_chain_2.png',
        'assets/images/professions/prof_supply_chain_3.png',
        'assets/images/professions/prof_supply_chain_4.png'
      ],
      related: [
        { name: 'Industrial Engineering', why: 'Process optimization and operations research' },
        { name: 'Management', why: 'Operations leadership and strategy' },
        { name: 'Business Information Technology', why: 'Supply chain technology systems' }
      ],
      whatYouCanDo: ['Manage global logistics for Amazon or FedEx','Optimize supply chains for automotive manufacturers','Lead procurement for government agencies','Drive sustainability in global supply chains','Launch a logistics consulting firm','Direct warehouse operations for e-commerce giants']
    },

    'coe-eng': {
      hero: 'assets/images/professions/prof_applied_eng.png',
      title: 'Engineering',
      tagline: 'Designing, Building & Innovating the Systems That Power Our World',
      overview: 'Engineers solve humanity\'s greatest challenges — designing bridges, developing software, creating biomedical devices, and building sustainable infrastructure. NC A&T\'s College of Engineering is the #1 producer of African American engineers in the nation, with ABET-accredited programs across nine disciplines.',
      blsSalary: 105100, blsGrowth: 7, blsEmployment: 1700000, nationalMedian: 48060,
      careers: [
        { title: 'Software Engineer', salary: '$85K – $180K+', icon: '💻', desc: 'Design, develop, and maintain software systems and applications.' },
        { title: 'Mechanical Engineer', salary: '$75K – $130K', icon: '⚙️', desc: 'Design mechanical systems — from engines and robotics to HVAC and manufacturing equipment.' },
        { title: 'Electrical Engineer', salary: '$80K – $140K', icon: '⚡', desc: 'Design electrical systems, power grids, semiconductors, and electronic devices.' },
        { title: 'Civil/Structural Engineer', salary: '$75K – $125K', icon: '🌉', desc: 'Design bridges, highways, buildings, and water systems that keep society running.' },
        { title: 'Biomedical Engineer', salary: '$80K – $140K', icon: '🦾', desc: 'Develop medical devices, prosthetics, and healthcare technology.' },
        { title: 'AI / Machine Learning Engineer', salary: '$100K – $250K+', icon: '🤖', desc: 'Build intelligent systems that learn, reason, and automate complex tasks.' }
      ],
      images: [
        'assets/images/professions/prof_applied_eng.png',
        'assets/images/professions/prof_applied_eng_2.png',
        'assets/images/professions/prof_applied_eng_3.png',
        'assets/images/professions/prof_applied_eng_4.png'
      ],
      related: [
        { name: 'Computer Science', why: 'Software and algorithm design' },
        { name: 'Mathematics — Applied', why: 'Advanced calculus, linear algebra, and modeling' },
        { name: 'Physics', why: 'Fundamental science driving engineering innovation' }
      ],
      whatYouCanDo: ['Design autonomous vehicles at Tesla or Google','Build bridges and infrastructure that last 100 years','Develop life-saving medical devices','Create AI systems that transform industries','Launch an engineering consulting firm','Lead R&D at NASA, Boeing, or Lockheed Martin','Design sustainable energy systems','Build the next generation of microprocessors']
    },
    'cs': {
      hero: 'assets/images/professions/prof_electronics.png',
      title: 'Computer Science',
      tagline: 'Building the Software That Runs the World',
      overview: 'Computer scientists design algorithms, build software systems, and push the boundaries of what\'s computationally possible. From Silicon Valley startups to cybersecurity, CS graduates are among the most in-demand professionals in the global economy.',
      blsSalary: 136620, blsGrowth: 23, blsEmployment: 1847900, nationalMedian: 48060,
      careers: [
        { title: 'Software Developer', salary: '$85K – $180K+', icon: '💻', desc: 'Design and build applications, APIs, and distributed systems.' },
        { title: 'Cybersecurity Engineer', salary: '$90K – $160K', icon: '🔒', desc: 'Protect systems and data from cyber threats and attacks.' },
        { title: 'Data Scientist', salary: '$90K – $170K', icon: '📊', desc: 'Extract insights from massive datasets using statistics and machine learning.' },
        { title: 'Cloud Architect', salary: '$100K – $180K+', icon: '☁️', desc: 'Design scalable cloud infrastructure on AWS, Azure, or GCP.' },
        { title: 'Full-Stack Developer', salary: '$80K – $160K', icon: '🔧', desc: 'Build complete web applications — frontend, backend, and database.' },
        { title: 'AI Research Scientist', salary: '$120K – $300K+', icon: '🧠', desc: 'Advance the frontier of artificial intelligence and machine learning.' }
      ],
      images: [
        'assets/images/professions/prof_computer_science.png',
        'assets/images/professions/prof_computer_science_2.png',
        'assets/images/professions/prof_computer_science_3.png',
        'assets/images/professions/prof_computer_science_4.png'
      ],
      related: [
        { name: 'Computer Engineering', why: 'Hardware-software integration' },
        { name: 'Mathematics — Data Science', why: 'Statistical modeling and algorithms' },
        { name: 'Artificial Intelligence (CoE)', why: 'Applied AI and deep learning' }
      ],
      whatYouCanDo: ['Build products at Google, Apple, or Meta','Launch a tech startup','Lead cybersecurity for federal agencies','Create the next breakthrough AI system','Architect cloud platforms serving billions','Develop video games and interactive media']
    },
    'ise': {
      hero: 'assets/images/professions/prof_applied_eng.png',
      title: 'Industrial & Systems Engineering',
      tagline: 'Optimizing Complex Systems for Maximum Efficiency',
      overview: 'Industrial engineers make systems work better — optimizing manufacturing, healthcare delivery, supply chains, and business processes. ISE is the most versatile engineering discipline, blending technical skills with business and human factors.',
      blsSalary: 95300, blsGrowth: 12, blsEmployment: 310000, nationalMedian: 48060,
      careers: [
        { title: 'Process Improvement Engineer', salary: '$70K – $120K', icon: '📈', desc: 'Apply Lean and Six Sigma methodologies to eliminate waste and improve quality.' },
        { title: 'Supply Chain Engineer', salary: '$70K – $120K', icon: '🚛', desc: 'Design and optimize logistics, inventory, and distribution networks.' },
        { title: 'Quality Engineer', salary: '$65K – $110K', icon: '✅', desc: 'Ensure products meet specifications through statistical quality control.' },
        { title: 'Healthcare Systems Engineer', salary: '$75K – $130K', icon: '🏥', desc: 'Optimize hospital workflows, patient flow, and healthcare delivery systems.' },
        { title: 'Operations Research Analyst', salary: '$80K – $140K', icon: '🧮', desc: 'Use mathematical modeling to solve complex organizational problems.' }
      ],
      images: [
        'assets/images/professions/prof_applied_eng.png',
        'assets/images/professions/prof_applied_eng_2.png',
        'assets/images/professions/prof_applied_eng_3.png',
        'assets/images/professions/prof_applied_eng_4.png'
      ],
      related: [
        { name: 'Supply Chain Management', why: 'Logistics and operations management' },
        { name: 'Computer Science', why: 'Simulation and optimization algorithms' },
        { name: 'Mathematics — Applied', why: 'Operations research and statistical modeling' }
      ],
      whatYouCanDo: ['Optimize manufacturing at Boeing or Toyota','Redesign hospital systems to save lives','Lead supply chain strategy for Amazon','Drive quality improvement at pharmaceutical companies','Consult on process optimization for Fortune 500 firms','Design smart factory systems']
    },

    'nurs': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Nursing',
      tagline: 'Healing, Advocating & Leading in Healthcare',
      overview: 'Nurses are the backbone of healthcare — providing direct patient care, advocating for health equity, and leading clinical teams. NC A&T\'s BSN program prepares you for licensure and a career that\'s always in demand. Nursing offers one of the fastest paths to a stable, meaningful career.',
      blsSalary: 81220, blsGrowth: 6, blsEmployment: 3175390, nationalMedian: 48060,
      careers: [
        { title: 'Registered Nurse (RN)', salary: '$60K – $95K', icon: '🩺', desc: 'Provide direct patient care in hospitals, clinics, and community health settings.' },
        { title: 'Nurse Practitioner (NP)', salary: '$120K – $170K', icon: '👩‍⚕️', desc: 'Diagnose, treat, and prescribe as an advanced practice provider. Requires MSN.' },
        { title: 'ICU / Critical Care Nurse', salary: '$70K – $110K', icon: '🫀', desc: 'Care for critically ill patients in intensive care and trauma units.' },
        { title: 'Public Health Nurse', salary: '$55K – $85K', icon: '🌍', desc: 'Promote community health, disease prevention, and health education.' },
        { title: 'Nurse Educator', salary: '$75K – $110K', icon: '📚', desc: 'Teach the next generation of nurses in academic and clinical settings.' },
        { title: 'Nurse Anesthetist (CRNA)', salary: '$190K – $250K+', icon: '💉', desc: 'Administer anesthesia for surgical procedures. Among the highest-paid nursing roles.' }
      ],
      images: [
        'assets/images/professions/prof_nursing.png',
        'assets/images/professions/prof_nursing_2.png',
        'assets/images/professions/prof_nursing_3.png',
        'assets/images/professions/prof_nursing_4.png'
      ],
      related: [
        { name: 'Biology — Pre-Med', why: 'Shared science foundation for healthcare careers' },
        { name: 'Psychology', why: 'Patient mental health and behavioral health' },
        { name: 'Health Services Management', why: 'Healthcare administration and leadership' }
      ],
      whatYouCanDo: ['Save lives in emergency rooms and ICUs','Become a nurse practitioner with prescribing authority','Serve underserved communities through public health nursing','Specialize in pediatrics, oncology, or cardiac care','Teach at nursing schools and mentor students','Lead nursing units and shape hospital policy']
    },
    'slpa': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Speech-Language Pathology & Audiology',
      tagline: 'Restoring Voices, Hearing & Communication Across the Lifespan',
      overview: 'Speech-language pathologists and audiologists help people communicate, swallow, and hear. From pediatric therapy to stroke rehabilitation, this field combines science with compassion to transform lives.',
      blsSalary: 84140, blsGrowth: 19, blsEmployment: 168000, nationalMedian: 48060,
      careers: [
        { title: 'Speech-Language Pathologist', salary: '$65K – $105K', icon: '🗣️', desc: 'Assess and treat speech, language, and swallowing disorders.' },
        { title: 'Audiologist', salary: '$80K – $120K', icon: '👂', desc: 'Diagnose and treat hearing and balance disorders. Requires AuD.' },
        { title: 'Pediatric SLP', salary: '$60K – $95K', icon: '👶', desc: 'Help children with speech delays, autism, and language disorders.' },
        { title: 'Medical SLP', salary: '$70K – $110K', icon: '🏥', desc: 'Treat swallowing disorders and communication after stroke or brain injury.' },
        { title: 'School-Based SLP', salary: '$55K – $85K', icon: '🏫', desc: 'Provide speech therapy services in K-12 schools.' }
      ],
      images: [
        'assets/images/professions/prof_speech_path.png',
        'assets/images/professions/prof_speech_path_2.png',
        'assets/images/professions/prof_speech_path_3.png',
        'assets/images/professions/prof_speech_path_4.png'
      ],
      related: [
        { name: 'Psychology', why: 'Cognitive and developmental science' },
        { name: 'Nursing', why: 'Patient care and medical terminology' },
        { name: 'Elementary Education', why: 'Working with children in school settings' }
      ],
      whatYouCanDo: ['Help children find their voices','Rehabilitate stroke patients\' communication abilities','Fit and program hearing aids and cochlear implants','Work in hospitals, schools, or private practice','Specialize in accent modification or voice therapy','Research new treatments for communication disorders']
    },
    'comm': {
      hero: 'assets/images/professions/prof_comm_studies.png',
      title: 'Communication Studies',
      tagline: 'Mastering the Art of Persuasion, Media & Human Connection',
      overview: 'Communication professionals shape how messages are crafted, delivered, and received — from corporate PR to political campaigns, social media strategy, and interpersonal dynamics. Strong communicators are essential in every industry.',
      blsSalary: 62800, blsGrowth: 6, blsEmployment: 410000, nationalMedian: 48060,
      careers: [
        { title: 'Public Relations Specialist', salary: '$50K – $90K', icon: '📢', desc: 'Manage brand reputation and media relationships for organizations.' },
        { title: 'Corporate Communications Manager', salary: '$70K – $120K', icon: '💼', desc: 'Lead internal and external communications strategy for companies.' },
        { title: 'Media Planner / Buyer', salary: '$50K – $85K', icon: '📺', desc: 'Plan and purchase advertising across TV, digital, and social channels.' },
        { title: 'Event / Campaign Manager', salary: '$55K – $95K', icon: '🎯', desc: 'Organize events, product launches, and political or advocacy campaigns.' },
        { title: 'Human Resources Specialist', salary: '$55K – $85K', icon: '👥', desc: 'Use communication skills in employee relations, training, and development.' }
      ],
      images: ['assets/images/professions/prof_communications.png'],
      related: [
        { name: 'Journalism & Mass Communication', why: 'Media production and storytelling' },
        { name: 'Marketing', why: 'Brand communication and advertising' },
        { name: 'Political Science', why: 'Political communication and public affairs' }
      ],
      whatYouCanDo: ['Lead PR for major corporations','Manage political campaigns','Direct corporate communications','Build social media empires','Train executives in public speaking','Produce documentaries and media content']
    },
    'kin': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Kinesiology',
      tagline: 'The Science of Human Movement, Performance & Wellness',
      overview: 'Kinesiology professionals study human movement to improve health, athletic performance, and rehabilitation. With concentrations in exercise science, recreational sport management, and pre-physical therapy, this field offers paths to healthcare, sports, and wellness careers.',
      blsSalary: 51350, blsGrowth: 14, blsEmployment: 380000, nationalMedian: 48060,
      careers: [
        { title: 'Physical Therapist', salary: '$90K – $130K', icon: '🏃', desc: 'Help patients recover from injuries and improve mobility. Requires DPT.' },
        { title: 'Athletic Trainer', salary: '$50K – $70K', icon: '⚕️', desc: 'Prevent and treat athletic injuries for teams and sports organizations.' },
        { title: 'Exercise Physiologist', salary: '$47K – $68K', icon: '❤️', desc: 'Design exercise programs for cardiac rehab and chronic disease management.' },
        { title: 'Strength & Conditioning Coach', salary: '$45K – $85K', icon: '💪', desc: 'Train athletes to maximize performance and prevent injury.' },
        { title: 'Sports Medicine Physician', salary: '$200K – $350K+', icon: '🩺', desc: 'Diagnose and treat sports injuries. Requires MD/DO.' },
        { title: 'Recreation & Sports Manager', salary: '$50K – $85K', icon: '🏟️', desc: 'Manage sports facilities, recreation programs, and athletic departments.' }
      ],
      images: [
        'assets/images/professions/prof_kinesiology.png',
        'assets/images/professions/prof_kinesiology_2.png',
        'assets/images/professions/prof_kinesiology_3.png',
        'assets/images/professions/prof_kinesiology_4.png'
      ],
      related: [
        { name: 'Biology — Pre-Med', why: 'Pre-medical foundation for PT and MD paths' },
        { name: 'Nursing', why: 'Patient care and clinical health' },
        { name: 'Psychology', why: 'Sport psychology and mental health' }
      ],
      whatYouCanDo: ['Help patients walk again as a physical therapist','Train professional athletes as a strength coach','Work with Olympic teams','Manage athletic departments at universities','Design cardiac rehabilitation programs','Open a sports performance training center']
    },
    'hsm': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Health Services Management',
      tagline: 'Leading Healthcare Organizations to Serve Communities Better',
      overview: 'Health services managers lead hospitals, clinics, public health agencies, and insurance companies. This field combines business management with healthcare expertise to improve access, quality, and efficiency of care delivery.',
      blsSalary: 104830, blsGrowth: 28, blsEmployment: 480700, nationalMedian: 48060,
      careers: [
        { title: 'Hospital Administrator', salary: '$80K – $150K+', icon: '🏥', desc: 'Oversee hospital operations, finances, and strategic planning.' },
        { title: 'Health Informatics Manager', salary: '$75K – $130K', icon: '💻', desc: 'Manage electronic health records and health data systems.' },
        { title: 'Public Health Program Manager', salary: '$60K – $100K', icon: '🌍', desc: 'Design and manage community health programs and disease prevention initiatives.' },
        { title: 'Healthcare Consultant', salary: '$70K – $140K', icon: '📊', desc: 'Advise healthcare organizations on operational improvement and strategy.' },
        { title: 'Insurance / Managed Care Director', salary: '$80K – $140K', icon: '🛡️', desc: 'Manage health insurance programs, claims, and provider networks.' }
      ],
      images: ['assets/images/professions/prof_health_mgmt.png'],
      related: [
        { name: 'Management', why: 'Business leadership and organizational strategy' },
        { name: 'Nursing', why: 'Clinical operations understanding' },
        { name: 'Business Information Technology', why: 'Health informatics and data systems' }
      ],
      whatYouCanDo: ['Run hospitals and health systems','Lead public health agencies','Direct quality improvement in healthcare','Manage health insurance operations','Consult for healthcare organizations worldwide','Shape health policy at the federal level']
    },
    'psych': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Psychology',
      tagline: 'Understanding the Human Mind & Transforming Lives',
      overview: 'Psychology is the scientific study of behavior and mental processes. From clinical therapy to industrial-organizational consulting, research, and forensic analysis, psychologists apply the science of the mind to solve real-world problems.',
      blsSalary: 85330, blsGrowth: 6, blsEmployment: 192000, nationalMedian: 48060,
      careers: [
        { title: 'Clinical Psychologist', salary: '$80K – $130K', icon: '🧠', desc: 'Diagnose and treat mental health disorders. Requires doctoral degree.' },
        { title: 'School Psychologist', salary: '$65K – $100K', icon: '🏫', desc: 'Support students\' mental health, learning, and behavioral needs in schools.' },
        { title: 'Industrial-Organizational Psychologist', salary: '$95K – $160K', icon: '💼', desc: 'Apply psychology to workplace performance, hiring, and employee well-being.' },
        { title: 'Forensic Psychologist', salary: '$70K – $120K', icon: '⚖️', desc: 'Apply psychology to legal matters — criminal profiling, competency evaluations.' },
        { title: 'Research Psychologist', salary: '$60K – $100K', icon: '🔬', desc: 'Conduct experiments and studies to advance understanding of human behavior.' },
        { title: 'Licensed Counselor', salary: '$50K – $80K', icon: '💬', desc: 'Provide therapy for individuals, couples, and families. Requires master\'s.' }
      ],
      images: [
        'assets/images/professions/prof_psychology.png',
        'assets/images/professions/prof_psychology_2.png',
        'assets/images/professions/prof_psychology_3.png',
        'assets/images/professions/prof_psychology_4.png'
      ],
      related: [
        { name: 'Social Work', why: 'Community mental health and counseling' },
        { name: 'Criminal Justice', why: 'Forensic psychology and behavioral analysis' },
        { name: 'Biology', why: 'Neuroscience and biopsychology research' }
      ],
      whatYouCanDo: ['Help people overcome anxiety, depression, and trauma','Profile criminals for the FBI','Improve workplace culture as an I-O psychologist','Conduct groundbreaking brain research','Support students as a school psychologist','Provide expert testimony in court cases']
    },
    'soc': {
      hero: 'assets/images/professions/prof_sociology.png',
      title: 'Sociology',
      tagline: 'Analyzing Society & Driving Social Change',
      overview: 'Sociologists study how societies function, examining inequality, culture, institutions, and social movements. This analytical discipline prepares you for careers in research, policy, social services, and community organizing.',
      blsSalary: 59230, blsGrowth: 4, blsEmployment: 3400, nationalMedian: 48060,
      careers: [
        { title: 'Social Research Analyst', salary: '$50K – $85K', icon: '📊', desc: 'Design and conduct research studies on social issues and trends.' },
        { title: 'Community Organizer', salary: '$40K – $65K', icon: '✊', desc: 'Mobilize communities around shared goals — housing, education, justice.' },
        { title: 'Policy Research Associate', salary: '$50K – $80K', icon: '🏛️', desc: 'Analyze social policy and propose evidence-based solutions.' },
        { title: 'Diversity & Inclusion Manager', salary: '$65K – $110K', icon: '🌈', desc: 'Lead corporate diversity, equity, and inclusion programs.' },
        { title: 'Survey Researcher', salary: '$55K – $90K', icon: '📋', desc: 'Design and analyze surveys for research organizations, polls, and censuses.' }
      ],
      images: ['assets/images/professions/prof_sociology.png'],
      related: [
        { name: 'Social Work', why: 'Applied community advocacy and services' },
        { name: 'Political Science', why: 'Public policy and governance analysis' },
        { name: 'Criminal Justice', why: 'Criminology and social deviance' }
      ],
      whatYouCanDo: ['Research inequality for think tanks and universities','Lead DEI programs at major corporations','Organize communities for social justice','Analyze census and demographic data','Advocate for policy change at all levels of government','Direct nonprofit organizations']
    },
    'sw': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Social Work',
      tagline: 'Empowering Individuals, Families & Communities',
      overview: 'Social workers are frontline advocates for vulnerable populations — children, families, veterans, and communities in crisis. Whether in clinical therapy, child welfare, or hospital settings, social workers create lasting change.',
      blsSalary: 55350, blsGrowth: 7, blsEmployment: 708100, nationalMedian: 48060,
      careers: [
        { title: 'Clinical Social Worker (LCSW)', salary: '$55K – $90K', icon: '💬', desc: 'Provide therapy and counseling for mental health and substance abuse. Requires MSW.' },
        { title: 'Child Welfare Specialist', salary: '$40K – $65K', icon: '👶', desc: 'Protect children from abuse and neglect; manage foster care placements.' },
        { title: 'School Social Worker', salary: '$45K – $70K', icon: '🏫', desc: 'Support students\' social-emotional needs and connect families to resources.' },
        { title: 'Hospital Social Worker', salary: '$50K – $75K', icon: '🏥', desc: 'Help patients and families navigate healthcare, insurance, and discharge planning.' },
        { title: 'Community Development Coordinator', salary: '$45K – $70K', icon: '🤝', desc: 'Build programs to address housing, employment, and community health needs.' }
      ],
      images: [
        'assets/images/professions/prof_social_work.png',
        'assets/images/professions/prof_social_work_2.png',
        'assets/images/professions/prof_social_work_3.png',
        'assets/images/professions/prof_social_work_4.png'
      ],
      related: [
        { name: 'Psychology', why: 'Clinical therapy and behavioral science' },
        { name: 'Sociology', why: 'Understanding social systems and inequality' },
        { name: 'Criminal Justice', why: 'Juvenile justice and reentry programs' }
      ],
      whatYouCanDo: ['Counsel individuals and families through crisis','Protect children in the foster care system','Support veterans transitioning to civilian life','Help patients navigate the healthcare system','Lead community development programs','Advocate for social justice and policy reform']
    },

    'cj': {
      hero: 'assets/images/professions/prof_sociology.png',
      title: 'Criminal Justice',
      tagline: 'Protecting Communities & Pursuing Justice',
      overview: 'Criminal justice professionals protect communities, investigate crimes, manage correctional systems, and shape public safety policy. From FBI special agents to juvenile justice advocates, this field offers diverse paths in law enforcement, courts, and corrections.',
      blsSalary: 64610, blsGrowth: 3, blsEmployment: 875000, nationalMedian: 48060,
      careers: [
        { title: 'FBI / Federal Agent', salary: '$70K – $140K', icon: '🕵️', desc: 'Investigate federal crimes — terrorism, cybercrime, organized crime, and civil rights violations.' },
        { title: 'Homicide Detective', salary: '$60K – $100K', icon: '🔍', desc: 'Investigate violent crimes and lead criminal investigations for police departments.' },
        { title: 'Probation / Parole Officer', salary: '$45K – $70K', icon: '⚖️', desc: 'Supervise offenders in the community and help them reintegrate into society.' },
        { title: 'Crime Analyst', salary: '$50K – $85K', icon: '📊', desc: 'Analyze crime patterns and data to support law enforcement strategy.' },
        { title: 'Juvenile Justice Counselor', salary: '$40K – $60K', icon: '👦', desc: 'Counsel at-risk youth and manage juvenile diversion programs.' },
        { title: 'Cybersecurity / Digital Forensics', salary: '$65K – $120K', icon: '💻', desc: 'Investigate digital crimes, recover evidence, and protect cyber infrastructure.' }
      ],
      images: [
        'assets/images/professions/prof_criminal_justice.png',
        'assets/images/professions/prof_criminal_justice_2.png',
        'assets/images/professions/prof_criminal_justice_3.png',
        'assets/images/professions/prof_criminal_justice_4.png'
      ],
      related: [
        { name: 'Sociology', why: 'Criminology and social deviance' },
        { name: 'Psychology', why: 'Criminal behavior and forensic psychology' },
        { name: 'Political Science', why: 'Public policy and governance' }
      ],
      whatYouCanDo: ['Become an FBI or DEA special agent','Investigate crimes as a detective','Lead community policing initiatives','Analyze crime data for major cities','Advocate for criminal justice reform','Manage correctional facilities and reentry programs']
    },
    'eng': {
      hero: 'assets/images/professions/prof_english.png',
      title: 'English',
      tagline: 'Mastering Language, Literature & the Power of Words',
      overview: 'English majors develop superior skills in writing, critical thinking, and communication — assets valued in every industry. With concentrations in African American literature, creative writing, technical writing, and professional writing, this degree opens doors to publishing, education, media, and beyond.',
      blsSalary: 69510, blsGrowth: 4, blsEmployment: 154200, nationalMedian: 48060,
      careers: [
        { title: 'Technical Writer', salary: '$60K – $100K', icon: '📝', desc: 'Create documentation, user guides, and technical content for technology companies.' },
        { title: 'Editor / Content Strategist', salary: '$55K – $95K', icon: '✏️', desc: 'Shape content strategy and editorial direction for publishers and brands.' },
        { title: 'Published Author / Novelist', salary: '$30K – $200K+', icon: '📖', desc: 'Write novels, poetry, essays, and creative nonfiction for publication.' },
        { title: 'UX Writer / Content Designer', salary: '$70K – $120K', icon: '💻', desc: 'Craft the words inside apps and digital products for intuitive user experience.' },
        { title: 'Communications Director', salary: '$65K – $120K', icon: '📢', desc: 'Lead communications strategy for organizations, nonprofits, and government.' },
        { title: 'College Professor', salary: '$60K – $110K', icon: '🎓', desc: 'Teach literature and writing at the university level. Requires graduate degree.' }
      ],
      images: ['assets/images/professions/prof_english.png'],
      related: [
        { name: 'Journalism & Mass Communication', why: 'Media writing and storytelling' },
        { name: 'Liberal Studies', why: 'Interdisciplinary humanities foundation' },
        { name: 'Theatre Arts', why: 'Creative writing and dramatic literature' }
      ],
      whatYouCanDo: ['Publish novels, poetry, and creative work','Lead communications for major organizations','Write for film, TV, and streaming platforms','Create content strategy for tech companies','Teach literature at universities','Edit manuscripts for publishing houses']
    },
    'hist': {
      hero: 'assets/images/professions/prof_history.png',
      title: 'History',
      tagline: 'Understanding the Past to Shape a Better Future',
      overview: 'Historians research, analyze, and interpret the past to inform the present. From museum curation to policy research, archival science, and education, history graduates bring critical analysis and context to every challenge.',
      blsSalary: 63940, blsGrowth: 3, blsEmployment: 36500, nationalMedian: 48060,
      careers: [
        { title: 'Museum Curator / Director', salary: '$50K – $95K', icon: '🏛️', desc: 'Collect, preserve, and interpret artifacts and art for public education.' },
        { title: 'Archivist', salary: '$50K – $80K', icon: '📜', desc: 'Preserve historical documents, photographs, and records for research.' },
        { title: 'Policy Researcher', salary: '$55K – $90K', icon: '📊', desc: 'Analyze historical context for policy decisions at think tanks and government agencies.' },
        { title: 'Intelligence Analyst', salary: '$60K – $100K', icon: '🔍', desc: 'Analyze geopolitical and historical intelligence for government agencies.' },
        { title: 'Historic Preservation Specialist', salary: '$50K – $85K', icon: '🏰', desc: 'Protect and restore historic sites, buildings, and cultural landscapes.' }
      ],
      images: [
        'assets/images/professions/prof_history.png',
        'assets/images/professions/prof_history_2.png',
        'assets/images/professions/prof_history_3.png',
        'assets/images/professions/prof_history_4.png'
      ],
      related: [
        { name: 'Political Science', why: 'Government and political history' },
        { name: 'English', why: 'Research writing and critical analysis' },
        { name: 'Liberal Studies', why: 'Interdisciplinary humanities approach' }
      ],
      whatYouCanDo: ['Curate exhibitions at the Smithsonian','Preserve rare documents at the Library of Congress','Analyze intelligence for the CIA or State Department','Teach history at secondary or collegiate levels','Produce historical documentaries','Lead historic preservation of cultural sites']
    },
    'poli': {
      hero: 'assets/images/professions/prof_sociology.png',
      title: 'Political Science',
      tagline: 'Governing, Analyzing & Shaping the Political World',
      overview: 'Political scientists analyze government systems, political behavior, and public policy. Whether aiming for law school, public service, or policy research, this field prepares you to influence how power is exercised and justice is served.',
      blsSalary: 128020, blsGrowth: 6, blsEmployment: 7200, nationalMedian: 48060,
      careers: [
        { title: 'Attorney / Lawyer', salary: '$80K – $200K+', icon: '⚖️', desc: 'Represent clients in legal matters. Requires law school (JD).' },
        { title: 'Legislative Aide / Policy Advisor', salary: '$45K – $85K', icon: '🏛️', desc: 'Research legislation and advise elected officials on policy positions.' },
        { title: 'Campaign Manager', salary: '$50K – $100K', icon: '🗳️', desc: 'Manage political campaigns from local elections to presidential races.' },
        { title: 'Diplomat / Foreign Service Officer', salary: '$60K – $120K', icon: '🌍', desc: 'Represent U.S. interests abroad at embassies and the State Department.' },
        { title: 'Lobbyist / Government Relations', salary: '$65K – $160K+', icon: '🤝', desc: 'Advocate for organizations\' interests before lawmakers and regulators.' }
      ],
      images: [
        'assets/images/professions/prof_political_science.png',
        'assets/images/professions/prof_political_science_2.png',
        'assets/images/professions/prof_political_science_3.png',
        'assets/images/professions/prof_political_science_4.png'
      ],
      related: [
        { name: 'Criminal Justice', why: 'Law and justice system' },
        { name: 'History', why: 'Political and constitutional history' },
        { name: 'Economics', why: 'Public policy and economic governance' }
      ],
      whatYouCanDo: ['Practice law at a top firm','Run for elected office','Serve as a diplomat overseas','Manage national political campaigns','Shape legislation at the federal level','Analyze politics for major news networks']
    },
    'jmc': {
      hero: 'assets/images/professions/prof_comm_studies.png',
      title: 'Journalism & Mass Communication',
      tagline: 'Telling Stories That Inform, Inspire & Ignite Change',
      overview: 'JMC professionals create the content that shapes public opinion — from investigative journalism and broadcast news to multimedia production and public relations. NC A&T\'s ACEJMC-accredited program trains you across multimedia, PR, and production.',
      blsSalary: 57500, blsGrowth: 3, blsEmployment: 150000, nationalMedian: 48060,
      careers: [
        { title: 'Broadcast Journalist / News Anchor', salary: '$45K – $100K+', icon: '🎤', desc: 'Report and present news on TV, radio, and digital platforms.' },
        { title: 'Documentary Producer', salary: '$55K – $120K', icon: '🎬', desc: 'Create compelling documentaries for networks, streaming, and film festivals.' },
        { title: 'Public Relations Manager', salary: '$60K – $110K', icon: '📢', desc: 'Manage brand reputation, crisis communications, and media strategy.' },
        { title: 'Social Media Director', salary: '$55K – $100K', icon: '📱', desc: 'Lead social media strategy and content across platforms.' },
        { title: 'Investigative Reporter', salary: '$40K – $85K', icon: '🔍', desc: 'Uncover corruption, injustice, and wrongdoing through deep investigative work.' },
        { title: 'Multimedia Producer', salary: '$50K – $90K', icon: '🎥', desc: 'Create video, audio, and interactive content for digital platforms.' }
      ],
      images: [
        'assets/images/professions/prof_journalism.png',
        'assets/images/professions/prof_journalism_2.png',
        'assets/images/professions/prof_journalism_3.png',
        'assets/images/professions/prof_journalism_4.png'
      ],
      related: [
        { name: 'Communication Studies', why: 'Media theory and persuasion' },
        { name: 'English — Creative Writing', why: 'Storytelling and narrative craft' },
        { name: 'Visual Arts — Graphic Design', why: 'Visual media production' }
      ],
      whatYouCanDo: ['Anchor the evening news','Produce award-winning documentaries','Lead PR for global brands','Break investigative stories that change policy','Direct social media for celebrities and corporations','Create podcasts and digital media empires']
    },
    'lib': {
      hero: 'assets/images/professions/prof_liberal_studies.png',
      title: 'Liberal Studies',
      tagline: 'An Interdisciplinary Foundation for Any Career Path',
      overview: 'Liberal Studies offers a flexible, interdisciplinary education with concentrations in African American studies, activism & social change, and pre-law. This versatile degree develops critical thinking, writing, and analytical skills valued across industries.',
      blsSalary: 60000, blsGrowth: 5, blsEmployment: 200000, nationalMedian: 48060,
      careers: [
        { title: 'Paralegal / Pre-Law Professional', salary: '$45K – $70K', icon: '⚖️', desc: 'Assist attorneys with legal research, case preparation, and client communication.' },
        { title: 'Nonprofit Program Director', salary: '$50K – $90K', icon: '💜', desc: 'Lead programs for nonprofit organizations focused on social change.' },
        { title: 'Policy Analyst', salary: '$50K – $85K', icon: '📋', desc: 'Research and analyze public policy for think tanks and government agencies.' },
        { title: 'Community Engagement Manager', salary: '$45K – $75K', icon: '🤝', desc: 'Build relationships between organizations and diverse communities.' },
        { title: 'Grant Writer', salary: '$45K – $75K', icon: '✍️', desc: 'Write compelling grant proposals to secure funding for organizations.' }
      ],
      images: ['assets/images/professions/prof_liberal_studies.png'],
      related: [
        { name: 'History', why: 'Historical analysis and research' },
        { name: 'English', why: 'Writing and critical thinking' },
        { name: 'Political Science', why: 'Policy and governance studies' }
      ],
      whatYouCanDo: ['Enter law school with a strong analytical foundation','Lead social justice organizations','Write grants that fund community programs','Manage nonprofit organizations','Research policy for think tanks','Advocate for equity and social change']
    },
    'art': {
      hero: 'assets/images/professions/prof_comp_graphics.png',
      title: 'Visual Arts',
      tagline: 'Creating the Visual World Around Us',
      overview: 'Visual arts professionals design the visual world — from graphic design and branding to fine art, gallery curation, and digital media. With concentrations in design and graphic design, NC A&T\'s program builds both creative and technical skills.',
      blsSalary: 57990, blsGrowth: 3, blsEmployment: 266500, nationalMedian: 48060,
      careers: [
        { title: 'Graphic Designer', salary: '$45K – $80K', icon: '🎨', desc: 'Create visual content — logos, branding, packaging, and digital media.' },
        { title: 'Art Director', salary: '$70K – $130K', icon: '🖼️', desc: 'Lead visual direction for advertising agencies, magazines, and media companies.' },
        { title: 'UI/UX Designer', salary: '$65K – $120K', icon: '📱', desc: 'Design intuitive digital interfaces for apps and websites.' },
        { title: 'Motion Graphics Designer', salary: '$55K – $95K', icon: '🎬', desc: 'Create animated visual content for film, TV, and digital platforms.' },
        { title: 'Gallery Director / Curator', salary: '$45K – $85K', icon: '🏛️', desc: 'Manage art galleries and curate exhibitions for public engagement.' }
      ],
      images: [
        'assets/images/professions/prof_visual_arts.png',
        'assets/images/professions/prof_visual_arts_2.png',
        'assets/images/professions/prof_visual_arts_3.png',
        'assets/images/professions/prof_visual_arts_4.png'
      ],
      related: [
        { name: 'Computer Graphics Technology', why: '3D modeling and digital production' },
        { name: 'Marketing', why: 'Brand design and advertising' },
        { name: 'Journalism — Multimedia', why: 'Visual storytelling and media' }
      ],
      whatYouCanDo: ['Design brand identities for global companies','Direct art and creative at an advertising agency','Create UI/UX for major tech products','Exhibit fine art in galleries worldwide','Design motion graphics for film and streaming','Curate exhibitions at major museums']
    },
    'music': {
      hero: 'assets/images/professions/prof_comm_studies.png',
      title: 'Music',
      tagline: 'Performing, Producing & Shaping the Sound of Culture',
      overview: 'Music professionals perform, compose, teach, and produce the sounds that define culture. From concert halls to recording studios, music education to audio engineering, this field combines artistry with technical skill.',
      blsSalary: 46920, blsGrowth: 2, blsEmployment: 176000, nationalMedian: 48060,
      careers: [
        { title: 'Music Producer', salary: '$40K – $200K+', icon: '🎛️', desc: 'Produce and mix music for artists, labels, and media projects.' },
        { title: 'Music Educator', salary: '$45K – $70K', icon: '🎵', desc: 'Teach music in K-12 schools, leading bands, choirs, and orchestras.' },
        { title: 'Performer / Session Musician', salary: '$30K – $150K+', icon: '🎸', desc: 'Perform live and in studio sessions for artists, symphonies, and events.' },
        { title: 'Audio Engineer', salary: '$45K – $90K', icon: '🎧', desc: 'Record, mix, and master audio for music, film, podcasts, and live events.' },
        { title: 'Music Therapist', salary: '$45K – $70K', icon: '💚', desc: 'Use music to treat physical, emotional, and cognitive conditions.' }
      ],
      images: [
        'assets/images/professions/prof_music.png',
        'assets/images/professions/prof_music_2.png',
        'assets/images/professions/prof_music_3.png',
        'assets/images/professions/prof_music_4.png'
      ],
      related: [
        { name: 'Theatre Arts', why: 'Performance and production arts' },
        { name: 'Communication Studies', why: 'Media and creative expression' },
        { name: 'Computer Graphics Technology', why: 'Audio-visual digital production' }
      ],
      whatYouCanDo: ['Perform on international stages','Produce chart-topping records','Direct school and community music programs','Score films and video games','Engineer sound for live concerts and studios','Use music therapy to heal']
    },
    'thtr': {
      hero: 'assets/images/professions/prof_comm_studies.png',
      title: 'Theatre Arts',
      tagline: 'Bringing Stories to Life on Stage & Screen',
      overview: 'Theatre arts professionals create live and recorded performance — acting, directing, designing sets and costumes, and managing productions. With concentrations in acting and technical theatre, this field bridges creativity and craftsmanship.',
      blsSalary: 46960, blsGrowth: 5, blsEmployment: 78000, nationalMedian: 48060,
      careers: [
        { title: 'Actor', salary: '$30K – $200K+', icon: '🎭', desc: 'Perform in theatre, film, TV, commercials, and voice-over work.' },
        { title: 'Stage Director', salary: '$45K – $100K', icon: '🎬', desc: 'Lead artistic vision and direct theatrical productions.' },
        { title: 'Scenic / Set Designer', salary: '$40K – $85K', icon: '🎨', desc: 'Design sets and environments for theatre, film, and television.' },
        { title: 'Costume Designer', salary: '$40K – $80K', icon: '👗', desc: 'Design costumes that bring characters to life across media.' },
        { title: 'Stage Manager', salary: '$40K – $75K', icon: '📋', desc: 'Coordinate all elements of theatrical production — scheduling, cues, and logistics.' }
      ],
      images: [
        'assets/images/professions/prof_theatre.png',
        'assets/images/professions/prof_theatre_2.png',
        'assets/images/professions/prof_theatre_3.png',
        'assets/images/professions/prof_theatre_4.png'
      ],
      related: [
        { name: 'Music', why: 'Musical theatre and performance arts' },
        { name: 'English — Creative Writing', why: 'Playwriting and dramatic literature' },
        { name: 'Visual Arts', why: 'Scenic and costume design' }
      ],
      whatYouCanDo: ['Perform on Broadway or in film','Direct theatrical productions','Design sets for major productions','Manage production for touring shows','Write and produce original plays','Teach drama at universities']
    },

    'elem': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Elementary Education',
      tagline: 'Shaping the Minds & Lives of Young Learners',
      overview: 'Elementary teachers lay the foundation for lifelong learning — teaching reading, math, science, and social skills to children in grades K-6. NC A&T\'s CAEP-accredited program prepares teachers with classroom experience from day one.',
      blsSalary: 61690, blsGrowth: 1, blsEmployment: 1516300, nationalMedian: 48060,
      careers: [
        { title: 'Elementary School Teacher', salary: '$45K – $70K', icon: '📚', desc: 'Teach all subjects to K-6 students in public or private schools.' },
        { title: 'Reading Specialist', salary: '$50K – $75K', icon: '📖', desc: 'Provide targeted literacy intervention for struggling readers.' },
        { title: 'Curriculum Developer', salary: '$55K – $85K', icon: '📝', desc: 'Design instructional materials and curriculum aligned to standards.' },
        { title: 'Instructional Coach', salary: '$55K – $80K', icon: '🎯', desc: 'Mentor and support teachers in improving classroom instruction.' },
        { title: 'School Principal', salary: '$80K – $130K', icon: '🏫', desc: 'Lead school operations, culture, and academic achievement. Requires graduate degree.' }
      ],
      images: [
        'assets/images/professions/prof_education.png',
        'assets/images/professions/prof_education_2.png',
        'assets/images/professions/prof_education_3.png',
        'assets/images/professions/prof_education_4.png'
      ],
      related: [
        { name: 'Child Development & Family Studies', why: 'Early childhood development expertise' },
        { name: 'Psychology', why: 'Educational and child psychology' },
        { name: 'English', why: 'Literacy instruction and language arts' }
      ],
      whatYouCanDo: ['Inspire children as a classroom teacher','Lead schools as a principal','Design curriculum adopted across districts','Coach teachers to improve instruction','Specialize in reading intervention','Teach internationally at schools worldwide']
    },
    'edst': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Education Studies',
      tagline: 'Innovating Education Through Technology, Leadership & Advocacy',
      overview: 'Education studies professionals shape the future of learning — through instructional technology, educational leadership, and family-school-community engagement. This non-licensure program prepares leaders for training, development, and educational innovation.',
      blsSalary: 63740, blsGrowth: 5, blsEmployment: 200000, nationalMedian: 48060,
      careers: [
        { title: 'Instructional Designer', salary: '$55K – $95K', icon: '💻', desc: 'Design online courses, training programs, and educational technology experiences.' },
        { title: 'Corporate Trainer', salary: '$55K – $90K', icon: '🎤', desc: 'Develop and deliver training programs for employees at organizations.' },
        { title: 'Education Technology Specialist', salary: '$55K – $85K', icon: '🖥️', desc: 'Implement and manage technology tools for schools and districts.' },
        { title: 'Family Engagement Coordinator', salary: '$40K – $65K', icon: '👪', desc: 'Build partnerships between families, schools, and community organizations.' },
        { title: 'Education Program Manager', salary: '$55K – $90K', icon: '📋', desc: 'Manage educational programs for nonprofits, government, and foundations.' }
      ],
      images: [
        'assets/images/professions/prof_education.png',
        'assets/images/professions/prof_education_2.png',
        'assets/images/professions/prof_education_3.png',
        'assets/images/professions/prof_education_4.png'
      ],
      related: [
        { name: 'Business Information Technology', why: 'EdTech and learning management systems' },
        { name: 'Communication Studies', why: 'Training and professional development' },
        { name: 'Management', why: 'Educational leadership and administration' }
      ],
      whatYouCanDo: ['Design online learning for major universities','Lead corporate training at Fortune 500 companies','Implement education technology across school districts','Build family engagement programs','Manage educational nonprofits','Create e-learning content for global audiences']
    },
    'aet': {
      hero: 'assets/images/professions/prof_applied_eng.png',
      title: 'Applied Engineering Technology',
      tagline: 'Hands-On Engineering for the Real World',
      overview: 'Applied engineering technologists bridge the gap between engineering design and manufacturing production. This practical, hands-on program prepares you for immediate impact in manufacturing, quality assurance, and technical project management.',
      blsSalary: 60140, blsGrowth: 2, blsEmployment: 75000, nationalMedian: 48060,
      careers: [
        { title: 'Manufacturing Engineer', salary: '$60K – $100K', icon: '🏭', desc: 'Design and improve manufacturing processes and production systems.' },
        { title: 'Quality Assurance Technologist', salary: '$50K – $80K', icon: '✅', desc: 'Inspect products and processes to ensure quality standards.' },
        { title: 'CAD/CAM Specialist', salary: '$50K – $80K', icon: '📐', desc: 'Create detailed technical drawings and CNC programming for manufacturing.' },
        { title: 'Plant Manager', salary: '$70K – $130K', icon: '🏗️', desc: 'Oversee entire manufacturing facility operations and workforce.' },
        { title: 'Technical Sales Engineer', salary: '$60K – $110K', icon: '🤝', desc: 'Sell complex engineering products and provide technical support to clients.' }
      ],
      images: [
        'assets/images/professions/prof_applied_eng.png',
        'assets/images/professions/prof_applied_eng_2.png',
        'assets/images/professions/prof_applied_eng_3.png',
        'assets/images/professions/prof_applied_eng_4.png'
      ],
      related: [
        { name: 'Industrial & Systems Engineering', why: 'Process optimization and quality' },
        { name: 'Construction Management', why: 'Project management in construction' },
        { name: 'Electronics Engineering Technology', why: 'Electrical systems integration' }
      ],
      whatYouCanDo: ['Manage manufacturing operations at major companies','Design production processes for automotive and aerospace','Lead quality improvement programs','Oversee plant operations as a facility manager','Sell technical engineering solutions','Program CNC machines and robotics']
    },
    'auto': {
      hero: 'assets/images/professions/prof_auto_eng.png',
      title: 'Automotive Engineering Technology',
      tagline: 'Engineering the Vehicles of Tomorrow',
      overview: 'Automotive engineering technologists design, test, and manufacture the vehicles of the future. From electric vehicles and autonomous driving to motorsports and fleet management, this field is at the forefront of transportation innovation.',
      blsSalary: 64000, blsGrowth: 4, blsEmployment: 58000, nationalMedian: 48060,
      careers: [
        { title: 'Automotive Test Engineer', salary: '$60K – $100K', icon: '🏎️', desc: 'Test vehicle systems for performance, safety, and durability.' },
        { title: 'EV Powertrain Engineer', salary: '$70K – $120K', icon: '⚡', desc: 'Design and develop electric vehicle battery and motor systems.' },
        { title: 'Motorsports Engineer', salary: '$55K – $110K', icon: '🏁', desc: 'Optimize race car performance for NASCAR, Formula 1, and other motorsports.' },
        { title: 'Fleet Manager', salary: '$55K – $90K', icon: '🚗', desc: 'Manage vehicle fleets for corporations, government, and logistics companies.' },
        { title: 'Vehicle Safety Engineer', salary: '$65K – $110K', icon: '🛡️', desc: 'Design and validate vehicle crash safety systems and compliance.' }
      ],
      images: ['assets/images/professions/prof_auto_engineering.png'],
      related: [
        { name: 'Mechanical Engineering', why: 'Vehicle design and thermodynamics' },
        { name: 'Electrical Engineering', why: 'EV systems and embedded electronics' },
        { name: 'Applied Engineering Technology', why: 'Manufacturing and prototyping' }
      ],
      whatYouCanDo: ['Design electric vehicles for Tesla or Rivian','Engineer race cars for NASCAR teams','Test safety systems for major automakers','Lead EV battery technology development','Manage government and corporate vehicle fleets','Work in autonomous vehicle development']
    },
    'bio': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Biology',
      tagline: 'Exploring Life from Molecules to Ecosystems',
      overview: 'Biologists study living organisms — from molecular genetics to ecosystem ecology. With concentrations in pre-med, pre-law, and general biology, this degree opens doors to medical school, research, forensics, and environmental science.',
      blsSalary: 67000, blsGrowth: 5, blsEmployment: 84000, nationalMedian: 48060,
      careers: [
        { title: 'Physician / Medical Doctor', salary: '$200K – $400K+', icon: '🩺', desc: 'Diagnose and treat patients. Requires medical school (MD/DO).' },
        { title: 'Biomedical Research Scientist', salary: '$65K – $120K', icon: '🔬', desc: 'Conduct research to advance medicine and develop treatments.' },
        { title: 'Forensic Scientist', salary: '$55K – $85K', icon: '🔍', desc: 'Analyze physical evidence for criminal investigations.' },
        { title: 'Pharmaceutical Sales Representative', salary: '$60K – $120K', icon: '💊', desc: 'Market pharmaceutical products to healthcare providers.' },
        { title: 'Environmental Biologist', salary: '$50K – $80K', icon: '🌿', desc: 'Study ecosystems and the impact of human activity on biodiversity.' },
        { title: 'Genetic Counselor', salary: '$70K – $100K', icon: '🧬', desc: 'Help patients understand genetic test results and inherited conditions.' }
      ],
      images: [
        'assets/images/professions/prof_biology.png',
        'assets/images/professions/prof_biology_2.png',
        'assets/images/professions/prof_biology_3.png',
        'assets/images/professions/prof_biology_4.png'
      ],
      related: [
        { name: 'Chemistry', why: 'Biochemistry and lab science' },
        { name: 'Animal Science', why: 'Comparative anatomy and physiology' },
        { name: 'Nursing', why: 'Healthcare career foundation' }
      ],
      whatYouCanDo: ['Become a physician and save lives','Discover new drugs and treatments as a researcher','Solve crimes using forensic biology','Counsel families on genetic health','Study ecosystems and protect biodiversity','Teach biology at universities']
    },
    'cm': {
      hero: 'assets/images/professions/prof_applied_eng.png',
      title: 'Construction Management',
      tagline: 'Building the Infrastructure of Tomorrow',
      overview: 'Construction managers oversee building projects from concept to completion — managing budgets, schedules, safety, and quality. From skyscrapers to highway systems, construction managers build the physical world.',
      blsSalary: 101480, blsGrowth: 5, blsEmployment: 499100, nationalMedian: 48060,
      careers: [
        { title: 'Construction Project Manager', salary: '$75K – $140K', icon: '🏗️', desc: 'Lead construction projects from planning through completion.' },
        { title: 'Site Superintendent', salary: '$65K – $110K', icon: '👷', desc: 'Manage day-to-day operations on construction sites.' },
        { title: 'Estimator', salary: '$60K – $100K', icon: '📊', desc: 'Prepare cost estimates for construction bids and proposals.' },
        { title: 'Safety Manager', salary: '$65K – $100K', icon: '🛡️', desc: 'Develop and enforce workplace safety programs on construction sites.' },
        { title: 'Real Estate Developer', salary: '$80K – $300K+', icon: '🏢', desc: 'Develop commercial and residential real estate projects.' }
      ],
      images: [
        'assets/images/professions/prof_construction_mgmt.png',
        'assets/images/professions/prof_construction_mgmt_2.png',
        'assets/images/professions/prof_construction_mgmt_3.png',
        'assets/images/professions/prof_construction_mgmt_4.png'
      ],
      related: [
        { name: 'Civil Engineering', why: 'Structural design and infrastructure' },
        { name: 'Landscape Architecture', why: 'Site development and outdoor construction' },
        { name: 'Applied Engineering Technology', why: 'Construction methods and materials' }
      ],
      whatYouCanDo: ['Build skyscrapers and bridges','Manage billion-dollar infrastructure projects','Develop commercial real estate','Lead safety programs for major contractors','Start your own construction company','Oversee hospital and university campus construction']
    },
    'ehs': {
      hero: 'assets/images/professions/prof_env_health.png',
      title: 'Environmental Health & Safety',
      tagline: 'Protecting People & the Planet Through Science & Regulation',
      overview: 'Environmental health and safety professionals protect workers, communities, and ecosystems from hazards. From OSHA compliance to industrial hygiene and hazardous waste management, EHS careers are in high demand across all industries.',
      blsSalary: 78570, blsGrowth: 4, blsEmployment: 97800, nationalMedian: 48060,
      careers: [
        { title: 'EHS Manager', salary: '$70K – $120K', icon: '🛡️', desc: 'Lead environmental health and safety programs for organizations.' },
        { title: 'Industrial Hygienist', salary: '$65K – $110K', icon: '🧪', desc: 'Assess and control workplace hazards — chemical, biological, and physical.' },
        { title: 'OSHA Compliance Officer', salary: '$55K – $90K', icon: '📋', desc: 'Enforce workplace safety regulations and conduct inspections.' },
        { title: 'Hazardous Waste Manager', salary: '$60K – $100K', icon: '☢️', desc: 'Manage storage, treatment, and disposal of hazardous materials.' },
        { title: 'Environmental Scientist', salary: '$55K – $90K', icon: '🌿', desc: 'Monitor air, water, and soil quality to protect public health.' }
      ],
      images: [
        'assets/images/professions/prof_env_health.png',
        'assets/images/professions/prof_env_health_2.png',
        'assets/images/professions/prof_env_health_3.png',
        'assets/images/professions/prof_env_health_4.png'
      ],
      related: [
        { name: 'Environmental Studies', why: 'Environmental science and policy' },
        { name: 'Biology', why: 'Toxicology and environmental biology' },
        { name: 'Chemistry', why: 'Analytical chemistry and hazard assessment' }
      ],
      whatYouCanDo: ['Lead safety programs for Fortune 500 companies','Enforce OSHA regulations as an inspector','Manage hazardous waste cleanup projects','Protect worker health as an industrial hygienist','Monitor air and water quality for communities','Consult on environmental compliance']
    },
    'geo': {
      hero: 'assets/images/professions/prof_environmental.png',
      title: 'Geomatics',
      tagline: 'Mapping, Measuring & Modeling the Earth',
      overview: 'Geomatics professionals use GPS, GIS, drones, and remote sensing to map and analyze the Earth\'s surface. From surveying construction sites to creating 3D city models, this high-tech field is essential for urban planning, agriculture, and defense.',
      blsSalary: 63080, blsGrowth: 5, blsEmployment: 48000, nationalMedian: 48060,
      careers: [
        { title: 'GIS Analyst', salary: '$50K – $85K', icon: '🗺️', desc: 'Create and analyze geographic data using GIS software (Esri ArcGIS).' },
        { title: 'Land Surveyor', salary: '$55K – $90K', icon: '📐', desc: 'Measure and map land boundaries for construction and real estate.' },
        { title: 'Remote Sensing Specialist', salary: '$60K – $100K', icon: '🛰️', desc: 'Analyze satellite and drone imagery for environmental monitoring and defense.' },
        { title: 'Drone / UAS Operator', salary: '$50K – $90K', icon: '🚁', desc: 'Operate drones for surveying, mapping, and inspection.' },
        { title: 'Cartographer', salary: '$50K – $80K', icon: '🌐', desc: 'Design and produce maps for government, military, and commercial use.' }
      ],
      images: [
        'assets/images/professions/prof_geomatics.png',
        'assets/images/professions/prof_geomatics_2.png',
        'assets/images/professions/prof_geomatics_3.png',
        'assets/images/professions/prof_geomatics_4.png'
      ],
      related: [
        { name: 'Landscape Architecture', why: 'Site planning and GIS mapping' },
        { name: 'Environmental Studies', why: 'Environmental monitoring and analysis' },
        { name: 'Computer Science', why: 'Geospatial programming and data science' }
      ],
      whatYouCanDo: ['Map cities using GIS and drone technology','Survey land for major construction projects','Analyze satellite data for defense and intelligence','Create 3D models of urban environments','Monitor climate change using remote sensing','Design precision agriculture mapping systems']
    },
    'chem': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Chemistry',
      tagline: 'Transforming Matter, Discovering New Materials & Saving Lives',
      overview: 'Chemists study and transform matter at the molecular level — developing new drugs, materials, and energy solutions. With concentrations in biochemistry and general chemistry, this field offers paths to pharmaceutical research, forensics, and industry.',
      blsSalary: 79760, blsGrowth: 6, blsEmployment: 91700, nationalMedian: 48060,
      careers: [
        { title: 'Pharmaceutical Chemist', salary: '$65K – $120K', icon: '💊', desc: 'Develop and test new drugs and therapeutics for pharmaceutical companies.' },
        { title: 'Analytical Chemist', salary: '$55K – $95K', icon: '🧪', desc: 'Analyze chemical composition of substances for quality, safety, and research.' },
        { title: 'Materials Scientist', salary: '$70K – $120K', icon: '🔬', desc: 'Develop new materials — polymers, ceramics, composites — for technology and manufacturing.' },
        { title: 'Forensic Chemist', salary: '$55K – $85K', icon: '🔍', desc: 'Analyze physical evidence — drugs, DNA, toxicology — for criminal investigations.' },
        { title: 'Chemical Process Engineer', salary: '$70K – $120K', icon: '⚗️', desc: 'Optimize chemical manufacturing processes for efficiency and safety.' }
      ],
      images: [
        'assets/images/professions/prof_chemistry.png',
        'assets/images/professions/prof_chemistry_2.png',
        'assets/images/professions/prof_chemistry_3.png',
        'assets/images/professions/prof_chemistry_4.png'
      ],
      related: [
        { name: 'Biology', why: 'Biochemistry and life sciences' },
        { name: 'Chemical Engineering', why: 'Chemical process scale-up and manufacturing' },
        { name: 'Environmental Health & Safety', why: 'Chemical safety and compliance' }
      ],
      whatYouCanDo: ['Develop life-saving drugs at pharmaceutical companies','Analyze evidence for crime labs','Create new materials for technology','Optimize chemical manufacturing processes','Research renewable energy solutions','Teach chemistry at universities']
    },
    'elec': {
      hero: 'assets/images/professions/prof_electronics.png',
      title: 'Electronics Engineering Technology',
      tagline: 'Building the Circuits & Systems That Power Modern Life',
      overview: 'Electronics engineering technologists design, test, and maintain the electronic systems in everything from smartphones to medical devices, defense systems, and industrial automation.',
      blsSalary: 65260, blsGrowth: 2, blsEmployment: 121000, nationalMedian: 48060,
      careers: [
        { title: 'Electronics Technician', salary: '$50K – $80K', icon: '🔧', desc: 'Install, calibrate, and repair electronic equipment and systems.' },
        { title: 'PCB Designer', salary: '$55K – $90K', icon: '🖥️', desc: 'Design printed circuit board layouts for electronic products.' },
        { title: 'Test Engineer', salary: '$60K – $100K', icon: '📊', desc: 'Design and execute test procedures for electronic systems and components.' },
        { title: 'Embedded Systems Developer', salary: '$70K – $120K', icon: '💻', desc: 'Program microcontrollers and embedded processors for IoT and automotive.' },
        { title: 'Telecommunications Technologist', salary: '$55K – $85K', icon: '📡', desc: 'Design and maintain telecommunications networks and wireless systems.' }
      ],
      images: ['assets/images/professions/prof_electronics.png'],
      related: [
        { name: 'Electrical Engineering', why: 'Power systems and circuit design' },
        { name: 'Computer Engineering', why: 'Hardware-software integration' },
        { name: 'Information Technology', why: 'Network and system administration' }
      ],
      whatYouCanDo: ['Design circuits for consumer electronics','Develop IoT and embedded systems','Test electronics for aerospace and defense','Build telecommunications infrastructure','Program microcontrollers and robotics','Maintain medical device electronics']
    },
    'it': {
      hero: 'assets/images/professions/prof_electronics.png',
      title: 'Information Technology',
      tagline: 'Managing the Digital Infrastructure That Runs the World',
      overview: 'IT professionals build, secure, and maintain the technology infrastructure that organizations depend on — from network administration and cloud computing to cybersecurity and help desk management.',
      blsSalary: 98740, blsGrowth: 10, blsEmployment: 482000, nationalMedian: 48060,
      careers: [
        { title: 'Systems Administrator', salary: '$65K – $100K', icon: '🖥️', desc: 'Manage servers, networks, and IT infrastructure for organizations.' },
        { title: 'Network Engineer', salary: '$70K – $120K', icon: '🌐', desc: 'Design and maintain enterprise network architectures.' },
        { title: 'Cloud Engineer', salary: '$80K – $150K', icon: '☁️', desc: 'Build and manage cloud infrastructure on AWS, Azure, or GCP.' },
        { title: 'Cybersecurity Specialist', salary: '$75K – $130K', icon: '🔒', desc: 'Protect systems and data from cyber threats and vulnerabilities.' },
        { title: 'IT Manager', salary: '$85K – $150K', icon: '💼', desc: 'Lead IT departments and technology strategy for organizations.' }
      ],
      images: [
        'assets/images/professions/prof_info_tech.png',
        'assets/images/professions/prof_info_tech_2.png',
        'assets/images/professions/prof_info_tech_3.png',
        'assets/images/professions/prof_info_tech_4.png'
      ],
      related: [
        { name: 'Computer Science', why: 'Software development and algorithms' },
        { name: 'Business Information Technology', why: 'Business applications of IT' },
        { name: 'Electronics Engineering Technology', why: 'Hardware and network infrastructure' }
      ],
      whatYouCanDo: ['Manage IT operations for global companies','Architect cloud solutions for enterprises','Lead cybersecurity teams','Build and maintain data center infrastructure','Direct technology strategy as a CTO','Launch an IT consulting business']
    },
    'cgt': {
      hero: 'assets/images/professions/prof_comp_graphics.png',
      title: 'Computer Graphics Technology',
      tagline: 'Creating Visual Worlds Through Technology & Design',
      overview: 'Computer graphics professionals create the visual content that powers entertainment, design, and technology. With concentrations in 3D design and UX design, this field bridges art and technology in gaming, film, AR/VR, and product design.',
      blsSalary: 79440, blsGrowth: 3, blsEmployment: 97600, nationalMedian: 48060,
      careers: [
        { title: '3D Modeler / Animator', salary: '$50K – $100K', icon: '🎮', desc: 'Create 3D models and animations for games, film, and VR/AR.' },
        { title: 'UX/UI Designer', salary: '$65K – $120K', icon: '📱', desc: 'Design user interfaces and experiences for apps and digital products.' },
        { title: 'Game Designer', salary: '$55K – $110K', icon: '🕹️', desc: 'Design gameplay mechanics, levels, and interactive experiences.' },
        { title: 'Visual Effects (VFX) Artist', salary: '$55K – $120K', icon: '🎬', desc: 'Create visual effects for film, TV, and streaming productions.' },
        { title: 'Product / Industrial Designer', salary: '$60K – $100K', icon: '📐', desc: 'Design consumer products using CAD and 3D prototyping.' }
      ],
      images: ['assets/images/professions/prof_comp_graphics.png'],
      related: [
        { name: 'Visual Arts — Graphic Design', why: 'Visual design foundations' },
        { name: 'Computer Science', why: 'Graphics programming and game development' },
        { name: 'Information Technology', why: 'Digital product development' }
      ],
      whatYouCanDo: ['Create characters and worlds for AAA video games','Design VFX for Marvel movies and Netflix shows','Build AR/VR experiences for Meta and Apple','Design consumer products for major brands','Create UX for apps used by millions','Animate for Pixar, DreamWorks, or Disney']
    },
    'math': {
      hero: 'assets/images/professions/prof_electronics.png',
      title: 'Mathematics',
      tagline: 'The Universal Language That Powers Science, Tech & Finance',
      overview: 'Mathematicians solve complex problems across every field — from data science and cryptography to actuarial science and quantitative finance. With concentrations in applied math, pure math, and data science, this degree is one of the most versatile in higher education.',
      blsSalary: 108100, blsGrowth: 31, blsEmployment: 33600, nationalMedian: 48060,
      careers: [
        { title: 'Data Scientist', salary: '$85K – $160K', icon: '📊', desc: 'Build predictive models and extract insights from large datasets.' },
        { title: 'Actuary', salary: '$105K – $170K', icon: '📈', desc: 'Analyze financial risk using mathematics, statistics, and financial theory.' },
        { title: 'Quantitative Analyst', salary: '$100K – $250K+', icon: '💹', desc: 'Develop mathematical models for financial trading and risk management.' },
        { title: 'Cryptographer', salary: '$90K – $160K', icon: '🔐', desc: 'Design encryption systems to protect data and communications.' },
        { title: 'Operations Research Analyst', salary: '$75K – $130K', icon: '🧮', desc: 'Use advanced math to help organizations make better decisions.' },
        { title: 'Mathematics Professor', salary: '$60K – $120K', icon: '🎓', desc: 'Teach and conduct mathematical research at universities.' }
      ],
      images: [
        'assets/images/professions/prof_mathematics.png',
        'assets/images/professions/prof_mathematics_2.png',
        'assets/images/professions/prof_mathematics_3.png',
        'assets/images/professions/prof_mathematics_4.png'
      ],
      related: [
        { name: 'Computer Science', why: 'Algorithms and computational thinking' },
        { name: 'Economics', why: 'Econometrics and quantitative analysis' },
        { name: 'Physics', why: 'Mathematical physics and modeling' }
      ],
      whatYouCanDo: ['Model financial markets on Wall Street','Predict risk as an actuary','Build AI and machine learning algorithms','Design encryption for national security','Analyze big data for tech companies','Teach mathematics at universities']
    },
    'atms': {
      hero: 'assets/images/professions/prof_environmental.png',
      title: 'Atmospheric Sciences & Meteorology',
      tagline: 'Forecasting Weather, Understanding Climate & Protecting Lives',
      overview: 'Atmospheric scientists study weather, climate, and the atmosphere. From TV meteorologists to climate researchers and emergency management, this field is critical for public safety and climate action.',
      blsSalary: 94570, blsGrowth: 4, blsEmployment: 11000, nationalMedian: 48060,
      careers: [
        { title: 'Broadcast Meteorologist', salary: '$45K – $120K', icon: '🌤️', desc: 'Forecast weather and deliver reports on TV, radio, and digital platforms.' },
        { title: 'Research Climatologist', salary: '$70K – $120K', icon: '🌡️', desc: 'Study long-term climate patterns and model future climate scenarios.' },
        { title: 'NWS Forecaster', salary: '$55K – $100K', icon: '🌪️', desc: 'Issue weather forecasts and severe weather warnings for the National Weather Service.' },
        { title: 'Air Quality Scientist', salary: '$55K – $90K', icon: '🌬️', desc: 'Monitor and model air quality and pollution for public health agencies.' },
        { title: 'Emergency Management Specialist', salary: '$50K – $85K', icon: '🚨', desc: 'Plan disaster response and community preparedness for extreme weather.' }
      ],
      images: [
        'assets/images/professions/prof_meteorology.png',
        'assets/images/professions/prof_meteorology_2.png',
        'assets/images/professions/prof_meteorology_3.png',
        'assets/images/professions/prof_meteorology_4.png'
      ],
      related: [
        { name: 'Environmental Studies', why: 'Climate science and environmental policy' },
        { name: 'Geomatics', why: 'Remote sensing and geospatial analysis' },
        { name: 'Mathematics — Applied', why: 'Atmospheric modeling and simulation' }
      ],
      whatYouCanDo: ['Forecast weather on national TV','Research climate change at NASA or NOAA','Issue life-saving severe weather warnings','Model atmospheric pollution and air quality','Lead emergency management for cities','Consult on climate risk for insurance and finance']
    },
    'phys': {
      hero: 'assets/images/professions/prof_electronics.png',
      title: 'Physics',
      tagline: 'Understanding the Fundamental Laws of the Universe',
      overview: 'Physicists explore the fundamental laws governing the universe — from quantum mechanics to astrophysics. With concentrations in engineering physics, biophysics, and general physics, this degree powers careers in research, technology, and defense.',
      blsSalary: 152430, blsGrowth: 5, blsEmployment: 20400, nationalMedian: 48060,
      careers: [
        { title: 'Research Physicist', salary: '$80K – $160K', icon: '⚛️', desc: 'Conduct experiments and develop theories at national labs and universities.' },
        { title: 'Data Scientist (Physics)', salary: '$85K – $160K', icon: '📊', desc: 'Apply physics modeling skills to data analysis in tech and finance.' },
        { title: 'Medical Physicist', salary: '$100K – $160K', icon: '🏥', desc: 'Apply physics to radiation therapy, diagnostic imaging, and nuclear medicine.' },
        { title: 'Optical Engineer', salary: '$80K – $130K', icon: '🔭', desc: 'Design optical systems — lasers, fiber optics, imaging, and photonics.' },
        { title: 'Aerospace Physicist', salary: '$90K – $150K', icon: '🚀', desc: 'Apply physics to spacecraft design, propulsion, and space exploration.' }
      ],
      images: [
        'assets/images/professions/prof_physics.png',
        'assets/images/professions/prof_physics_2.png',
        'assets/images/professions/prof_physics_3.png',
        'assets/images/professions/prof_physics_4.png'
      ],
      related: [
        { name: 'Mathematics', why: 'Mathematical physics and advanced calculus' },
        { name: 'Electrical Engineering', why: 'Semiconductor physics and electronics' },
        { name: 'Computer Science', why: 'Computational physics and simulation' }
      ],
      whatYouCanDo: ['Research at NASA or national laboratories','Develop quantum computing technology','Apply physics to medical imaging and treatment','Design lasers and optical systems','Build models for Wall Street quantitative firms','Teach physics at universities']
    },
    'cost-ai': {
      hero: 'assets/images/professions/prof_electronics.png',
      title: 'Artificial Intelligence (CoST)',
      tagline: 'Building Intelligent Systems That Think, Learn & Adapt',
      overview: 'AI specialists design and build intelligent systems — from machine learning models and natural language processing to computer vision and robotics. AI is the fastest-growing field in technology, with demand far exceeding supply.',
      blsSalary: 164250, blsGrowth: 23, blsEmployment: 45300, nationalMedian: 48060,
      careers: [
        { title: 'Machine Learning Engineer', salary: '$110K – $220K+', icon: '🤖', desc: 'Build and deploy machine learning models at scale for production systems.' },
        { title: 'AI Research Scientist', salary: '$120K – $300K+', icon: '🧠', desc: 'Advance the frontier of AI through research in deep learning, NLP, and reasoning.' },
        { title: 'Computer Vision Engineer', salary: '$100K – $200K', icon: '👁️', desc: 'Build systems that understand and interpret visual information.' },
        { title: 'NLP Engineer', salary: '$100K – $190K', icon: '💬', desc: 'Develop systems that understand and generate human language.' },
        { title: 'Robotics AI Engineer', salary: '$90K – $170K', icon: '🦾', desc: 'Build AI systems for autonomous robots and drones.' }
      ],
      images: ['assets/images/professions/prof_electronics.png'],
      related: [
        { name: 'Computer Science', why: 'Algorithms and software engineering' },
        { name: 'Mathematics — Data Science', why: 'Statistics and machine learning theory' },
        { name: 'Physics', why: 'Computational modeling and optimization' }
      ],
      whatYouCanDo: ['Build AI at Google, OpenAI, or DeepMind','Develop self-driving car technology','Create AI-powered medical diagnostics','Design intelligent robotics systems','Research breakthrough AI algorithms','Launch an AI startup']
    }
  };

  // Also map alternate keys
  DB['slfs'] = DB['envs'];
  DB['lab'] = DB['animal'];
  DB['cons'] = DB['fashion'];
  // CoBE aliases
  DB['sales'] = DB['mktg'];
  // CoE aliases - map all engineering slugs to appropriate keys
  DB['ae'] = DB['coe-eng'];
  DB['che'] = DB['coe-eng'];
  DB['ce'] = DB['coe-eng'];
  DB['cpe'] = DB['cs'];
  DB['ee'] = DB['coe-eng'];
  DB['me'] = DB['coe-eng'];
  DB['coe-bioe'] = DB['bioe'];
  DB['coe-ai'] = DB['cs'];
  // CHHS aliases
  DB['ex'] = DB['kin'];
  DB['rsm'] = DB['kin'];
  DB['pre'] = DB['kin'];
  // CAHSS aliases
  DB['afam'] = DB['eng'];
  DB['cw'] = DB['eng'];
  DB['tw'] = DB['eng'];
  DB['pro'] = DB['eng'];
  DB['mmj'] = DB['jmc'];
  DB['mmp'] = DB['jmc'];
  DB['pr'] = DB['jmc'];
  DB['act'] = DB['lib'];
  DB['law'] = DB['lib'];
  DB['des'] = DB['art'];
  DB['gd'] = DB['art'];
  DB['tech'] = DB['thtr'];
  // CEd aliases
  DB['lead'] = DB['edst'];
  DB['fam'] = DB['edst'];
  // CoST aliases
  DB['mgmt-ehs'] = DB['ehs'];
  DB['sci-ehs'] = DB['ehs'];
  DB['td'] = DB['cgt'];
  DB['ux'] = DB['cgt'];
  DB['app'] = DB['math'];
  DB['pure'] = DB['math'];
  DB['ds'] = DB['math'];
  DB['phys-eng'] = DB['phys'];
  DB['phys-bio'] = DB['phys'];

  // Explicit slug → DB key mapping (no more fragile substring matching)
  const SLUG_TO_DB = {
    // CAES
    'caes-la': 'landscape', 'caes-ansc': 'animal', 'caes-lasc': 'animal',
    'caes-bioe-bio': 'bioe', 'caes-bioe-nr': 'bioe',
    'caes-fns-food': 'food', 'caes-fns-nutr': 'food',
    'caes-fcs-fash': 'fashion', 'caes-fcs-cons': 'fashion',
    'caes-cdfs-fam': 'child', 'caes-cdfs-bk': 'child',
    'caes-aged-sec': 'aged', 'caes-aged-pro': 'aged',
    'caes-agbm': 'agbm',
    'caes-aes-envs': 'envs', 'caes-aes-slfs': 'envs',
    // CoBE
    'cobe-acct': 'acct', 'cobe-fin': 'fin',
    'cobe-econ': 'econ', 'cobe-econ-biz': 'econ', 'cobe-econ-law': 'econ',
    'cobe-mgmt': 'mgmt', 'cobe-mgmt-ent': 'mgmt', 'cobe-mgmt-intl': 'mgmt',
    'cobe-bit': 'bit', 'cobe-mktg': 'mktg', 'cobe-mktg-sales': 'mktg', 'cobe-scm': 'scm',
    // CoE
    'coe-bioe': 'bioe', 'coe-che': 'coe-eng', 'coe-ae': 'coe-eng', 'coe-ce': 'coe-eng',
    'coe-cs': 'cs', 'coe-cpe': 'cs', 'coe-ee': 'elec', 'coe-ise': 'ise',
    'coe-me': 'coe-eng', 'coe-ai': 'cs',
    // CHHS
    'chhs-nurs': 'nurs', 'chhs-slpa': 'slpa', 'chhs-comm': 'comm',
    'chhs-kin-ex': 'kin', 'chhs-kin-rsm': 'kin', 'chhs-kin-pre': 'kin',
    'chhs-hsm': 'hsm', 'chhs-psych': 'psych', 'chhs-soc': 'soc', 'chhs-sw': 'sw',
    // CAHSS
    'cahss-cj': 'cj',
    'cahss-eng-afam': 'eng', 'cahss-eng-cw': 'eng', 'cahss-eng-tw': 'eng', 'cahss-eng-pro': 'eng',
    'cahss-hist': 'hist', 'cahss-poli': 'poli',
    'cahss-jmc-mmj': 'jmc', 'cahss-jmc-mmp': 'jmc', 'cahss-jmc-pr': 'jmc',
    'cahss-lib-afam': 'lib', 'cahss-lib-act': 'lib', 'cahss-lib-law': 'lib',
    'cahss-art-des': 'art', 'cahss-art-gd': 'art',
    'cahss-music': 'music', 'cahss-thtr-act': 'thtr', 'cahss-thtr-tech': 'thtr',
    // CEd
    'ced-elem': 'elem', 'ced-edst-tech': 'edst', 'ced-edst-lead': 'edst', 'ced-edst-fam': 'edst',
    // CoST
    'cost-aet': 'aet', 'cost-auto': 'auto',
    'cost-bio': 'bio', 'cost-bio-pre': 'bio', 'cost-bio-law': 'bio',
    'cost-cm': 'cm', 'cost-ehs-mgmt': 'ehs', 'cost-ehs-sci': 'ehs',
    'cost-geo': 'geo', 'cost-chem': 'chem', 'cost-chem-bio': 'chem',
    'cost-elec': 'elec', 'cost-it': 'it',
    'cost-cgt-td': 'cgt', 'cost-cgt-ux': 'cgt',
    'cost-math-app': 'math', 'cost-math-pure': 'math', 'cost-math-ds': 'math',
    'cost-atms': 'atms', 'cost-phys': 'phys', 'cost-phys-eng': 'phys', 'cost-phys-bio': 'phys',
    'cost-ai': 'cs'
  };

  function matchKey(slug) {
    slug = (slug || '').toLowerCase();
    // 1. Direct lookup (most reliable)
    if (SLUG_TO_DB[slug]) return SLUG_TO_DB[slug];
    // 2. Fallback: check if any DB key is a substring of the slug
    for (const k of Object.keys(DB)) { if (slug.includes(k)) return k; }
    // 3. Use branding program name as last resort
    const branding = typeof EMMA_STATE !== 'undefined' ? EMMA_STATE.get('branding') : null;
    if (branding?.programName) {
      const name = branding.programName.toLowerCase();
      for (const k of Object.keys(DB)) {
        if (name.includes(DB[k].title?.toLowerCase())) return k;
      }
    }
    console.warn(`[EMMA Report] No DB match for slug "${slug}" — using branding fallback`);
    return 'landscape';
  }

  const CAT_ICONS = {'course':'📘','field':'🌿','professional':'💼','community':'🤝','research':'🔬','certification':'🏆','award':'🏅','leadership':'👑'};

  /* ══════════════════════════════════════════════════
     COLLEGE ICON MAP
     ══════════════════════════════════════════════════ */
  const COLLEGE_ICON = {
    'CAES': 'assets/images/college-icons/icon-agriculture-color.svg',
    'CoBE': 'assets/images/college-icons/icon-business-color.svg',
    'CoE':  'assets/images/college-icons/icon-engineering-color.svg',
    'CHHS': 'assets/images/college-icons/icon-health-color.svg',
    'CAHSS':'assets/images/college-icons/icon-arts-color.svg',
    'CEd':  'assets/images/college-icons/icon-education-color.svg',
    'CoST': 'assets/images/college-icons/icon-science-color.svg',
    'JSNN': 'assets/images/college-icons/icon-nano-color.svg'
  };

  function getCollegeIcon(collegeName) {
    for (const [abbr, path] of Object.entries(COLLEGE_ICON)) {
      if (collegeName && collegeName.includes(abbr)) return path;
    }
    // Fallback by keyword
    if (collegeName?.includes('Agric')) return COLLEGE_ICON['CAES'];
    if (collegeName?.includes('Business')) return COLLEGE_ICON['CoBE'];
    if (collegeName?.includes('Engineer')) return COLLEGE_ICON['CoE'];
    if (collegeName?.includes('Health')) return COLLEGE_ICON['CHHS'];
    if (collegeName?.includes('Arts') || collegeName?.includes('Humanities')) return COLLEGE_ICON['CAHSS'];
    if (collegeName?.includes('Educ')) return COLLEGE_ICON['CEd'];
    if (collegeName?.includes('Science') || collegeName?.includes('Tech')) return COLLEGE_ICON['CoST'];
    return COLLEGE_ICON['CAES'];
  }

  const PHASE_CLR = ['#2d5016','#003366','#b8651a','#7b2d8e'];

  /* ══════════════════════════════════════════════════
     SVG CHART GENERATORS
     ══════════════════════════════════════════════════ */

  function salaryBarChart(profSalary, nationalMedian) {
    const max = Math.max(profSalary, nationalMedian) * 1.2;
    const pw = (profSalary / max) * 100;
    const nw = (nationalMedian / max) * 100;
    return `<svg viewBox="0 0 360 90" class="chart-svg">
      <text x="0" y="18" font-size="12" fill="#334155" font-weight="700">This Profession</text>
      <rect x="120" y="5" width="${pw * 2.1}" height="20" rx="5" fill="#003366"/>
      <text x="${124 + pw * 2.1}" y="19" font-size="14" fill="#003366" font-weight="900">$${(profSalary/1000).toFixed(0)}K</text>
      <text x="0" y="54" font-size="12" fill="#334155" font-weight="700">National Median</text>
      <rect x="120" y="41" width="${nw * 2.1}" height="20" rx="5" fill="#94a3b8"/>
      <text x="${124 + nw * 2.1}" y="55" font-size="14" fill="#003366" font-weight="900">$${(nationalMedian/1000).toFixed(0)}K</text>
      <text x="0" y="82" font-size="13" fill="#22c55e" font-weight="900">+${(((profSalary - nationalMedian)/nationalMedian)*100).toFixed(0)}% above median</text>
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
      <text x="50" y="46" text-anchor="middle" font-size="22" font-weight="900" fill="#1a1a2e">${pct}%</text>
      <text x="50" y="62" text-anchor="middle" font-size="9" font-weight="700" fill="#94a3b8">10yr Growth</text>
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
     GENERATE REPORT — NC A&T BRANDED MAGAZINE
     ══════════════════════════════════════════════════ */

  function generate() {
    const timeline = EMMA_STATE.get('timeline');
    const branding = EMMA_STATE.get('branding');
    const program  = EMMA_STATE.get('currentProgram');
    const checked  = EMMA_STATE.get('checkedMilestones') || {};
    if (!timeline || !branding) { EMMA_MATRIX?.showToast('\u26a0\ufe0f Load a program first', 'error'); return; }

    const key  = matchKey(program);
    const prof = DB[key];
    const overall = EMMA_STATE.getOverallProgress();
    const totalMs = timeline.phases.reduce((s,p) => s + p.milestones.length, 0);
    const doneMs  = Object.values(checked).filter(Boolean).length;
    const today   = new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'});
    const circum  = 2 * Math.PI * 42;
    const ringClr = overall >= 75 ? '#22c55e' : overall >= 50 ? '#FF9800' : '#003366';
    const collegeName = branding.collegeName || 'NC A&T State University';
    const collegeIconPath = getCollegeIcon(collegeName);

    // Resolve absolute base URL so images work in the popup window
    const loc = window.location;
    const basePath = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    const baseUrl = loc.origin + basePath;
    const abs = (rel) => rel.startsWith('http') ? rel : baseUrl + rel;

    // Career cards with job search links
    const careerHTML = prof.careers.map((c, i) => {
      const jobQuery = encodeURIComponent(c.title);
      const indeedUrl = `https://www.indeed.com/jobs?q=${jobQuery}`;
      const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${jobQuery}`;
      return `<div class="cr-card">
        <div class="cr-rank-num">${i + 1}</div>
        <div class="cr-icon">${c.icon}</div>
        <div class="cr-body">
          <div class="cr-title">${c.title}</div>
          <div class="cr-desc">${c.desc}</div>
          <div class="cr-sal">${c.salary}</div>
          <div class="cr-jobs"><a href="${indeedUrl}" target="_blank" class="job-link">Indeed</a> <a href="${linkedInUrl}" target="_blank" class="job-link ln">LinkedIn</a></div>
        </div>
      </div>`;
    }).join('');

    const doHTML = prof.whatYouCanDo.map(d => `<li>${d}</li>`).join('');
    const relHTML = prof.related.map(r =>
      `<div class="rel-card"><div class="rel-name">${r.name}</div><div class="rel-why">${r.why}</div></div>`
    ).join('');

    // Professional organizations from branding
    const proOrgs = branding.professionalOrgs || [];
    const orgsHTML = proOrgs.map(o =>
      `<a href="${o.url}" target="_blank" class="org-card">
        <div class="org-icon">${o.icon}</div>
        <div class="org-body">
          <div class="org-name">${o.name}</div>
          <div class="org-desc">${o.description}</div>
        </div>
      </a>`
    ).join('');

    // Journey phases
    const phasesHTML = timeline.phases.map((phase, idx) => {
      const c = PHASE_CLR[idx % 4];
      const pp = EMMA_STATE.getPhaseProgress(phase.id);
      const phaseIcon = ['\ud83c\udf31','\ud83d\udd25','\u26a1','\ud83d\ude80'][idx % 4];
      const msHTML = phase.milestones.map(m => {
        const d = checked[m.id]; const ic = CAT_ICONS[m.category] || '\ud83d\udccc';
        return `<div class="ms ${d?'ms-d':''}"><span class="ms-c">${d?'\u2705':'\u2b1c'}</span><span class="ms-i">${ic}</span><div class="ms-t"><span class="ms-l">${m.label}</span>${m.credits?`<span class="ms-cr">${m.credits} cr</span>`:''}</div></div>`;
      }).join('');
      return `<div class="ph"><div class="ph-h" style="border-left:6px solid ${c};background:${c}0C"><div class="ph-r"><h3 style="color:${c}">${phaseIcon} ${phase.name}</h3><span class="ph-p" style="background:${c}">${pp.checked}/${pp.total} \u00b7 ${pp.percent}%</span></div>${phase.description?`<p class="ph-d">${phase.description}</p>`:''}</div><div class="ms-g">${msHTML}</div></div>`;
    }).join('');

    // Images — use absolute URLs so they load in the popup
    const heroImg = abs(prof.hero);
    const galleryImgs = (prof.images || [prof.hero]).map(abs);
    const pg2Gallery = galleryImgs.slice(0, 2).map(img =>
      `<img src="${img}" class="ov-gallery-img" alt="Career" onerror="this.style.display='none'" />`
    ).join('');
    const pg3Gallery = galleryImgs.slice(0, 4).map(img =>
      `<img src="${img}" class="gal-img" alt="Professionals in the field" onerror="this.style.display='none'" />`
    ).join('');
    const collegeIconAbs = abs(collegeIconPath);
    const ncatLogoAbs = abs('assets/images/ncat-logo-white.png');

    const pullQuote = `\u201cYour degree in ${prof.title} doesn\u2019t just open doors \u2014 it builds the doors that don\u2019t exist yet.\u201d`;

    // ─── PAGE FOOTER TEMPLATE ───
    const pgFoot = (left, right) => `<div class="pg-footer"><div><span class="stamp">NC A&T State University</span> \u00b7 ${left}</div><div>${right}</div></div>`;

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<base href="${baseUrl}" />
<title>${prof.title} \u2014 Experiential Journey Map | NC A&T</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
/* ============================================
   NC A&T BRAND STANDARDS
   Aggie Blue #003366 · Aggie Gold #FDB827
   Font: Montserrat (official university font)
   ============================================ */
*{margin:0;padding:0;box-sizing:border-box}
:root{--ab:#003366;--abd:#002244;--ag:#FDB827;--agl:#FFF3D0;
  --t1:#1a1a2e;--t2:#334155;--t3:#64748b;--t4:#94a3b8;
  --bd:#e2e8f0;--bgL:#f8fafc;--bgW:#FFFBF0;--gr:#22c55e}
body{font-family:'Montserrat',sans-serif;color:var(--t1);background:#fff;line-height:1.7;
  -webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:letter;margin:0}
.pg{page-break-after:always;min-height:100vh;position:relative;overflow:hidden}
.pg:last-child{page-break-after:auto}

/* PAGE FOOTER */
.pg-footer{position:absolute;bottom:0;left:0;right:0;padding:0.55rem 3rem;
  display:flex;justify-content:space-between;align-items:center;
  font-size:0.5rem;color:var(--t4);font-weight:600;border-top:3px solid var(--ag);background:#fff}
.pg-footer .stamp{font-weight:900;color:var(--ab);text-transform:uppercase;letter-spacing:0.15em}

/* ═══ COVER ═══ */
.cover{display:flex;flex-direction:column;justify-content:flex-end;min-height:100vh}
.cover-bg{position:absolute;inset:0;object-fit:cover;width:100%;height:100%;filter:brightness(0.22) saturate(1.3)}
.cover-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,34,68,0.95) 0%,rgba(0,34,68,0.55) 40%,rgba(0,34,68,0.15) 70%,transparent 100%);z-index:1}
.cover-ov{position:relative;z-index:2;padding:3.5rem 3.5rem 2.8rem;color:#fff}
.cover-bar{width:5rem;height:6px;background:var(--ag);margin-bottom:1.5rem;border-radius:3px}
.cover-badge{font-size:0.62rem;font-weight:800;text-transform:uppercase;letter-spacing:0.4em;color:var(--ag);margin-bottom:1rem}
.cover h1{font-size:2.9rem;font-weight:900;letter-spacing:-0.03em;line-height:1.08;max-width:30rem}
.cover .tag{font-size:1.05rem;font-weight:600;margin-top:0.7rem;opacity:0.92;max-width:30rem;line-height:1.5}
.cover-gold-bar{position:absolute;bottom:0;left:0;right:0;height:10px;background:var(--ag);z-index:3}
.cover-top{position:absolute;top:2rem;left:3rem;right:3rem;z-index:3;display:flex;justify-content:space-between;align-items:flex-start}
.cover-logo-img{height:55px;width:auto}
.cover-col-right{display:flex;align-items:center;gap:0.6rem;text-align:right;color:rgba(255,255,255,0.92)}
.cover-col-icon{height:40px;width:40px}
.cover-col-txt .cn{font-size:0.5rem;font-weight:800;text-transform:uppercase;letter-spacing:0.2em;color:var(--ag)}
.cover-col-txt .cs{font-size:0.42rem;font-weight:600;opacity:0.7;margin-top:2px}
.cover-bot{position:absolute;bottom:18px;right:3rem;z-index:3;font-size:0.5rem;font-weight:800;color:var(--ag);letter-spacing:0.15em;text-transform:uppercase}

/* ═══ PAGE 2: OVERVIEW + DATA ═══ */
.data-pg{padding:2.6rem 3rem 3.5rem}
.pg-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.6rem;padding-bottom:0.8rem;border-bottom:3px solid var(--ab)}
.pg-hdr-icon{height:36px;width:36px;opacity:0.6}
.sec-badge{font-size:0.55rem;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:#fff;background:var(--ab);display:inline-block;padding:0.3rem 0.9rem;border-radius:4px;margin-bottom:0.45rem}
.sec-h2{font-size:1.45rem;font-weight:900;color:var(--ab);letter-spacing:-0.02em;line-height:1.25}
.sec-sub{font-size:0.82rem;color:var(--t2);font-weight:500;margin-bottom:1.2rem;max-width:38rem;line-height:1.7}
.ov-layout{display:flex;gap:1.4rem;margin-bottom:1.2rem}
.ov-img-col{flex-shrink:0;width:230px;display:flex;flex-direction:column;gap:0.5rem}
.ov-img{width:100%;height:165px;border-radius:12px;object-fit:cover;box-shadow:0 6px 24px rgba(0,0,0,0.12)}
.ov-gallery-img{width:100%;height:100px;border-radius:10px;object-fit:cover;box-shadow:0 4px 16px rgba(0,0,0,0.1)}
.ov-txt{flex:1}
.ov-txt p{font-size:0.8rem;color:var(--t2);font-weight:500;line-height:1.8;margin-bottom:0.6rem}
.pull-q{margin:0.6rem 0;padding:0.7rem 1.1rem;border-left:4px solid var(--ag);background:var(--bgW);border-radius:0 8px 8px 0;font-size:0.82rem;font-style:italic;font-weight:700;color:var(--ab);line-height:1.6}
.ncat-hist{margin-top:0.7rem;padding:0.7rem 1rem;background:linear-gradient(135deg,#002244 0%,#003366 100%);border-radius:10px;color:#fff;position:relative;overflow:hidden}
.ncat-hist::before{content:'';position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:var(--ag);opacity:0.08;border-radius:50%}
.ncat-hist-title{font-size:0.5rem;font-weight:900;text-transform:uppercase;letter-spacing:0.25em;color:var(--ag);margin-bottom:0.3rem}
.ncat-hist p{font-size:0.7rem;font-weight:500;line-height:1.7;opacity:0.92}
.charts-row{display:flex;gap:0.9rem;margin-top:1rem}
.chart-box{flex:1;background:var(--bgL);border:1px solid var(--bd);border-radius:12px;padding:0.8rem 1rem}
.chart-box .ch-title{font-size:0.6rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:var(--t3);margin-bottom:0.35rem}
.chart-svg{width:100%;height:auto}
.chart-label{font-size:11px;fill:var(--t2);font-weight:700}
.chart-val{font-size:13px;fill:var(--ab);font-weight:900}
.gauge-svg{width:100px;height:100px;display:block;margin:0 auto}
.emp-stat{text-align:center;padding-top:0.25rem}
.emp-num{font-size:1.8rem;font-weight:900;color:var(--ab)}
.emp-lbl{font-size:0.6rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:0.1em}
.do-section{margin-top:1rem;padding:0.9rem 1.1rem;background:var(--bgW);border-radius:12px;border:2px solid var(--ag)}
.do-title{font-size:0.5rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:var(--ab);margin-bottom:0.4rem}
.do-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.15rem}
.do-grid li{font-size:0.7rem;font-weight:600;color:var(--t2);list-style:none;padding:0.15rem 0 0.15rem 1.3em;position:relative;line-height:1.5}
.do-grid li::before{content:'\u2192';position:absolute;left:0;color:var(--ag);font-weight:900}

/* ═══ PAGE 3: CAREERS ═══ */
.careers-pg{padding:2.6rem 3rem 3.5rem}
.cr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-top:0.7rem}
.cr-card{display:flex;gap:0.5rem;align-items:flex-start;padding:0.7rem;border:1px solid var(--bd);border-radius:10px;background:#fff;position:relative;overflow:hidden}
.cr-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--ag)}
.cr-rank-num{position:absolute;top:0.35rem;right:0.45rem;font-size:0.45rem;font-weight:900;color:var(--t4);opacity:0.35}
.cr-icon{font-size:1.3rem;flex-shrink:0;width:1.8rem;text-align:center;padding-top:0.05rem}
.cr-body{flex:1;min-width:0;padding-left:0.1rem}
.cr-title{font-size:0.78rem;font-weight:800;color:var(--ab);margin-bottom:0.1rem;line-height:1.3}
.cr-desc{font-size:0.67rem;color:var(--t2);font-weight:500;line-height:1.5}
.cr-sal{font-size:0.67rem;font-weight:800;color:var(--gr);margin-top:0.2rem}
.cr-jobs{margin-top:0.2rem;display:flex;gap:0.3rem}
.job-link{font-size:0.52rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;padding:0.15rem 0.45rem;border-radius:4px;text-decoration:none;background:var(--ab);color:#fff;transition:opacity 0.2s}
.job-link.ln{background:#0A66C2}
.job-link:hover{opacity:0.8}
@media print{.job-link{border:1px solid var(--ab);background:transparent!important;color:var(--ab)!important}.job-link.ln{border-color:#0A66C2;color:#0A66C2!important}}
.stats-recap{display:flex;gap:0.8rem;margin-top:0.8rem;padding:0.7rem 1.2rem;background:var(--ab);border-radius:10px;color:#fff;align-items:center}
.stats-recap .sr-item{flex:1;text-align:center}
.stats-recap .sr-val{font-size:1rem;font-weight:900;color:var(--ag)}
.stats-recap .sr-lbl{font-size:0.45rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;opacity:0.8}
.stats-recap .sr-div{width:1px;height:1.8rem;background:rgba(255,255,255,0.2)}
.gal-row{display:flex;gap:0.5rem;margin-top:1rem}
.gal-img{flex:1;height:120px;object-fit:cover;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.1)}

/* ═══ PAGE 4: JOURNEY MAP ═══ */
.map-pg{padding:2.6rem 3rem 3.5rem}
.map-prog{display:flex;align-items:center;gap:1.5rem;margin:0.8rem 0 1.2rem;padding:0.9rem 1.3rem;background:linear-gradient(135deg,var(--bgL) 0%,var(--bgW) 100%);border-radius:14px;border:2px solid var(--bd)}
.ring{width:4.2rem;height:4.2rem;position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ring svg{position:absolute;width:100%;height:100%;transform:rotate(-90deg)}
.ring .pct{font-size:1.1rem;font-weight:900;color:var(--ab)}
.prog-t .prog-big{font-size:0.95rem;font-weight:900;color:var(--ab)}
.prog-t .prog-sm{font-size:0.65rem;color:var(--t2);font-weight:500}
.ph{margin-bottom:0.55rem;page-break-inside:avoid}
.ph-h{padding:0.45rem 0.8rem;border-radius:8px;margin-bottom:0.25rem}
.ph-r{display:flex;justify-content:space-between;align-items:center}
.ph-r h3{font-size:0.78rem;font-weight:900;text-transform:uppercase;letter-spacing:0.04em}
.ph-p{font-size:0.55rem;font-weight:800;color:#fff;padding:0.12rem 0.5rem;border-radius:20px}
.ph-d{font-size:0.62rem;color:var(--t2);margin-top:0.12rem;font-weight:500}
.ms-g{display:grid;grid-template-columns:1fr 1fr;gap:0.18rem}
.ms{display:flex;align-items:center;gap:0.25rem;padding:0.28rem 0.4rem;border:1px solid var(--bd);border-radius:5px;font-size:0.65rem}
.ms-d{background:#f0fdf4;border-color:#bbf7d0}
.ms-c{font-size:0.65rem;flex-shrink:0}.ms-i{font-size:0.6rem;flex-shrink:0}
.ms-t{display:flex;flex-direction:column;min-width:0}
.ms-l{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ms-cr{font-size:0.5rem;color:var(--t4);font-weight:600}

/* ═══ PAGE 5: RELATED + QR ═══ */
.rel-pg{padding:2.6rem 3rem 3.5rem}
.rel-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-top:0.7rem}
.rel-card{padding:0.7rem 0.8rem;border:2px solid var(--bd);border-radius:10px}
.rel-name{font-size:0.82rem;font-weight:900;color:var(--ab);line-height:1.3}
.rel-why{font-size:0.67rem;color:var(--t2);font-weight:500;margin-top:0.12rem;line-height:1.5}
.org-section{margin-top:0.9rem}
.org-sec-title{font-size:0.55rem;font-weight:900;text-transform:uppercase;letter-spacing:0.25em;color:var(--ab);margin-bottom:0.4rem;padding-left:0.1rem}
.org-grid{display:flex;flex-direction:column;gap:0.35rem}
.org-card{display:flex;gap:0.5rem;align-items:flex-start;padding:0.55rem 0.7rem;border:2px solid var(--bd);border-radius:8px;text-decoration:none;color:inherit;transition:border-color 0.2s}
.org-card:hover{border-color:var(--ag)}
.org-icon{font-size:1.2rem;flex-shrink:0;width:1.5rem;text-align:center;padding-top:0.05rem}
.org-body{flex:1;min-width:0}
.org-name{font-size:0.72rem;font-weight:800;color:var(--ab);line-height:1.3}
.org-desc{font-size:0.6rem;color:var(--t2);font-weight:500;line-height:1.5}
.qr-section{margin-top:1.2rem;padding:1.3rem 1.8rem;background:linear-gradient(135deg,var(--ab) 0%,var(--abd) 100%);border-radius:16px;display:flex;align-items:center;gap:1.4rem;color:#fff}
.qr-img{width:120px;height:120px;border-radius:10px;border:4px solid var(--ag);flex-shrink:0}
.qr-txt h3{font-size:1.15rem;font-weight:900;margin-bottom:0.25rem}
.qr-txt p{font-size:0.78rem;font-weight:500;opacity:0.9;line-height:1.7}
.qr-txt .qr-url{font-size:0.85rem;font-weight:900;color:var(--ag);margin-top:0.35rem;letter-spacing:0.05em}
.close-brand{margin-top:1.2rem;display:flex;justify-content:space-between;align-items:center;padding:1rem 1.3rem;background:var(--bgL);border-radius:12px;border:2px solid var(--bd)}
.cb-left{display:flex;align-items:center;gap:0.7rem}
.cb-icon{height:32px;width:32px;opacity:0.7}
.cb-aggie{font-size:1rem;font-weight:900;color:var(--ab)}
.cb-sub{font-size:0.55rem;color:var(--t3);font-weight:600}
.cb-right{text-align:right}
.cb-emma{font-size:0.65rem;font-weight:800;color:var(--ab)}
.cb-copy{font-size:0.45rem;color:var(--t4);font-weight:600}

/* PRINT & TOOLBAR */
@media print{.no-print{display:none!important}.ph{page-break-inside:avoid}}
.pbar{position:fixed;bottom:0;left:0;right:0;background:var(--ab);padding:0.6rem 3rem;display:flex;justify-content:center;gap:1rem;z-index:100;box-shadow:0 -4px 20px rgba(0,0,0,0.3)}
.pbar button{padding:0.65rem 2rem;font-size:0.8rem;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.1em}
.btn-p{background:var(--ag);color:var(--ab)}.btn-c{background:rgba(255,255,255,0.15);color:#fff}
</style></head><body>

<div class="pbar no-print">
  <button class="btn-p" onclick="window.print()">\ud83d\udda8\ufe0f Print / Save PDF</button>
  <button class="btn-c" onclick="window.close()">\u2715 Close</button>
</div>

<!-- PAGE 1: COVER -->
<div class="pg cover">
  <img src="${heroImg}" class="cover-bg" alt="${prof.title}"/>
  <div class="cover-grad"></div>
  <div class="cover-top">
    <img src="${ncatLogoAbs}" class="cover-logo-img" alt="NC A&T" onerror="this.alt='NC A&T'"/>
    <div class="cover-col-right">
      <div class="cover-col-txt">
        <div class="cn">${collegeName}</div>
        <div class="cs">North Carolina A&T State University</div>
      </div>
      <img src="${collegeIconAbs}" class="cover-col-icon" alt="" onerror="this.style.display='none'"/>
    </div>
  </div>
  <div class="cover-ov">
    <div class="cover-bar"></div>
    <div class="cover-badge">Experiential Journey Map \u00b7 EMMA Platform</div>
    <h1>${prof.title}</h1>
    <div class="tag">${prof.tagline}</div>
  </div>
  <div class="cover-bot">Powered by EMMA</div>
  <div class="cover-gold-bar"></div>
</div>

<!-- PAGE 2: OVERVIEW + DATA -->
<div class="pg data-pg">
  <div class="pg-hdr">
    <div>
      <div class="sec-badge">Career Overview</div>
      <h2 class="sec-h2">${prof.title}</h2>
    </div>
    <img src="${collegeIconAbs}" class="pg-hdr-icon" alt="" onerror="this.style.display='none'"/>
  </div>
  <div class="ov-layout">
    <div class="ov-img-col">
      <img src="${heroImg}" class="ov-img" alt="${prof.title}"/>
      ${pg2Gallery}
    </div>
    <div class="ov-txt">
      <p>${prof.overview}</p>
      <div class="pull-q">${pullQuote}</div>
      ${prof.ncatHistory ? `<div class="ncat-hist">
        <div class="ncat-hist-title">🏨 Aggie Legacy</div>
        <p>${prof.ncatHistory}</p>
      </div>` : ''}
    </div>
  </div>
  <div class="charts-row">
    <div class="chart-box"><div class="ch-title">\ud83d\udcb0 Salary Comparison</div>${salaryBarChart(prof.blsSalary, prof.nationalMedian)}</div>
    <div class="chart-box"><div class="ch-title">\ud83d\udcc8 Job Growth (10yr)</div>${growthGauge(prof.blsGrowth)}</div>
    <div class="chart-box"><div class="ch-title">\ud83c\udfe2 U.S. Employment</div>${employmentStat(prof.blsEmployment)}</div>
  </div>
  <div class="do-section">
    <div class="do-title">\ud83d\ude80 What You Can Do With This Degree</div>
    <ul class="do-grid">${doHTML}</ul>
  </div>
  ${pgFoot(collegeName, 'EMMA \u00b7 ' + today)}
</div>

<!-- PAGE 3: TOP CAREERS + IMAGES -->
<div class="pg careers-pg">
  <div class="pg-hdr">
    <div>
      <div class="sec-badge">What You Can Become</div>
      <h2 class="sec-h2">Top Career Paths in ${prof.title}</h2>
    </div>
    <img src="${collegeIconAbs}" class="pg-hdr-icon" alt="" onerror="this.style.display='none'"/>
  </div>
  <p class="sec-sub">Your degree opens doors to diverse, rewarding careers. Here are the top paths where NC A&T Aggies are making an impact.</p>
  <div class="cr-grid">${careerHTML}</div>
  <div class="stats-recap">
    <div class="sr-item"><div class="sr-val">$${(prof.blsSalary/1000).toFixed(0)}K</div><div class="sr-lbl">Median Salary</div></div>
    <div class="sr-div"></div>
    <div class="sr-item"><div class="sr-val">${prof.blsGrowth}%</div><div class="sr-lbl">Job Growth</div></div>
    <div class="sr-div"></div>
    <div class="sr-item"><div class="sr-val">${prof.blsEmployment >= 1000 ? (prof.blsEmployment/1000).toFixed(0)+'K' : prof.blsEmployment}</div><div class="sr-lbl">U.S. Jobs</div></div>
    <div class="sr-div"></div>
    <div class="sr-item"><div class="sr-val">${prof.careers.length}</div><div class="sr-lbl">Career Paths</div></div>
  </div>
  <div class="gal-row">${pg3Gallery}</div>
  ${pgFoot(prof.title, 'Bureau of Labor Statistics \u00b7 ' + today)}
</div>

<!-- PAGE 4: JOURNEY MAP -->
<div class="pg map-pg">
  <div class="pg-hdr">
    <div>
      <div class="sec-badge">Your Journey</div>
      <h2 class="sec-h2">4-Year Experiential Journey Map</h2>
    </div>
    <img src="${collegeIconAbs}" class="pg-hdr-icon" alt="" onerror="this.style.display='none'"/>
  </div>
  <p class="sec-sub">Track your progress across the four-phase experiential framework \u2014 from exploration to launch.</p>
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
      <div class="prog-sm">Generated ${today} \u00b7 ${branding.programName || prof.title}</div>
    </div>
  </div>
  ${phasesHTML}
  ${pgFoot(branding.programName || prof.title, 'Experiential Journey Map \u00b7 ' + today)}
</div>

<!-- PAGE 5: RELATED FIELDS + QR -->
<div class="pg rel-pg">
  <div class="pg-hdr">
    <div>
      <div class="sec-badge">Explore Related Fields</div>
      <h2 class="sec-h2">Students Who Love ${prof.title} Also Explore</h2>
    </div>
    <img src="${collegeIconAbs}" class="pg-hdr-icon" alt="" onerror="this.style.display='none'"/>
  </div>
  <p class="sec-sub">Your interests connect to many fields. Consider a minor or double major to strengthen your career portfolio.</p>
  <div class="rel-grid">${relHTML}</div>

  ${proOrgs.length > 0 ? `
  <div class="org-section">
    <div class="org-sec-title">🏢 Professional Organizations</div>
    <div class="org-grid">${orgsHTML}</div>
  </div>` : ''}

  <div class="qr-section">
    ${qrCodeImg('https://thinkemma.app')}
    <div class="qr-txt">
      <h3>Start Your Journey Today</h3>
      <p>Scan the QR code to open EMMA \u2014 your Experiential Major Mapping Assistant. Track your milestones, explore career paths, and build your experiential portfolio.</p>
      <div class="qr-url">thinkemma.app</div>
    </div>
  </div>

  <div class="close-brand">
    <div class="cb-left">
      <img src="${collegeIconAbs}" class="cb-icon" alt="" onerror="this.style.display='none'"/>
      <div>
        <div class="cb-aggie">Aggies Do! \ud83d\udc99\ud83d\udc9b</div>
        <div class="cb-sub">North Carolina Agricultural & Technical State University \u00b7 Greensboro, NC</div>
      </div>
    </div>
    <div class="cb-right">
      <div class="cb-emma">Generated by EMMA</div>
      <div class="cb-copy">\u00a9 ${new Date().getFullYear()} Think! Design and Planning, LLC \u00b7 thinkemma.app</div>
    </div>
  </div>

  ${pgFoot('Aggies Do! \u00b7 ' + collegeName, '\u00a9 ' + new Date().getFullYear() + ' Think! Design & Planning, LLC')}
</div>

</body></html>`;

    // Open popup and write HTML. The <base href> tag in the HTML ensures
    // all relative image/icon paths resolve against the EMMA site URL.
    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } else {
      EMMA_MATRIX?.showToast('\u26a0\ufe0f Pop-up blocked \u2014 allow pop-ups', 'error');
    }
  }

  return { generate };
})();

console.log('[EMMA] Premium Magazine Report initialized');
