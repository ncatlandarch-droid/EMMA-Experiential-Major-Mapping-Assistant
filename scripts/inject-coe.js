/**
 * Inject CoE career data into report.js
 * Run: node scripts/inject-coe.js
 */
const fs = require('fs');
const path = require('path');
const reportPath = path.join(__dirname, '..', 'js', 'report.js');

const COE_DATA = `
    'coe-eng': {
      hero: 'assets/images/professions/prof_applied_engineering.png',
      title: 'Engineering',
      tagline: 'Designing, Building & Innovating the Systems That Power Our World',
      overview: 'Engineers solve humanity\\'s greatest challenges — designing bridges, developing software, creating biomedical devices, and building sustainable infrastructure. NC A&T\\'s College of Engineering is the #1 producer of African American engineers in the nation, with ABET-accredited programs across nine disciplines.',
      blsSalary: 105100, blsGrowth: 7, blsEmployment: 1700000, nationalMedian: 48060,
      careers: [
        { title: 'Software Engineer', salary: '$85K – $180K+', icon: '💻', desc: 'Design, develop, and maintain software systems and applications.' },
        { title: 'Mechanical Engineer', salary: '$75K – $130K', icon: '⚙️', desc: 'Design mechanical systems — from engines and robotics to HVAC and manufacturing equipment.' },
        { title: 'Electrical Engineer', salary: '$80K – $140K', icon: '⚡', desc: 'Design electrical systems, power grids, semiconductors, and electronic devices.' },
        { title: 'Civil/Structural Engineer', salary: '$75K – $125K', icon: '🌉', desc: 'Design bridges, highways, buildings, and water systems that keep society running.' },
        { title: 'Biomedical Engineer', salary: '$80K – $140K', icon: '🦾', desc: 'Develop medical devices, prosthetics, and healthcare technology.' },
        { title: 'AI / Machine Learning Engineer', salary: '$100K – $250K+', icon: '🤖', desc: 'Build intelligent systems that learn, reason, and automate complex tasks.' }
      ],
      images: ['assets/images/professions/prof_applied_engineering.png'],
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
      overview: 'Computer scientists design algorithms, build software systems, and push the boundaries of what\\'s computationally possible. From Silicon Valley startups to cybersecurity, CS graduates are among the most in-demand professionals in the global economy.',
      blsSalary: 136620, blsGrowth: 23, blsEmployment: 1847900, nationalMedian: 48060,
      careers: [
        { title: 'Software Developer', salary: '$85K – $180K+', icon: '💻', desc: 'Design and build applications, APIs, and distributed systems.' },
        { title: 'Cybersecurity Engineer', salary: '$90K – $160K', icon: '🔒', desc: 'Protect systems and data from cyber threats and attacks.' },
        { title: 'Data Scientist', salary: '$90K – $170K', icon: '📊', desc: 'Extract insights from massive datasets using statistics and machine learning.' },
        { title: 'Cloud Architect', salary: '$100K – $180K+', icon: '☁️', desc: 'Design scalable cloud infrastructure on AWS, Azure, or GCP.' },
        { title: 'Full-Stack Developer', salary: '$80K – $160K', icon: '🔧', desc: 'Build complete web applications — frontend, backend, and database.' },
        { title: 'AI Research Scientist', salary: '$120K – $300K+', icon: '🧠', desc: 'Advance the frontier of artificial intelligence and machine learning.' }
      ],
      images: ['assets/images/professions/prof_electronics.png'],
      related: [
        { name: 'Computer Engineering', why: 'Hardware-software integration' },
        { name: 'Mathematics — Data Science', why: 'Statistical modeling and algorithms' },
        { name: 'Artificial Intelligence (CoE)', why: 'Applied AI and deep learning' }
      ],
      whatYouCanDo: ['Build products at Google, Apple, or Meta','Launch a tech startup','Lead cybersecurity for federal agencies','Create the next breakthrough AI system','Architect cloud platforms serving billions','Develop video games and interactive media']
    },
    'ise': {
      hero: 'assets/images/professions/prof_applied_engineering.png',
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
      images: ['assets/images/professions/prof_applied_engineering.png'],
      related: [
        { name: 'Supply Chain Management', why: 'Logistics and operations management' },
        { name: 'Computer Science', why: 'Simulation and optimization algorithms' },
        { name: 'Mathematics — Applied', why: 'Operations research and statistical modeling' }
      ],
      whatYouCanDo: ['Optimize manufacturing at Boeing or Toyota','Redesign hospital systems to save lives','Lead supply chain strategy for Amazon','Drive quality improvement at pharmaceutical companies','Consult on process optimization for Fortune 500 firms','Design smart factory systems']
    }`;

let src = fs.readFileSync(reportPath, 'utf8');

const aliasLine = "  // Also map alternate keys";
const dbCloseIdx = src.lastIndexOf('  };', src.indexOf(aliasLine));

const beforeClose = src.substring(0, dbCloseIdx - 1);
const afterClose = src.substring(dbCloseIdx);

let newSrc = beforeClose + ',\n' + COE_DATA + '\n' + afterClose;

// Add alias mappings for CoE
const oldAliases = "  DB['sales'] = DB['mktg'];";
const newAliases = oldAliases + `
  // CoE aliases - map all engineering slugs to appropriate keys
  DB['ae'] = DB['coe-eng'];
  DB['che'] = DB['coe-eng'];
  DB['ce'] = DB['coe-eng'];
  DB['cpe'] = DB['cs'];
  DB['ee'] = DB['coe-eng'];
  DB['me'] = DB['coe-eng'];
  DB['coe-bioe'] = DB['bioe'];
  DB['coe-ai'] = DB['cs'];`;

newSrc = newSrc.replace(oldAliases, newAliases);

fs.writeFileSync(reportPath, newSrc, 'utf8');
console.log('✅ CoE data injected into report.js');
console.log('Keys added: coe-eng, cs, ise');
console.log('Aliases: ae, che, ce, cpe, ee, me -> coe-eng; coe-bioe -> bioe; coe-ai -> cs');
