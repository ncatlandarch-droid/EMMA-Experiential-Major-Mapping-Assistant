/**
 * Inject CAHSS career data into report.js
 */
const fs = require('fs');
const path = require('path');
const reportPath = path.join(__dirname, '..', 'js', 'report.js');

const CAHSS_DATA = `
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
      images: ['assets/images/professions/prof_sociology.png'],
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
      images: ['assets/images/professions/prof_history.png'],
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
        { title: 'Lobbyist / Government Relations', salary: '$65K – $160K+', icon: '🤝', desc: 'Advocate for organizations\\' interests before lawmakers and regulators.' }
      ],
      images: ['assets/images/professions/prof_sociology.png'],
      related: [
        { name: 'Criminal Justice', why: 'Law and justice system' },
        { name: 'History', why: 'Political and constitutional history' },
        { name: 'Economics', why: 'Public policy and economic governance' }
      ],
      whatYouCanDo: ['Practice law at a top firm','Run for elected office','Serve as a diplomat overseas','Manage national political campaigns','Shape legislation at the federal level','Analyze politics for major news networks']
    },
    'jmc': {
      hero: 'assets/images/professions/prof_communications.png',
      title: 'Journalism & Mass Communication',
      tagline: 'Telling Stories That Inform, Inspire & Ignite Change',
      overview: 'JMC professionals create the content that shapes public opinion — from investigative journalism and broadcast news to multimedia production and public relations. NC A&T\\'s ACEJMC-accredited program trains you across multimedia, PR, and production.',
      blsSalary: 57500, blsGrowth: 3, blsEmployment: 150000, nationalMedian: 48060,
      careers: [
        { title: 'Broadcast Journalist / News Anchor', salary: '$45K – $100K+', icon: '🎤', desc: 'Report and present news on TV, radio, and digital platforms.' },
        { title: 'Documentary Producer', salary: '$55K – $120K', icon: '🎬', desc: 'Create compelling documentaries for networks, streaming, and film festivals.' },
        { title: 'Public Relations Manager', salary: '$60K – $110K', icon: '📢', desc: 'Manage brand reputation, crisis communications, and media strategy.' },
        { title: 'Social Media Director', salary: '$55K – $100K', icon: '📱', desc: 'Lead social media strategy and content across platforms.' },
        { title: 'Investigative Reporter', salary: '$40K – $85K', icon: '🔍', desc: 'Uncover corruption, injustice, and wrongdoing through deep investigative work.' },
        { title: 'Multimedia Producer', salary: '$50K – $90K', icon: '🎥', desc: 'Create video, audio, and interactive content for digital platforms.' }
      ],
      images: ['assets/images/professions/prof_communications.png'],
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
      overview: 'Visual arts professionals design the visual world — from graphic design and branding to fine art, gallery curation, and digital media. With concentrations in design and graphic design, NC A&T\\'s program builds both creative and technical skills.',
      blsSalary: 57990, blsGrowth: 3, blsEmployment: 266500, nationalMedian: 48060,
      careers: [
        { title: 'Graphic Designer', salary: '$45K – $80K', icon: '🎨', desc: 'Create visual content — logos, branding, packaging, and digital media.' },
        { title: 'Art Director', salary: '$70K – $130K', icon: '🖼️', desc: 'Lead visual direction for advertising agencies, magazines, and media companies.' },
        { title: 'UI/UX Designer', salary: '$65K – $120K', icon: '📱', desc: 'Design intuitive digital interfaces for apps and websites.' },
        { title: 'Motion Graphics Designer', salary: '$55K – $95K', icon: '🎬', desc: 'Create animated visual content for film, TV, and digital platforms.' },
        { title: 'Gallery Director / Curator', salary: '$45K – $85K', icon: '🏛️', desc: 'Manage art galleries and curate exhibitions for public engagement.' }
      ],
      images: ['assets/images/professions/prof_comp_graphics.png'],
      related: [
        { name: 'Computer Graphics Technology', why: '3D modeling and digital production' },
        { name: 'Marketing', why: 'Brand design and advertising' },
        { name: 'Journalism — Multimedia', why: 'Visual storytelling and media' }
      ],
      whatYouCanDo: ['Design brand identities for global companies','Direct art and creative at an advertising agency','Create UI/UX for major tech products','Exhibit fine art in galleries worldwide','Design motion graphics for film and streaming','Curate exhibitions at major museums']
    },
    'music': {
      hero: 'assets/images/professions/prof_communications.png',
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
      images: ['assets/images/professions/prof_communications.png'],
      related: [
        { name: 'Theatre Arts', why: 'Performance and production arts' },
        { name: 'Communication Studies', why: 'Media and creative expression' },
        { name: 'Computer Graphics Technology', why: 'Audio-visual digital production' }
      ],
      whatYouCanDo: ['Perform on international stages','Produce chart-topping records','Direct school and community music programs','Score films and video games','Engineer sound for live concerts and studios','Use music therapy to heal']
    },
    'thtr': {
      hero: 'assets/images/professions/prof_communications.png',
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
      images: ['assets/images/professions/prof_communications.png'],
      related: [
        { name: 'Music', why: 'Musical theatre and performance arts' },
        { name: 'English — Creative Writing', why: 'Playwriting and dramatic literature' },
        { name: 'Visual Arts', why: 'Scenic and costume design' }
      ],
      whatYouCanDo: ['Perform on Broadway or in film','Direct theatrical productions','Design sets for major productions','Manage production for touring shows','Write and produce original plays','Teach drama at universities']
    }`;

let src = fs.readFileSync(reportPath, 'utf8');

const aliasLine = "  // Also map alternate keys";
const dbCloseIdx = src.lastIndexOf('  };', src.indexOf(aliasLine));

const beforeClose = src.substring(0, dbCloseIdx - 1);
const afterClose = src.substring(dbCloseIdx);

let newSrc = beforeClose + ',\n' + CAHSS_DATA + '\n' + afterClose;

// Add alias mappings
const lastAlias = "  DB['pre'] = DB['kin'];";
const newAliases = lastAlias + `
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
  DB['tech'] = DB['thtr'];`;

newSrc = newSrc.replace(lastAlias, newAliases);

fs.writeFileSync(reportPath, newSrc, 'utf8');
console.log('✅ CAHSS data injected into report.js');
console.log('Keys added: cj, eng, hist, poli, jmc, lib, art, music, thtr');
