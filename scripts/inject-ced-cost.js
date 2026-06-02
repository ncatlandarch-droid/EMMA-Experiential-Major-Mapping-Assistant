/**
 * Inject CEd + CoST career data into report.js
 */
const fs = require('fs');
const path = require('path');
const reportPath = path.join(__dirname, '..', 'js', 'report.js');

const DATA = `
    'elem': {
      hero: 'assets/images/professions/prof_health_mgmt.png',
      title: 'Elementary Education',
      tagline: 'Shaping the Minds & Lives of Young Learners',
      overview: 'Elementary teachers lay the foundation for lifelong learning — teaching reading, math, science, and social skills to children in grades K-6. NC A&T\\'s CAEP-accredited program prepares teachers with classroom experience from day one.',
      blsSalary: 61690, blsGrowth: 1, blsEmployment: 1516300, nationalMedian: 48060,
      careers: [
        { title: 'Elementary School Teacher', salary: '$45K – $70K', icon: '📚', desc: 'Teach all subjects to K-6 students in public or private schools.' },
        { title: 'Reading Specialist', salary: '$50K – $75K', icon: '📖', desc: 'Provide targeted literacy intervention for struggling readers.' },
        { title: 'Curriculum Developer', salary: '$55K – $85K', icon: '📝', desc: 'Design instructional materials and curriculum aligned to standards.' },
        { title: 'Instructional Coach', salary: '$55K – $80K', icon: '🎯', desc: 'Mentor and support teachers in improving classroom instruction.' },
        { title: 'School Principal', salary: '$80K – $130K', icon: '🏫', desc: 'Lead school operations, culture, and academic achievement. Requires graduate degree.' }
      ],
      images: ['assets/images/professions/prof_health_mgmt.png'],
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
      images: ['assets/images/professions/prof_health_mgmt.png'],
      related: [
        { name: 'Business Information Technology', why: 'EdTech and learning management systems' },
        { name: 'Communication Studies', why: 'Training and professional development' },
        { name: 'Management', why: 'Educational leadership and administration' }
      ],
      whatYouCanDo: ['Design online learning for major universities','Lead corporate training at Fortune 500 companies','Implement education technology across school districts','Build family engagement programs','Manage educational nonprofits','Create e-learning content for global audiences']
    },
    'aet': {
      hero: 'assets/images/professions/prof_applied_engineering.png',
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
      images: ['assets/images/professions/prof_applied_engineering.png'],
      related: [
        { name: 'Industrial & Systems Engineering', why: 'Process optimization and quality' },
        { name: 'Construction Management', why: 'Project management in construction' },
        { name: 'Electronics Engineering Technology', why: 'Electrical systems integration' }
      ],
      whatYouCanDo: ['Manage manufacturing operations at major companies','Design production processes for automotive and aerospace','Lead quality improvement programs','Oversee plant operations as a facility manager','Sell technical engineering solutions','Program CNC machines and robotics']
    },
    'auto': {
      hero: 'assets/images/professions/prof_auto_engineering.png',
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
      images: ['assets/images/professions/prof_health_mgmt.png'],
      related: [
        { name: 'Chemistry', why: 'Biochemistry and lab science' },
        { name: 'Animal Science', why: 'Comparative anatomy and physiology' },
        { name: 'Nursing', why: 'Healthcare career foundation' }
      ],
      whatYouCanDo: ['Become a physician and save lives','Discover new drugs and treatments as a researcher','Solve crimes using forensic biology','Counsel families on genetic health','Study ecosystems and protect biodiversity','Teach biology at universities']
    },
    'cm': {
      hero: 'assets/images/professions/prof_applied_engineering.png',
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
      images: ['assets/images/professions/prof_applied_engineering.png'],
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
      images: ['assets/images/professions/prof_env_health.png'],
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
      overview: 'Geomatics professionals use GPS, GIS, drones, and remote sensing to map and analyze the Earth\\'s surface. From surveying construction sites to creating 3D city models, this high-tech field is essential for urban planning, agriculture, and defense.',
      blsSalary: 63080, blsGrowth: 5, blsEmployment: 48000, nationalMedian: 48060,
      careers: [
        { title: 'GIS Analyst', salary: '$50K – $85K', icon: '🗺️', desc: 'Create and analyze geographic data using GIS software (Esri ArcGIS).' },
        { title: 'Land Surveyor', salary: '$55K – $90K', icon: '📐', desc: 'Measure and map land boundaries for construction and real estate.' },
        { title: 'Remote Sensing Specialist', salary: '$60K – $100K', icon: '🛰️', desc: 'Analyze satellite and drone imagery for environmental monitoring and defense.' },
        { title: 'Drone / UAS Operator', salary: '$50K – $90K', icon: '🚁', desc: 'Operate drones for surveying, mapping, and inspection.' },
        { title: 'Cartographer', salary: '$50K – $80K', icon: '🌐', desc: 'Design and produce maps for government, military, and commercial use.' }
      ],
      images: ['assets/images/professions/prof_environmental.png'],
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
      images: ['assets/images/professions/prof_health_mgmt.png'],
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
      images: ['assets/images/professions/prof_electronics.png'],
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
      images: ['assets/images/professions/prof_electronics.png'],
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
      images: ['assets/images/professions/prof_environmental.png'],
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
      images: ['assets/images/professions/prof_electronics.png'],
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
    }`;

let src = fs.readFileSync(reportPath, 'utf8');

const aliasLine = "  // Also map alternate keys";
const dbCloseIdx = src.lastIndexOf('  };', src.indexOf(aliasLine));

const beforeClose = src.substring(0, dbCloseIdx - 1);
const afterClose = src.substring(dbCloseIdx);

let newSrc = beforeClose + ',\n' + DATA + '\n' + afterClose;

// Add alias mappings
const lastAlias = "  DB['tech'] = DB['thtr'];";
const newAliases = lastAlias + `
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
  DB['phys-bio'] = DB['phys'];`;

newSrc = newSrc.replace(lastAlias, newAliases);

fs.writeFileSync(reportPath, newSrc, 'utf8');
console.log('✅ CEd + CoST data injected into report.js');
console.log('Keys added: elem, edst, aet, auto, bio, cm, ehs, geo, chem, elec, it, cgt, math, atms, phys, cost-ai');
