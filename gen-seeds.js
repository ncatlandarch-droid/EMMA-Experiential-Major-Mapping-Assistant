/**
 * EMMA Seed Data Generator
 * Generates branding.json, matrix.json, and timeline.json for ALL programs.
 * Run: node gen-seeds.js
 */

const fs = require('fs');
const path = require('path');

const SEEDS_DIR = path.join(__dirname, 'data', 'seeds');

// ──────────────────────────────────────────────
// CATEGORY COLORS (shared by all programs)
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// ALL PROGRAMS WITH DATA
// ──────────────────────────────────────────────
const PROGRAMS = [
  // ═══ CoBE ═══
  { slug:'cobe-acct', college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Accounting & Finance', program:'B.S. in Accounting', degree:'BSACCT', field:'Accounting', blsCode:'13-2011', medianSalary:'$79,880', growth:'4%', employment:'1,538,400', topEmployers:['Deloitte','EY','PwC','KPMG','Grant Thornton','State Audit Offices'], certs:['CPA','CMA','CIA','CFE'], related:['Finance','Economics','Business IT'], skills:['Financial Reporting','Audit','Tax Preparation','GAAP','Excel','QuickBooks','Analytical Reasoning'],
    timeline:[
      {id:'year-1',name:'Year 1',subtitle:'Explore',desc:'Foundation in business principles and accounting basics.',ms:[
        {id:'y1-acct201',label:'Principles of Accounting I',courseRef:'ACCT 201',credits:3,cat:'Purpose',sem:'fall',desc:'Introduction to financial accounting: recording, classifying, and reporting business transactions.',skills:['Financial Accounting','Journal Entries']},
        {id:'y1-acct202',label:'Principles of Accounting II',courseRef:'ACCT 202',credits:3,cat:'Purpose',sem:'spring',desc:'Managerial accounting: budgeting, cost analysis, and internal decision making.',skills:['Managerial Accounting','Budgeting']},
        {id:'y1-econ201',label:'Principles of Microeconomics',courseRef:'ECON 201',credits:3,cat:'Identity',sem:'fall',desc:'Supply, demand, market structures, and firm behavior.',skills:['Microeconomics','Market Analysis']},
        {id:'y1-bsis100',label:'Business Computer Applications',courseRef:'BSIS 100',credits:3,cat:'Communities',sem:'spring',desc:'Excel, databases, and business software fundamentals.',skills:['Microsoft Excel','Business Software']}
      ]},
      {id:'year-2',name:'Year 2',subtitle:'Engage',desc:'Intermediate accounting and business law.',ms:[
        {id:'y2-acct310',label:'Intermediate Accounting I',courseRef:'ACCT 310',credits:3,cat:'Identity',sem:'fall',desc:'Assets, liabilities, and equity under GAAP frameworks.',skills:['GAAP','Financial Statements']},
        {id:'y2-acct311',label:'Intermediate Accounting II',courseRef:'ACCT 311',credits:3,cat:'Identity',sem:'spring',desc:'Revenue recognition, leases, pensions, and complex transactions.',skills:['Revenue Recognition','Complex Accounting']},
        {id:'y2-blaw301',label:'Business Law',courseRef:'BLAW 301',credits:3,cat:'Communities',sem:'fall',desc:'Contract law, business organizations, and regulatory compliance.',skills:['Business Law','Compliance']},
        {id:'y2-finc301',label:'Corporate Finance',courseRef:'FINC 301',credits:3,cat:'LocalGlobal',sem:'spring',desc:'Time value of money, capital budgeting, and financial decision-making.',skills:['Corporate Finance','Valuation']}
      ]},
      {id:'year-3',name:'Year 3',subtitle:'Develop',desc:'Advanced accounting, auditing, and tax.',ms:[
        {id:'y3-acct401',label:'Advanced Accounting',courseRef:'ACCT 401',credits:3,cat:'Identity',sem:'fall',desc:'Consolidations, partnerships, and governmental accounting.',skills:['Consolidations','Governmental Accounting']},
        {id:'y3-acct420',label:'Auditing',courseRef:'ACCT 420',credits:3,cat:'Purpose',sem:'spring',desc:'Audit procedures, internal controls, and professional standards.',skills:['Auditing','Internal Controls']},
        {id:'y3-acct410',label:'Federal Income Tax',courseRef:'ACCT 410',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Individual and corporate tax preparation, planning, and compliance.',skills:['Tax Preparation','IRS Compliance']},
        {id:'y3-intern',label:'Accounting Internship',courseRef:'ACCT 490 — Internship',credits:3,cat:'Communities',sem:'spring',desc:'Supervised work experience at a CPA firm, corporate accounting dept, or government agency.',skills:['Professional Experience','CPA Firm']}
      ]},
      {id:'year-4',name:'Year 4',subtitle:'Launch',desc:'CPA preparation and career placement.',ms:[
        {id:'y4-acct430',label:'Accounting Information Systems',courseRef:'ACCT 430',credits:3,cat:'Identity',sem:'fall',desc:'ERP systems, data analytics, and technology in accounting.',skills:['AIS','ERP Systems','Data Analytics']},
        {id:'y4-acct450',label:'Forensic Accounting',courseRef:'ACCT 450',credits:3,cat:'Purpose',sem:'fall',desc:'Fraud detection, investigation techniques, and expert witness skills.',skills:['Fraud Detection','Forensics']},
        {id:'y4-capstone',label:'Senior Capstone',courseRef:'ACCT 498 — Capstone',credits:3,cat:'LocalGlobal',sem:'spring',desc:'Comprehensive case study integrating all accounting disciplines.',skills:['Integration','Case Analysis']},
        {id:'y4-career',label:'CPA Exam Preparation',courseRef:'ACCT 499 — Professional Development',credits:1,cat:'Communities',sem:'spring',desc:'CPA exam review, career networking, and professional readiness.',skills:['CPA Exam','Career Readiness']}
      ]}
    ]
  },
  { slug:'cobe-fin', college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Accounting & Finance', program:'B.S. in Finance', degree:'BSFIN', field:'Financial Analysis', blsCode:'13-2051', medianSalary:'$96,220', growth:'8%', employment:'327,600', topEmployers:['Goldman Sachs','JPMorgan Chase','Bank of America','Morgan Stanley','BlackRock','Wells Fargo'], certs:['CFA','CFP','FRM','Series 7'], related:['Accounting','Economics','Mathematics'], skills:['Financial Modeling','Risk Analysis','Portfolio Management','Bloomberg Terminal','Valuation','Corporate Finance'],
    timeline:[
      {id:'year-1',name:'Year 1',subtitle:'Explore',desc:'Business foundations and economic principles.',ms:[
        {id:'y1-acct201',label:'Principles of Accounting I',courseRef:'ACCT 201',credits:3,cat:'Purpose',sem:'fall',desc:'Financial accounting fundamentals for finance majors.',skills:['Financial Accounting']},
        {id:'y1-econ201',label:'Microeconomics',courseRef:'ECON 201',credits:3,cat:'Identity',sem:'fall',desc:'Market mechanisms and price theory.',skills:['Microeconomics']},
        {id:'y1-econ202',label:'Macroeconomics',courseRef:'ECON 202',credits:3,cat:'LocalGlobal',sem:'spring',desc:'National income, monetary policy, and global trade.',skills:['Macroeconomics']},
        {id:'y1-math224',label:'Business Calculus',courseRef:'MATH 224',credits:3,cat:'Communities',sem:'spring',desc:'Calculus applications in business and finance.',skills:['Calculus','Quantitative Analysis']}
      ]},
      {id:'year-2',name:'Year 2',subtitle:'Engage',desc:'Corporate finance and investments.',ms:[
        {id:'y2-finc301',label:'Corporate Finance',courseRef:'FINC 301',credits:3,cat:'Identity',sem:'fall',desc:'Capital budgeting, cost of capital, and financial decisions.',skills:['Corporate Finance','NPV']},
        {id:'y2-finc310',label:'Investments',courseRef:'FINC 310',credits:3,cat:'Purpose',sem:'spring',desc:'Security analysis, portfolio theory, and market efficiency.',skills:['Investments','Portfolio Theory']},
        {id:'y2-econ321',label:'Money & Banking',courseRef:'ECON 321',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Federal Reserve, monetary policy, and banking systems.',skills:['Banking','Monetary Policy']},
        {id:'y2-stat310',label:'Business Statistics',courseRef:'STAT 310',credits:3,cat:'Communities',sem:'spring',desc:'Statistical methods for financial data analysis.',skills:['Statistics','Data Analysis']}
      ]},
      {id:'year-3',name:'Year 3',subtitle:'Develop',desc:'Advanced finance and financial modeling.',ms:[
        {id:'y3-finc410',label:'Financial Markets & Institutions',courseRef:'FINC 410',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Capital markets, derivatives, and financial intermediaries.',skills:['Capital Markets','Derivatives']},
        {id:'y3-finc420',label:'International Finance',courseRef:'FINC 420',credits:3,cat:'LocalGlobal',sem:'spring',desc:'Foreign exchange, international capital markets, and risk management.',skills:['Forex','International Markets']},
        {id:'y3-finc430',label:'Financial Modeling',courseRef:'FINC 430',credits:3,cat:'Identity',sem:'fall',desc:'Excel-based DCF, LBO, and valuation modeling.',skills:['Financial Modeling','DCF','LBO']},
        {id:'y3-intern',label:'Finance Internship',courseRef:'FINC 490 — Internship',credits:3,cat:'Communities',sem:'spring',desc:'Work experience at a bank, investment firm, or corporate finance department.',skills:['Industry Experience','Networking']}
      ]},
      {id:'year-4',name:'Year 4',subtitle:'Launch',desc:'Portfolio management and career placement.',ms:[
        {id:'y4-finc440',label:'Portfolio Management',courseRef:'FINC 440',credits:3,cat:'Purpose',sem:'fall',desc:'Active and passive portfolio strategies using real market data.',skills:['Portfolio Management','Asset Allocation']},
        {id:'y4-finc450',label:'Risk Management',courseRef:'FINC 450',credits:3,cat:'Identity',sem:'fall',desc:'Credit risk, market risk, and enterprise risk management frameworks.',skills:['Risk Management','VaR']},
        {id:'y4-capstone',label:'Finance Capstone',courseRef:'FINC 498 — Capstone',credits:3,cat:'LocalGlobal',sem:'spring',desc:'Comprehensive financial analysis project with industry presentation.',skills:['Integration','Presentation']},
        {id:'y4-career',label:'CFA/Career Preparation',courseRef:'FINC 499 — Professional Development',credits:1,cat:'Communities',sem:'spring',desc:'CFA Level I prep, resume building, and placement.',skills:['CFA Exam','Career Readiness']}
      ]}
    ]
  },
  { slug:'cobe-econ', college:'Willie A. Deese College of Business & Economics (CoBE)', dept:'Economics', program:'B.S. in Economics', degree:'BSECON', field:'Economics', blsCode:'19-3011', medianSalary:'$113,940', growth:'6%', employment:'20,000', topEmployers:['Federal Reserve','World Bank','IMF','Bureau of Labor Statistics','Congressional Budget Office','McKinsey'], certs:['N/A — Graduate school recommended'], related:['Finance','Mathematics','Political Science'], skills:['Econometrics','Data Analysis','Policy Analysis','Statistical Software','Economic Modeling'],
    timeline:[
      {id:'year-1',name:'Year 1',subtitle:'Explore',desc:'Economic principles and quantitative foundations.',ms:[
        {id:'y1-econ201',label:'Principles of Microeconomics',courseRef:'ECON 201',credits:3,cat:'Purpose',sem:'fall',desc:'Consumer and producer theory, market structures.',skills:['Microeconomics']},
        {id:'y1-econ202',label:'Principles of Macroeconomics',courseRef:'ECON 202',credits:3,cat:'Purpose',sem:'spring',desc:'GDP, inflation, unemployment, and fiscal/monetary policy.',skills:['Macroeconomics']},
        {id:'y1-math224',label:'Calculus for Economics',courseRef:'MATH 224',credits:3,cat:'Identity',sem:'fall',desc:'Differential calculus applied to economic optimization.',skills:['Calculus']},
        {id:'y1-stat210',label:'Intro to Statistics',courseRef:'STAT 210',credits:3,cat:'Communities',sem:'spring',desc:'Descriptive and inferential statistics for social science.',skills:['Statistics']}
      ]},
      {id:'year-2',name:'Year 2',subtitle:'Engage',desc:'Intermediate theory and quantitative methods.',ms:[
        {id:'y2-econ301',label:'Intermediate Microeconomics',courseRef:'ECON 301',credits:3,cat:'Identity',sem:'fall',desc:'Game theory, market failures, and general equilibrium.',skills:['Game Theory','Optimization']},
        {id:'y2-econ302',label:'Intermediate Macroeconomics',courseRef:'ECON 302',credits:3,cat:'Identity',sem:'spring',desc:'IS-LM models, growth theory, and open economy macro.',skills:['IS-LM','Growth Theory']},
        {id:'y2-econ310',label:'Economic Statistics',courseRef:'ECON 310',credits:3,cat:'Purpose',sem:'fall',desc:'Probability, hypothesis testing, and regression for economists.',skills:['Regression','Hypothesis Testing']},
        {id:'y2-econ321',label:'Money & Banking',courseRef:'ECON 321',credits:3,cat:'LocalGlobal',sem:'spring',desc:'Central banking, financial intermediation, and monetary transmission.',skills:['Monetary Policy','Banking']}
      ]},
      {id:'year-3',name:'Year 3',subtitle:'Develop',desc:'Econometrics and applied economics.',ms:[
        {id:'y3-econ410',label:'Econometrics',courseRef:'ECON 410',credits:3,cat:'Identity',sem:'fall',desc:'OLS, time series, panel data methods using Stata/R.',skills:['Econometrics','Stata','R']},
        {id:'y3-econ420',label:'Labor Economics',courseRef:'ECON 420',credits:3,cat:'Communities',sem:'spring',desc:'Wage determination, human capital, discrimination, and labor policy.',skills:['Labor Economics','Policy']},
        {id:'y3-econ430',label:'International Economics',courseRef:'ECON 430',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Trade theory, exchange rates, and global development.',skills:['International Trade','Exchange Rates']},
        {id:'y3-intern',label:'Economics Internship',courseRef:'ECON 490 — Internship',credits:3,cat:'Communities',sem:'spring',desc:'Work with government agencies, think tanks, or financial institutions.',skills:['Policy Research','Data Analysis']}
      ]},
      {id:'year-4',name:'Year 4',subtitle:'Launch',desc:'Senior research and career placement.',ms:[
        {id:'y4-econ440',label:'Public Finance',courseRef:'ECON 440',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Government spending, taxation, and fiscal policy analysis.',skills:['Public Finance','Tax Policy']},
        {id:'y4-capstone',label:'Senior Research Project',courseRef:'ECON 498 — Senior Seminar',credits:3,cat:'Purpose',sem:'spring',desc:'Original empirical research paper on an economic question.',skills:['Research','Writing','Data']},
        {id:'y4-career',label:'Career Placement',courseRef:'ECON 499 — Professional Development',credits:1,cat:'Identity',sem:'spring',desc:'Graduate school applications, job search, and professional networking.',skills:['Career Readiness']}
      ]}
    ]
  },
  // Engineering Programs
  { slug:'coe-cpe', college:'College of Engineering (CoE)', dept:'Electrical & Computer Engineering', program:'B.S. in Computer Engineering', degree:'BSCPE', field:'Computer Engineering', blsCode:'17-2061', medianSalary:'$128,170', growth:'5%', employment:'86,700', topEmployers:['Intel','Apple','NVIDIA','Qualcomm','AMD','Lockheed Martin','Raytheon'], certs:['FE Exam','CompTIA','Cisco CCNA'], related:['Electrical Engineering','Computer Science','AI'], skills:['Digital Logic','Embedded Systems','VHDL/Verilog','Microprocessors','PCB Design','C/C++'],
    timeline:[
      {id:'year-1',name:'Year 1',subtitle:'Explore',desc:'Math, physics, and programming foundations.',ms:[
        {id:'y1-ecen101',label:'Intro to Computer Engineering',courseRef:'ECEN 101',credits:3,cat:'Purpose',sem:'fall',desc:'Overview of computer engineering: hardware, software, and systems.',skills:['Computer Engineering Overview']},
        {id:'y1-comp163',label:'Programming I',courseRef:'COMP 163',credits:3,cat:'Identity',sem:'fall',desc:'C++ programming: variables, control structures, functions, arrays.',skills:['C++','Programming']},
        {id:'y1-math231',label:'Calculus I',courseRef:'MATH 231',credits:4,cat:'Identity',sem:'fall',desc:'Limits, derivatives, integrals for engineering.',skills:['Calculus']},
        {id:'y1-phys241',label:'Physics I',courseRef:'PHYS 241',credits:4,cat:'Communities',sem:'spring',desc:'Mechanics, waves, and thermodynamics with lab.',skills:['Physics','Lab Skills']}
      ]},
      {id:'year-2',name:'Year 2',subtitle:'Engage',desc:'Circuits, digital logic, and data structures.',ms:[
        {id:'y2-ecen215',label:'Circuit Analysis',courseRef:'ECEN 215',credits:3,cat:'Identity',sem:'fall',desc:'DC and AC circuit analysis using KVL, KCL, and Thevenin.',skills:['Circuit Analysis','KVL/KCL']},
        {id:'y2-ecen230',label:'Digital Logic Design',courseRef:'ECEN 230',credits:3,cat:'Purpose',sem:'spring',desc:'Boolean algebra, combinational and sequential logic circuits.',skills:['Digital Logic','Verilog']},
        {id:'y2-comp264',label:'Data Structures',courseRef:'COMP 264',credits:3,cat:'Identity',sem:'fall',desc:'Arrays, linked lists, trees, graphs, and algorithm analysis.',skills:['Data Structures','Algorithms']},
        {id:'y2-math321',label:'Differential Equations',courseRef:'MATH 321',credits:3,cat:'LocalGlobal',sem:'spring',desc:'ODEs for modeling engineering systems.',skills:['Differential Equations']}
      ]},
      {id:'year-3',name:'Year 3',subtitle:'Develop',desc:'Microprocessors, embedded systems, and operating systems.',ms:[
        {id:'y3-ecen340',label:'Microprocessor Systems',courseRef:'ECEN 340',credits:3,cat:'Identity',sem:'fall',desc:'ARM architecture, assembly language, and I/O interfacing.',skills:['ARM','Assembly','Microprocessors']},
        {id:'y3-ecen360',label:'Embedded Systems',courseRef:'ECEN 360',credits:3,cat:'Purpose',sem:'spring',desc:'Real-time OS, sensors, actuators, and embedded C programming.',skills:['Embedded Systems','RTOS']},
        {id:'y3-comp340',label:'Operating Systems',courseRef:'COMP 340',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Process management, memory, file systems, and concurrency.',skills:['Operating Systems','Concurrency']},
        {id:'y3-intern',label:'Engineering Internship',courseRef:'ECEN 490 — Co-op/Internship',credits:3,cat:'Communities',sem:'spring',desc:'Industry experience at a tech or defense company.',skills:['Industry Experience']}
      ]},
      {id:'year-4',name:'Year 4',subtitle:'Launch',desc:'Senior design and career preparation.',ms:[
        {id:'y4-ecen471',label:'Senior Design I',courseRef:'ECEN 471 — Senior Design I',credits:3,cat:'Purpose',sem:'fall',desc:'Team-based design project: proposal, planning, and prototyping.',skills:['Design Project','Teamwork']},
        {id:'y4-ecen472',label:'Senior Design II',courseRef:'ECEN 472 — Senior Design II',credits:3,cat:'Purpose',sem:'spring',desc:'Build, test, and present the final engineering design project.',skills:['Prototyping','Presentation']},
        {id:'y4-ecen450',label:'Computer Architecture',courseRef:'ECEN 450',credits:3,cat:'Identity',sem:'fall',desc:'Pipelining, cache design, multicore processors.',skills:['Computer Architecture','Cache']},
        {id:'y4-career',label:'FE Exam & Career Prep',courseRef:'ECEN 499 — Professional Development',credits:1,cat:'Communities',sem:'spring',desc:'FE exam review, resume workshops, and career placement.',skills:['FE Exam','Career Readiness']}
      ]}
    ]
  },
  { slug:'coe-ee', college:'College of Engineering (CoE)', dept:'Electrical & Computer Engineering', program:'B.S. in Electrical Engineering', degree:'BSEE', field:'Electrical Engineering', blsCode:'17-2071', medianSalary:'$104,610', growth:'3%', employment:'192,100', topEmployers:['Duke Energy','Siemens','ABB','Texas Instruments','General Electric','Schneider Electric'], certs:['FE Exam','PE License','IEEE Certifications'], related:['Computer Engineering','Physics','Mechanical Engineering'], skills:['Power Systems','Signal Processing','Control Systems','Circuit Design','MATLAB','PSpice'],
    timeline:[
      {id:'year-1',name:'Year 1',subtitle:'Explore',desc:'Math, physics, and electrical fundamentals.',ms:[
        {id:'y1-ecen101',label:'Intro to Electrical Engineering',courseRef:'ECEN 101',credits:3,cat:'Purpose',sem:'fall',desc:'Overview of EE: circuits, signals, power, and communications.',skills:['EE Overview']},
        {id:'y1-math231',label:'Calculus I',courseRef:'MATH 231',credits:4,cat:'Identity',sem:'fall',desc:'Limits, derivatives, and integrals.',skills:['Calculus']},
        {id:'y1-phys241',label:'Physics I',courseRef:'PHYS 241',credits:4,cat:'Communities',sem:'spring',desc:'Mechanics and thermodynamics with lab.',skills:['Physics']},
        {id:'y1-phys242',label:'Physics II',courseRef:'PHYS 242',credits:4,cat:'Identity',sem:'spring',desc:'Electricity, magnetism, and optics with lab.',skills:['E&M','Optics']}
      ]},
      {id:'year-2',name:'Year 2',subtitle:'Engage',desc:'Circuits, electronics, and signals.',ms:[
        {id:'y2-ecen215',label:'Circuit Analysis',courseRef:'ECEN 215',credits:3,cat:'Identity',sem:'fall',desc:'DC/AC circuit analysis, impedance, and frequency response.',skills:['Circuit Analysis']},
        {id:'y2-ecen310',label:'Electronics I',courseRef:'ECEN 310',credits:3,cat:'Purpose',sem:'spring',desc:'Diodes, transistors, and amplifier design.',skills:['Electronics','Transistors']},
        {id:'y2-ecen320',label:'Signals & Systems',courseRef:'ECEN 320',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Fourier analysis, Laplace transforms, and system response.',skills:['Signals','Laplace']},
        {id:'y2-math321',label:'Differential Equations',courseRef:'MATH 321',credits:3,cat:'Communities',sem:'spring',desc:'ODEs and systems modeling.',skills:['Differential Equations']}
      ]},
      {id:'year-3',name:'Year 3',subtitle:'Develop',desc:'Power systems, controls, and communications.',ms:[
        {id:'y3-ecen350',label:'Power Systems',courseRef:'ECEN 350',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Generation, transmission, distribution, and renewable energy.',skills:['Power Systems','Renewable Energy']},
        {id:'y3-ecen360',label:'Control Systems',courseRef:'ECEN 360',credits:3,cat:'Identity',sem:'spring',desc:'Feedback, stability, PID controllers, and root locus.',skills:['Control Systems','PID']},
        {id:'y3-ecen370',label:'Communications Systems',courseRef:'ECEN 370',credits:3,cat:'Purpose',sem:'fall',desc:'Modulation, encoding, and wireless communication.',skills:['Communications','RF']},
        {id:'y3-intern',label:'Engineering Internship',courseRef:'ECEN 490 — Internship',credits:3,cat:'Communities',sem:'spring',desc:'Industry experience at a utility, manufacturer, or defense contractor.',skills:['Industry Experience']}
      ]},
      {id:'year-4',name:'Year 4',subtitle:'Launch',desc:'Senior design and PE preparation.',ms:[
        {id:'y4-ecen471',label:'Senior Design I',courseRef:'ECEN 471 — Senior Design I',credits:3,cat:'Purpose',sem:'fall',desc:'Capstone project proposal and system design.',skills:['Design Project']},
        {id:'y4-ecen472',label:'Senior Design II',courseRef:'ECEN 472 — Senior Design II',credits:3,cat:'Purpose',sem:'spring',desc:'Build, test, and present the final project.',skills:['Prototyping','Presentation']},
        {id:'y4-ecen460',label:'Renewable Energy Systems',courseRef:'ECEN 460',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Solar, wind, and energy storage system design.',skills:['Solar','Wind','Storage']},
        {id:'y4-career',label:'FE Exam & Career Prep',courseRef:'ECEN 499',credits:1,cat:'Communities',sem:'spring',desc:'FE exam preparation and career placement.',skills:['FE Exam','Career Readiness']}
      ]}
    ]
  },
  { slug:'coe-ise', college:'College of Engineering (CoE)', dept:'Industrial & Systems Engineering', program:'B.S. in Industrial & Systems Engineering', degree:'BSISE', field:'Industrial Engineering', blsCode:'17-2112', medianSalary:'$96,350', growth:'12%', employment:'314,600', topEmployers:['Amazon','Boeing','Toyota','UPS','FedEx','Deloitte','Lockheed Martin'], certs:['FE Exam','Six Sigma Green/Black Belt','PMP'], related:['Mechanical Engineering','Supply Chain Management','Computer Science'], skills:['Operations Research','Lean Manufacturing','Six Sigma','Supply Chain','Simulation','Ergonomics'],
    timeline:[
      {id:'year-1',name:'Year 1',subtitle:'Explore',desc:'Engineering foundations and intro to IE.',ms:[
        {id:'y1-isen101',label:'Intro to Industrial Engineering',courseRef:'ISEN 101',credits:3,cat:'Purpose',sem:'fall',desc:'Overview of IE: optimization, human factors, and systems thinking.',skills:['IE Overview']},
        {id:'y1-math231',label:'Calculus I',courseRef:'MATH 231',credits:4,cat:'Identity',sem:'fall',desc:'Differential and integral calculus.',skills:['Calculus']},
        {id:'y1-phys241',label:'Physics I',courseRef:'PHYS 241',credits:4,cat:'Communities',sem:'spring',desc:'Mechanics and thermodynamics.',skills:['Physics']},
        {id:'y1-comp163',label:'Programming for Engineers',courseRef:'COMP 163',credits:3,cat:'Identity',sem:'spring',desc:'Python/C++ programming for engineering applications.',skills:['Python','Programming']}
      ]},
      {id:'year-2',name:'Year 2',subtitle:'Engage',desc:'Statistics, manufacturing, and operations.',ms:[
        {id:'y2-isen310',label:'Engineering Statistics',courseRef:'ISEN 310',credits:3,cat:'Identity',sem:'fall',desc:'Probability, distributions, and statistical process control.',skills:['Statistics','SPC']},
        {id:'y2-isen320',label:'Manufacturing Processes',courseRef:'ISEN 320',credits:3,cat:'Purpose',sem:'spring',desc:'Machining, casting, forming, and additive manufacturing.',skills:['Manufacturing','3D Printing']},
        {id:'y2-isen330',label:'Operations Research I',courseRef:'ISEN 330',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Linear programming, network models, and optimization.',skills:['Linear Programming','Optimization']},
        {id:'y2-isen340',label:'Work Design & Ergonomics',courseRef:'ISEN 340',credits:3,cat:'Communities',sem:'spring',desc:'Human factors, workplace safety, and ergonomic design.',skills:['Ergonomics','Human Factors']}
      ]},
      {id:'year-3',name:'Year 3',subtitle:'Develop',desc:'Quality, simulation, and supply chain.',ms:[
        {id:'y3-isen410',label:'Quality Engineering',courseRef:'ISEN 410',credits:3,cat:'Purpose',sem:'fall',desc:'Six Sigma, DOE, and quality management systems.',skills:['Six Sigma','DOE','Quality']},
        {id:'y3-isen420',label:'Systems Simulation',courseRef:'ISEN 420',credits:3,cat:'Identity',sem:'spring',desc:'Discrete-event simulation using Arena and Python.',skills:['Simulation','Arena']},
        {id:'y3-isen430',label:'Supply Chain Engineering',courseRef:'ISEN 430',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Inventory, logistics, and supply chain optimization.',skills:['Supply Chain','Logistics']},
        {id:'y3-intern',label:'IE Internship',courseRef:'ISEN 490 — Internship',credits:3,cat:'Communities',sem:'spring',desc:'Industry placement at a manufacturing, logistics, or tech company.',skills:['Industry Experience']}
      ]},
      {id:'year-4',name:'Year 4',subtitle:'Launch',desc:'Senior design and professional readiness.',ms:[
        {id:'y4-isen471',label:'Senior Design I',courseRef:'ISEN 471',credits:3,cat:'Purpose',sem:'fall',desc:'Capstone team project with industry sponsor.',skills:['Design Project','Teamwork']},
        {id:'y4-isen472',label:'Senior Design II',courseRef:'ISEN 472',credits:3,cat:'Purpose',sem:'spring',desc:'Implementation, testing, and final presentation.',skills:['Implementation','Presentation']},
        {id:'y4-isen440',label:'Lean Systems',courseRef:'ISEN 440',credits:3,cat:'Identity',sem:'fall',desc:'Lean manufacturing, value stream mapping, and kaizen.',skills:['Lean','VSM','Kaizen']},
        {id:'y4-career',label:'FE Exam & Career Prep',courseRef:'ISEN 499',credits:1,cat:'Communities',sem:'spring',desc:'FE exam review and career placement.',skills:['FE Exam','Career Readiness']}
      ]}
    ]
  },
  { slug:'coe-me', college:'College of Engineering (CoE)', dept:'Mechanical Engineering', program:'B.S. in Mechanical Engineering', degree:'BSME', field:'Mechanical Engineering', blsCode:'17-2141', medianSalary:'$96,310', growth:'10%', employment:'286,800', topEmployers:['Boeing','Lockheed Martin','Caterpillar','Honda','Tesla','NASA','SpaceX'], certs:['FE Exam','PE License','SolidWorks CSWP'], related:['Aerospace Engineering','Civil Engineering','Industrial Engineering'], skills:['Thermodynamics','Fluid Mechanics','CAD/CAM','FEA','Machine Design','MATLAB'],
    timeline:[
      {id:'year-1',name:'Year 1',subtitle:'Explore',desc:'Math, physics, and engineering graphics.',ms:[
        {id:'y1-meen101',label:'Intro to Mechanical Engineering',courseRef:'MEEN 101',credits:3,cat:'Purpose',sem:'fall',desc:'Overview of ME: design, thermal, and manufacturing.',skills:['ME Overview']},
        {id:'y1-meen110',label:'Engineering Graphics',courseRef:'MEEN 110',credits:3,cat:'Identity',sem:'fall',desc:'Technical drawing, SolidWorks CAD, and 3D modeling.',skills:['SolidWorks','CAD']},
        {id:'y1-math231',label:'Calculus I',courseRef:'MATH 231',credits:4,cat:'Identity',sem:'fall',desc:'Differential and integral calculus.',skills:['Calculus']},
        {id:'y1-phys241',label:'Physics I',courseRef:'PHYS 241',credits:4,cat:'Communities',sem:'spring',desc:'Mechanics and thermodynamics with lab.',skills:['Physics','Mechanics']}
      ]},
      {id:'year-2',name:'Year 2',subtitle:'Engage',desc:'Statics, dynamics, and materials.',ms:[
        {id:'y2-meen210',label:'Statics',courseRef:'MEEN 210',credits:3,cat:'Identity',sem:'fall',desc:'Forces, moments, equilibrium of rigid bodies.',skills:['Statics','Free Body Diagrams']},
        {id:'y2-meen220',label:'Dynamics',courseRef:'MEEN 220',credits:3,cat:'Identity',sem:'spring',desc:'Kinematics and kinetics of particles and rigid bodies.',skills:['Dynamics','Kinematics']},
        {id:'y2-meen240',label:'Materials Science',courseRef:'MEEN 240',credits:3,cat:'Purpose',sem:'fall',desc:'Crystal structures, phase diagrams, and material properties.',skills:['Materials Science','Metallurgy']},
        {id:'y2-meen250',label:'Mechanics of Materials',courseRef:'MEEN 250',credits:3,cat:'LocalGlobal',sem:'spring',desc:'Stress, strain, bending, and torsion of structural members.',skills:['Stress Analysis','Beam Theory']}
      ]},
      {id:'year-3',name:'Year 3',subtitle:'Develop',desc:'Thermo, fluids, and machine design.',ms:[
        {id:'y3-meen310',label:'Thermodynamics',courseRef:'MEEN 310',credits:3,cat:'Identity',sem:'fall',desc:'Laws of thermodynamics, cycles, and energy systems.',skills:['Thermodynamics','Cycles']},
        {id:'y3-meen320',label:'Fluid Mechanics',courseRef:'MEEN 320',credits:3,cat:'Purpose',sem:'spring',desc:'Fluid statics and dynamics, pipe flow, and pumps.',skills:['Fluid Mechanics','Pipe Flow']},
        {id:'y3-meen340',label:'Machine Design',courseRef:'MEEN 340',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Gears, bearings, shafts, and fatigue analysis.',skills:['Machine Design','Gears']},
        {id:'y3-intern',label:'Engineering Internship',courseRef:'MEEN 490 — Co-op/Internship',credits:3,cat:'Communities',sem:'spring',desc:'Industry experience at an aerospace, automotive, or manufacturing company.',skills:['Industry Experience']}
      ]},
      {id:'year-4',name:'Year 4',subtitle:'Launch',desc:'Senior design and FE preparation.',ms:[
        {id:'y4-meen471',label:'Senior Design I',courseRef:'MEEN 471',credits:3,cat:'Purpose',sem:'fall',desc:'Capstone project with industry sponsor — proposal and design.',skills:['Design Project','Teamwork']},
        {id:'y4-meen472',label:'Senior Design II',courseRef:'MEEN 472',credits:3,cat:'Purpose',sem:'spring',desc:'Build, test, and present final design project.',skills:['Prototyping','Presentation']},
        {id:'y4-meen410',label:'Heat Transfer',courseRef:'MEEN 410',credits:3,cat:'Identity',sem:'fall',desc:'Conduction, convection, radiation, and heat exchangers.',skills:['Heat Transfer','HX Design']},
        {id:'y4-career',label:'FE Exam & Career Prep',courseRef:'MEEN 499',credits:1,cat:'Communities',sem:'spring',desc:'FE exam review and career placement.',skills:['FE Exam','Career Readiness']}
      ]}
    ]
  },
  { slug:'coe-ai', college:'College of Engineering (CoE)', dept:'Interdisciplinary', program:'B.S. in Artificial Intelligence', degree:'BSAI', field:'Artificial Intelligence', blsCode:'15-2051', medianSalary:'$136,620', growth:'23%', employment:'190,600', topEmployers:['Google','Meta','Microsoft','Amazon','Apple','OpenAI','NVIDIA','DeepMind'], certs:['AWS ML Specialty','Google Cloud ML Engineer','TensorFlow Developer Certificate'], related:['Computer Science','Computer Engineering','Mathematics — Data Science'], skills:['Machine Learning','Deep Learning','NLP','Computer Vision','Python','TensorFlow/PyTorch'],
    timeline:[
      {id:'year-1',name:'Year 1',subtitle:'Explore',desc:'Programming, math, and AI foundations.',ms:[
        {id:'y1-comp163',label:'Programming I (Python)',courseRef:'COMP 163',credits:3,cat:'Purpose',sem:'fall',desc:'Python programming: data types, control flow, functions, OOP.',skills:['Python','OOP']},
        {id:'y1-comp164',label:'Programming II',courseRef:'COMP 164',credits:3,cat:'Identity',sem:'spring',desc:'Advanced programming, data structures, and algorithms.',skills:['Data Structures','Algorithms']},
        {id:'y1-math231',label:'Calculus I',courseRef:'MATH 231',credits:4,cat:'Identity',sem:'fall',desc:'Differential calculus for optimization.',skills:['Calculus']},
        {id:'y1-math232',label:'Calculus II',courseRef:'MATH 232',credits:4,cat:'Communities',sem:'spring',desc:'Integral calculus and series for AI foundations.',skills:['Integration','Series']}
      ]},
      {id:'year-2',name:'Year 2',subtitle:'Engage',desc:'Linear algebra, probability, and intro to ML.',ms:[
        {id:'y2-math337',label:'Linear Algebra',courseRef:'MATH 337',credits:3,cat:'Identity',sem:'fall',desc:'Vectors, matrices, eigenvalues — the math of ML.',skills:['Linear Algebra','Matrices']},
        {id:'y2-stat300',label:'Probability & Statistics',courseRef:'STAT 300',credits:3,cat:'Purpose',sem:'spring',desc:'Probability distributions, Bayes theorem, and inference.',skills:['Probability','Bayes']},
        {id:'y2-comp310',label:'Intro to AI',courseRef:'COMP 310',credits:3,cat:'Purpose',sem:'fall',desc:'Search algorithms, knowledge representation, and agent design.',skills:['AI Fundamentals','Search']},
        {id:'y2-comp320',label:'Databases',courseRef:'COMP 320',credits:3,cat:'LocalGlobal',sem:'spring',desc:'SQL, NoSQL, and data management for AI pipelines.',skills:['SQL','Data Management']}
      ]},
      {id:'year-3',name:'Year 3',subtitle:'Develop',desc:'Machine learning, deep learning, and NLP.',ms:[
        {id:'y3-comp410',label:'Machine Learning',courseRef:'COMP 410',credits:3,cat:'Identity',sem:'fall',desc:'Supervised/unsupervised learning, SVMs, random forests, neural networks.',skills:['Machine Learning','scikit-learn']},
        {id:'y3-comp420',label:'Deep Learning',courseRef:'COMP 420',credits:3,cat:'Purpose',sem:'spring',desc:'CNNs, RNNs, transformers, and training large models.',skills:['Deep Learning','PyTorch']},
        {id:'y3-comp430',label:'Natural Language Processing',courseRef:'COMP 430',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Text processing, embeddings, attention, and LLMs.',skills:['NLP','Transformers','LLMs']},
        {id:'y3-intern',label:'AI Research Internship',courseRef:'COMP 490 — Internship',credits:3,cat:'Communities',sem:'spring',desc:'Industry or lab internship in AI/ML research and development.',skills:['Research','Industry Experience']}
      ]},
      {id:'year-4',name:'Year 4',subtitle:'Launch',desc:'Computer vision, ethics, and capstone.',ms:[
        {id:'y4-comp440',label:'Computer Vision',courseRef:'COMP 440',credits:3,cat:'Identity',sem:'fall',desc:'Image recognition, object detection, and generative models.',skills:['Computer Vision','CNNs']},
        {id:'y4-comp450',label:'AI Ethics & Society',courseRef:'COMP 450',credits:3,cat:'LocalGlobal',sem:'fall',desc:'Bias, fairness, privacy, and responsible AI development.',skills:['AI Ethics','Fairness']},
        {id:'y4-capstone',label:'AI Capstone Project',courseRef:'COMP 498 — Senior Design',credits:3,cat:'Purpose',sem:'spring',desc:'End-to-end AI project: data, model, deployment, and presentation.',skills:['End-to-End ML','Deployment']},
        {id:'y4-career',label:'Career Placement',courseRef:'COMP 499',credits:1,cat:'Communities',sem:'spring',desc:'Resume, portfolio, and placement at AI companies.',skills:['Career Readiness']}
      ]}
    ]
  }
];

// ──────────────────────────────────────────────
// GENERATOR
// ──────────────────────────────────────────────
function generateBranding(p) {
  return {
    institutionName: 'North Carolina Agricultural and Technical State University',
    abbreviation: 'NC A&T',
    collegeName: p.college,
    departmentName: p.dept,
    programName: p.program,
    degreeType: p.degree,
    programSlug: p.slug,
    slug: p.slug,
    programDescription: `${p.program} at NC A&T prepares students for rewarding careers in ${p.field.toLowerCase()}. Through rigorous coursework, hands-on projects, internships, and mentorship from industry-connected faculty, graduates emerge ready to lead and innovate.`,
    tagline: `Leading the Future of ${p.field}`,
    brandingColors: BRANDING_COLORS,
    categoryColors: CATEGORY_COLORS,
    careerOutlook: {
      field: p.field,
      blsCode: p.blsCode,
      growthRate: `${p.growth} (2022-2032)`,
      medianSalary: p.medianSalary,
      totalJobs: p.employment,
      topEmployers: p.topEmployers,
      certifications: p.certs,
      relatedFields: p.related,
      keySkills: p.skills,
      outlook: `${p.field} professionals are in demand. NC A&T graduates bring unique perspectives and strong technical skills to this growing field.`
    }
  };
}

function generateTimeline(p) {
  return {
    phases: p.timeline.map(phase => ({
      id: phase.id,
      name: phase.name,
      subtitle: phase.subtitle,
      description: phase.desc,
      milestones: phase.ms.map(m => ({
        id: m.id,
        label: m.label,
        courseRef: m.courseRef,
        credits: m.credits,
        category: m.cat,
        semester: m.sem,
        description: m.desc,
        skills: m.skills
      }))
    }))
  };
}

function generateMatrix(p) {
  return {
    validationCategories: Object.keys(CATEGORY_COLORS).map(key => ({
      id: key,
      label: CATEGORY_COLORS[key].label,
      description: CATEGORY_COLORS[key].description,
      color: CATEGORY_COLORS[key].hex
    }))
  };
}

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────
let created = 0;
let skipped = 0;

PROGRAMS.forEach(p => {
  const dir = path.join(SEEDS_DIR, p.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // branding.json
  const brandingPath = path.join(dir, 'branding.json');
  if (!fs.existsSync(brandingPath)) {
    fs.writeFileSync(brandingPath, JSON.stringify(generateBranding(p), null, 2));
    console.log(`✅ Created branding.json for ${p.slug}`);
    created++;
  } else { skipped++; }

  // timeline.json
  const timelinePath = path.join(dir, 'timeline.json');
  if (!fs.existsSync(timelinePath)) {
    fs.writeFileSync(timelinePath, JSON.stringify(generateTimeline(p), null, 2));
    console.log(`✅ Created timeline.json for ${p.slug}`);
    created++;
  } else { skipped++; }

  // matrix.json
  const matrixPath = path.join(dir, 'matrix.json');
  if (!fs.existsSync(matrixPath)) {
    fs.writeFileSync(matrixPath, JSON.stringify(generateMatrix(p), null, 2));
    console.log(`✅ Created matrix.json for ${p.slug}`);
    created++;
  } else { skipped++; }
});

console.log(`\n📊 Done: ${created} files created, ${skipped} skipped (already existed)`);
