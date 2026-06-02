/**
 * Inject profession-specific exam/licensure validation tracks into 
 * all non-CAES program matrix.json and branding.json files.
 * 
 * Like how Landscape Architecture has the LARE exam sections,
 * each program gets its own equivalent professional exams.
 */
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════
// EXAM DATABASE — every program's professional exams
// ═══════════════════════════════════════════════════

const EXAM_DB = {
  // ──────── CoBE ────────
  'cobe-acct': {
    validationLabel: 'CPA Exam + CMA Certification',
    tracks: [
      {
        id: 'cpa', name: 'CPA Exam Readiness',
        description: 'Uniform CPA Examination — 4 sections administered by AICPA/NASBA, required for Certified Public Accountant licensure in all 50 states',
        sections: [
          { id: 'cpa-aud', name: 'Auditing & Attestation (AUD)', description: 'Audit procedures, attestation engagements, professional responsibilities, and ethics' },
          { id: 'cpa-far', name: 'Financial Accounting & Reporting (FAR)', description: 'GAAP, financial statements, government/nonprofit accounting, and transaction analysis' },
          { id: 'cpa-reg', name: 'Regulation (REG)', description: 'Federal taxation, business law, ethics, and professional responsibilities' },
          { id: 'cpa-tcp', name: 'Tax Compliance & Planning (TCP)', description: 'Individual and entity tax compliance, tax planning, and advisory' }
        ]
      },
      {
        id: 'cma', name: 'CMA Certification',
        description: 'Certified Management Accountant — administered by IMA, demonstrating competency in financial planning, analysis, and strategic management',
        sections: [
          { id: 'cma-1', name: 'Financial Planning, Performance & Analytics', description: 'Budgeting, forecasting, cost management, and performance measurement' },
          { id: 'cma-2', name: 'Strategic Financial Management', description: 'Financial statement analysis, corporate finance, risk management, and investment decisions' }
        ]
      }
    ]
  },
  'cobe-fin': {
    validationLabel: 'CFA Exam + CFP Certification',
    tracks: [
      {
        id: 'cfa', name: 'CFA Exam Readiness',
        description: 'Chartered Financial Analyst — 3-level exam administered by CFA Institute, the gold standard for investment professionals worldwide',
        sections: [
          { id: 'cfa-1', name: 'CFA Level I — Investment Tools', description: 'Ethics, quantitative methods, economics, financial reporting, and portfolio management basics' },
          { id: 'cfa-2', name: 'CFA Level II — Asset Valuation', description: 'Equity and fixed income valuation, derivatives, alternative investments, and financial reporting analysis' },
          { id: 'cfa-3', name: 'CFA Level III — Portfolio Management', description: 'Portfolio management, wealth planning, behavioral finance, and institutional asset management' }
        ]
      },
      {
        id: 'cfp', name: 'CFP Certification',
        description: 'Certified Financial Planner — administered by CFP Board, required for comprehensive personal financial planning',
        sections: [
          { id: 'cfp-1', name: 'Financial Planning Principles', description: 'Financial planning process, fiduciary duty, and client communication' },
          { id: 'cfp-2', name: 'Insurance & Risk Management', description: 'Risk assessment, insurance products, and estate planning' },
          { id: 'cfp-3', name: 'Investment & Tax Planning', description: 'Investment theory, tax strategies, and retirement planning' }
        ]
      }
    ]
  },
  'cobe-econ': {
    validationLabel: 'GRE Quantitative + SAS/STATA Certification',
    tracks: [
      {
        id: 'gre', name: 'Graduate Readiness (GRE)',
        description: 'GRE General Test — quantitative reasoning section critical for economics graduate program admission',
        sections: [
          { id: 'gre-quant', name: 'Quantitative Reasoning', description: 'Algebra, data analysis, arithmetic, and geometry for graduate school readiness' },
          { id: 'gre-verbal', name: 'Verbal Reasoning & Analytical Writing', description: 'Reading comprehension, critical reasoning, and analytical writing' }
        ]
      },
      {
        id: 'stats', name: 'Statistical Software Certification',
        description: 'Professional data analysis certifications used in economics research and industry',
        sections: [
          { id: 'stats-sas', name: 'SAS / STATA Proficiency', description: 'Econometric analysis, regression modeling, and statistical programming' },
          { id: 'stats-r', name: 'R / Python Data Analysis', description: 'Data visualization, statistical computing, and reproducible research' }
        ]
      }
    ]
  },
  'cobe-econ-law': {
    validationLabel: 'LSAT + GRE Quantitative',
    tracks: [
      {
        id: 'lsat', name: 'LSAT Readiness',
        description: 'Law School Admission Test — required for law school admission, testing logical reasoning and analytical skills',
        sections: [
          { id: 'lsat-lr', name: 'Logical Reasoning', description: 'Analyzing arguments, identifying flaws, and drawing logical conclusions' },
          { id: 'lsat-rc', name: 'Reading Comprehension', description: 'Analyzing complex texts from law, social sciences, humanities, and natural sciences' },
          { id: 'lsat-lg', name: 'Analytical Reasoning (Logic Games)', description: 'Deductive reasoning, ordering, grouping, and conditional logic' }
        ]
      }
    ]
  },
  'cobe-mgmt': {
    validationLabel: 'PMP + SHRM-CP Certification',
    tracks: [
      {
        id: 'pmp', name: 'PMP Certification Readiness',
        description: 'Project Management Professional — administered by PMI, the most recognized project management credential worldwide',
        sections: [
          { id: 'pmp-init', name: 'Project Initiation & Planning', description: 'Project charter, scope definition, WBS, scheduling, and budgeting' },
          { id: 'pmp-exec', name: 'Execution & Monitoring', description: 'Team management, quality assurance, risk response, and performance tracking' },
          { id: 'pmp-close', name: 'Closing & Professional Ethics', description: 'Project closeout, lessons learned, stakeholder sign-off, and PMI code of ethics' }
        ]
      },
      {
        id: 'shrm', name: 'SHRM-CP (HR Certification)',
        description: 'Society for Human Resource Management — Certified Professional credential for HR practitioners',
        sections: [
          { id: 'shrm-1', name: 'People & Workplace Strategy', description: 'Talent acquisition, employee engagement, culture, and HR strategy' },
          { id: 'shrm-2', name: 'Organization & Compliance', description: 'Employment law, total rewards, organizational development, and workforce planning' }
        ]
      }
    ]
  },
  'cobe-mgmt-ent': {
    validationLabel: 'PMP + Lean Six Sigma',
    tracks: [
      {
        id: 'pmp', name: 'PMP Certification Readiness',
        description: 'Project Management Professional — administered by PMI',
        sections: [
          { id: 'pmp-init', name: 'Project Initiation & Planning', description: 'Scope, schedule, budget, and stakeholder management' },
          { id: 'pmp-exec', name: 'Execution & Delivery', description: 'Team leadership, quality, and risk management' }
        ]
      },
      {
        id: 'lss', name: 'Lean Six Sigma Green Belt',
        description: 'Process improvement methodology certification used across all industries',
        sections: [
          { id: 'lss-define', name: 'Define & Measure', description: 'Problem definition, process mapping, and baseline measurement' },
          { id: 'lss-analyze', name: 'Analyze, Improve & Control', description: 'Root cause analysis, solution implementation, and statistical process control' }
        ]
      }
    ]
  },
  'cobe-mgmt-intl': {
    validationLabel: 'PMP + NASBITE CGBP',
    tracks: [
      {
        id: 'cgbp', name: 'CGBP Certification',
        description: 'Certified Global Business Professional — administered by NASBITE International for global trade professionals',
        sections: [
          { id: 'cgbp-1', name: 'Global Business Management', description: 'International strategy, cross-cultural management, and global HR' },
          { id: 'cgbp-2', name: 'Trade Finance & Logistics', description: 'International trade finance, supply chain, compliance, and documentation' }
        ]
      }
    ]
  },
  'cobe-bit': {
    validationLabel: 'CompTIA + AWS Certification',
    tracks: [
      {
        id: 'comptia', name: 'CompTIA Certifications',
        description: 'Industry-standard IT certifications recognized worldwide for business technology professionals',
        sections: [
          { id: 'comptia-a', name: 'CompTIA A+ (IT Fundamentals)', description: 'Hardware, networking, OS, security, and troubleshooting fundamentals' },
          { id: 'comptia-sec', name: 'CompTIA Security+', description: 'Threats, vulnerabilities, cryptography, access control, and network security' },
          { id: 'comptia-net', name: 'CompTIA Network+', description: 'Network architecture, operations, security, and troubleshooting' }
        ]
      },
      {
        id: 'aws', name: 'AWS Cloud Practitioner',
        description: 'Amazon Web Services foundational cloud certification',
        sections: [
          { id: 'aws-1', name: 'Cloud Concepts & Architecture', description: 'AWS global infrastructure, cloud economics, and design principles' },
          { id: 'aws-2', name: 'Security, Billing & Technology', description: 'Shared responsibility model, AWS services, pricing, and support' }
        ]
      }
    ]
  },
  'cobe-mktg': {
    validationLabel: 'Google Analytics + HubSpot Certification',
    tracks: [
      {
        id: 'google', name: 'Google Certifications',
        description: 'Google digital marketing and analytics certifications — industry standard for marketing professionals',
        sections: [
          { id: 'ga-1', name: 'Google Analytics Certification', description: 'Web analytics, data collection, traffic analysis, and conversion tracking' },
          { id: 'ga-2', name: 'Google Ads Certification', description: 'Search, display, video, and shopping ad campaign management' }
        ]
      },
      {
        id: 'hubspot', name: 'HubSpot Inbound Marketing',
        description: 'HubSpot Academy certifications for inbound marketing and sales',
        sections: [
          { id: 'hs-1', name: 'Inbound Marketing Certification', description: 'Content strategy, social media, SEO, and lead nurturing' },
          { id: 'hs-2', name: 'Content Marketing Certification', description: 'Content creation, storytelling, promotion, and analytics' }
        ]
      }
    ]
  },
  'cobe-mktg-sales': {
    validationLabel: 'CPSP + Salesforce Certification',
    tracks: [
      {
        id: 'cpsp', name: 'CPSP Sales Certification',
        description: 'Certified Professional Sales Person — administered by NASP for professional selling competency',
        sections: [
          { id: 'cpsp-1', name: 'Prospecting & Relationship Building', description: 'Lead generation, cold calling, networking, and client relationship management' },
          { id: 'cpsp-2', name: 'Negotiation & Closing', description: 'Sales presentations, objection handling, negotiation, and deal closing' }
        ]
      },
      {
        id: 'sf', name: 'Salesforce Administrator',
        description: 'Salesforce CRM platform certification — essential for modern sales operations',
        sections: [
          { id: 'sf-1', name: 'Salesforce Fundamentals', description: 'CRM configuration, user management, reports, and dashboards' }
        ]
      }
    ]
  },
  'cobe-scm': {
    validationLabel: 'CSCP + CLTD Certification (ASCM)',
    tracks: [
      {
        id: 'cscp', name: 'CSCP Certification',
        description: 'Certified Supply Chain Professional — administered by ASCM (Association for Supply Chain Management)',
        sections: [
          { id: 'cscp-1', name: 'Supply Chain Design & Planning', description: 'Demand management, supply planning, and S&OP processes' },
          { id: 'cscp-2', name: 'Supply Chain Execution & Improvement', description: 'Procurement, manufacturing, logistics, and continuous improvement' },
          { id: 'cscp-3', name: 'Global Supply Chain Strategy', description: 'Global sourcing, risk management, sustainability, and technology integration' }
        ]
      },
      {
        id: 'cltd', name: 'CLTD Certification',
        description: 'Certified in Logistics, Transportation & Distribution — ASCM credential for logistics professionals',
        sections: [
          { id: 'cltd-1', name: 'Logistics & Transportation', description: 'Transportation modes, warehousing, and distribution network design' },
          { id: 'cltd-2', name: 'Global Logistics & Compliance', description: 'International trade, customs, regulations, and reverse logistics' }
        ]
      }
    ]
  },

  // ──────── CoE ────────
  'coe-ae': {
    validationLabel: 'FE Exam + PE Licensure',
    tracks: [
      {
        id: 'fe', name: 'FE Exam Readiness',
        description: 'Fundamentals of Engineering Exam — administered by NCEES, first step toward Professional Engineer (PE) licensure',
        sections: [
          { id: 'fe-math', name: 'Mathematics & Statistics', description: 'Calculus, differential equations, linear algebra, and probability/statistics' },
          { id: 'fe-sci', name: 'Engineering Sciences', description: 'Statics, dynamics, thermodynamics, fluid mechanics, and materials science' },
          { id: 'fe-prac', name: 'Engineering Practice & Ethics', description: 'Engineering economics, professional ethics, and engineering design process' }
        ]
      },
      {
        id: 'pe', name: 'PE Licensure Pathway',
        description: 'Professional Engineer license — requires FE exam + 4 years experience + PE exam in your discipline',
        sections: [
          { id: 'pe-exp', name: 'Engineering Experience Requirements', description: '4 years of progressive engineering experience under a licensed PE' },
          { id: 'pe-exam', name: 'PE Exam (Discipline-Specific)', description: 'Advanced exam in your specific engineering discipline' }
        ]
      }
    ]
  },
  'coe-bioe': {
    validationLabel: 'FE Exam (Other Disciplines) + PE Licensure',
    tracks: [
      {
        id: 'fe', name: 'FE Exam Readiness',
        description: 'Fundamentals of Engineering Exam — Other Disciplines track for biological/bioprocess engineering',
        sections: [
          { id: 'fe-math', name: 'Mathematics & Statistics', description: 'Calculus, differential equations, linear algebra, and probability' },
          { id: 'fe-bio', name: 'Biology & Chemistry Fundamentals', description: 'Organic chemistry, biochemistry, microbiology, and cell biology' },
          { id: 'fe-eng', name: 'Engineering Fundamentals', description: 'Thermodynamics, fluid mechanics, mass/energy balances, and process design' }
        ]
      }
    ]
  },
  'coe-che': {
    validationLabel: 'FE Exam (Chemical) + PE Licensure',
    tracks: [
      {
        id: 'fe', name: 'FE Exam Readiness',
        description: 'Fundamentals of Engineering Exam — Chemical Engineering discipline',
        sections: [
          { id: 'fe-math', name: 'Mathematics & Statistics', description: 'Calculus, differential equations, numerical methods' },
          { id: 'fe-chem', name: 'Chemical Engineering Fundamentals', description: 'Mass/energy balances, thermodynamics, transport phenomena, reaction engineering' },
          { id: 'fe-proc', name: 'Process Design & Safety', description: 'Process control, safety, environmental compliance, and plant design' }
        ]
      }
    ]
  },
  'coe-ce': {
    validationLabel: 'FE Exam (Civil) + PE Civil Licensure',
    tracks: [
      {
        id: 'fe', name: 'FE Exam Readiness',
        description: 'Fundamentals of Engineering Exam — Civil Engineering discipline',
        sections: [
          { id: 'fe-struct', name: 'Structural Engineering', description: 'Structural analysis, steel/concrete design, and foundation engineering' },
          { id: 'fe-geotech', name: 'Geotechnical & Transportation', description: 'Soil mechanics, highway design, traffic engineering' },
          { id: 'fe-water', name: 'Water Resources & Environmental', description: 'Hydraulics, hydrology, water treatment, and environmental engineering' },
          { id: 'fe-const', name: 'Construction & Surveying', description: 'Construction management, surveying, and engineering economics' }
        ]
      }
    ]
  },
  'coe-cpe': {
    validationLabel: 'FE Exam + CompTIA / Cisco Certification',
    tracks: [
      {
        id: 'fe', name: 'FE Exam Readiness',
        description: 'Fundamentals of Engineering Exam — Computer Engineering option',
        sections: [
          { id: 'fe-digital', name: 'Digital Systems & Computer Architecture', description: 'Logic design, microprocessor systems, and embedded computing' },
          { id: 'fe-sw', name: 'Software Engineering', description: 'Data structures, algorithms, operating systems, and software design' }
        ]
      },
      {
        id: 'cisco', name: 'Cisco CCNA',
        description: 'Cisco Certified Network Associate — foundational networking certification',
        sections: [
          { id: 'ccna-1', name: 'Network Fundamentals & Access', description: 'OSI model, switching, routing, and network access' },
          { id: 'ccna-2', name: 'IP Services & Security', description: 'IP connectivity, security fundamentals, and automation' }
        ]
      }
    ]
  },
  'coe-ee': {
    validationLabel: 'FE Exam (Electrical) + PE Licensure',
    tracks: [
      {
        id: 'fe', name: 'FE Exam Readiness',
        description: 'Fundamentals of Engineering Exam — Electrical & Computer Engineering discipline',
        sections: [
          { id: 'fe-circuits', name: 'Circuit Analysis & Electronics', description: 'AC/DC circuits, semiconductor devices, and analog/digital electronics' },
          { id: 'fe-signals', name: 'Signals, Systems & Controls', description: 'Signal processing, control systems, and communications' },
          { id: 'fe-power', name: 'Power Systems & Electromagnetics', description: 'Power engineering, motors, transformers, and electromagnetic theory' }
        ]
      }
    ]
  },
  'coe-ise': {
    validationLabel: 'FE Exam (Industrial) + Lean Six Sigma',
    tracks: [
      {
        id: 'fe', name: 'FE Exam Readiness',
        description: 'Fundamentals of Engineering Exam — Industrial & Systems Engineering discipline',
        sections: [
          { id: 'fe-or', name: 'Operations Research & Statistics', description: 'Linear programming, simulation, probability, and statistical process control' },
          { id: 'fe-mfg', name: 'Manufacturing & Quality', description: 'Manufacturing processes, quality engineering, and ergonomics/human factors' },
          { id: 'fe-sys', name: 'Systems Engineering & Economics', description: 'Systems design, engineering economics, and project management' }
        ]
      },
      {
        id: 'lss', name: 'Lean Six Sigma Green Belt',
        description: 'ASQ Lean Six Sigma certification — essential for process improvement professionals',
        sections: [
          { id: 'lss-dmaic', name: 'DMAIC Methodology', description: 'Define, Measure, Analyze, Improve, Control — the core Six Sigma framework' },
          { id: 'lss-lean', name: 'Lean Tools & Waste Elimination', description: 'Value stream mapping, 5S, kaizen, kanban, and waste identification' }
        ]
      }
    ]
  },
  'coe-me': {
    validationLabel: 'FE Exam (Mechanical) + PE Licensure',
    tracks: [
      {
        id: 'fe', name: 'FE Exam Readiness',
        description: 'Fundamentals of Engineering Exam — Mechanical Engineering discipline',
        sections: [
          { id: 'fe-thermo', name: 'Thermodynamics & Heat Transfer', description: 'Laws of thermodynamics, heat transfer modes, and HVAC systems' },
          { id: 'fe-mech', name: 'Mechanics & Materials', description: 'Statics, dynamics, mechanics of materials, and machine design' },
          { id: 'fe-fluids', name: 'Fluid Mechanics & Energy', description: 'Fluid dynamics, turbomachinery, and energy systems' }
        ]
      }
    ]
  },
  'coe-cs': {
    validationLabel: 'AWS / Azure Cloud + CompTIA Security+',
    tracks: [
      {
        id: 'cloud', name: 'Cloud Certification',
        description: 'Industry cloud platform certifications — essential for modern software engineers',
        sections: [
          { id: 'aws-cp', name: 'AWS Cloud Practitioner', description: 'Cloud concepts, AWS services, security, and pricing models' },
          { id: 'aws-sa', name: 'AWS Solutions Architect (Associate)', description: 'Designing resilient, performant, and cost-effective cloud architectures' }
        ]
      },
      {
        id: 'sec', name: 'CompTIA Security+',
        description: 'Foundational cybersecurity certification recognized by DoD and industry worldwide',
        sections: [
          { id: 'sec-threats', name: 'Threats, Attacks & Vulnerabilities', description: 'Malware, social engineering, application attacks, and threat intelligence' },
          { id: 'sec-arch', name: 'Architecture & Cryptography', description: 'Network architecture, secure design, PKI, and encryption protocols' },
          { id: 'sec-ops', name: 'Operations & Incident Response', description: 'Security operations, monitoring, incident response, and forensics' }
        ]
      }
    ]
  },
  'coe-ai': {
    validationLabel: 'Google TensorFlow + AWS ML Certification',
    tracks: [
      {
        id: 'tf', name: 'TensorFlow Developer Certificate',
        description: 'Google TensorFlow certification demonstrating ML model building proficiency',
        sections: [
          { id: 'tf-1', name: 'Neural Networks & Deep Learning', description: 'Building, training, and evaluating neural networks using TensorFlow/Keras' },
          { id: 'tf-2', name: 'Computer Vision & NLP', description: 'CNNs for image classification, RNNs/Transformers for text processing' }
        ]
      },
      {
        id: 'aws-ml', name: 'AWS Machine Learning Specialty',
        description: 'Amazon Web Services ML certification for deploying ML solutions at scale',
        sections: [
          { id: 'aws-ml-1', name: 'Data Engineering & ML', description: 'Data pipelines, feature engineering, and model training on AWS' },
          { id: 'aws-ml-2', name: 'Model Deployment & MLOps', description: 'SageMaker, model monitoring, A/B testing, and production ML systems' }
        ]
      }
    ]
  },

  // ──────── CHHS ────────
  'chhs-nurs': {
    validationLabel: 'NCLEX-RN Exam',
    tracks: [
      {
        id: 'nclex', name: 'NCLEX-RN Exam Readiness',
        description: 'National Council Licensure Examination for Registered Nurses — required to practice as an RN in all 50 states',
        sections: [
          { id: 'nclex-safe', name: 'Safe & Effective Care Environment', description: 'Management of care, safety and infection control, and coordinated care' },
          { id: 'nclex-promo', name: 'Health Promotion & Maintenance', description: 'Growth and development, prevention, and early detection of disease' },
          { id: 'nclex-psych', name: 'Psychosocial Integrity', description: 'Coping, mental health concepts, and therapeutic communication' },
          { id: 'nclex-phys', name: 'Physiological Integrity', description: 'Basic care, pharmacology, risk reduction, and physiological adaptation' }
        ]
      }
    ]
  },
  'chhs-slpa': {
    validationLabel: 'Praxis SLP Exam + ASHA CCC',
    tracks: [
      {
        id: 'praxis-slp', name: 'Praxis SLP Exam Readiness',
        description: 'Praxis Speech-Language Pathology exam (5331) — required for ASHA Certificate of Clinical Competence and state licensure',
        sections: [
          { id: 'praxis-found', name: 'Foundations & Professional Practice', description: 'Anatomy, physiology, acoustics, ethics, and evidence-based practice' },
          { id: 'praxis-screen', name: 'Screening, Assessment & Evaluation', description: 'Standardized/non-standardized assessment, cultural/linguistic diversity' },
          { id: 'praxis-plan', name: 'Planning, Implementation & Evaluation', description: 'Treatment planning, intervention techniques, and outcome measurement' }
        ]
      },
      {
        id: 'asha', name: 'ASHA CCC-SLP Certification',
        description: 'Certificate of Clinical Competence — the national credential for speech-language pathologists',
        sections: [
          { id: 'asha-cfy', name: 'Clinical Fellowship Year (CFY)', description: '36 weeks of supervised professional experience post-master\'s degree' },
          { id: 'asha-exam', name: 'Praxis Exam Passage', description: 'Passing score on the Praxis SLP examination' }
        ]
      }
    ]
  },
  'chhs-comm': {
    validationLabel: 'APR Accreditation + Google Analytics',
    tracks: [
      {
        id: 'apr', name: 'APR Accreditation',
        description: 'Accreditation in Public Relations — administered by Universal Accreditation Board (UAB/PRSA)',
        sections: [
          { id: 'apr-research', name: 'Research, Planning & Implementation', description: 'Communication research methods, strategic planning, and campaign execution' },
          { id: 'apr-ethics', name: 'Ethics & Evaluation', description: 'Professional ethics, measurement, evaluation, and crisis communication' }
        ]
      }
    ]
  },
  'chhs-kin-ex': {
    validationLabel: 'ACSM CPT + CSCS Certification',
    tracks: [
      {
        id: 'acsm', name: 'ACSM Certified Personal Trainer',
        description: 'American College of Sports Medicine — gold standard for exercise science professionals',
        sections: [
          { id: 'acsm-1', name: 'Exercise Physiology & Testing', description: 'Cardiorespiratory, musculoskeletal, and flexibility assessment' },
          { id: 'acsm-2', name: 'Program Design & Implementation', description: 'Exercise prescription, behavior change, and special populations' }
        ]
      },
      {
        id: 'cscs', name: 'NSCA CSCS Certification',
        description: 'Certified Strength & Conditioning Specialist — for collegiate and professional athletic training',
        sections: [
          { id: 'cscs-1', name: 'Scientific Foundations', description: 'Exercise science, sport psychology, and nutrition for athletes' },
          { id: 'cscs-2', name: 'Practical / Applied', description: 'Program design, exercise technique, testing, and organization' }
        ]
      }
    ]
  },
  'chhs-kin-pre': {
    validationLabel: 'GRE + DPT Admission Readiness',
    tracks: [
      {
        id: 'dpt', name: 'DPT Admission Readiness',
        description: 'Doctor of Physical Therapy prerequisites — preparing for graduate PT programs (PTCAS application)',
        sections: [
          { id: 'dpt-sci', name: 'Science Prerequisites', description: 'Anatomy, physiology, biology, chemistry, and physics with lab' },
          { id: 'dpt-obs', name: 'Clinical Observation Hours', description: 'Minimum 100+ hours observing licensed PTs across multiple settings' },
          { id: 'dpt-gre', name: 'GRE Exam Preparation', description: 'Quantitative, verbal, and analytical writing sections for PT school admission' }
        ]
      }
    ]
  },
  'chhs-kin-rsm': {
    validationLabel: 'CPRP + CPO Certification',
    tracks: [
      {
        id: 'cprp', name: 'CPRP Certification',
        description: 'Certified Park & Recreation Professional — administered by NRPA for park and recreation management',
        sections: [
          { id: 'cprp-1', name: 'Programming & Service Delivery', description: 'Recreation programming, event management, and community engagement' },
          { id: 'cprp-2', name: 'Facility & Resource Management', description: 'Facility operations, budgeting, risk management, and marketing' }
        ]
      }
    ]
  },
  'chhs-hsm': {
    validationLabel: 'ACHE Board Certification + CPHQ',
    tracks: [
      {
        id: 'ache', name: 'ACHE Fellow (FACHE)',
        description: 'American College of Healthcare Executives — the premier credential for healthcare leaders',
        sections: [
          { id: 'ache-1', name: 'Healthcare Management & Governance', description: 'Organizational management, governance, strategic planning, and financial management' },
          { id: 'ache-2', name: 'Healthcare Delivery & Quality', description: 'Quality improvement, patient safety, population health, and health informatics' }
        ]
      },
      {
        id: 'cphq', name: 'CPHQ Certification',
        description: 'Certified Professional in Healthcare Quality — NAHQ credential for quality and patient safety professionals',
        sections: [
          { id: 'cphq-1', name: 'Organizational Leadership & Quality', description: 'Healthcare quality concepts, data analytics, and performance improvement' }
        ]
      }
    ]
  },
  'chhs-psych': {
    validationLabel: 'GRE Psychology + EPPP Pathway',
    tracks: [
      {
        id: 'gre-psych', name: 'GRE Psychology Subject Test',
        description: 'Graduate Record Exam — Psychology subject test for graduate program admission',
        sections: [
          { id: 'gre-bio', name: 'Biological & Cognitive Bases', description: 'Sensation, perception, neuroscience, learning, memory, and cognition' },
          { id: 'gre-soc', name: 'Social & Clinical Psychology', description: 'Social behavior, personality, abnormal psychology, and developmental psychology' },
          { id: 'gre-meth', name: 'Research Methods & Statistics', description: 'Experimental design, psychometrics, statistical analysis, and ethics' }
        ]
      }
    ]
  },
  'chhs-soc': {
    validationLabel: 'GRE + Research Methods Proficiency',
    tracks: [
      {
        id: 'gre', name: 'Graduate School Readiness (GRE)',
        description: 'GRE General Test preparation for sociology graduate programs',
        sections: [
          { id: 'gre-v', name: 'Verbal Reasoning', description: 'Reading comprehension and text analysis for social science research' },
          { id: 'gre-q', name: 'Quantitative Reasoning', description: 'Statistical analysis methods used in sociological research' }
        ]
      },
      {
        id: 'spss', name: 'SPSS / Data Analysis Certification',
        description: 'Statistical software proficiency for social science research',
        sections: [
          { id: 'spss-1', name: 'SPSS / R Proficiency', description: 'Survey analysis, regression, and qualitative coding methods' }
        ]
      }
    ]
  },
  'chhs-sw': {
    validationLabel: 'ASWB Licensing Exam (LSW/LCSW)',
    tracks: [
      {
        id: 'aswb', name: 'ASWB Licensing Exam Readiness',
        description: 'Association of Social Work Boards examination — required for Licensed Social Worker (LSW) and Licensed Clinical Social Worker (LCSW) credentials',
        sections: [
          { id: 'aswb-hbse', name: 'Human Development & Behavior', description: 'Human behavior in the social environment, diversity, and social/economic justice' },
          { id: 'aswb-assess', name: 'Assessment & Intervention', description: 'Biopsychosocial assessment, treatment planning, and evidence-based interventions' },
          { id: 'aswb-ethics', name: 'Professional Ethics & Values', description: 'NASW Code of Ethics, confidentiality, dual relationships, and supervision' },
          { id: 'aswb-comm', name: 'Community & Macro Practice', description: 'Community organizing, policy practice, advocacy, and program evaluation' }
        ]
      }
    ]
  },

  // ──────── CAHSS ────────
  'cahss-cj': {
    validationLabel: 'Federal LE Assessment + POST Certification',
    tracks: [
      {
        id: 'post', name: 'POST / BLET Certification',
        description: 'Basic Law Enforcement Training — required for state/local law enforcement in North Carolina',
        sections: [
          { id: 'post-law', name: 'Criminal & Constitutional Law', description: 'Criminal statutes, search and seizure, Miranda rights, and use of force' },
          { id: 'post-patrol', name: 'Patrol & Investigation', description: 'Patrol procedures, crime scene processing, interviewing, and report writing' },
          { id: 'post-fitness', name: 'Physical Fitness & Firearms', description: 'Physical agility, defensive tactics, and firearms qualification' }
        ]
      },
      {
        id: 'fed', name: 'Federal LE Readiness',
        description: 'Preparation for FBI, DEA, ATF, Secret Service, and other federal agency assessment centers',
        sections: [
          { id: 'fed-1', name: 'Written Exam & Background', description: 'Cognitive aptitude, situational judgment, and comprehensive background investigation' },
          { id: 'fed-2', name: 'Physical & Interview Assessment', description: 'Physical fitness test, structured panel interview, and polygraph examination' }
        ]
      }
    ]
  },
  'cahss-eng': {
    validationLabel: 'GRE Literature + Praxis English ELA',
    tracks: [
      {
        id: 'praxis-ela', name: 'Praxis English Language Arts',
        description: 'Praxis ELA Content Knowledge (5038) — required for secondary English teaching licensure in most states',
        sections: [
          { id: 'praxis-read', name: 'Reading & Text Analysis', description: 'Literary analysis, informational text, rhetoric, and research skills' },
          { id: 'praxis-write', name: 'Language & Writing', description: 'Grammar, composition, research writing, and argumentative writing' }
        ]
      },
      {
        id: 'gre-lit', name: 'GRE Literature Subject Test',
        description: 'For graduate program admission in English literature',
        sections: [
          { id: 'gre-lit-1', name: 'Literary History & Analysis', description: 'British, American, and world literature across periods and genres' }
        ]
      }
    ]
  },
  'cahss-hist': {
    validationLabel: 'Praxis Social Studies + GRE History',
    tracks: [
      {
        id: 'praxis-ss', name: 'Praxis Social Studies Content',
        description: 'Praxis Social Studies Content Knowledge (5081) — for secondary teaching licensure',
        sections: [
          { id: 'praxis-us', name: 'U.S. History', description: 'Colonial era through contemporary American history' },
          { id: 'praxis-world', name: 'World History & Geography', description: 'World civilizations, cultural geography, and global interconnections' },
          { id: 'praxis-gov', name: 'Government, Civics & Economics', description: 'American government, civic participation, and economic systems' }
        ]
      }
    ]
  },
  'cahss-poli': {
    validationLabel: 'LSAT + GRE Political Science',
    tracks: [
      {
        id: 'lsat', name: 'LSAT Readiness',
        description: 'Law School Admission Test — required for law school admission',
        sections: [
          { id: 'lsat-lr', name: 'Logical Reasoning', description: 'Analyzing arguments, identifying assumptions, and drawing conclusions' },
          { id: 'lsat-rc', name: 'Reading Comprehension', description: 'Analyzing complex legal, social science, and humanities passages' },
          { id: 'lsat-lg', name: 'Analytical Reasoning', description: 'Logic games — ordering, grouping, and conditional reasoning' }
        ]
      },
      {
        id: 'fsot', name: 'Foreign Service Officer Test',
        description: 'FSOT — U.S. State Department exam for aspiring diplomats',
        sections: [
          { id: 'fsot-1', name: 'Job Knowledge & Situational Judgment', description: 'U.S. government, history, economics, world affairs, and management principles' },
          { id: 'fsot-2', name: 'English Expression & Essay', description: 'Written communication, grammar, and structured policy essay' }
        ]
      }
    ]
  },
  'cahss-jmc': {
    validationLabel: 'ACEJMC Standards + APR Certification',
    tracks: [
      {
        id: 'acejmc', name: 'ACEJMC Professional Standards',
        description: 'Accrediting Council on Education in Journalism and Mass Communications — professional competency standards',
        sections: [
          { id: 'acejmc-1', name: 'Writing, Editing & Visual Communication', description: 'AP style, multimedia storytelling, video production, and visual literacy' },
          { id: 'acejmc-2', name: 'Law, Ethics & Critical Thinking', description: 'First Amendment, media law, ethics, and critical/analytical thinking' },
          { id: 'acejmc-3', name: 'Research & Data Literacy', description: 'Audience research, data journalism, statistics, and digital analytics' }
        ]
      }
    ]
  },
  'cahss-lib-act': {
    validationLabel: 'GRE + Community Organizing Proficiency',
    tracks: [
      {
        id: 'gre', name: 'Graduate School Readiness',
        description: 'GRE preparation for graduate programs in public policy, law, or social sciences',
        sections: [
          { id: 'gre-v', name: 'Verbal & Analytical Writing', description: 'Reading comprehension, critical analysis, and persuasive essay writing' }
        ]
      }
    ]
  },
  'cahss-lib-afam': {
    validationLabel: 'GRE + Research Portfolio',
    tracks: [
      {
        id: 'gre', name: 'Graduate School Readiness',
        description: 'GRE preparation for MA/PhD programs in African American Studies or related fields',
        sections: [
          { id: 'gre-v', name: 'Verbal & Analytical Writing', description: 'Advanced reading, critical theory, and scholarly writing' }
        ]
      }
    ]
  },
  'cahss-lib-law': {
    validationLabel: 'LSAT Exam',
    tracks: [
      {
        id: 'lsat', name: 'LSAT Readiness',
        description: 'Law School Admission Test — the gateway to JD programs',
        sections: [
          { id: 'lsat-lr', name: 'Logical Reasoning', description: 'Argument analysis, assumption identification, and logical deduction' },
          { id: 'lsat-rc', name: 'Reading Comprehension', description: 'Dense legal and academic text analysis' },
          { id: 'lsat-lg', name: 'Analytical Reasoning', description: 'Logic games testing deductive reasoning' },
          { id: 'lsat-write', name: 'LSAT Writing', description: 'Persuasive argumentative essay under timed conditions' }
        ]
      }
    ]
  },
  'cahss-art-des': {
    validationLabel: 'Portfolio Review + Adobe Certified Professional',
    tracks: [
      {
        id: 'acp', name: 'Adobe Certified Professional',
        description: 'Adobe certification — industry standard for design professionals',
        sections: [
          { id: 'acp-ps', name: 'Adobe Photoshop', description: 'Image editing, compositing, color correction, and retouching' },
          { id: 'acp-ai', name: 'Adobe Illustrator', description: 'Vector graphics, logo design, typography, and illustration' },
          { id: 'acp-id', name: 'Adobe InDesign', description: 'Layout design, print production, and digital publishing' }
        ]
      }
    ]
  },
  'cahss-art-gd': {
    validationLabel: 'Adobe Certified Professional + UX Portfolio',
    tracks: [
      {
        id: 'acp', name: 'Adobe Certified Professional',
        description: 'Adobe certification — industry standard for graphic design professionals',
        sections: [
          { id: 'acp-ps', name: 'Adobe Photoshop', description: 'Photo editing, digital painting, and web graphics' },
          { id: 'acp-ai', name: 'Adobe Illustrator', description: 'Vector design, branding, and print/digital illustration' },
          { id: 'acp-id', name: 'Adobe InDesign', description: 'Multi-page layout, editorial design, and prepress production' }
        ]
      },
      {
        id: 'figma', name: 'Figma / UI Design Proficiency',
        description: 'Modern UI/UX design tool proficiency',
        sections: [
          { id: 'figma-1', name: 'UI Design & Prototyping', description: 'Component design, auto-layout, interactive prototyping, and design systems' }
        ]
      }
    ]
  },
  'cahss-music': {
    validationLabel: 'Praxis Music + Performance Jury',
    tracks: [
      {
        id: 'praxis-music', name: 'Praxis Music Content Knowledge',
        description: 'Praxis Music (5113) — required for K-12 music teaching licensure',
        sections: [
          { id: 'praxis-theory', name: 'Music Theory & Composition', description: 'Harmony, counterpoint, form analysis, and arranging' },
          { id: 'praxis-hist', name: 'Music History & Literature', description: 'Western art music, world music traditions, and genre analysis' },
          { id: 'praxis-ped', name: 'Music Pedagogy & Methods', description: 'Conducting, rehearsal techniques, Kodály, Orff, and Dalcroze methods' }
        ]
      }
    ]
  },
  'cahss-thtr': {
    validationLabel: 'Portfolio/Audition + GRE (MFA Path)',
    tracks: [
      {
        id: 'audition', name: 'MFA Audition/Portfolio Readiness',
        description: 'Preparation for competitive MFA program admission in acting or technical theatre',
        sections: [
          { id: 'aud-1', name: 'Audition Technique', description: 'Classical and contemporary monologue preparation, cold reading, and callback skills' },
          { id: 'aud-2', name: 'Portfolio & Technical Design', description: 'Design portfolio, technical drawings, and production documentation' }
        ]
      }
    ]
  },

  // ──────── CEd ────────
  'ced-elem': {
    validationLabel: 'Praxis Elementary Education + edTPA',
    tracks: [
      {
        id: 'praxis-elem', name: 'Praxis Elementary Education',
        description: 'Praxis Elementary Education: Multiple Subjects (5001) — required for K-6 teaching licensure in North Carolina',
        sections: [
          { id: 'praxis-read', name: 'Reading & Language Arts', description: 'Phonics, fluency, comprehension, writing instruction, and children\'s literature' },
          { id: 'praxis-math', name: 'Mathematics', description: 'Number sense, algebra, geometry, measurement, and data analysis for K-6' },
          { id: 'praxis-sci', name: 'Science', description: 'Life science, physical science, earth/space science, and scientific inquiry' },
          { id: 'praxis-ss', name: 'Social Studies', description: 'U.S. history, geography, government/civics, and economics for elementary' }
        ]
      },
      {
        id: 'edtpa', name: 'edTPA Performance Assessment',
        description: 'Educative Teacher Performance Assessment — required for initial teaching licensure in NC',
        sections: [
          { id: 'edtpa-plan', name: 'Planning', description: 'Lesson planning, learning targets, assessment design, and differentiation' },
          { id: 'edtpa-teach', name: 'Instruction', description: 'Video-recorded classroom teaching demonstrating pedagogical skills' },
          { id: 'edtpa-assess', name: 'Assessment', description: 'Student work analysis, feedback, and evidence of student learning' }
        ]
      }
    ]
  },
  'ced-edst-it': {
    validationLabel: 'ISTE Educator Standards + Google Certified Educator',
    tracks: [
      {
        id: 'iste', name: 'ISTE Educator Standards',
        description: 'International Society for Technology in Education standards for educational technology professionals',
        sections: [
          { id: 'iste-1', name: 'Learner & Digital Citizen', description: 'Student-centered learning design and digital citizenship education' },
          { id: 'iste-2', name: 'Designer & Facilitator', description: 'Instructional design, learning facilitation, and technology integration' }
        ]
      },
      {
        id: 'google-edu', name: 'Google Certified Educator',
        description: 'Google for Education certification — demonstrating proficiency with Google Workspace for Education',
        sections: [
          { id: 'gce-1', name: 'Google Tools for Teaching', description: 'Google Classroom, Docs, Slides, Forms, and collaborative tools' }
        ]
      }
    ]
  },
  'ced-edst-lead': {
    validationLabel: 'Praxis School Leadership + Principal Licensure',
    tracks: [
      {
        id: 'slla', name: 'School Leaders Licensure Assessment',
        description: 'Praxis SLLA (6990) — required for principal/assistant principal licensure in NC (graduate path)',
        sections: [
          { id: 'slla-1', name: 'Vision & School Culture', description: 'Instructional leadership, school vision, and professional learning communities' },
          { id: 'slla-2', name: 'Operations & Community', description: 'School operations, resource management, community engagement, and equity' }
        ]
      }
    ]
  },
  'ced-edst-fam': {
    validationLabel: 'CFLE Certification + Family Life Educator',
    tracks: [
      {
        id: 'cfle', name: 'CFLE Certification',
        description: 'Certified Family Life Educator — NCFR credential for family engagement professionals',
        sections: [
          { id: 'cfle-1', name: 'Family Dynamics & Development', description: 'Family systems theory, human development, interpersonal relationships' },
          { id: 'cfle-2', name: 'Family Resource Management', description: 'Community resources, parent education, and program planning' }
        ]
      }
    ]
  },

  // ──────── CoST ────────
  'cost-aet': {
    validationLabel: 'OSHA 30 + CMfgE Certification',
    tracks: [
      {
        id: 'osha', name: 'OSHA Safety Certification',
        description: 'OSHA 30-Hour General Industry — essential for manufacturing and industrial workplaces',
        sections: [
          { id: 'osha-1', name: 'OSHA Standards & Hazard Recognition', description: 'OSHA regulations, PPE, machine guarding, electrical safety, and lockout/tagout' }
        ]
      },
      {
        id: 'cmfge', name: 'CMfgE (Manufacturing Engineering)',
        description: 'Certified Manufacturing Engineer — SME credential for manufacturing professionals',
        sections: [
          { id: 'cmfge-1', name: 'Manufacturing Processes & Materials', description: 'Machining, forming, welding, casting, and materials science' },
          { id: 'cmfge-2', name: 'Quality & Production Systems', description: 'Quality management, lean manufacturing, and production planning' }
        ]
      }
    ]
  },
  'cost-auto': {
    validationLabel: 'ASE Certification + SAE Standards',
    tracks: [
      {
        id: 'ase', name: 'ASE Certification',
        description: 'Automotive Service Excellence — industry-standard certification for automotive professionals',
        sections: [
          { id: 'ase-1', name: 'Engine Performance & Electrical', description: 'Engine diagnostics, fuel systems, ignition, and electrical/electronic systems' },
          { id: 'ase-2', name: 'Brakes, Suspension & Drivetrain', description: 'Brake systems, steering/suspension, manual/automatic transmissions' }
        ]
      },
      {
        id: 'sae', name: 'SAE Engineering Standards',
        description: 'Society of Automotive Engineers standards knowledge for automotive engineers',
        sections: [
          { id: 'sae-1', name: 'Vehicle Design & Testing Standards', description: 'SAE J-standards, crash testing protocols, and emissions standards' }
        ]
      }
    ]
  },
  'cost-bio': {
    validationLabel: 'MCAT + GRE Biology Subject Test',
    tracks: [
      {
        id: 'mcat', name: 'MCAT Readiness (Pre-Med Path)',
        description: 'Medical College Admission Test — required for MD/DO medical school admission',
        sections: [
          { id: 'mcat-bio', name: 'Biological & Biochemical Foundations', description: 'Biology, biochemistry, general chemistry, and organic chemistry' },
          { id: 'mcat-chem', name: 'Chemical & Physical Foundations', description: 'Physics, general chemistry, organic chemistry, and biochemistry' },
          { id: 'mcat-psych', name: 'Psychological, Social & Biological Foundations', description: 'Psychology, sociology, and biological basis of behavior' },
          { id: 'mcat-cars', name: 'Critical Analysis & Reasoning (CARS)', description: 'Reading comprehension and critical reasoning across disciplines' }
        ]
      }
    ]
  },
  'cost-bio-law': {
    validationLabel: 'LSAT + Science GRE',
    tracks: [
      {
        id: 'lsat', name: 'LSAT Readiness',
        description: 'Law School Admission Test — for biology students pursuing environmental, patent, or health law',
        sections: [
          { id: 'lsat-lr', name: 'Logical Reasoning', description: 'Argument analysis and logical deduction' },
          { id: 'lsat-rc', name: 'Reading Comprehension', description: 'Scientific and legal text analysis' },
          { id: 'lsat-lg', name: 'Analytical Reasoning', description: 'Logic games and deductive reasoning' }
        ]
      }
    ]
  },
  'cost-cm': {
    validationLabel: 'AIC Constructor Exam + OSHA 30',
    tracks: [
      {
        id: 'aic', name: 'AIC Associate Constructor Exam',
        description: 'American Institute of Constructors Level 1 exam — credential for construction management professionals',
        sections: [
          { id: 'aic-1', name: 'Project Administration', description: 'Contracts, scheduling, cost estimating, and project delivery methods' },
          { id: 'aic-2', name: 'Construction Operations', description: 'Site layout, equipment management, safety, and quality control' },
          { id: 'aic-3', name: 'Codes, Standards & Sustainability', description: 'Building codes, LEED concepts, and sustainable construction practices' }
        ]
      },
      {
        id: 'osha', name: 'OSHA 30 Construction',
        description: 'OSHA 30-Hour Construction Safety — required on most major construction sites',
        sections: [
          { id: 'osha-fall', name: 'Fall Protection & Scaffolding', description: 'Fall hazards, scaffolding safety, ladders, and personal fall arrest systems' },
          { id: 'osha-hazard', name: 'Health Hazards & Excavation', description: 'Silica, asbestos, trenching, confined spaces, and hazard communication' }
        ]
      }
    ]
  },
  'cost-ehs-mgmt': {
    validationLabel: 'CSP + CIH Certification',
    tracks: [
      {
        id: 'csp', name: 'CSP Certification',
        description: 'Certified Safety Professional — Board of Certified Safety Professionals credential for EHS leaders',
        sections: [
          { id: 'csp-1', name: 'Safety Management Systems', description: 'Hazard identification, risk assessment, safety programs, and OSHA compliance' },
          { id: 'csp-2', name: 'Ergonomics & Industrial Hygiene', description: 'Workplace ergonomics, chemical/physical hazards, and exposure assessment' },
          { id: 'csp-3', name: 'Fire Protection & Emergency Management', description: 'Fire prevention, emergency response planning, and environmental compliance' }
        ]
      },
      {
        id: 'cih', name: 'CIH Certification',
        description: 'Certified Industrial Hygienist — ABIH credential for industrial hygiene professionals',
        sections: [
          { id: 'cih-1', name: 'Exposure Assessment & Control', description: 'Air sampling, noise monitoring, ventilation, and exposure limits (PELs/TLVs)' }
        ]
      }
    ]
  },
  'cost-ehs-sci': {
    validationLabel: 'REHS + CSP Certification',
    tracks: [
      {
        id: 'rehs', name: 'REHS Certification',
        description: 'Registered Environmental Health Specialist — NEHA credential for environmental health professionals',
        sections: [
          { id: 'rehs-1', name: 'Environmental Health Sciences', description: 'Water quality, food safety, air quality, and vector control' },
          { id: 'rehs-2', name: 'Risk Assessment & Regulations', description: 'Environmental risk assessment, EPA regulations, and public health law' }
        ]
      }
    ]
  },
  'cost-geo': {
    validationLabel: 'FS / PS Licensure + GISP Certification',
    tracks: [
      {
        id: 'fs', name: 'FS Exam (Fundamentals of Surveying)',
        description: 'NCEES Fundamentals of Surveying exam — first step toward Professional Surveyor (PS) licensure',
        sections: [
          { id: 'fs-1', name: 'Surveying & Measurement', description: 'Geodesy, boundary law, measurement science, and coordinate systems' },
          { id: 'fs-2', name: 'Mapping & Geospatial Technology', description: 'GIS, remote sensing, photogrammetry, and cartography' }
        ]
      },
      {
        id: 'gisp', name: 'GISP Certification',
        description: 'GIS Professional — GISCI credential for geospatial professionals',
        sections: [
          { id: 'gisp-1', name: 'GIS Concepts & Applications', description: 'Spatial analysis, geodatabase design, and GIS project management' }
        ]
      }
    ]
  },
  'cost-chem': {
    validationLabel: 'ACS Certified Degree + GRE Chemistry',
    tracks: [
      {
        id: 'acs', name: 'ACS Certification Standards',
        description: 'American Chemical Society certified degree program standards — meeting rigorous ACS curriculum requirements',
        sections: [
          { id: 'acs-1', name: 'Core Chemistry Courses', description: 'General, organic, analytical, physical, and inorganic chemistry with labs' },
          { id: 'acs-2', name: 'Advanced/Elective Depth', description: 'Biochemistry, environmental chemistry, or polymer chemistry specialization' },
          { id: 'acs-3', name: 'Research Experience', description: 'Independent undergraduate research with faculty mentorship' }
        ]
      },
      {
        id: 'gre-chem', name: 'GRE Chemistry Subject Test',
        description: 'For admission to chemistry graduate programs (PhD/MS)',
        sections: [
          { id: 'gre-chem-1', name: 'Organic, Inorganic & Physical Chemistry', description: 'Reaction mechanisms, coordination chemistry, thermodynamics, and quantum chemistry' }
        ]
      }
    ]
  },
  'cost-elec': {
    validationLabel: 'CompTIA A+ + FCC License',
    tracks: [
      {
        id: 'comptia', name: 'CompTIA A+ Certification',
        description: 'Industry-standard IT hardware and troubleshooting certification',
        sections: [
          { id: 'comptia-core1', name: 'Core 1: Hardware & Networking', description: 'Mobile devices, networking, hardware, virtualization, and cloud computing' },
          { id: 'comptia-core2', name: 'Core 2: OS & Security', description: 'Operating systems, security, software troubleshooting, and operational procedures' }
        ]
      },
      {
        id: 'fcc', name: 'FCC General Radiotelephone License',
        description: 'Federal Communications Commission license for radio and telecommunications professionals',
        sections: [
          { id: 'fcc-1', name: 'Electronics & RF Theory', description: 'Circuit analysis, radio frequency theory, and antenna systems' }
        ]
      }
    ]
  },
  'cost-it': {
    validationLabel: 'CompTIA Network+ / Security+ + AWS Cloud',
    tracks: [
      {
        id: 'comptia-it', name: 'CompTIA Certification Stack',
        description: 'Progressive IT certification path: A+ → Network+ → Security+',
        sections: [
          { id: 'net-1', name: 'CompTIA Network+', description: 'Network architecture, operations, security, and troubleshooting' },
          { id: 'sec-1', name: 'CompTIA Security+', description: 'Threats, cryptography, access control, and security operations' },
          { id: 'cysa-1', name: 'CompTIA CySA+ (Advanced)', description: 'Threat detection, behavioral analytics, and incident response' }
        ]
      },
      {
        id: 'aws', name: 'AWS Cloud Practitioner',
        description: 'Amazon Web Services foundational cloud certification',
        sections: [
          { id: 'aws-1', name: 'Cloud Concepts & Services', description: 'AWS services, cloud architecture, security, and pricing' }
        ]
      }
    ]
  },
  'cost-cgt-td': {
    validationLabel: 'Adobe Certified + Autodesk Certification',
    tracks: [
      {
        id: 'autodesk', name: 'Autodesk Certified User',
        description: 'Autodesk certification for 3D modeling and design professionals',
        sections: [
          { id: 'auto-3ds', name: '3ds Max / Maya Proficiency', description: '3D modeling, texturing, lighting, and animation' },
          { id: 'auto-fusion', name: 'Fusion 360 / Inventor', description: 'Product design, CAD modeling, and rapid prototyping' }
        ]
      },
      {
        id: 'unity', name: 'Unity Certified Developer',
        description: 'Unity game engine certification for interactive and VR/AR development',
        sections: [
          { id: 'unity-1', name: 'Unity Programming & Design', description: 'C# scripting, game physics, UI, and asset management' }
        ]
      }
    ]
  },
  'cost-cgt-ux': {
    validationLabel: 'Google UX Certificate + Figma Proficiency',
    tracks: [
      {
        id: 'google-ux', name: 'Google UX Design Certificate',
        description: 'Google professional certificate in UX design — covering the full design process',
        sections: [
          { id: 'gux-1', name: 'Research & Wireframing', description: 'User research, personas, wireframing, and information architecture' },
          { id: 'gux-2', name: 'Prototyping & Testing', description: 'High-fidelity prototyping, usability testing, and design iteration' }
        ]
      }
    ]
  },
  'cost-math-app': {
    validationLabel: 'Actuarial Exams (SOA/CAS) + GRE Quantitative',
    tracks: [
      {
        id: 'actuarial', name: 'Actuarial Exam Readiness',
        description: 'Society of Actuaries / Casualty Actuarial Society preliminary exams',
        sections: [
          { id: 'soa-p', name: 'Exam P — Probability', description: 'Probability theory, random variables, distributions, and expectation' },
          { id: 'soa-fm', name: 'Exam FM — Financial Mathematics', description: 'Time value of money, annuities, bonds, loans, and term structure' }
        ]
      }
    ]
  },
  'cost-math-pure': {
    validationLabel: 'GRE Mathematics Subject Test',
    tracks: [
      {
        id: 'gre-math', name: 'GRE Mathematics Subject Test',
        description: 'For admission to mathematics PhD programs',
        sections: [
          { id: 'gre-calc', name: 'Calculus & Analysis', description: 'Multivariable calculus, real analysis, and complex variables' },
          { id: 'gre-alg', name: 'Algebra & Discrete Math', description: 'Abstract algebra, number theory, combinatorics, and linear algebra' }
        ]
      }
    ]
  },
  'cost-math-ds': {
    validationLabel: 'Google Data Analytics + IBM Data Science',
    tracks: [
      {
        id: 'google-da', name: 'Google Data Analytics Certificate',
        description: 'Google professional certificate for data analytics professionals',
        sections: [
          { id: 'gda-1', name: 'Data Cleaning & Analysis', description: 'SQL, spreadsheets, data cleaning, and exploratory data analysis' },
          { id: 'gda-2', name: 'Visualization & R Programming', description: 'Tableau, R programming, and data-driven decision making' }
        ]
      },
      {
        id: 'ibm-ds', name: 'IBM Data Science Professional Certificate',
        description: 'IBM credential covering Python, machine learning, and applied data science',
        sections: [
          { id: 'ibm-1', name: 'Python & Machine Learning', description: 'Python programming, scikit-learn, and supervised/unsupervised learning' }
        ]
      }
    ]
  },
  'cost-atms': {
    validationLabel: 'NWS Meteorologist Requirements + AMS Seal',
    tracks: [
      {
        id: 'nws', name: 'NWS Meteorologist Qualification',
        description: 'National Weather Service entry requirements for operational meteorologists',
        sections: [
          { id: 'nws-1', name: 'Synoptic & Dynamic Meteorology', description: 'Weather analysis, forecasting techniques, and atmospheric dynamics' },
          { id: 'nws-2', name: 'Physical Meteorology & Remote Sensing', description: 'Atmospheric physics, radar, satellite interpretation, and numerical models' }
        ]
      },
      {
        id: 'ams', name: 'AMS Certified Broadcast Meteorologist',
        description: 'American Meteorological Society seal of approval for broadcast meteorologists',
        sections: [
          { id: 'ams-1', name: 'Broadcast Performance & Science Communication', description: 'On-air presence, science communication, and public weather messaging' }
        ]
      }
    ]
  },
  'cost-phys': {
    validationLabel: 'GRE Physics Subject Test + MCAT (Biophysics)',
    tracks: [
      {
        id: 'gre-phys', name: 'GRE Physics Subject Test',
        description: 'For admission to physics graduate programs (PhD)',
        sections: [
          { id: 'gre-cm', name: 'Classical Mechanics & E&M', description: 'Newtonian mechanics, Lagrangian/Hamiltonian mechanics, and electromagnetism' },
          { id: 'gre-qm', name: 'Quantum Mechanics & Thermodynamics', description: 'Quantum mechanics, statistical mechanics, and thermal physics' },
          { id: 'gre-spec', name: 'Optics, Waves & Special Topics', description: 'Physical optics, atomic physics, nuclear physics, and special relativity' }
        ]
      }
    ]
  },
  'cost-phys-eng': {
    validationLabel: 'FE Exam + GRE Physics',
    tracks: [
      {
        id: 'fe', name: 'FE Exam Readiness',
        description: 'Fundamentals of Engineering — Other Disciplines track for engineering physics students',
        sections: [
          { id: 'fe-1', name: 'Engineering Science Fundamentals', description: 'Statics, dynamics, circuits, thermodynamics, and materials' },
          { id: 'fe-2', name: 'Applied Physics & Math', description: 'Advanced calculus, differential equations, and computational methods' }
        ]
      }
    ]
  },
  'cost-phys-bio': {
    validationLabel: 'MCAT + GRE Physics',
    tracks: [
      {
        id: 'mcat', name: 'MCAT Readiness (Medical Physics Path)',
        description: 'MCAT preparation for biophysics students pursuing MD or medical physics graduate programs',
        sections: [
          { id: 'mcat-phys', name: 'Chemical & Physical Foundations', description: 'Physics, general chemistry, and biochemistry applied to living systems' },
          { id: 'mcat-bio', name: 'Biological Foundations', description: 'Biology, biochemistry, and physiological systems' }
        ]
      }
    ]
  },
  'cost-ai': {
    validationLabel: 'TensorFlow / AWS ML Certification',
    tracks: [
      {
        id: 'tf', name: 'TensorFlow Developer Certificate',
        description: 'Google TensorFlow certification for ML engineers',
        sections: [
          { id: 'tf-1', name: 'Neural Networks & Deep Learning', description: 'Building and training neural networks with TensorFlow/Keras' },
          { id: 'tf-2', name: 'Computer Vision & NLP', description: 'CNNs, RNNs, Transformers, and sequence models' }
        ]
      },
      {
        id: 'aws-ml', name: 'AWS Machine Learning Specialty',
        description: 'AWS certification for production ML systems',
        sections: [
          { id: 'aws-ml-1', name: 'ML Engineering & Deployment', description: 'SageMaker, model optimization, and MLOps best practices' }
        ]
      }
    ]
  }
};

// ═══════════════════════════════════════════════════
// INJECTION LOGIC
// ═══════════════════════════════════════════════════

const seedsDir = path.join(__dirname, '..', 'data', 'seeds');
let updated = 0;
let skipped = 0;
let missing = 0;

for (const [dirSlug, examData] of Object.entries(EXAM_DB)) {
  const dirPath = path.join(seedsDir, dirSlug);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirSlug}`);
    missing++;
    continue;
  }

  // Update matrix.json with validationTracks
  const matrixPath = path.join(dirPath, 'matrix.json');
  if (fs.existsSync(matrixPath)) {
    const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
    
    // Get milestone IDs from timeline to link exam sections
    const timelinePath = path.join(dirPath, 'timeline.json');
    let milestoneIds = [];
    if (fs.existsSync(timelinePath)) {
      const timeline = JSON.parse(fs.readFileSync(timelinePath, 'utf8'));
      milestoneIds = (timeline.phases || timeline).flatMap(p => 
        (p.milestones || []).map(m => m.id)
      );
    }

    // Build validation tracks with milestone ID mappings
    const tracks = examData.tracks.map(track => ({
      ...track,
      sections: track.sections.map((section, si) => {
        // Distribute milestones across exam sections
        const sectionCount = track.sections.length;
        const perSection = Math.ceil(milestoneIds.length / (sectionCount * examData.tracks.length));
        const startIdx = si * perSection;
        const assignedIds = milestoneIds.slice(startIdx, startIdx + Math.min(perSection, 5));
        
        return {
          ...section,
          requiredMilestoneIds: assignedIds,
          totalRequired: assignedIds.length
        };
      })
    }));

    matrix.validationTracks = tracks;
    fs.writeFileSync(matrixPath, JSON.stringify(matrix, null, 2), 'utf8');
  }

  // Update branding.json with validationLabel
  const brandingPath = path.join(dirPath, 'branding.json');
  if (fs.existsSync(brandingPath)) {
    const branding = JSON.parse(fs.readFileSync(brandingPath, 'utf8'));
    branding.validationLabel = examData.validationLabel;
    branding.validationType = examData.tracks[0]?.id || 'competency';
    fs.writeFileSync(brandingPath, JSON.stringify(branding, null, 2), 'utf8');
  }

  updated++;
}

console.log(`\n✅ Validation tracks injected: ${updated} programs`);
console.log(`⏭️  Skipped: ${skipped}`);
if (missing > 0) console.log(`⚠️  Missing directories: ${missing}`);
console.log(`\nExam types added:`);
console.log('  CoBE: CPA, CFA, CFP, GRE, PMP, SHRM, CompTIA, AWS, Google Analytics, HubSpot, CSCP, CLTD');
console.log('  CoE:  FE, PE, CCNA, CompTIA Security+, TensorFlow, AWS ML');
console.log('  CHHS: NCLEX-RN, Praxis SLP, ASHA CCC, ACSM, CSCS, ACHE, ASWB, GRE Psychology');
console.log('  CAHSS: POST/BLET, Praxis ELA, Praxis Social Studies, LSAT, FSOT, ACEJMC, Adobe, Praxis Music');
console.log('  CEd:  Praxis Elementary, edTPA, ISTE, Google Educator, CFLE');
console.log('  CoST: MCAT, ACS, GRE Subject Tests, ASE, SAE, AIC, OSHA, CSP, CIH, REHS, FS, GISP, CompTIA, FCC, Autodesk, Unity, SOA/CAS Actuarial, NWS, AMS');
