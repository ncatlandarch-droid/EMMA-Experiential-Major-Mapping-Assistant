/**
 * EMMA — Generate ALL remaining seed data (CHHS, CAHSS, CEd, CoST)
 * Creates branding.json, timeline.json, matrix.json for every program
 * Run: node gen-all-seeds.js
 */
const fs = require('fs');
const path = require('path');
const SEEDS = path.join(__dirname, 'data', 'seeds');

const CC = {
  Purpose:{hex:'#2563EB',rgb:'37,99,235',emoji:'🔍',label:'Purpose & Self-Discovery',description:'Research, coursework, and foundational experiences'},
  Communities:{hex:'#059669',rgb:'5,150,105',emoji:'🤝',label:'Communities & Service',description:'Collaborative projects and community engagement'},
  LocalGlobal:{hex:'#D97706',rgb:'217,119,6',emoji:'🌍',label:'Local & Global Engagement',description:'Field work, internships, and real-world applications'},
  Identity:{hex:'#7C3AED',rgb:'124,58,237',emoji:'💼',label:'Professional Identity',description:'Career prep and professional practice'}
};
const BC = {primaryHex:'#004684',primaryRgb:'0,70,132',secondaryHex:'#fdb927',secondaryRgb:'253,185,39',backgroundHex:'#F0F2F5',surfaceHex:'#FFFFFF',textPrimaryHex:'#1A1A2E',textSecondaryHex:'#555770'};
const MATRIX = {validationCategories:Object.keys(CC).map(k=>({id:k,label:CC[k].label,description:CC[k].description,color:CC[k].hex}))};

function mkBranding(s,college,dept,prog,deg,field,bls,salary,growth,jobs,employers,certs,related,skills) {
  return {institutionName:'North Carolina Agricultural and Technical State University',abbreviation:'NC A&T',collegeName:college,departmentName:dept,programName:prog,degreeType:deg,programSlug:s,slug:s,
    programDescription:`${prog} at NC A&T prepares students for rewarding careers in ${field.toLowerCase()}. Through rigorous coursework, hands-on projects, and internships, graduates emerge ready to lead.`,
    tagline:`Leading the Future of ${field}`,brandingColors:BC,categoryColors:CC,
    careerOutlook:{field,blsCode:bls,medianSalary:salary,growthRate:`${growth} (2022-2032)`,totalJobs:jobs,topEmployers:employers,certifications:certs,relatedFields:related,keySkills:skills}};
}

function mkTimeline(phases) {
  return {phases:phases.map(p=>({id:p.id,name:p.name,subtitle:p.sub,description:p.desc,
    milestones:p.ms.map(m=>({id:m.id,label:m.l,courseRef:m.c,credits:m.cr||3,category:m.cat,semester:m.sem,description:m.d,skills:m.sk}))}))};
}

// ═════════════════════════════════════════
// CHHS — Hairston College of Health & Human Sciences
// ═════════════════════════════════════════
const CHHS = 'Hairston College of Health & Human Sciences (CHHS)';

const ALL = [
// ── CHHS-NURS ──
{s:'chhs-nurs',col:CHHS,dept:'School of Nursing',prog:'B.S.N. in Nursing',deg:'BSN',field:'Nursing',bls:'29-1141',sal:'$81,220',gr:'6%',jobs:'3,175,000',
emp:['Cone Health','Duke Health','Novant Health','HCA Healthcare','VA Medical Centers'],cert:['NCLEX-RN','BLS/ACLS','Specialty Certifications'],rel:['Biology','Psychology','Health Services Management'],sk:['Patient Assessment','Clinical Skills','Pharmacology','EHR Systems','Critical Thinking'],
tl:[
  {id:'year-1',name:'Year 1',sub:'Explore',desc:'Science foundations and intro to nursing.',ms:[
    {id:'y1-nurs101',l:'Intro to Professional Nursing',c:'NURS 101',cat:'Purpose',sem:'fall',d:'History, ethics, and scope of professional nursing.',sk:['Nursing Overview']},
    {id:'y1-biol221',l:'Human Anatomy & Physiology I',c:'BIOL 221',cr:4,cat:'Identity',sem:'fall',d:'Skeletal, muscular, and nervous systems.',sk:['Anatomy','Physiology']},
    {id:'y1-biol222',l:'Human Anatomy & Physiology II',c:'BIOL 222',cr:4,cat:'Identity',sem:'spring',d:'Cardiovascular, respiratory, and endocrine systems.',sk:['Anatomy','Physiology']},
    {id:'y1-psyc201',l:'Intro to Psychology',c:'PSYC 201',cat:'Communities',sem:'spring',d:'Psychological foundations for patient-centered care.',sk:['Psychology','Human Behavior']}
  ]},
  {id:'year-2',name:'Year 2',sub:'Engage',desc:'Fundamentals of nursing and clinical rotations.',ms:[
    {id:'y2-nurs210',l:'Health Assessment',c:'NURS 210',cat:'Identity',sem:'fall',d:'Physical examination and patient history taking.',sk:['Health Assessment','Vital Signs']},
    {id:'y2-nurs220',l:'Pharmacology',c:'NURS 220',cat:'Purpose',sem:'spring',d:'Drug classifications, dosage calculations, and administration.',sk:['Pharmacology','Drug Admin']},
    {id:'y2-nurs230',l:'Fundamentals of Nursing',c:'NURS 230',cr:4,cat:'Communities',sem:'fall',d:'Core nursing skills with clinical lab practice.',sk:['Clinical Skills','Patient Care']},
    {id:'y2-nurs240',l:'Pathophysiology',c:'NURS 240',cat:'LocalGlobal',sem:'spring',d:'Disease mechanisms and clinical manifestations.',sk:['Pathophysiology','Disease Process']}
  ]},
  {id:'year-3',name:'Year 3',sub:'Develop',desc:'Medical-surgical nursing and specialty clinicals.',ms:[
    {id:'y3-nurs310',l:'Adult Health Nursing I',c:'NURS 310',cr:4,cat:'Identity',sem:'fall',d:'Acute and chronic care nursing with hospital clinicals.',sk:['Med-Surg Nursing','Hospital Care']},
    {id:'y3-nurs320',l:'Mental Health Nursing',c:'NURS 320',cat:'Communities',sem:'spring',d:'Psychiatric nursing and therapeutic communication.',sk:['Mental Health','Therapeutic Communication']},
    {id:'y3-nurs330',l:'Maternal-Child Nursing',c:'NURS 330',cr:4,cat:'LocalGlobal',sem:'fall',d:'Obstetric and pediatric nursing with clinical rotation.',sk:['OB Nursing','Pediatrics']},
    {id:'y3-nurs340',l:'Community Health Nursing',c:'NURS 340',cat:'Communities',sem:'spring',d:'Population health, epidemiology, and public health nursing.',sk:['Public Health','Epidemiology']}
  ]},
  {id:'year-4',name:'Year 4',sub:'Launch',desc:'Leadership, preceptorship, and NCLEX preparation.',ms:[
    {id:'y4-nurs410',l:'Adult Health Nursing II',c:'NURS 410',cr:4,cat:'Identity',sem:'fall',d:'Complex medical-surgical nursing and critical care.',sk:['Critical Care','Complex Patients']},
    {id:'y4-nurs420',l:'Nursing Leadership',c:'NURS 420',cat:'Purpose',sem:'fall',d:'Healthcare management, delegation, and evidence-based practice.',sk:['Leadership','EBP']},
    {id:'y4-nurs490',l:'Clinical Preceptorship',c:'NURS 490',cr:6,cat:'LocalGlobal',sem:'spring',d:'240-hour preceptorship with RN mentor in specialty area.',sk:['Preceptorship','Clinical Immersion']},
    {id:'y4-nclex',l:'NCLEX-RN Preparation',c:'NURS 499',cr:1,cat:'Communities',sem:'spring',d:'Comprehensive NCLEX review and career placement.',sk:['NCLEX-RN','Career Readiness']}
  ]}
]},
// ── CHHS-SLPA ──
{s:'chhs-slpa',col:CHHS,dept:'Communication Sciences & Disorders',prog:'B.A. in Speech-Language Pathology & Audiology',deg:'BA',field:'Speech-Language Pathology',bls:'29-1127',sal:'$84,140',gr:'19%',jobs:'168,000',
emp:['Hospitals','School Districts','Rehabilitation Centers','Private Practice','VA Medical Centers'],cert:['CCC-SLP (grad)','State Licensure'],rel:['Psychology','Special Education','Audiology'],sk:['Speech Therapy','Language Assessment','Articulation','AAC Devices','Clinical Documentation'],
tl:[
  {id:'year-1',name:'Year 1',sub:'Explore',desc:'Foundations in communication sciences.',ms:[
    {id:'y1-csdi100',l:'Intro to Communication Disorders',c:'CSDI 100',cat:'Purpose',sem:'fall',d:'Overview of speech, language, and hearing disorders.',sk:['Communication Disorders']},
    {id:'y1-biol101',l:'Biology',c:'BIOL 101',cat:'Identity',sem:'fall',d:'Biological foundations for clinical sciences.',sk:['Biology']},
    {id:'y1-psyc201',l:'General Psychology',c:'PSYC 201',cat:'Communities',sem:'spring',d:'Psychological principles for clinical practice.',sk:['Psychology']},
    {id:'y1-csdi200',l:'Phonetics',c:'CSDI 200',cat:'Identity',sem:'spring',d:'International Phonetic Alphabet and transcription.',sk:['Phonetics','IPA']}
  ]},
  {id:'year-2',name:'Year 2',sub:'Engage',desc:'Anatomy of speech and language development.',ms:[
    {id:'y2-csdi210',l:'Anatomy of Speech & Hearing',c:'CSDI 210',cat:'Identity',sem:'fall',d:'Structures and functions of speech and hearing mechanisms.',sk:['Speech Anatomy','Hearing']},
    {id:'y2-csdi220',l:'Language Development',c:'CSDI 220',cat:'Purpose',sem:'spring',d:'Normal language acquisition from birth through adolescence.',sk:['Language Development']},
    {id:'y2-csdi230',l:'Intro to Audiology',c:'CSDI 230',cat:'LocalGlobal',sem:'fall',d:'Hearing science, audiometric testing, and hearing aids.',sk:['Audiology','Hearing Assessment']},
    {id:'y2-stat210',l:'Statistics',c:'STAT 210',cat:'Communities',sem:'spring',d:'Statistical methods for clinical research.',sk:['Statistics']}
  ]},
  {id:'year-3',name:'Year 3',sub:'Develop',desc:'Clinical methods and disorders.',ms:[
    {id:'y3-csdi310',l:'Articulation Disorders',c:'CSDI 310',cat:'Identity',sem:'fall',d:'Assessment and treatment of speech sound disorders.',sk:['Articulation','Speech Therapy']},
    {id:'y3-csdi320',l:'Language Disorders',c:'CSDI 320',cat:'Purpose',sem:'spring',d:'Assessment and intervention for language impairments.',sk:['Language Therapy']},
    {id:'y3-csdi330',l:'Clinical Methods',c:'CSDI 330',cat:'Communities',sem:'fall',d:'Introduction to clinical practicum and documentation.',sk:['Clinical Practice']},
    {id:'y3-csdi340',l:'Voice & Fluency Disorders',c:'CSDI 340',cat:'LocalGlobal',sem:'spring',d:'Stuttering, voice disorders, and related interventions.',sk:['Voice','Fluency']}
  ]},
  {id:'year-4',name:'Year 4',sub:'Launch',desc:'Clinical practicum and graduate school preparation.',ms:[
    {id:'y4-csdi410',l:'Neurogenic Disorders',c:'CSDI 410',cat:'Identity',sem:'fall',d:'Aphasia, dysarthria, and cognitive-communication disorders.',sk:['Neurogenic Disorders']},
    {id:'y4-csdi490',l:'Clinical Practicum',c:'CSDI 490',cr:4,cat:'Communities',sem:'spring',d:'Supervised clinical experience with real clients.',sk:['Clinical Practicum']},
    {id:'y4-csdi420',l:'Swallowing Disorders',c:'CSDI 420',cat:'LocalGlobal',sem:'fall',d:'Dysphagia assessment and management.',sk:['Dysphagia']},
    {id:'y4-gre',l:'Graduate School Preparation',c:'CSDI 499',cr:1,cat:'Purpose',sem:'spring',d:'GRE prep, grad school applications, and career planning.',sk:['GRE','Career Readiness']}
  ]}
]},
// ── CHHS-COMM ──
{s:'chhs-comm',col:CHHS,dept:'Communication Sciences & Disorders',prog:'B.A. in Speech Communication Studies',deg:'BA',field:'Communication Studies',bls:'27-3031',sal:'$62,340',gr:'5%',jobs:'348,500',
emp:['Corporate Communications','PR Agencies','Healthcare','Media Companies','Government'],cert:['APR (Public Relations)'],rel:['Journalism','Political Science','Marketing'],sk:['Public Speaking','Interpersonal Communication','Persuasion','Media Literacy','Organizational Communication'],
tl:[
  {id:'year-1',name:'Year 1',sub:'Explore',desc:'Communication foundations.',ms:[
    {id:'y1-comm101',l:'Intro to Communication',c:'COMM 101',cat:'Purpose',sem:'fall',d:'Theory and practice of human communication.',sk:['Communication Theory']},
    {id:'y1-comm110',l:'Public Speaking',c:'COMM 110',cat:'Identity',sem:'spring',d:'Speech preparation, delivery, and audience analysis.',sk:['Public Speaking']},
    {id:'y1-engl101',l:'Composition I',c:'ENGL 101',cat:'Communities',sem:'fall',d:'Academic writing and critical thinking.',sk:['Writing']},
    {id:'y1-psyc201',l:'General Psychology',c:'PSYC 201',cat:'LocalGlobal',sem:'spring',d:'Psychological foundations of communication.',sk:['Psychology']}
  ]},
  {id:'year-2',name:'Year 2',sub:'Engage',desc:'Theory and media studies.',ms:[
    {id:'y2-comm210',l:'Interpersonal Communication',c:'COMM 210',cat:'Communities',sem:'fall',d:'Relationship dynamics and conflict resolution.',sk:['Interpersonal Skills']},
    {id:'y2-comm220',l:'Mass Media & Society',c:'COMM 220',cat:'LocalGlobal',sem:'spring',d:'Media influence on culture and public opinion.',sk:['Media Literacy']},
    {id:'y2-comm230',l:'Persuasion',c:'COMM 230',cat:'Purpose',sem:'fall',d:'Principles of persuasive communication.',sk:['Persuasion']},
    {id:'y2-comm240',l:'Organizational Communication',c:'COMM 240',cat:'Identity',sem:'spring',d:'Communication in corporate and institutional settings.',sk:['Organizational Communication']}
  ]},
  {id:'year-3',name:'Year 3',sub:'Develop',desc:'Research methods and specialized study.',ms:[
    {id:'y3-comm310',l:'Communication Research',c:'COMM 310',cat:'Purpose',sem:'fall',d:'Quantitative and qualitative research methods.',sk:['Research Methods']},
    {id:'y3-comm320',l:'Intercultural Communication',c:'COMM 320',cat:'LocalGlobal',sem:'spring',d:'Communication across cultures and identity.',sk:['Intercultural Skills']},
    {id:'y3-comm330',l:'Rhetorical Criticism',c:'COMM 330',cat:'Identity',sem:'fall',d:'Analysis of public discourse and persuasive texts.',sk:['Rhetoric']},
    {id:'y3-intern',l:'Communication Internship',c:'COMM 490',cat:'Communities',sem:'spring',d:'Work experience in corporate communications or media.',sk:['Industry Experience']}
  ]},
  {id:'year-4',name:'Year 4',sub:'Launch',desc:'Capstone and career preparation.',ms:[
    {id:'y4-comm410',l:'Health Communication',c:'COMM 410',cat:'LocalGlobal',sem:'fall',d:'Communication in healthcare settings and campaigns.',sk:['Health Communication']},
    {id:'y4-capstone',l:'Senior Seminar',c:'COMM 498',cat:'Purpose',sem:'spring',d:'Research project and professional portfolio.',sk:['Research','Portfolio']},
    {id:'y4-career',l:'Career Preparation',c:'COMM 499',cr:1,cat:'Identity',sem:'spring',d:'Resume, networking, and career placement.',sk:['Career Readiness']}
  ]}
]},
// ── CHHS-KIN-EX ──
{s:'chhs-kin-ex',col:CHHS,dept:'Kinesiology',prog:'B.S. in Kinesiology — Exercise Science',deg:'BS',field:'Exercise Science',bls:'29-1128',sal:'$51,350',gr:'15%',jobs:'70,500',
emp:['Hospitals','Fitness Centers','Sports Teams','Rehabilitation Clinics','Corporate Wellness'],cert:['ACSM-CPT','CSCS','NSCA-CPT'],rel:['Biology','Nursing','Physical Therapy (grad)'],sk:['Exercise Prescription','Biomechanics','Anatomy','Fitness Assessment','Cardiac Rehab'],
tl:[
  {id:'year-1',name:'Year 1',sub:'Explore',desc:'Science foundations and intro to kinesiology.',ms:[
    {id:'y1-kins100',l:'Intro to Kinesiology',c:'KINS 100',cat:'Purpose',sem:'fall',d:'History, philosophy, and careers in kinesiology.',sk:['Kinesiology Overview']},
    {id:'y1-biol221',l:'Anatomy & Physiology I',c:'BIOL 221',cr:4,cat:'Identity',sem:'fall',d:'Musculoskeletal and nervous systems.',sk:['Anatomy']},
    {id:'y1-biol222',l:'Anatomy & Physiology II',c:'BIOL 222',cr:4,cat:'Identity',sem:'spring',d:'Cardiovascular and respiratory systems.',sk:['Physiology']},
    {id:'y1-chem100',l:'General Chemistry',c:'CHEM 100',cr:4,cat:'Communities',sem:'spring',d:'Chemistry fundamentals for health sciences.',sk:['Chemistry']}
  ]},
  {id:'year-2',name:'Year 2',sub:'Engage',desc:'Biomechanics and exercise physiology.',ms:[
    {id:'y2-kins210',l:'Biomechanics',c:'KINS 210',cat:'Identity',sem:'fall',d:'Forces and motion in human movement.',sk:['Biomechanics']},
    {id:'y2-kins220',l:'Exercise Physiology',c:'KINS 220',cat:'Purpose',sem:'spring',d:'Physiological responses to acute and chronic exercise.',sk:['Exercise Physiology']},
    {id:'y2-kins230',l:'Motor Learning',c:'KINS 230',cat:'LocalGlobal',sem:'fall',d:'Principles of skill acquisition and motor control.',sk:['Motor Learning']},
    {id:'y2-nutr200',l:'Nutrition',c:'NUTR 200',cat:'Communities',sem:'spring',d:'Nutritional science for health and performance.',sk:['Nutrition']}
  ]},
  {id:'year-3',name:'Year 3',sub:'Develop',desc:'Testing, prescription, and clinical experience.',ms:[
    {id:'y3-kins310',l:'Exercise Testing & Prescription',c:'KINS 310',cat:'Identity',sem:'fall',d:'Cardiopulmonary testing and exercise program design.',sk:['Exercise Prescription','Fitness Testing']},
    {id:'y3-kins320',l:'Strength & Conditioning',c:'KINS 320',cat:'Purpose',sem:'spring',d:'Resistance training principles and program design.',sk:['Strength Training']},
    {id:'y3-kins330',l:'Clinical Exercise Physiology',c:'KINS 330',cat:'LocalGlobal',sem:'fall',d:'Exercise in chronic disease management.',sk:['Clinical Exercise']},
    {id:'y3-intern',l:'Kinesiology Internship',c:'KINS 490',cat:'Communities',sem:'spring',d:'Clinical or fitness industry internship.',sk:['Clinical Experience']}
  ]},
  {id:'year-4',name:'Year 4',sub:'Launch',desc:'Research, certification, and career placement.',ms:[
    {id:'y4-kins410',l:'Research Methods',c:'KINS 410',cat:'Purpose',sem:'fall',d:'Research design and data analysis in exercise science.',sk:['Research Methods']},
    {id:'y4-kins420',l:'Cardiac Rehabilitation',c:'KINS 420',cat:'LocalGlobal',sem:'fall',d:'Exercise programming for cardiac patients.',sk:['Cardiac Rehab']},
    {id:'y4-capstone',l:'Senior Capstone',c:'KINS 498',cat:'Identity',sem:'spring',d:'Independent research project in exercise science.',sk:['Research','Presentation']},
    {id:'y4-career',l:'ACSM Certification & Career Prep',c:'KINS 499',cr:1,cat:'Communities',sem:'spring',d:'ACSM/CSCS exam prep and career placement.',sk:['Certification','Career Readiness']}
  ]}
]},
// ── CHHS-KIN-RSM ──
{s:'chhs-kin-rsm',col:CHHS,dept:'Kinesiology',prog:'B.S. in Kinesiology — Recreation & Sport Mgmt',deg:'BS',field:'Sport Management',bls:'11-9179',sal:'$58,380',gr:'10%',jobs:'15,200',
emp:['Professional Sports Teams','NCAA Athletics','YMCAs','Parks & Rec Departments','Event Companies'],cert:['CPRP','CMP'],rel:['Marketing','Management','Communication'],sk:['Event Management','Facility Operations','Sports Marketing','Budgeting','Leadership'],
tl:[
  {id:'year-1',name:'Year 1',sub:'Explore',desc:'Sport management foundations.',ms:[
    {id:'y1-kins100',l:'Intro to Kinesiology',c:'KINS 100',cat:'Purpose',sem:'fall',d:'Careers in sport and recreation management.',sk:['Kinesiology']},
    {id:'y1-kins150',l:'Intro to Sport Management',c:'KINS 150',cat:'Identity',sem:'spring',d:'Overview of the sport industry and career paths.',sk:['Sport Management']},
    {id:'y1-mgmt101',l:'Principles of Management',c:'MGMT 101',cat:'Communities',sem:'fall',d:'Management theory and organizational behavior.',sk:['Management']},
    {id:'y1-comm110',l:'Public Speaking',c:'COMM 110',cat:'LocalGlobal',sem:'spring',d:'Presentation skills for sports professionals.',sk:['Public Speaking']}
  ]},
  {id:'year-2',name:'Year 2',sub:'Engage',desc:'Marketing, law, and facility management.',ms:[
    {id:'y2-kins250',l:'Sport Marketing',c:'KINS 250',cat:'Purpose',sem:'fall',d:'Marketing strategies for sports organizations.',sk:['Sports Marketing']},
    {id:'y2-kins260',l:'Sport Law',c:'KINS 260',cat:'Identity',sem:'spring',d:'Legal issues in athletics and recreation.',sk:['Sport Law']},
    {id:'y2-kins270',l:'Facility & Event Management',c:'KINS 270',cat:'LocalGlobal',sem:'fall',d:'Planning and managing sports facilities and events.',sk:['Event Management']},
    {id:'y2-acct201',l:'Principles of Accounting',c:'ACCT 201',cat:'Communities',sem:'spring',d:'Financial fundamentals for sport managers.',sk:['Accounting']}
  ]},
  {id:'year-3',name:'Year 3',sub:'Develop',desc:'Finance, governance, and analytics.',ms:[
    {id:'y3-kins350',l:'Sport Finance',c:'KINS 350',cat:'Identity',sem:'fall',d:'Budgeting, revenue streams, and financial management.',sk:['Sport Finance']},
    {id:'y3-kins360',l:'Sport Governance',c:'KINS 360',cat:'LocalGlobal',sem:'spring',d:'NCAA governance, Olympic organizations, and professional leagues.',sk:['Governance']},
    {id:'y3-kins370',l:'Sport Analytics',c:'KINS 370',cat:'Purpose',sem:'fall',d:'Data analytics for player evaluation and business decisions.',sk:['Analytics']},
    {id:'y3-intern',l:'Sport Management Internship',c:'KINS 490',cat:'Communities',sem:'spring',d:'Internship with a sports organization or recreation department.',sk:['Industry Experience']}
  ]},
  {id:'year-4',name:'Year 4',sub:'Launch',desc:'Capstone and career launch.',ms:[
    {id:'y4-kins450',l:'Sport Ethics',c:'KINS 450',cat:'Purpose',sem:'fall',d:'Ethical issues in sports administration.',sk:['Ethics']},
    {id:'y4-capstone',l:'Senior Capstone',c:'KINS 498',cat:'Identity',sem:'spring',d:'Comprehensive sport management project.',sk:['Capstone']},
    {id:'y4-career',l:'Career Placement',c:'KINS 499',cr:1,cat:'Communities',sem:'spring',d:'Resume, networking, and job search preparation.',sk:['Career Readiness']}
  ]}
]},
// ── CHHS-KIN-PRE ──
{s:'chhs-kin-pre',col:CHHS,dept:'Kinesiology',prog:'B.S. in Kinesiology — Pre-Professional',deg:'BS',field:'Pre-Professional Health',bls:'29-1071',sal:'$92,910',gr:'3%',jobs:'727,000',
emp:['Medical Schools','PT Schools','OT Programs','Chiropractic Schools'],cert:['Pre-Med/Pre-PT Track'],rel:['Biology','Chemistry','Nursing'],sk:['Anatomy','Exercise Science','Clinical Shadowing','Research','MCAT/GRE Prep'],
tl:[
  {id:'year-1',name:'Year 1',sub:'Explore',desc:'Pre-health science foundations.',ms:[
    {id:'y1-kins100',l:'Intro to Kinesiology',c:'KINS 100',cat:'Purpose',sem:'fall',d:'Careers in health professions.',sk:['Kinesiology']},
    {id:'y1-biol101',l:'General Biology I',c:'BIOL 101',cr:4,cat:'Identity',sem:'fall',d:'Cell biology and genetics.',sk:['Biology']},
    {id:'y1-chem101',l:'General Chemistry I',c:'CHEM 101',cr:4,cat:'Identity',sem:'spring',d:'Atomic structure, bonding, and reactions.',sk:['Chemistry']},
    {id:'y1-math131',l:'Calculus or Statistics',c:'MATH 131',cat:'Communities',sem:'spring',d:'Quantitative foundations for health sciences.',sk:['Mathematics']}
  ]},
  {id:'year-2',name:'Year 2',sub:'Engage',desc:'Anatomy, physiology, and organic chemistry.',ms:[
    {id:'y2-biol221',l:'Anatomy & Physiology I',c:'BIOL 221',cr:4,cat:'Identity',sem:'fall',d:'Musculoskeletal and nervous systems.',sk:['Anatomy']},
    {id:'y2-biol222',l:'Anatomy & Physiology II',c:'BIOL 222',cr:4,cat:'Identity',sem:'spring',d:'Organ systems and clinical anatomy.',sk:['Physiology']},
    {id:'y2-chem201',l:'Organic Chemistry I',c:'CHEM 201',cr:4,cat:'Purpose',sem:'fall',d:'Carbon chemistry and functional groups.',sk:['Organic Chemistry']},
    {id:'y2-phys101',l:'Physics I',c:'PHYS 101',cr:4,cat:'LocalGlobal',sem:'spring',d:'Mechanics and thermodynamics for health sciences.',sk:['Physics']}
  ]},
  {id:'year-3',name:'Year 3',sub:'Develop',desc:'Advanced sciences and clinical shadowing.',ms:[
    {id:'y3-kins310',l:'Exercise Physiology',c:'KINS 310',cat:'Identity',sem:'fall',d:'Physiological responses to exercise.',sk:['Exercise Physiology']},
    {id:'y3-kins320',l:'Pathophysiology',c:'KINS 320',cat:'Purpose',sem:'spring',d:'Disease mechanisms for clinical applications.',sk:['Pathophysiology']},
    {id:'y3-biol301',l:'Microbiology',c:'BIOL 301',cr:4,cat:'LocalGlobal',sem:'fall',d:'Medical microbiology and infectious diseases.',sk:['Microbiology']},
    {id:'y3-shadow',l:'Clinical Shadowing',c:'KINS 395',cat:'Communities',sem:'spring',d:'100+ hours of shadowing physicians, PTs, or OTs.',sk:['Clinical Shadowing']}
  ]},
  {id:'year-4',name:'Year 4',sub:'Launch',desc:'MCAT/GRE prep and graduate school applications.',ms:[
    {id:'y4-kins410',l:'Research Methods',c:'KINS 410',cat:'Purpose',sem:'fall',d:'Research design for health sciences.',sk:['Research']},
    {id:'y4-kins420',l:'Senior Research',c:'KINS 420',cat:'Identity',sem:'spring',d:'Independent research project.',sk:['Research Project']},
    {id:'y4-career',l:'MCAT/GRE & Grad School Prep',c:'KINS 499',cr:1,cat:'Communities',sem:'spring',d:'Exam preparation and application support.',sk:['MCAT','GRE','Applications']}
  ]}
]},
// ── CHHS-HSM ──
{s:'chhs-hsm',col:CHHS,dept:'Population Health Mgmt & Policy',prog:'B.S. in Health Services Management',deg:'BS',field:'Health Services Management',bls:'11-9111',sal:'$104,830',gr:'28%',jobs:'480,700',
emp:['Hospital Systems','Health Departments','Insurance Companies','Consulting Firms','Pharmaceutical Companies'],cert:['FACHE','CPHQ'],rel:['Nursing','Public Health','Business Administration'],sk:['Healthcare Administration','Policy Analysis','Budgeting','HIPAA','Quality Improvement'],
tl:[
  {id:'year-1',name:'Year 1',sub:'Explore',desc:'Foundations of health systems.',ms:[
    {id:'y1-hlth100',l:'Intro to Health Services',c:'HLTH 100',cat:'Purpose',sem:'fall',d:'U.S. healthcare system structure and delivery.',sk:['Healthcare Systems']},
    {id:'y1-biol101',l:'Biology',c:'BIOL 101',cat:'Identity',sem:'fall',d:'Biological foundations for health managers.',sk:['Biology']},
    {id:'y1-econ201',l:'Microeconomics',c:'ECON 201',cat:'LocalGlobal',sem:'spring',d:'Economic principles for healthcare markets.',sk:['Economics']},
    {id:'y1-mgmt101',l:'Principles of Management',c:'MGMT 101',cat:'Communities',sem:'spring',d:'Organizational theory and management.',sk:['Management']}
  ]},
  {id:'year-2',name:'Year 2',sub:'Engage',desc:'Health policy and informatics.',ms:[
    {id:'y2-hlth210',l:'Health Policy',c:'HLTH 210',cat:'LocalGlobal',sem:'fall',d:'Federal and state health policy and reform.',sk:['Health Policy','ACA']},
    {id:'y2-hlth220',l:'Health Informatics',c:'HLTH 220',cat:'Identity',sem:'spring',d:'EHR systems, data management, and analytics.',sk:['Health Informatics','EHR']},
    {id:'y2-hlth230',l:'Epidemiology',c:'HLTH 230',cat:'Purpose',sem:'fall',d:'Disease patterns and population health analysis.',sk:['Epidemiology']},
    {id:'y2-acct201',l:'Accounting',c:'ACCT 201',cat:'Communities',sem:'spring',d:'Financial accounting for healthcare organizations.',sk:['Accounting']}
  ]},
  {id:'year-3',name:'Year 3',sub:'Develop',desc:'Finance, quality, and law.',ms:[
    {id:'y3-hlth310',l:'Healthcare Finance',c:'HLTH 310',cat:'Identity',sem:'fall',d:'Reimbursement, budgeting, and financial management.',sk:['Healthcare Finance']},
    {id:'y3-hlth320',l:'Healthcare Quality',c:'HLTH 320',cat:'Purpose',sem:'spring',d:'Quality improvement, patient safety, and accreditation.',sk:['Quality Improvement']},
    {id:'y3-hlth330',l:'Health Law & Ethics',c:'HLTH 330',cat:'LocalGlobal',sem:'fall',d:'HIPAA, medical liability, and bioethics.',sk:['Health Law','HIPAA']},
    {id:'y3-intern',l:'Health Admin Internship',c:'HLTH 490',cat:'Communities',sem:'spring',d:'Administrative internship at a healthcare organization.',sk:['Industry Experience']}
  ]},
  {id:'year-4',name:'Year 4',sub:'Launch',desc:'Capstone and career placement.',ms:[
    {id:'y4-hlth410',l:'Strategic Management in Healthcare',c:'HLTH 410',cat:'Identity',sem:'fall',d:'Strategic planning and organizational leadership.',sk:['Strategic Planning']},
    {id:'y4-capstone',l:'Senior Capstone',c:'HLTH 498',cat:'Purpose',sem:'spring',d:'Comprehensive healthcare management project.',sk:['Capstone']},
    {id:'y4-career',l:'Career Placement',c:'HLTH 499',cr:1,cat:'Communities',sem:'spring',d:'Resume, networking, and FACHE certification path.',sk:['Career Readiness']}
  ]}
]},
// ── CHHS-PSYCH ──
{s:'chhs-psych',col:CHHS,dept:'Psychology',prog:'B.A. in Psychology',deg:'BA',field:'Psychology',bls:'19-3039',sal:'$85,330',gr:'6%',jobs:'205,600',
emp:['Mental Health Centers','Schools','Research Labs','HR Departments','Government Agencies'],cert:['N/A — Graduate school required for licensure'],rel:['Social Work','Sociology','Biology'],sk:['Research Methods','Statistical Analysis','Clinical Assessment','Counseling Skills','SPSS'],
tl:[
  {id:'year-1',name:'Year 1',sub:'Explore',desc:'Foundations of psychology.',ms:[
    {id:'y1-psyc201',l:'General Psychology',c:'PSYC 201',cat:'Purpose',sem:'fall',d:'Survey of major psychological theories and research.',sk:['Psychology Overview']},
    {id:'y1-psyc202',l:'Developmental Psychology',c:'PSYC 202',cat:'Identity',sem:'spring',d:'Human development from birth through aging.',sk:['Developmental Psychology']},
    {id:'y1-biol101',l:'Biology',c:'BIOL 101',cat:'Communities',sem:'fall',d:'Biological foundations for behavioral science.',sk:['Biology']},
    {id:'y1-stat210',l:'Statistics',c:'STAT 210',cat:'LocalGlobal',sem:'spring',d:'Statistical methods for behavioral research.',sk:['Statistics']}
  ]},
  {id:'year-2',name:'Year 2',sub:'Engage',desc:'Core areas of psychology.',ms:[
    {id:'y2-psyc301',l:'Abnormal Psychology',c:'PSYC 301',cat:'Identity',sem:'fall',d:'Psychological disorders, diagnosis, and treatment.',sk:['Abnormal Psych','DSM']},
    {id:'y2-psyc310',l:'Social Psychology',c:'PSYC 310',cat:'Communities',sem:'spring',d:'Group behavior, attitudes, and social influence.',sk:['Social Psychology']},
    {id:'y2-psyc320',l:'Research Methods',c:'PSYC 320',cat:'Purpose',sem:'fall',d:'Experimental design and data collection.',sk:['Research Methods']},
    {id:'y2-psyc330',l:'Cognitive Psychology',c:'PSYC 330',cat:'LocalGlobal',sem:'spring',d:'Memory, perception, attention, and problem solving.',sk:['Cognitive Psychology']}
  ]},
  {id:'year-3',name:'Year 3',sub:'Develop',desc:'Specialized topics and research.',ms:[
    {id:'y3-psyc340',l:'Biopsychology',c:'PSYC 340',cat:'Identity',sem:'fall',d:'Brain-behavior relationships and neuroscience.',sk:['Neuroscience']},
    {id:'y3-psyc350',l:'Personality Psychology',c:'PSYC 350',cat:'Purpose',sem:'spring',d:'Personality theories and assessment.',sk:['Personality']},
    {id:'y3-psyc360',l:'Cross-Cultural Psychology',c:'PSYC 360',cat:'LocalGlobal',sem:'fall',d:'Cultural influences on behavior and mental health.',sk:['Cultural Psychology']},
    {id:'y3-psyc390',l:'Research Practicum',c:'PSYC 390',cat:'Communities',sem:'spring',d:'Supervised research experience in faculty lab.',sk:['Research Experience']}
  ]},
  {id:'year-4',name:'Year 4',sub:'Launch',desc:'Senior thesis and graduate school prep.',ms:[
    {id:'y4-psyc410',l:'Testing & Assessment',c:'PSYC 410',cat:'Identity',sem:'fall',d:'Psychological testing, reliability, and validity.',sk:['Assessment']},
    {id:'y4-capstone',l:'Senior Thesis',c:'PSYC 498',cat:'Purpose',sem:'spring',d:'Original research project and presentation.',sk:['Thesis','Research']},
    {id:'y4-career',l:'GRE & Graduate School Prep',c:'PSYC 499',cr:1,cat:'Communities',sem:'spring',d:'GRE prep, grad school applications, and career planning.',sk:['GRE','Career Readiness']}
  ]}
]},
// ── CHHS-SOC ──
{s:'chhs-soc',col:CHHS,dept:'Social Work & Sociology',prog:'B.A. in Sociology',deg:'BA',field:'Sociology',bls:'19-3041',sal:'$59,230',gr:'4%',jobs:'3,800',
emp:['Government','Nonprofits','Research Firms','Social Services','Education'],cert:['N/A'],rel:['Psychology','Social Work','Criminal Justice'],sk:['Sociological Theory','Research Methods','Data Analysis','Survey Design','Social Stratification'],
tl:[
  {id:'year-1',name:'Year 1',sub:'Explore',desc:'Sociological foundations.',ms:[
    {id:'y1-soci201',l:'Intro to Sociology',c:'SOCI 201',cat:'Purpose',sem:'fall',d:'Social structures, institutions, and inequality.',sk:['Sociology']},
    {id:'y1-soci210',l:'Social Problems',c:'SOCI 210',cat:'Communities',sem:'spring',d:'Poverty, crime, racism, and social change.',sk:['Social Problems']},
    {id:'y1-psyc201',l:'Psychology',c:'PSYC 201',cat:'Identity',sem:'fall',d:'Individual behavior and mental processes.',sk:['Psychology']},
    {id:'y1-stat210',l:'Statistics',c:'STAT 210',cat:'LocalGlobal',sem:'spring',d:'Statistical analysis for social sciences.',sk:['Statistics']}
  ]},
  {id:'year-2',name:'Year 2',sub:'Engage',desc:'Theory and specialized topics.',ms:[
    {id:'y2-soci301',l:'Sociological Theory',c:'SOCI 301',cat:'Identity',sem:'fall',d:'Classical and contemporary sociological theory.',sk:['Sociological Theory']},
    {id:'y2-soci310',l:'Race & Ethnicity',c:'SOCI 310',cat:'Communities',sem:'spring',d:'Racial stratification, identity, and social movements.',sk:['Race Studies']},
    {id:'y2-soci320',l:'Research Methods',c:'SOCI 320',cat:'Purpose',sem:'fall',d:'Survey design, interviewing, and ethnography.',sk:['Research Methods']},
    {id:'y2-soci330',l:'Criminology',c:'SOCI 330',cat:'LocalGlobal',sem:'spring',d:'Theories of crime and deviance.',sk:['Criminology']}
  ]},
  {id:'year-3',name:'Year 3',sub:'Develop',desc:'Applied sociology and fieldwork.',ms:[
    {id:'y3-soci340',l:'Urban Sociology',c:'SOCI 340',cat:'LocalGlobal',sem:'fall',d:'Cities, gentrification, and community development.',sk:['Urban Sociology']},
    {id:'y3-soci350',l:'Medical Sociology',c:'SOCI 350',cat:'Identity',sem:'spring',d:'Social determinants of health and healthcare systems.',sk:['Medical Sociology']},
    {id:'y3-soci360',l:'Gender & Society',c:'SOCI 360',cat:'Communities',sem:'fall',d:'Gender roles, inequality, and feminist theory.',sk:['Gender Studies']},
    {id:'y3-intern',l:'Sociology Internship',c:'SOCI 490',cat:'Purpose',sem:'spring',d:'Applied research or community organization placement.',sk:['Fieldwork']}
  ]},
  {id:'year-4',name:'Year 4',sub:'Launch',desc:'Senior research and career placement.',ms:[
    {id:'y4-soci410',l:'Advanced Data Analysis',c:'SOCI 410',cat:'Purpose',sem:'fall',d:'SPSS/R for sociological data analysis.',sk:['SPSS','Data Analysis']},
    {id:'y4-capstone',l:'Senior Research',c:'SOCI 498',cat:'Identity',sem:'spring',d:'Original sociological research project.',sk:['Research']},
    {id:'y4-career',l:'Career Preparation',c:'SOCI 499',cr:1,cat:'Communities',sem:'spring',d:'Graduate school prep and career placement.',sk:['Career Readiness']}
  ]}
]},
// ── CHHS-SW ──
{s:'chhs-sw',col:CHHS,dept:'Social Work & Sociology',prog:'B.S.W. in Social Work',deg:'BSW',field:'Social Work',bls:'21-1021',sal:'$55,350',gr:'7%',jobs:'713,200',
emp:['Hospitals','Child Protective Services','Schools','Community Mental Health','VA'],cert:['State Social Work License (LSW/LCSW grad)'],rel:['Psychology','Sociology','Criminal Justice'],sk:['Case Management','Crisis Intervention','Cultural Competency','Advocacy','Community Organizing'],
tl:[
  {id:'year-1',name:'Year 1',sub:'Explore',desc:'Introduction to social work.',ms:[
    {id:'y1-sowk200',l:'Intro to Social Work',c:'SOWK 200',cat:'Purpose',sem:'fall',d:'History, values, and ethics of social work practice.',sk:['Social Work Overview']},
    {id:'y1-soci201',l:'Sociology',c:'SOCI 201',cat:'Identity',sem:'fall',d:'Social systems and institutions.',sk:['Sociology']},
    {id:'y1-psyc201',l:'Psychology',c:'PSYC 201',cat:'Communities',sem:'spring',d:'Individual development and behavior.',sk:['Psychology']},
    {id:'y1-biol101',l:'Biology',c:'BIOL 101',cat:'LocalGlobal',sem:'spring',d:'Biological foundations for social work practice.',sk:['Biology']}
  ]},
  {id:'year-2',name:'Year 2',sub:'Engage',desc:'HBSE and diversity.',ms:[
    {id:'y2-sowk310',l:'Human Behavior & Social Environment I',c:'SOWK 310',cat:'Identity',sem:'fall',d:'Biopsychosocial development across the lifespan.',sk:['HBSE']},
    {id:'y2-sowk311',l:'HBSE II',c:'SOWK 311',cat:'Identity',sem:'spring',d:'Families, groups, organizations, and communities.',sk:['Systems Theory']},
    {id:'y2-sowk320',l:'Diversity & Social Justice',c:'SOWK 320',cat:'Communities',sem:'fall',d:'Oppression, privilege, and culturally responsive practice.',sk:['Social Justice','Cultural Competency']},
    {id:'y2-sowk330',l:'Social Welfare Policy',c:'SOWK 330',cat:'LocalGlobal',sem:'spring',d:'U.S. social welfare history and policy analysis.',sk:['Policy Analysis']}
  ]},
  {id:'year-3',name:'Year 3',sub:'Develop',desc:'Practice methods and research.',ms:[
    {id:'y3-sowk340',l:'Social Work Practice I',c:'SOWK 340',cat:'Identity',sem:'fall',d:'Generalist practice with individuals.',sk:['Case Management']},
    {id:'y3-sowk341',l:'Social Work Practice II',c:'SOWK 341',cat:'Purpose',sem:'spring',d:'Group and family intervention methods.',sk:['Group Work']},
    {id:'y3-sowk350',l:'Social Work Research',c:'SOWK 350',cat:'LocalGlobal',sem:'fall',d:'Evidence-based practice and program evaluation.',sk:['Research','EBP']},
    {id:'y3-sowk360',l:'Practice III — Communities',c:'SOWK 360',cat:'Communities',sem:'spring',d:'Community organizing and macro practice.',sk:['Community Organizing']}
  ]},
  {id:'year-4',name:'Year 4',sub:'Launch',desc:'Field practicum and licensure prep.',ms:[
    {id:'y4-sowk470',l:'Field Practicum I',c:'SOWK 470',cr:6,cat:'Communities',sem:'fall',d:'400-hour supervised field placement at agency.',sk:['Field Practicum']},
    {id:'y4-sowk471',l:'Field Practicum II',c:'SOWK 471',cr:6,cat:'Communities',sem:'spring',d:'Continued field placement with advanced responsibilities.',sk:['Advanced Practice']},
    {id:'y4-sowk480',l:'Integrative Seminar',c:'SOWK 480',cat:'Purpose',sem:'spring',d:'Integration of theory and field practice.',sk:['Integration']},
    {id:'y4-career',l:'Licensure & Career Prep',c:'SOWK 499',cr:1,cat:'Identity',sem:'spring',d:'LSW exam preparation and career placement.',sk:['LSW Exam','Career Readiness']}
  ]}
]}
];

// ═════════════════════════════════════════
// CAHSS — Quick-generate with simplified timelines  
// ═════════════════════════════════════════
const CAHSS = 'College of Arts, Humanities & Social Sciences (CAHSS)';
const cahssPrograms = [
  {s:'cahss-cj',dept:'Criminal Justice',prog:'B.S. in Criminal Justice',deg:'BS',field:'Criminal Justice',bls:'33-3051',sal:'$74,910',gr:'3%',jobs:'812,000',emp:['FBI','DEA','ATF','State Police','Federal Courts'],cert:['BLET','Certified Fraud Examiner'],rel:['Political Science','Sociology','Psychology'],sk:['Criminal Law','Forensics','Investigation','Ethics','Crisis Management'],prefix:'CJUS'},
  {s:'cahss-eng-afam',dept:'English',prog:'B.A. in English — African American Lit',deg:'BA',field:'African American Literature',bls:'25-1123',sal:'$78,930',gr:'4%',jobs:'78,400',emp:['Universities','Publishing Houses','Museums','Archives','Media Companies'],cert:['N/A'],rel:['History','Liberal Studies','Journalism'],sk:['Literary Analysis','Research','Critical Theory','Writing','African American Studies'],prefix:'ENGL'},
  {s:'cahss-eng-cw',dept:'English',prog:'B.A. in English — Creative Writing',deg:'BA',field:'Creative Writing',bls:'27-3043',sal:'$73,150',gr:'4%',jobs:'143,200',emp:['Publishing Houses','Media Companies','Advertising Agencies','Freelance','MFA Programs'],cert:['N/A'],rel:['Journalism','Theatre','Liberal Studies'],sk:['Fiction','Poetry','Screenwriting','Editing','Workshop Critique'],prefix:'ENGL'},
  {s:'cahss-eng-tw',dept:'English',prog:'B.A. in English — Technical Writing',deg:'BA',field:'Technical Writing',bls:'27-3042',sal:'$79,960',gr:'7%',jobs:'55,400',emp:['Tech Companies','Government','Healthcare','Engineering Firms','Software Companies'],cert:['Certified Technical Writer'],rel:['Computer Science','Engineering','Business IT'],sk:['Technical Documentation','UX Writing','API Docs','Style Guides','Content Management'],prefix:'ENGL'},
  {s:'cahss-eng-pro',dept:'English',prog:'B.A. in English — Professional English',deg:'BA',field:'Professional Communication',bls:'27-3031',sal:'$62,340',gr:'5%',jobs:'348,500',emp:['Corporate Communications','PR Firms','Government','Nonprofits','Media'],cert:['APR'],rel:['Marketing','Communication','Political Science'],sk:['Professional Writing','Editing','Grant Writing','Corporate Communication'],prefix:'ENGL'},
  {s:'cahss-hist',dept:'History & Political Science',prog:'B.A. in History',deg:'BA',field:'History',bls:'25-1125',sal:'$72,810',gr:'2%',jobs:'35,800',emp:['Museums','Archives','National Park Service','Government','Education'],cert:['N/A'],rel:['Political Science','English','Liberal Studies'],sk:['Historical Research','Archival Work','Critical Analysis','Academic Writing'],prefix:'HIST'},
  {s:'cahss-poli',dept:'History & Political Science',prog:'B.A. in Political Science',deg:'BA',field:'Political Science',bls:'19-3094',sal:'$128,020',gr:'6%',jobs:'11,600',emp:['Congressional Offices','State Legislature','Think Tanks','Law Schools','Campaigns'],cert:['N/A'],rel:['History','Economics','Criminal Justice'],sk:['Policy Analysis','Research','Legislative Process','International Relations','Public Admin'],prefix:'POLI'},
  {s:'cahss-jmc-mmj',dept:'Journalism & Mass Communication',prog:'B.S. in Journalism — Multimedia',deg:'BS',field:'Multimedia Journalism',bls:'27-3023',sal:'$57,500',gr:'-3%',jobs:'40,400',emp:['CNN','ESPN','Local TV Stations','Digital Media Companies','NPR'],cert:['N/A'],rel:['Visual Arts','Communication','Marketing'],sk:['Video Production','Audio Editing','Social Media','AP Style','Data Journalism'],prefix:'JOMC'},
  {s:'cahss-jmc-mmp',dept:'Journalism & Mass Communication',prog:'B.S. in Journalism — Mass Media Production',deg:'BS',field:'Media Production',bls:'27-4032',sal:'$62,520',gr:'9%',jobs:'71,700',emp:['Film Studios','TV Networks','Streaming Platforms','Production Companies','Ad Agencies'],cert:['Adobe Certified'],rel:['Visual Arts','Music','Theatre'],sk:['Film Production','Post-Production','Motion Graphics','Sound Design','Directing'],prefix:'JOMC'},
  {s:'cahss-jmc-pr',dept:'Journalism & Mass Communication',prog:'B.S. in Journalism — Public Relations',deg:'BS',field:'Public Relations',bls:'11-2031',sal:'$67,440',gr:'6%',jobs:'344,200',emp:['Edelman','Weber Shandwick','Hill+Knowlton','Corporate PR Depts','Government'],cert:['APR','CPRC'],rel:['Marketing','Communication','Political Science'],sk:['Media Relations','Crisis Communication','Social Media','Event Planning','Strategic Messaging'],prefix:'JOMC'},
  {s:'cahss-lib-afam',dept:'Liberal Studies',prog:'B.A. in Liberal Studies — African American',deg:'BA',field:'African American Studies',bls:'25-1062',sal:'$77,400',gr:'4%',jobs:'174,000',emp:['Museums','Government','Nonprofits','Higher Ed','Community Organizations'],cert:['N/A'],rel:['History','English','Sociology'],sk:['Critical Analysis','Research','Cultural Studies','Advocacy','Writing'],prefix:'LIBS'},
  {s:'cahss-lib-act',dept:'Liberal Studies',prog:'B.A. in Liberal Studies — Applied Cultural Thought',deg:'BA',field:'Cultural Studies',bls:'25-1062',sal:'$77,400',gr:'4%',jobs:'174,000',emp:['Nonprofits','Museums','Government','Education','Media'],cert:['N/A'],rel:['Sociology','History','Philosophy'],sk:['Cultural Analysis','Critical Theory','Research','Public Humanities'],prefix:'LIBS'},
  {s:'cahss-lib-law',dept:'Liberal Studies',prog:'B.A. in Liberal Studies — Pre-Law',deg:'BA',field:'Pre-Law',bls:'23-1011',sal:'$135,740',gr:'5%',jobs:'793,200',emp:['Law Firms','Corporate Legal','Government','Public Interest','Judiciary'],cert:['LSAT'],rel:['Political Science','Criminal Justice','History'],sk:['Legal Writing','Critical Thinking','Research','Argumentation','LSAT Prep'],prefix:'LIBS'},
  {s:'cahss-art-des',dept:'Visual & Performing Arts',prog:'B.A. in Visual Arts — Design',deg:'BA',field:'Visual Design',bls:'27-1024',sal:'$57,990',gr:'3%',jobs:'395,800',emp:['Design Studios','Advertising Agencies','Corporations','Freelance','Museums'],cert:['Adobe Certified'],rel:['Graphic Design','Theatre','English'],sk:['Drawing','Painting','Sculpture','Digital Art','Art History'],prefix:'ARTS'},
  {s:'cahss-art-gd',dept:'Visual & Performing Arts',prog:'B.A. in Visual Arts — Graphic Design',deg:'BA',field:'Graphic Design',bls:'27-1024',sal:'$57,990',gr:'3%',jobs:'395,800',emp:['Design Agencies','Tech Companies','Publishing','Marketing Firms','Freelance'],cert:['Adobe Certified Professional'],rel:['Visual Arts','Marketing','Web Development'],sk:['Adobe Creative Suite','Typography','Branding','UI/UX','Motion Graphics'],prefix:'ARTS'},
  {s:'cahss-music',dept:'Visual & Performing Arts',prog:'B.A. in Music',deg:'BA',field:'Music',bls:'27-2042',sal:'$55,990',gr:'8%',jobs:'176,900',emp:['Orchestras','School Districts','Recording Studios','Churches','Entertainment Companies'],cert:['Music Education Licensure (optional)'],rel:['Theatre','Liberal Studies','Education'],sk:['Music Theory','Performance','Composition','Music Technology','Ensemble'],prefix:'MUSC'},
  {s:'cahss-thtr-act',dept:'Visual & Performing Arts',prog:'B.F.A. in Professional Theatre — Acting',deg:'BFA',field:'Acting',bls:'27-2011',sal:'$46,960',gr:'2%',jobs:'60,700',emp:['Broadway','Regional Theatres','Film/TV Studios','Talent Agencies','Theme Parks'],cert:['AEA/SAG-AFTRA (professional)'],rel:['Music','English','Communication'],sk:['Acting Technique','Voice','Movement','Auditioning','Script Analysis'],prefix:'THEA'},
  {s:'cahss-thtr-tech',dept:'Visual & Performing Arts',prog:'B.F.A. in Professional Theatre — Tech',deg:'BFA',field:'Technical Theatre',bls:'27-4011',sal:'$59,650',gr:'5%',jobs:'17,700',emp:['Broadway','Regional Theatres','Event Companies','Theme Parks','Film/TV'],cert:['ETCP Certification'],rel:['Visual Arts','Engineering Technology','Music'],sk:['Lighting Design','Sound Design','Set Construction','Stage Management','CAD'],prefix:'THEA'}
];

// ═════════════════════════════════════════
// CEd — College of Education
// ═════════════════════════════════════════
const CEd = 'College of Education (CEd)';
const cedPrograms = [
  {s:'ced-elem',dept:'Educator Preparation',prog:'B.S. in Elementary Education',deg:'BS',field:'Elementary Education',bls:'25-2021',sal:'$61,690',gr:'1%',jobs:'1,454,500',emp:['Public Schools','Charter Schools','Private Schools','DoDEA','International Schools'],cert:['NC Teaching License','Praxis','edTPA'],rel:['English','Mathematics','Psychology'],sk:['Lesson Planning','Classroom Management','Differentiated Instruction','Assessment','Literacy'],prefix:'EDUC'},
  {s:'ced-edst-tech',dept:'Educator Preparation',prog:'B.S. in Educational Studies — Tech & Innovation',deg:'BS',field:'Educational Technology',bls:'25-9031',sal:'$66,490',gr:'7%',jobs:'216,000',emp:['School Districts','EdTech Companies','Corporate Training','Higher Ed','Government'],cert:['Google Certified Educator','Microsoft Innovative Educator'],rel:['Computer Science','Business IT','Graphic Design'],sk:['Instructional Design','LMS Administration','Digital Tools','Curriculum Development'],prefix:'EDST'},
  {s:'ced-edst-lead',dept:'Educator Preparation',prog:'B.S. in Educational Studies — Leadership & Policy',deg:'BS',field:'Education Policy',bls:'25-9031',sal:'$66,490',gr:'7%',jobs:'216,000',emp:['School Districts','State DOE','Nonprofits','Think Tanks','Higher Ed'],cert:['N/A'],rel:['Political Science','Sociology','Psychology'],sk:['Policy Analysis','Leadership','Program Evaluation','Advocacy','Grant Writing'],prefix:'EDST'},
  {s:'ced-edst-fam',dept:'Educator Preparation',prog:'B.S. in Educational Studies — Family & Community',deg:'BS',field:'Family & Community Education',bls:'21-1093',sal:'$52,870',gr:'11%',jobs:'58,600',emp:['Community Centers','Nonprofits','Schools','Social Services','Faith-Based Orgs'],cert:['Certified Family Life Educator'],rel:['Social Work','Psychology','Child Development'],sk:['Family Engagement','Community Partnerships','Program Planning','Cultural Competency'],prefix:'EDST'}
];

// ═════════════════════════════════════════
// CoST — College of Science & Technology
// ═════════════════════════════════════════
const CoST = 'College of Science & Technology (CoST)';
const costPrograms = [
  {s:'cost-aet',dept:'Applied Engineering Technology',prog:'B.S. in Applied Engineering Technology',deg:'BS',field:'Engineering Technology',bls:'17-3026',sal:'$60,550',gr:'4%',jobs:'73,100',emp:['Manufacturing','Construction','Utilities','Defense','Transportation'],cert:['Certified Manufacturing Engineer'],rel:['Mechanical Engineering','Construction Management','Electronics'],sk:['CAD/CAM','Manufacturing Processes','Quality Control','Project Management'],prefix:'TECH'},
  {s:'cost-auto',dept:'Applied Engineering Technology',prog:'B.S. in Automotive Engineering Technology',deg:'BS',field:'Automotive Technology',bls:'17-3027',sal:'$60,220',gr:'5%',jobs:'69,900',emp:['Ford','GM','Toyota','Tesla','Bosch','NASCAR Teams'],cert:['ASE Certifications'],rel:['Mechanical Engineering','Electronics','Applied Engineering'],sk:['Automotive Systems','Diagnostics','EV Technology','Engine Performance'],prefix:'AUTO'},
  {s:'cost-bio',dept:'Biology',prog:'B.S. in Biology',deg:'BS',field:'Biology',bls:'19-1020',sal:'$82,220',gr:'5%',jobs:'87,800',emp:['Research Labs','Pharmaceutical Companies','Government Agencies','Biotech Firms'],cert:['ASCP (lab)'],rel:['Chemistry','Environmental Science','Public Health'],sk:['Lab Techniques','Molecular Biology','Genetics','Ecology','Microscopy'],prefix:'BIOL'},
  {s:'cost-bio-pre',dept:'Biology',prog:'B.S. in Biology — Pre-Medical',deg:'BS',field:'Pre-Medicine',bls:'29-1228',sal:'$229,300',gr:'3%',jobs:'727,000',emp:['Medical Schools','Hospitals','Research Institutions','VA Medical Centers'],cert:['MCAT'],rel:['Chemistry','Psychology','Kinesiology'],sk:['Anatomy','Biochemistry','Clinical Shadowing','MCAT Prep','Research'],prefix:'BIOL'},
  {s:'cost-bio-law',dept:'Biology',prog:'B.S. in Biology — Pre-Law',deg:'BS',field:'Biolaw',bls:'23-1011',sal:'$135,740',gr:'5%',jobs:'793,200',emp:['Patent Law Firms','FDA','EPA','Biotech Legal','IP Law'],cert:['LSAT'],rel:['Chemistry','Political Science','Criminal Justice'],sk:['Patent Law','Regulatory Science','LSAT Prep','Scientific Writing'],prefix:'BIOL'},
  {s:'cost-cm',dept:'Built Environment',prog:'B.S. in Construction Management',deg:'BS',field:'Construction Management',bls:'11-9021',sal:'$101,480',gr:'5%',jobs:'504,600',emp:['Skanska','Turner Construction','Brasfield & Gorrie','Holder Construction','Balfour Beatty'],cert:['CCM','LEED AP','PMP','OSHA 30'],rel:['Civil Engineering','Architectural Engineering','Geomatics'],sk:['Project Scheduling','Cost Estimating','BIM','Safety Management','Contract Administration'],prefix:'CONS'},
  {s:'cost-ehs-mgmt',dept:'Built Environment',prog:'B.S. in Environmental Health & Safety — Mgmt',deg:'BS',field:'EHS Management',bls:'29-9011',sal:'$78,570',gr:'5%',jobs:'122,700',emp:['OSHA','EPA','Manufacturing','Construction','Consulting Firms'],cert:['CSP','CIH','OSHA 30'],rel:['Biology','Chemistry','Construction Management'],sk:['OSHA Regulations','Risk Assessment','Industrial Hygiene','Safety Training'],prefix:'ENHS'},
  {s:'cost-ehs-sci',dept:'Built Environment',prog:'B.S. in Environmental Health & Safety — Science',deg:'BS',field:'Environmental Health Science',bls:'19-2041',sal:'$76,530',gr:'6%',jobs:'86,400',emp:['EPA','State Health Departments','Consulting Firms','Water Utilities'],cert:['REHS','CSP'],rel:['Biology','Chemistry','Environmental Studies'],sk:['Environmental Sampling','Toxicology','Water Quality','Air Monitoring'],prefix:'ENHS'},
  {s:'cost-geo',dept:'Built Environment',prog:'B.S. in Geomatics',deg:'BS',field:'Geomatics/Surveying',bls:'17-1022',sal:'$63,080',gr:'5%',jobs:'49,700',emp:['Survey Firms','Civil Engineering Companies','State DOTs','USGS','Real Estate'],cert:['PLS (Professional Land Surveyor)'],rel:['Civil Engineering','GIS','Construction Management'],sk:['Total Station','GPS/GNSS','GIS','Drone Mapping','CAD','Remote Sensing'],prefix:'GEOM'},
  {s:'cost-chem',dept:'Chemistry',prog:'B.S. in Chemistry — ACS Certified',deg:'BS',field:'Chemistry',bls:'19-2031',sal:'$80,680',gr:'6%',jobs:'86,600',emp:['Pharmaceutical Companies','Chemical Manufacturers','FDA','EPA','Research Labs'],cert:['ACS Certified'],rel:['Biology','Physics','Environmental Science'],sk:['Organic Chemistry','Analytical Chemistry','Spectroscopy','Lab Safety','Research'],prefix:'CHEM'},
  {s:'cost-chem-bio',dept:'Chemistry',prog:'B.S. in Chemistry — Biochemistry',deg:'BS',field:'Biochemistry',bls:'19-1021',sal:'$102,270',gr:'7%',jobs:'34,800',emp:['Biotech Firms','Pharmaceutical Companies','NIH','Research Universities','Hospitals'],cert:['ASCP'],rel:['Biology','Pre-Medicine','Food Science'],sk:['Protein Chemistry','Molecular Biology','Enzymology','Mass Spectrometry','PCR'],prefix:'CHEM'},
  {s:'cost-elec',dept:'Computer Systems Technology',prog:'B.S. in Electronics Technology',deg:'BS',field:'Electronics Technology',bls:'17-3023',sal:'$60,360',gr:'1%',jobs:'133,200',emp:['Telecommunications','Defense','Manufacturing','Utilities','Semiconductor Companies'],cert:['CompTIA A+','FCC License','IPC Certification'],rel:['Electrical Engineering','Computer Engineering','IT'],sk:['Circuit Design','PCB Layout','Troubleshooting','Oscilloscopes','Soldering'],prefix:'ECET'},
  {s:'cost-it',dept:'Computer Systems Technology',prog:'B.S. in Information Technology',deg:'BS',field:'Information Technology',bls:'15-1232',sal:'$99,270',gr:'9%',jobs:'455,200',emp:['IBM','Microsoft','Amazon','Cisco','Government','Healthcare IT'],cert:['CompTIA A+/Net+/Sec+','AWS','Cisco CCNA'],rel:['Computer Science','Business IT','Cybersecurity'],sk:['Networking','Cybersecurity','Cloud Computing','Linux','Help Desk','Scripting'],prefix:'ITEC'},
  {s:'cost-cgt-td',dept:'Applied Engineering Technology',prog:'B.S. in Computer Graphics Tech — Technical Design',deg:'BS',field:'Computer Graphics — Technical Design',bls:'27-1014',sal:'$62,530',gr:'3%',jobs:'98,500',emp:['Architecture Firms','Engineering Companies','Game Studios','Animation Studios'],cert:['Autodesk Certified','SolidWorks CSWP'],rel:['Architectural Engineering','Visual Arts','Mechanical Engineering'],sk:['3D Modeling','AutoCAD','Revit','SolidWorks','Rendering','Technical Drawing'],prefix:'CGRA'},
  {s:'cost-cgt-ux',dept:'Applied Engineering Technology',prog:'B.S. in Computer Graphics Tech — UX',deg:'BS',field:'UX Design',bls:'15-1255',sal:'$80,150',gr:'16%',jobs:'196,000',emp:['Google','Apple','Microsoft','Design Agencies','Startups'],cert:['Google UX Design Certificate','Nielsen Norman UX'],rel:['Graphic Design','Computer Science','Psychology'],sk:['User Research','Wireframing','Prototyping','Figma','Usability Testing'],prefix:'CGRA'},
  {s:'cost-math-app',dept:'Mathematics & Statistics',prog:'B.S. in Mathematics — Applied',deg:'BS',field:'Applied Mathematics',bls:'15-2021',sal:'$100,860',gr:'31%',jobs:'48,600',emp:['NSA','NIST','Defense Contractors','Tech Companies','Finance'],cert:['SAS Certified','Actuarial Exams'],rel:['Computer Science','Physics','Economics'],sk:['Differential Equations','Numerical Methods','MATLAB','Mathematical Modeling'],prefix:'MATH'},
  {s:'cost-math-pure',dept:'Mathematics & Statistics',prog:'B.S. in Mathematics — Pure',deg:'BS',field:'Pure Mathematics',bls:'15-2021',sal:'$100,860',gr:'31%',jobs:'48,600',emp:['Universities','Research Institutes','NSA','Cryptography','Graduate Schools'],cert:['N/A'],rel:['Physics','Computer Science','Philosophy'],sk:['Abstract Algebra','Real Analysis','Topology','Proof Writing','Number Theory'],prefix:'MATH'},
  {s:'cost-math-ds',dept:'Mathematics & Statistics',prog:'B.S. in Mathematics — Data Science',deg:'BS',field:'Data Science',bls:'15-2051',sal:'$108,020',gr:'35%',jobs:'190,600',emp:['Google','Amazon','Meta','Netflix','Financial Institutions','Healthcare'],cert:['SAS','Python Data Science','Tableau'],rel:['Computer Science','Statistics','Economics'],sk:['Machine Learning','Python/R','SQL','Statistical Modeling','Data Visualization'],prefix:'MATH'},
  {s:'cost-atms',dept:'Physics',prog:'B.S. in Atmospheric Sciences & Meteorology',deg:'BS',field:'Meteorology',bls:'19-2021',sal:'$94,570',gr:'4%',jobs:'10,100',emp:['NWS','NOAA','Military','TV Stations','Private Forecasting'],cert:['AMS Certified Broadcast Meteorologist'],rel:['Physics','Mathematics','Environmental Science'],sk:['Weather Forecasting','Radar Interpretation','Climate Science','Numerical Modeling','GIS'],prefix:'ATMS'},
  {s:'cost-phys',dept:'Physics',prog:'B.S. in Physics',deg:'BS',field:'Physics',bls:'19-2012',sal:'$142,850',gr:'5%',jobs:'21,500',emp:['National Labs','NASA','Universities','Defense','Tech Companies'],cert:['N/A'],rel:['Mathematics','Engineering','Astronomy'],sk:['Mechanics','E&M','Quantum Mechanics','Lab Skills','Mathematical Physics'],prefix:'PHYS'},
  {s:'cost-phys-eng',dept:'Physics',prog:'B.S. in Physics — Engineering',deg:'BS',field:'Engineering Physics',bls:'17-2199',sal:'$104,610',gr:'4%',jobs:'199,000',emp:['Boeing','Lockheed Martin','NASA','National Labs','Tesla'],cert:['FE Exam'],rel:['Mechanical Engineering','Electrical Engineering','Mathematics'],sk:['Applied Physics','Materials Science','Optics','Computational Physics'],prefix:'PHYS'},
  {s:'cost-phys-bio',dept:'Physics',prog:'B.S. in Physics — Biological',deg:'BS',field:'Biophysics',bls:'19-2012',sal:'$142,850',gr:'5%',jobs:'21,500',emp:['NIH','Pharmaceutical Companies','Research Universities','Medical Device Companies'],cert:['N/A'],rel:['Biology','Chemistry','Bioengineering'],sk:['Biophysics','Medical Imaging','Radiation Physics','Molecular Biophysics'],prefix:'PHYS'},
  {s:'cost-ai',dept:'Interdisciplinary',prog:'B.S. in Artificial Intelligence — Applied AI',deg:'BS',field:'Applied AI',bls:'15-2051',sal:'$136,620',gr:'23%',jobs:'190,600',emp:['Google','Microsoft','Amazon','Apple','NVIDIA','OpenAI'],cert:['AWS ML Specialty','TensorFlow Developer'],rel:['Computer Science','Mathematics','Data Science'],sk:['Machine Learning','Deep Learning','Python','TensorFlow/PyTorch','Computer Vision'],prefix:'COMP'}
];

// ═════════════════════════════════════════
// GENERATE GENERIC TIMELINE
// ═════════════════════════════════════════
function genericTimeline(prefix, field) {
  return mkTimeline([
    {id:'year-1',name:'Year 1',sub:'Explore',desc:`Introduction to ${field.toLowerCase()} and foundations.`,ms:[
      {id:'y1-intro',l:`Intro to ${field}`,c:`${prefix} 101`,cat:'Purpose',sem:'fall',d:`Overview of ${field.toLowerCase()}: history, scope, and careers.`,sk:[field]},
      {id:'y1-found1',l:'Foundation Course I',c:`${prefix} 110`,cat:'Identity',sem:'fall',d:`Core principles and methodologies in ${field.toLowerCase()}.`,sk:['Foundations']},
      {id:'y1-found2',l:'Foundation Course II',c:`${prefix} 120`,cat:'Communities',sem:'spring',d:'Building fundamental skills and knowledge.',sk:['Core Skills']},
      {id:'y1-gen',l:'General Education',c:'UNIV 101',cat:'LocalGlobal',sem:'spring',d:'University seminar and academic success strategies.',sk:['Academic Skills']}
    ]},
    {id:'year-2',name:'Year 2',sub:'Engage',desc:`Intermediate ${field.toLowerCase()} courses and engagement.`,ms:[
      {id:'y2-inter1',l:`Intermediate ${field}`,c:`${prefix} 200`,cat:'Identity',sem:'fall',d:`Deeper exploration of ${field.toLowerCase()} concepts.`,sk:['Intermediate Skills']},
      {id:'y2-inter2',l:'Methods & Techniques',c:`${prefix} 210`,cat:'Purpose',sem:'spring',d:'Practical methods and professional techniques.',sk:['Methods']},
      {id:'y2-app',l:'Applied Practice',c:`${prefix} 220`,cat:'Communities',sem:'fall',d:'Hands-on applications and collaborative projects.',sk:['Applied Practice']},
      {id:'y2-elec',l:'Elective Exploration',c:`${prefix} 250`,cat:'LocalGlobal',sem:'spring',d:'Exploring specialized topics and interests.',sk:['Specialization']}
    ]},
    {id:'year-3',name:'Year 3',sub:'Develop',desc:`Advanced ${field.toLowerCase()} and professional development.`,ms:[
      {id:'y3-adv1',l:'Advanced Topics',c:`${prefix} 300`,cat:'Identity',sem:'fall',d:`Advanced theory and practice in ${field.toLowerCase()}.`,sk:['Advanced Topics']},
      {id:'y3-adv2',l:'Specialized Study',c:`${prefix} 310`,cat:'Purpose',sem:'spring',d:'Concentrated study in area of specialization.',sk:['Specialization']},
      {id:'y3-research',l:'Research/Practice',c:`${prefix} 350`,cat:'LocalGlobal',sem:'fall',d:'Research methods or applied professional practice.',sk:['Research']},
      {id:'y3-intern',l:'Internship/Field Experience',c:`${prefix} 490`,cat:'Communities',sem:'spring',d:'Professional work experience in the field.',sk:['Industry Experience']}
    ]},
    {id:'year-4',name:'Year 4',sub:'Launch',desc:'Capstone, certification, and career launch.',ms:[
      {id:'y4-cap1',l:'Senior Seminar',c:`${prefix} 400`,cat:'Identity',sem:'fall',d:'Advanced seminar integrating all program knowledge.',sk:['Integration']},
      {id:'y4-capstone',l:'Senior Capstone',c:`${prefix} 498`,cat:'Purpose',sem:'spring',d:'Comprehensive capstone project or thesis.',sk:['Capstone']},
      {id:'y4-career',l:'Career Preparation',c:`${prefix} 499`,cr:1,cat:'Communities',sem:'spring',d:'Resume, portfolio, and career placement.',sk:['Career Readiness']}
    ]}
  ]);
}

// ═════════════════════════════════════════
// WRITE ALL FILES
// ═════════════════════════════════════════
let created = 0;

function writeProgram(p, college) {
  const dir = path.join(SEEDS, p.s);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});

  // branding
  const bp = path.join(dir, 'branding.json');
  if (!fs.existsSync(bp)) {
    fs.writeFileSync(bp, JSON.stringify(mkBranding(p.s,college,p.dept,p.prog,p.deg,p.field,p.bls,p.sal,p.gr,p.jobs,p.emp,p.cert,p.rel,p.sk), null, 2));
    created++;
  }
  // timeline
  const tp = path.join(dir, 'timeline.json');
  if (!fs.existsSync(tp)) {
    const tl = p.tl ? mkTimeline(p.tl) : genericTimeline(p.prefix || 'DEPT', p.field);
    fs.writeFileSync(tp, JSON.stringify(tl, null, 2));
    created++;
  }
  // matrix
  const mp = path.join(dir, 'matrix.json');
  if (!fs.existsSync(mp)) {
    fs.writeFileSync(mp, JSON.stringify(MATRIX, null, 2));
    created++;
  }
}

// CHHS (detailed timelines built above)
ALL.forEach(p => writeProgram(p, p.col));

// CAHSS (generic timelines)
cahssPrograms.forEach(p => writeProgram(p, CAHSS));

// CEd (generic timelines)
cedPrograms.forEach(p => writeProgram(p, CEd));

// CoST (generic timelines)
costPrograms.forEach(p => writeProgram(p, CoST));

console.log(`\n✅ Created ${created} new seed files`);
console.log(`📂 Total seed directories: ${fs.readdirSync(SEEDS).filter(f => fs.statSync(path.join(SEEDS, f)).isDirectory()).length}`);
