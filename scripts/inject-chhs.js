/**
 * Inject CHHS career data into report.js
 */
const fs = require('fs');
const path = require('path');
const reportPath = path.join(__dirname, '..', 'js', 'report.js');

const CHHS_DATA = `
    'nurs': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Nursing',
      tagline: 'Healing, Advocating & Leading in Healthcare',
      overview: 'Nurses are the backbone of healthcare — providing direct patient care, advocating for health equity, and leading clinical teams. NC A&T\\'s BSN program prepares you for licensure and a career that\\'s always in demand. Nursing offers one of the fastest paths to a stable, meaningful career.',
      blsSalary: 81220, blsGrowth: 6, blsEmployment: 3175390, nationalMedian: 48060,
      careers: [
        { title: 'Registered Nurse (RN)', salary: '$60K – $95K', icon: '🩺', desc: 'Provide direct patient care in hospitals, clinics, and community health settings.' },
        { title: 'Nurse Practitioner (NP)', salary: '$120K – $170K', icon: '👩‍⚕️', desc: 'Diagnose, treat, and prescribe as an advanced practice provider. Requires MSN.' },
        { title: 'ICU / Critical Care Nurse', salary: '$70K – $110K', icon: '🫀', desc: 'Care for critically ill patients in intensive care and trauma units.' },
        { title: 'Public Health Nurse', salary: '$55K – $85K', icon: '🌍', desc: 'Promote community health, disease prevention, and health education.' },
        { title: 'Nurse Educator', salary: '$75K – $110K', icon: '📚', desc: 'Teach the next generation of nurses in academic and clinical settings.' },
        { title: 'Nurse Anesthetist (CRNA)', salary: '$190K – $250K+', icon: '💉', desc: 'Administer anesthesia for surgical procedures. Among the highest-paid nursing roles.' }
      ],
      images: ['assets/images/professions/prof_health_mgmt.png'],
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
      images: ['assets/images/professions/prof_health_mgmt.png'],
      related: [
        { name: 'Psychology', why: 'Cognitive and developmental science' },
        { name: 'Nursing', why: 'Patient care and medical terminology' },
        { name: 'Elementary Education', why: 'Working with children in school settings' }
      ],
      whatYouCanDo: ['Help children find their voices','Rehabilitate stroke patients\\' communication abilities','Fit and program hearing aids and cochlear implants','Work in hospitals, schools, or private practice','Specialize in accent modification or voice therapy','Research new treatments for communication disorders']
    },
    'comm': {
      hero: 'assets/images/professions/prof_communications.png',
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
      images: ['assets/images/professions/prof_health_mgmt.png'],
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
        { title: 'School Psychologist', salary: '$65K – $100K', icon: '🏫', desc: 'Support students\\' mental health, learning, and behavioral needs in schools.' },
        { title: 'Industrial-Organizational Psychologist', salary: '$95K – $160K', icon: '💼', desc: 'Apply psychology to workplace performance, hiring, and employee well-being.' },
        { title: 'Forensic Psychologist', salary: '$70K – $120K', icon: '⚖️', desc: 'Apply psychology to legal matters — criminal profiling, competency evaluations.' },
        { title: 'Research Psychologist', salary: '$60K – $100K', icon: '🔬', desc: 'Conduct experiments and studies to advance understanding of human behavior.' },
        { title: 'Licensed Counselor', salary: '$50K – $80K', icon: '💬', desc: 'Provide therapy for individuals, couples, and families. Requires master\\'s.' }
      ],
      images: ['assets/images/professions/prof_health_mgmt.png'],
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
        { title: 'School Social Worker', salary: '$45K – $70K', icon: '🏫', desc: 'Support students\\' social-emotional needs and connect families to resources.' },
        { title: 'Hospital Social Worker', salary: '$50K – $75K', icon: '🏥', desc: 'Help patients and families navigate healthcare, insurance, and discharge planning.' },
        { title: 'Community Development Coordinator', salary: '$45K – $70K', icon: '🤝', desc: 'Build programs to address housing, employment, and community health needs.' }
      ],
      images: ['assets/images/professions/prof_health_mgmt.png'],
      related: [
        { name: 'Psychology', why: 'Clinical therapy and behavioral science' },
        { name: 'Sociology', why: 'Understanding social systems and inequality' },
        { name: 'Criminal Justice', why: 'Juvenile justice and reentry programs' }
      ],
      whatYouCanDo: ['Counsel individuals and families through crisis','Protect children in the foster care system','Support veterans transitioning to civilian life','Help patients navigate the healthcare system','Lead community development programs','Advocate for social justice and policy reform']
    }`;

let src = fs.readFileSync(reportPath, 'utf8');

const aliasLine = "  // Also map alternate keys";
const dbCloseIdx = src.lastIndexOf('  };', src.indexOf(aliasLine));

const beforeClose = src.substring(0, dbCloseIdx - 1);
const afterClose = src.substring(dbCloseIdx);

let newSrc = beforeClose + ',\n' + CHHS_DATA + '\n' + afterClose;

// Add alias mappings
const lastAlias = "  DB['coe-ai'] = DB['cs'];";
const newAliases = lastAlias + `
  // CHHS aliases
  DB['ex'] = DB['kin'];
  DB['rsm'] = DB['kin'];
  DB['pre'] = DB['kin'];`;

newSrc = newSrc.replace(lastAlias, newAliases);

fs.writeFileSync(reportPath, newSrc, 'utf8');
console.log('✅ CHHS data injected into report.js');
console.log('Keys added: nurs, slpa, comm, kin, hsm, psych, soc, sw');
