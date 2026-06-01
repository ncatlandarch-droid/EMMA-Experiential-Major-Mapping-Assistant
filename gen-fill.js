/**
 * Fill missing branding.json and matrix.json for programs that have timeline.json
 */
const fs = require('fs');
const path = require('path');

const SEEDS_DIR = path.join(__dirname, 'data', 'seeds');
const CATEGORY_COLORS = {
  Purpose: { hex:'#2563EB', rgb:'37,99,235', emoji:'🔍', label:'Purpose & Self-Discovery', description:'Research, coursework, and foundational experiences that build your professional identity' },
  Communities: { hex:'#059669', rgb:'5,150,105', emoji:'🤝', label:'Communities & Service', description:'Collaborative projects, service-learning, and community engagement' },
  LocalGlobal: { hex:'#D97706', rgb:'217,119,6', emoji:'🌍', label:'Local & Global Engagement', description:'Field work, internships, and real-world applications beyond campus' },
  Identity: { hex:'#7C3AED', rgb:'124,58,237', emoji:'💼', label:'Professional Identity', description:'Career prep, portfolio development, and professional practice' }
};
const BRANDING_COLORS = {
  primaryHex:'#004684', primaryRgb:'0,70,132', secondaryHex:'#fdb927', secondaryRgb:'253,185,39',
  backgroundHex:'#F0F2F5', surfaceHex:'#FFFFFF', textPrimaryHex:'#1A1A2E', textSecondaryHex:'#555770'
};

const FILL = {
  'cobe-bit': { college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Business Info Systems & Analytics', program:'B.S. in Business Information Technology', degree:'BSBIT', field:'Business Information Technology', blsCode:'15-1232', medianSalary:'$99,270', growth:'9%', emp:'455,200', employers:['IBM','Microsoft','SAP','Accenture','Deloitte'], certs:['CompTIA','Salesforce Admin','AWS Cloud Practitioner'], related:['Computer Science','Marketing','Supply Chain'], skills:['SQL','ERP/SAP','Cybersecurity','Business Analytics','Project Management'] },
  'cobe-econ-biz': { college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Economics', program:'B.S. in Economics — Business', degree:'BSECONB', field:'Business Economics', blsCode:'19-3011', medianSalary:'$113,940', growth:'6%', emp:'20,000', employers:['McKinsey','BCG','Bain','Federal Reserve','Deloitte'], certs:['CFA (partial)'], related:['Finance','Management','Accounting'], skills:['Econometrics','Business Strategy','Data Analysis','Financial Modeling'] },
  'cobe-econ-law': { college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Economics', program:'B.S. in Economics — Law', degree:'BSECONL', field:'Law & Economics', blsCode:'19-3011', medianSalary:'$113,940', growth:'6%', emp:'20,000', employers:['Law Firms','DOJ','FTC','SEC','Corporate Legal Depts'], certs:['LSAT Prep'], related:['Political Science','Criminal Justice','History'], skills:['Legal Research','Antitrust Analysis','Regulatory Economics','Critical Thinking'] },
  'cobe-mgmt-ent': { college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Management', program:'B.S. in Management — Entrepreneurship', degree:'BSMGMTE', field:'Entrepreneurship', blsCode:'11-1021', medianSalary:'$100,090', growth:'3%', emp:'3,541,200', employers:['Self-Employed','Startups','Venture Capital','Incubators','Accelerators'], certs:['Lean Six Sigma','PMP'], related:['Marketing','Finance','Computer Science'], skills:['Business Model Canvas','Lean Startup','Pitch Decks','Financial Projections','Venture Capital'] },
  'cobe-mgmt-intl': { college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Management', program:'B.S. in Management — International', degree:'BSMGMTI', field:'International Business', blsCode:'11-1021', medianSalary:'$100,090', growth:'3%', emp:'3,541,200', employers:['PwC','Procter & Gamble','Coca-Cola','World Bank','State Dept'], certs:['Global Professional in HR','CITP'], related:['Economics','Political Science','Foreign Languages'], skills:['Cross-Cultural Communication','Global Strategy','Trade Analysis','Foreign Languages'] },
  'cobe-mktg': { college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Marketing & Supply Chain Management', program:'B.S. in Marketing', degree:'BSMKTG', field:'Marketing', blsCode:'11-2021', medianSalary:'$140,040', growth:'6%', emp:'346,900', employers:['Google','Meta','Nike','P&G','HubSpot','Coca-Cola'], certs:['Google Analytics','HubSpot Inbound','Meta Blueprint'], related:['Journalism','Visual Arts','Supply Chain'], skills:['Digital Marketing','Brand Strategy','SEO/SEM','Social Media','Consumer Behavior','Analytics'] },
  'cobe-mktg-sales': { college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Marketing & Supply Chain Management', program:'B.S. in Marketing — Sales', degree:'BSMKTGS', field:'Sales Management', blsCode:'11-2022', medianSalary:'$131,710', growth:'4%', emp:'476,100', employers:['Salesforce','Oracle','IBM','Pharmaceutical Companies','Tech Startups'], certs:['Salesforce Admin','SPIN Selling','Challenger Sale'], related:['Management','Communication','Psychology'], skills:['Professional Selling','CRM','Negotiation','Account Management','Pipeline Management'] },
  'cobe-scm': { college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Marketing & Supply Chain Management', program:'B.S. in Supply Chain Management', degree:'BSSCM', field:'Supply Chain Management', blsCode:'13-1081', medianSalary:'$79,400', growth:'18%', emp:'878,700', employers:['Amazon','FedEx','UPS','Walmart','Target','Apple'], certs:['CSCP','CPIM','CLTD','Six Sigma'], related:['Industrial Engineering','Business IT','Economics'], skills:['Logistics','Procurement','Inventory Management','ERP/SAP','Data Analytics','Lean'] },
  'coe-ae': { college:'College of Engineering (CoE)', dept:'Civil, Architectural & Env Engineering', program:'B.S. in Architectural Engineering', degree:'BSAE', field:'Architectural Engineering', blsCode:'17-2011', medianSalary:'$93,310', growth:'4%', emp:'155,000', employers:['Thornton Tomasetti','WSP','Arup','Walter P Moore','HOK'], certs:['FE Exam','PE License','LEED AP'], related:['Civil Engineering','Landscape Architecture','Construction Management'], skills:['Structural Systems','MEP Design','Building Codes','BIM/Revit','HVAC','Energy Modeling'] },
  'coe-bioe': { college:'College of Engineering (CoE)', dept:'Chemical, Biological & Bio Engineering', program:'B.S. in Bioengineering', degree:'BSBIOE', field:'Bioengineering', blsCode:'17-2031', medianSalary:'$99,550', growth:'5%', emp:'19,200', employers:['Medtronic','J&J','Stryker','Abbott','Boston Scientific','FDA'], certs:['FE Exam','Regulatory Affairs Cert'], related:['Biological Engineering','Chemical Engineering','Biology'], skills:['Biomechanics','Tissue Engineering','Medical Devices','Biomaterials','FDA Regulations'] },
  'coe-ce': { college:'College of Engineering (CoE)', dept:'Civil, Architectural & Env Engineering', program:'B.S. in Civil Engineering', degree:'BSCE', field:'Civil Engineering', blsCode:'17-2051', medianSalary:'$89,940', growth:'5%', emp:'316,100', employers:['AECOM','WSP','Jacobs','Kimley-Horn','State DOTs','USACE'], certs:['FE Exam','PE License','PMP'], related:['Architectural Engineering','Construction Management','Environmental Engineering'], skills:['Structural Analysis','Geotechnical','Transportation','Water Resources','AutoCAD/Civil 3D'] },
  'coe-che': { college:'College of Engineering (CoE)', dept:'Chemical, Biological & Bio Engineering', program:'B.S. in Chemical Engineering', degree:'BSCHE', field:'Chemical Engineering', blsCode:'17-2041', medianSalary:'$106,260', growth:'8%', emp:'32,600', employers:['ExxonMobil','Dow Chemical','3M','BASF','Merck','P&G'], certs:['FE Exam','PE License','Six Sigma'], related:['Bioengineering','Chemistry','Environmental Engineering'], skills:['Thermodynamics','Reaction Engineering','Process Design','ASPEN','Mass Transfer','HAZOP'] },
  'coe-cs': { college:'College of Engineering (CoE)', dept:'Computer Science', program:'B.S. in Computer Science', degree:'BSCS', field:'Computer Science', blsCode:'15-1252', medianSalary:'$136,620', growth:'23%', emp:'1,847,900', employers:['Google','Meta','Microsoft','Amazon','Apple','Netflix','Salesforce'], certs:['AWS Developer','Azure Developer','Google Cloud'], related:['AI','Computer Engineering','Business IT'], skills:['Data Structures','Algorithms','Software Engineering','Python/Java','Databases','Web Development'] }
};

let created = 0;
Object.entries(FILL).forEach(([slug, p]) => {
  const dir = path.join(SEEDS_DIR, slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const brandingPath = path.join(dir, 'branding.json');
  if (!fs.existsSync(brandingPath)) {
    const branding = {
      institutionName: 'North Carolina Agricultural and Technical State University',
      abbreviation: 'NC A&T',
      collegeName: p.college, departmentName: p.dept, programName: p.program,
      degreeType: p.degree, programSlug: slug, slug: slug,
      programDescription: `${p.program} at NC A&T prepares students for rewarding careers in ${p.field.toLowerCase()}.`,
      tagline: `Leading the Future of ${p.field}`,
      brandingColors: BRANDING_COLORS, categoryColors: CATEGORY_COLORS,
      careerOutlook: {
        field: p.field, blsCode: p.blsCode, growthRate: `${p.growth} (2022-2032)`,
        medianSalary: p.medianSalary, totalJobs: p.emp,
        topEmployers: p.employers, certifications: p.certs,
        relatedFields: p.related, keySkills: p.skills
      }
    };
    fs.writeFileSync(brandingPath, JSON.stringify(branding, null, 2));
    console.log(`✅ branding.json → ${slug}`);
    created++;
  }

  const matrixPath = path.join(dir, 'matrix.json');
  if (!fs.existsSync(matrixPath)) {
    const matrix = {
      validationCategories: Object.keys(CATEGORY_COLORS).map(k => ({
        id: k, label: CATEGORY_COLORS[k].label,
        description: CATEGORY_COLORS[k].description, color: CATEGORY_COLORS[k].hex
      }))
    };
    fs.writeFileSync(matrixPath, JSON.stringify(matrix, null, 2));
    console.log(`✅ matrix.json → ${slug}`);
    created++;
  }
});
console.log(`\n📊 ${created} files filled`);
