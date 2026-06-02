/**
 * Inject CoBE career data into report.js
 * Run: node scripts/inject-cobe.js
 */
const fs = require('fs');
const path = require('path');
const reportPath = path.join(__dirname, '..', 'js', 'report.js');

const COBE_DATA = `
    'acct': {
      hero: 'assets/images/professions/prof_economics.png',
      title: 'Accounting',
      tagline: 'The Language of Business & Financial Decision-Making',
      overview: 'Accountants are the backbone of every organization — tracking financial performance, ensuring compliance, and guiding strategic decisions. From Big Four firms to forensic investigation, accounting offers stability, upward mobility, and global demand. NC A&T\\'s program is AACSB-accredited, the gold standard in business education.',
      blsSalary: 79880, blsGrowth: 6, blsEmployment: 1538400, nationalMedian: 48060,
      careers: [
        { title: 'Certified Public Accountant (CPA)', salary: '$65K – $120K', icon: '📊', desc: 'Audit financial statements, prepare taxes, and advise clients on financial strategy.' },
        { title: 'Forensic Accountant', salary: '$70K – $130K', icon: '🔍', desc: 'Investigate financial fraud, embezzlement, and white-collar crime for law enforcement and firms.' },
        { title: 'Tax Manager', salary: '$80K – $140K', icon: '🏛️', desc: 'Lead corporate tax planning, compliance, and strategy for organizations.' },
        { title: 'Internal Auditor', salary: '$65K – $110K', icon: '🛡️', desc: 'Evaluate internal controls, risk management, and operational efficiency.' },
        { title: 'Controller / CFO', salary: '$100K – $250K+', icon: '💼', desc: 'Oversee all financial operations, reporting, and strategy for an organization.' }
      ],
      images: ['assets/images/professions/prof_economics.png'],
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
      images: ['assets/images/professions/prof_economics.png'],
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
      images: ['assets/images/professions/prof_economics.png'],
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
      overview: 'Management professionals lead teams, drive strategy, and build organizations. With concentrations in entrepreneurship and international business, NC A&T\\'s program prepares leaders who can launch startups, manage global operations, and transform industries.',
      blsSalary: 102000, blsGrowth: 6, blsEmployment: 3452000, nationalMedian: 48060,
      careers: [
        { title: 'Operations Manager', salary: '$65K – $120K', icon: '⚙️', desc: 'Oversee daily operations, supply chains, and process improvements.' },
        { title: 'Entrepreneur / Business Owner', salary: '$50K – $500K+', icon: '🚀', desc: 'Launch and grow your own business — from tech startups to franchise operations.' },
        { title: 'Human Resources Manager', salary: '$65K – $130K', icon: '👥', desc: 'Lead talent acquisition, culture development, and employee engagement.' },
        { title: 'Project Manager', salary: '$70K – $130K', icon: '📋', desc: 'Plan, execute, and deliver projects on time and within budget.' },
        { title: 'Management Consultant', salary: '$75K – $160K', icon: '💡', desc: 'Advise organizations on strategy, structure, and performance improvement.' }
      ],
      images: ['assets/images/professions/prof_economics.png'],
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
      overview: 'BIT professionals live at the intersection of business and technology — designing information systems, managing databases, leading digital transformation, and securing enterprise networks. In today\\'s data-driven world, every industry needs tech-savvy business leaders.',
      blsSalary: 98740, blsGrowth: 10, blsEmployment: 482000, nationalMedian: 48060,
      careers: [
        { title: 'Business Systems Analyst', salary: '$65K – $110K', icon: '🔄', desc: 'Translate business needs into technology solutions and system designs.' },
        { title: 'IT Project Manager', salary: '$80K – $140K', icon: '📋', desc: 'Lead software development and technology implementation projects.' },
        { title: 'Database Administrator', salary: '$70K – $120K', icon: '🗄️', desc: 'Design, secure, and optimize enterprise database systems.' },
        { title: 'Cybersecurity Analyst', salary: '$75K – $130K', icon: '🔒', desc: 'Protect organizations from cyber threats and data breaches.' },
        { title: 'ERP Consultant', salary: '$80K – $150K', icon: '⚙️', desc: 'Implement and customize enterprise resource planning systems (SAP, Oracle).' }
      ],
      images: ['assets/images/professions/prof_economics.png'],
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
      images: ['assets/images/professions/prof_economics.png'],
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
      tagline: 'Moving the World\\'s Products From Source to Shelf',
      overview: 'Supply chain professionals ensure products reach consumers efficiently — managing logistics, procurement, warehousing, and global distribution. In a world shaped by e-commerce and global trade, supply chain managers are critical to every industry.',
      blsSalary: 77520, blsGrowth: 18, blsEmployment: 218300, nationalMedian: 48060,
      careers: [
        { title: 'Supply Chain Manager', salary: '$70K – $130K', icon: '🚛', desc: 'Oversee end-to-end supply chain operations from sourcing to delivery.' },
        { title: 'Logistics Analyst', salary: '$55K – $90K', icon: '📦', desc: 'Optimize transportation routes, warehouse operations, and inventory management.' },
        { title: 'Procurement Manager', salary: '$70K – $120K', icon: '🤝', desc: 'Negotiate with suppliers and manage purchasing strategy for organizations.' },
        { title: 'Operations Research Analyst', salary: '$75K – $130K', icon: '📈', desc: 'Use data and mathematical models to improve operational efficiency.' },
        { title: 'Global Trade Compliance Specialist', salary: '$65K – $110K', icon: '🌍', desc: 'Navigate international trade regulations, tariffs, and import/export compliance.' }
      ],
      images: ['assets/images/professions/prof_economics.png'],
      related: [
        { name: 'Industrial Engineering', why: 'Process optimization and operations research' },
        { name: 'Management', why: 'Operations leadership and strategy' },
        { name: 'Business Information Technology', why: 'Supply chain technology systems' }
      ],
      whatYouCanDo: ['Manage global logistics for Amazon or FedEx','Optimize supply chains for automotive manufacturers','Lead procurement for government agencies','Drive sustainability in global supply chains','Launch a logistics consulting firm','Direct warehouse operations for e-commerce giants']
    }`;

// Read current file
let src = fs.readFileSync(reportPath, 'utf8');

// Find the closing of the DB object (line "  };") and the alias lines
const insertPoint = "    'envs': {";
const closingBrace = `    }
  };`;

// Insert after the envs closing brace
const aliasLine = "  // Also map alternate keys";
const insertBefore = aliasLine;

// Build the new entries
const newEntries = `,${COBE_DATA}`;

// Find the position just before alias mapping
const aliasIdx = src.indexOf(aliasLine);
if (aliasIdx === -1) {
  console.error('Could not find alias insertion point');
  process.exit(1);
}

// We need to insert just before "  };\n\n  // Also map alternate keys"
// Find the closing of envs entry and DB
const dbClose = src.lastIndexOf('  };', aliasIdx);
if (dbClose === -1) {
  console.error('Could not find DB closing brace');
  process.exit(1);
}

// Insert before the DB closing
const beforeClose = src.substring(0, dbClose - 1); // remove the newline before "  };"
const afterClose = src.substring(dbClose);

const newSrc = beforeClose + ',\n' + COBE_DATA + '\n' + afterClose;

// Also add alias mappings for CoBE
const oldAliases = "  DB['slfs'] = DB['envs'];\n  DB['lab'] = DB['animal'];\n  DB['cons'] = DB['fashion'];";
const newAliases = oldAliases + "\n  // CoBE aliases\n  DB['sales'] = DB['mktg'];";

const finalSrc = newSrc.replace(oldAliases, newAliases);

fs.writeFileSync(reportPath, finalSrc, 'utf8');
console.log('✅ CoBE data injected into report.js');
console.log('Keys added: acct, fin, econ, mgmt, bit, mktg, scm');
