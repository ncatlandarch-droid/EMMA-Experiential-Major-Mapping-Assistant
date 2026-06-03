#!/usr/bin/env node
/**
 * inject-orgs.js — Populate professionalOrgs for every program
 * Run: node scripts/inject-orgs.js
 */
const fs = require('fs');
const path = require('path');
const SEEDS = path.join(__dirname, '..', 'data', 'seeds');

/* ═══════════════════════════════════════════════════════
   PROFESSIONAL ORGANIZATIONS DATABASE
   Each key matches a program folder prefix or slug
   ═══════════════════════════════════════════════════════ */
const ORG_DB = {

  // ── CAES ──
  'caes-la': null, // already done

  'caes-aes-envs': [
    { id:'naaee', name:'North American Association for Environmental Education (NAAEE)', description:'Professional development, certification, and resources for environmental educators and scientists', url:'https://naaee.org', icon:'🌍' },
    { id:'esa', name:'Ecological Society of America (ESA)', description:'Advancing ecological research, education, and the responsible application of ecological science', url:'https://www.esa.org', icon:'🌿' },
    { id:'setac', name:'Society of Environmental Toxicology and Chemistry (SETAC)', description:'Environmental science, research, and education for sustainability', url:'https://www.setac.org', icon:'🔬' }
  ],
  'caes-aes-slfs': [
    { id:'ashs', name:'American Society for Horticultural Science (ASHS)', description:'Advancing all areas of horticultural science through research, education, and knowledge exchange', url:'https://ashs.org', icon:'🌱' },
    { id:'sfp', name:'Sustainable Food Policy Alliance', description:'Advocating for transparent, sustainable, and equitable food systems at national and global levels', url:'https://foodpolicyalliance.org', icon:'🍎' },
    { id:'asa', name:'American Society of Agronomy (ASA)', description:'Advancing agronomy, crop science, and soil science for sustainable agriculture', url:'https://www.agronomy.org', icon:'🌾' }
  ],
  'caes-agbm': [
    { id:'aaea', name:'Agricultural & Applied Economics Association (AAEA)', description:'Advancing agricultural and applied economics through research and policy analysis', url:'https://www.aaea.org', icon:'📊' },
    { id:'nama', name:'National Agri-Marketing Association (NAMA)', description:'Connecting agribusiness professionals in marketing, communications, and public relations', url:'https://nama.org', icon:'📈' },
    { id:'ffa', name:'National FFA Organization', description:'Developing agricultural leadership, personal growth, and career success for students', url:'https://www.ffa.org', icon:'🏅' }
  ],
  'caes-aged-pro': [
    { id:'naae', name:'National Association of Agricultural Educators (NAAE)', description:'Professional organization for agricultural educators — advocacy, resources, and professional development', url:'https://www.naae.org', icon:'🎓' },
    { id:'ffa', name:'National FFA Organization', description:'Developing agricultural leadership, personal growth, and career success for students', url:'https://www.ffa.org', icon:'🏅' },
    { id:'acte', name:'Association for Career and Technical Education (ACTE)', description:'Largest national educator association dedicated to advancing CTE', url:'https://www.acteonline.org', icon:'📚' }
  ],
  'caes-aged-sec': [
    { id:'naae', name:'National Association of Agricultural Educators (NAAE)', description:'Professional organization for agricultural educators — advocacy, resources, and professional development', url:'https://www.naae.org', icon:'🎓' },
    { id:'ffa', name:'National FFA Organization', description:'Developing agricultural leadership, personal growth, and career success for students', url:'https://www.ffa.org', icon:'🏅' },
    { id:'acte', name:'Association for Career and Technical Education (ACTE)', description:'Largest national educator association dedicated to advancing CTE', url:'https://www.acteonline.org', icon:'📚' }
  ],
  'caes-ansc': [
    { id:'asas', name:'American Society of Animal Science (ASAS)', description:'Advancing animal science research, education, and industry application', url:'https://www.asas.org', icon:'🐄' },
    { id:'avma', name:'American Veterinary Medical Association (AVMA)', description:'Representing veterinarians — advocacy, accreditation, and public health', url:'https://www.avma.org', icon:'🩺' },
    { id:'psa', name:'Poultry Science Association (PSA)', description:'Advancing poultry science through research, teaching, and extension', url:'https://poultryscience.org', icon:'🐔' }
  ],
  'caes-bioe-bio': [
    { id:'asabe', name:'American Society of Agricultural & Biological Engineers (ASABE)', description:'Engineering and technology for food, agriculture, and biological systems', url:'https://www.asabe.org', icon:'⚙️' },
    { id:'bmes', name:'Biomedical Engineering Society (BMES)', description:'Advancing biomedical engineering education, research, and professional development', url:'https://www.bmes.org', icon:'🦾' },
    { id:'aiche', name:'American Institute of Chemical Engineers (AIChE)', description:'Advancing chemical engineering — bioprocessing, sustainability, and innovation', url:'https://www.aiche.org', icon:'🧪' }
  ],
  'caes-bioe-nr': [
    { id:'asabe', name:'American Society of Agricultural & Biological Engineers (ASABE)', description:'Engineering and technology for food, agriculture, and biological systems', url:'https://www.asabe.org', icon:'⚙️' },
    { id:'swcs', name:'Soil and Water Conservation Society (SWCS)', description:'Advancing soil and water conservation science and practice', url:'https://www.swcs.org', icon:'💧' },
    { id:'esa', name:'Ecological Society of America (ESA)', description:'Advancing ecological research and the responsible application of ecological science', url:'https://www.esa.org', icon:'🌿' }
  ],
  'caes-cdfs-bk': [
    { id:'naeyc', name:'National Association for the Education of Young Children (NAEYC)', description:'Promoting high-quality early learning — accreditation, resources, and advocacy', url:'https://www.naeyc.org', icon:'👶' },
    { id:'ncfr', name:'National Council on Family Relations (NCFR)', description:'Advancing family science through research, theory, and practice', url:'https://www.ncfr.org', icon:'👨‍👩‍👧' },
    { id:'srcd', name:'Society for Research in Child Development (SRCD)', description:'Advancing developmental science research and its application to children and families', url:'https://www.srcd.org', icon:'🧒' }
  ],
  'caes-cdfs-fam': [
    { id:'ncfr', name:'National Council on Family Relations (NCFR)', description:'Advancing family science through research, theory, and practice', url:'https://www.ncfr.org', icon:'👨‍👩‍👧' },
    { id:'aamft', name:'American Association for Marriage and Family Therapy (AAMFT)', description:'Professional association for marriage and family therapists — licensing, ethics, advocacy', url:'https://www.aamft.org', icon:'💬' },
    { id:'naeyc', name:'National Association for the Education of Young Children (NAEYC)', description:'Promoting high-quality early learning — accreditation, resources, and advocacy', url:'https://www.naeyc.org', icon:'👶' }
  ],
  'caes-fns': [
    { id:'and', name:'Academy of Nutrition and Dietetics (AND)', description:'The world\'s largest organization of food and nutrition professionals — credentialing, research, advocacy', url:'https://www.eatright.org', icon:'🥗' },
    { id:'ift', name:'Institute of Food Technologists (IFT)', description:'Advancing food science and technology for the benefit of people and planet', url:'https://www.ift.org', icon:'🔬' },
    { id:'sneb', name:'Society for Nutrition Education and Behavior (SNEB)', description:'Promoting effective nutrition education and healthy behavior through research and practice', url:'https://www.sneb.org', icon:'📚' }
  ],
  'caes-fns-diet': [
    { id:'and', name:'Academy of Nutrition and Dietetics (AND)', description:'The world\'s largest organization of food and nutrition professionals — credentialing, research, advocacy', url:'https://www.eatright.org', icon:'🥗' },
    { id:'ift', name:'Institute of Food Technologists (IFT)', description:'Advancing food science and technology for the benefit of people and planet', url:'https://www.ift.org', icon:'🔬' },
    { id:'ascn', name:'American Society for Clinical Nutrition (ASCN)', description:'Advancing clinical nutrition research and practice', url:'https://nutrition.org', icon:'🩺' }
  ],
  'caes-soil': [
    { id:'sssa', name:'Soil Science Society of America (SSSA)', description:'Advancing soil science through research, education, and professional development', url:'https://www.soils.org', icon:'🌍' },
    { id:'asa', name:'American Society of Agronomy (ASA)', description:'Advancing agronomy, crop science, and soil science for sustainable agriculture', url:'https://www.agronomy.org', icon:'🌾' },
    { id:'swcs', name:'Soil and Water Conservation Society (SWCS)', description:'Advancing soil and water conservation science and practice', url:'https://www.swcs.org', icon:'💧' }
  ],

  // ── CoBE ──
  'cobe-acct': [
    { id:'aicpa', name:'American Institute of Certified Public Accountants (AICPA)', description:'The national professional organization for CPAs — ethics, standards, and certification', url:'https://www.aicpa.org', icon:'📋' },
    { id:'naba', name:'National Association of Black Accountants (NABA)', description:'Expanding opportunities for minorities in accounting, finance, and business', url:'https://www.nabainc.org', icon:'✊🏿' },
    { id:'ima', name:'Institute of Management Accountants (IMA)', description:'Advancing management accounting and financial management worldwide', url:'https://www.imanet.org', icon:'💰' }
  ],
  'cobe-fin': [
    { id:'cfa', name:'CFA Institute', description:'Global association of investment professionals — ethics, standards, and the CFA charter', url:'https://www.cfainstitute.org', icon:'📈' },
    { id:'fpa', name:'Financial Planning Association (FPA)', description:'Community for financial planners — education, practice management, and advocacy', url:'https://www.financialplanningassociation.org', icon:'💵' },
    { id:'naba', name:'National Association of Black Accountants (NABA)', description:'Expanding opportunities for minorities in accounting, finance, and business', url:'https://www.nabainc.org', icon:'✊🏿' }
  ],
  'cobe-econ': [
    { id:'aea', name:'American Economic Association (AEA)', description:'Encouraging economic research, publishing, and education', url:'https://www.aeaweb.org', icon:'📊' },
    { id:'nea', name:'National Economic Association (NEA)', description:'Promoting the professional lives of minorities in the economics profession', url:'https://www.neaecon.org', icon:'✊🏿' },
    { id:'nabe', name:'National Association for Business Economics (NABE)', description:'Connecting business economists — forecasting, policy analysis, and applied economics', url:'https://nabe.com', icon:'📈' }
  ],
  'cobe-econ-biz': [
    { id:'aea', name:'American Economic Association (AEA)', description:'Encouraging economic research, publishing, and education', url:'https://www.aeaweb.org', icon:'📊' },
    { id:'nabe', name:'National Association for Business Economics (NABE)', description:'Connecting business economists — forecasting, policy analysis, and applied economics', url:'https://nabe.com', icon:'📈' },
    { id:'nea', name:'National Economic Association (NEA)', description:'Promoting the professional lives of minorities in the economics profession', url:'https://www.neaecon.org', icon:'✊🏿' }
  ],
  'cobe-econ-law': [
    { id:'aea', name:'American Economic Association (AEA)', description:'Encouraging economic research, publishing, and education', url:'https://www.aeaweb.org', icon:'📊' },
    { id:'alea', name:'American Law and Economics Association (ALEA)', description:'Advancing scholarly research at the intersection of law and economics', url:'https://www.amlecon.org', icon:'⚖️' },
    { id:'nba', name:'National Bar Association (NBA)', description:'Largest national association of predominantly African American lawyers, judges, and legal professionals', url:'https://www.nationalbar.org', icon:'🏛️' }
  ],
  'cobe-mgmt': [
    { id:'shrm', name:'Society for Human Resource Management (SHRM)', description:'The world\'s largest HR professional society — certification, research, and advocacy', url:'https://www.shrm.org', icon:'👥' },
    { id:'pmi', name:'Project Management Institute (PMI)', description:'Global standard for project management — PMP certification, knowledge, and community', url:'https://www.pmi.org', icon:'📋' },
    { id:'ama', name:'American Management Association (AMA)', description:'Management training, development, and leadership education', url:'https://www.amanet.org', icon:'💼' }
  ],
  'cobe-mgmt-ent': [
    { id:'usasbe', name:'United States Association for Small Business & Entrepreneurship (USASBE)', description:'Advancing entrepreneurship education through research and practice', url:'https://www.usasbe.org', icon:'🚀' },
    { id:'sba', name:'Small Business Administration (SBA)', description:'Federal agency providing resources, training, and funding for entrepreneurs', url:'https://www.sba.gov', icon:'🏛️' },
    { id:'naacp-esd', name:'National Black Chamber of Commerce (NBCC)', description:'Advocating for Black-owned businesses — access to capital, contracts, and networking', url:'https://www.nationalbcc.org', icon:'✊🏿' }
  ],
  'cobe-mgmt-intl': [
    { id:'aib', name:'Academy of International Business (AIB)', description:'Leading association for scholars and specialists in international business', url:'https://www.aib.msu.edu', icon:'🌐' },
    { id:'pmi', name:'Project Management Institute (PMI)', description:'Global standard for project management — PMP certification, knowledge, and community', url:'https://www.pmi.org', icon:'📋' },
    { id:'shrm', name:'Society for Human Resource Management (SHRM)', description:'The world\'s largest HR professional society — certification, research, and advocacy', url:'https://www.shrm.org', icon:'👥' }
  ],
  'cobe-bit': [
    { id:'isaca', name:'ISACA (Information Systems Audit and Control Association)', description:'Global professional association for IT governance, security, audit, and risk management', url:'https://www.isaca.org', icon:'🔒' },
    { id:'acm', name:'Association for Computing Machinery (ACM)', description:'World\'s largest computing society — research, education, and career resources', url:'https://www.acm.org', icon:'💻' },
    { id:'bdpa', name:'Black Data Processing Associates (BDPA)', description:'Advancing minorities in IT — training, scholarships, and career development', url:'https://www.bdpa.org', icon:'✊🏿' }
  ],
  'cobe-mktg': [
    { id:'ama-mktg', name:'American Marketing Association (AMA)', description:'Essential community for marketers — research, training, and professional certification', url:'https://www.ama.org', icon:'📢' },
    { id:'aaf', name:'American Advertising Federation (AAF)', description:'Protecting and promoting advertising through advocacy, education, and ADDY Awards', url:'https://www.aaf.org', icon:'🎨' },
    { id:'prsa', name:'Public Relations Society of America (PRSA)', description:'Advancing the profession of public relations — ethics, certification, and community', url:'https://www.prsa.org', icon:'📰' }
  ],
  'cobe-mktg-sales': [
    { id:'ama-mktg', name:'American Marketing Association (AMA)', description:'Essential community for marketers — research, training, and professional certification', url:'https://www.ama.org', icon:'📢' },
    { id:'nsf', name:'National Sales Foundation (Pi Sigma Epsilon)', description:'National fraternity for sales, marketing, and management — professional development and networking', url:'https://www.pse.org', icon:'🤝' },
    { id:'aaf', name:'American Advertising Federation (AAF)', description:'Protecting and promoting advertising through advocacy, education, and ADDY Awards', url:'https://www.aaf.org', icon:'🎨' }
  ],
  'cobe-scm': [
    { id:'ascm', name:'Association for Supply Chain Management (ASCM)', description:'Global leader in supply chain education — APICS certifications (CSCP, CPIM, CLTD)', url:'https://www.ascm.org', icon:'🚛' },
    { id:'cscmp', name:'Council of Supply Chain Management Professionals (CSCMP)', description:'Professional association providing education, research, and networking for supply chain leaders', url:'https://cscmp.org', icon:'📦' },
    { id:'ism', name:'Institute for Supply Management (ISM)', description:'Supply management research, standards, and the CPSM certification', url:'https://www.ismworld.org', icon:'🤝' }
  ],

  // ── CoE ──
  'coe-ae': [
    { id:'asce', name:'American Society of Civil Engineers (ASCE)', description:'Advancing civil engineering knowledge and practice for infrastructure and sustainability', url:'https://www.asce.org', icon:'🏗️' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership programs', url:'https://www.nsbe.org', icon:'✊🏿' },
    { id:'ashrae', name:'American Society of Heating, Refrigerating, and Air-Conditioning Engineers (ASHRAE)', description:'Building performance standards, energy efficiency, and HVAC engineering', url:'https://www.ashrae.org', icon:'❄️' }
  ],
  'coe-ai': [
    { id:'aaai', name:'Association for the Advancement of Artificial Intelligence (AAAI)', description:'Advancing the scientific understanding and responsible use of AI', url:'https://www.aaai.org', icon:'🤖' },
    { id:'acm', name:'Association for Computing Machinery (ACM)', description:'World\'s largest computing society — research, education, and career resources', url:'https://www.acm.org', icon:'💻' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership programs', url:'https://www.nsbe.org', icon:'✊🏿' }
  ],
  'coe-bioe': [
    { id:'bmes', name:'Biomedical Engineering Society (BMES)', description:'Advancing biomedical engineering education, research, and professional development', url:'https://www.bmes.org', icon:'🦾' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership programs', url:'https://www.nsbe.org', icon:'✊🏿' },
    { id:'aiche', name:'American Institute of Chemical Engineers (AIChE)', description:'Advancing chemical engineering — bioprocessing, sustainability, and innovation', url:'https://www.aiche.org', icon:'🧪' }
  ],
  'coe-ce': [
    { id:'asce', name:'American Society of Civil Engineers (ASCE)', description:'Advancing civil engineering — infrastructure, sustainability, and professional practice', url:'https://www.asce.org', icon:'🌉' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership programs', url:'https://www.nsbe.org', icon:'✊🏿' },
    { id:'chi-eps', name:'Chi Epsilon (Civil Engineering Honor Society)', description:'National civil engineering honor society recognizing academic achievement and character', url:'https://www.chi-epsilon.org', icon:'🏅' }
  ],
  'coe-che': [
    { id:'aiche', name:'American Institute of Chemical Engineers (AIChE)', description:'Advancing chemical engineering — bioprocessing, sustainability, and innovation', url:'https://www.aiche.org', icon:'🧪' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership programs', url:'https://www.nsbe.org', icon:'✊🏿' },
    { id:'acs', name:'American Chemical Society (ACS)', description:'World\'s largest scientific society — advancing chemistry for life', url:'https://www.acs.org', icon:'⚗️' }
  ],
  'coe-cpe': [
    { id:'ieee', name:'Institute of Electrical and Electronics Engineers (IEEE)', description:'World\'s largest technical professional organization — advancing technology for humanity', url:'https://www.ieee.org', icon:'⚡' },
    { id:'acm', name:'Association for Computing Machinery (ACM)', description:'World\'s largest computing society — research, education, and career resources', url:'https://www.acm.org', icon:'💻' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership programs', url:'https://www.nsbe.org', icon:'✊🏿' }
  ],
  'coe-cs': [
    { id:'acm', name:'Association for Computing Machinery (ACM)', description:'World\'s largest computing society — research, education, and career resources', url:'https://www.acm.org', icon:'💻' },
    { id:'ieee-cs', name:'IEEE Computer Society', description:'Computing professionals\' community — conferences, publications, and certifications', url:'https://www.computer.org', icon:'🖥️' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership programs', url:'https://www.nsbe.org', icon:'✊🏿' },
    { id:'bdpa', name:'Black Data Processing Associates (BDPA)', description:'Advancing minorities in IT — training, scholarships, and career development', url:'https://www.bdpa.org', icon:'✊🏿' }
  ],
  'coe-ee': [
    { id:'ieee', name:'Institute of Electrical and Electronics Engineers (IEEE)', description:'World\'s largest technical professional organization — advancing technology for humanity', url:'https://www.ieee.org', icon:'⚡' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership programs', url:'https://www.nsbe.org', icon:'✊🏿' },
    { id:'eta', name:'Eta Kappa Nu (IEEE-HKN)', description:'Electrical and computer engineering honor society — recognizing academic excellence', url:'https://hkn.ieee.org', icon:'🏅' }
  ],
  'coe-ise': [
    { id:'iise', name:'Institute of Industrial and Systems Engineers (IISE)', description:'Leading professional society for industrial and systems engineers — Lean, Six Sigma, and operations', url:'https://www.iise.org', icon:'⚙️' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership programs', url:'https://www.nsbe.org', icon:'✊🏿' },
    { id:'asq', name:'American Society for Quality (ASQ)', description:'Global community for quality professionals — certifications (CQE, CMQ/OE, Six Sigma)', url:'https://asq.org', icon:'✅' }
  ],
  'coe-me': [
    { id:'asme', name:'American Society of Mechanical Engineers (ASME)', description:'Advancing mechanical engineering — standards, conferences, and professional development', url:'https://www.asme.org', icon:'⚙️' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership programs', url:'https://www.nsbe.org', icon:'✊🏿' },
    { id:'sae', name:'SAE International', description:'Advancing mobility engineering — automotive, aerospace, and commercial vehicle standards', url:'https://www.sae.org', icon:'🚗' }
  ],

  // ── CHHS ──
  'chhs-nurs': [
    { id:'ana', name:'American Nurses Association (ANA)', description:'Representing the nation\'s 4.2 million registered nurses — advocacy, standards, and innovation', url:'https://www.nursingworld.org', icon:'🩺' },
    { id:'nbna', name:'National Black Nurses Association (NBNA)', description:'Advancing Black nurses and improving health equity in communities of color', url:'https://www.nbna.org', icon:'✊🏿' },
    { id:'nsna', name:'National Student Nurses Association (NSNA)', description:'The voice of nursing students — advocacy, career planning, and leadership', url:'https://www.nsna.org', icon:'📚' }
  ],
  'chhs-slpa': [
    { id:'asha', name:'American Speech-Language-Hearing Association (ASHA)', description:'Professional association for audiologists and speech-language pathologists — certification (CCC), research', url:'https://www.asha.org', icon:'🗣️' },
    { id:'nbaslh', name:'National Black Association for Speech-Language and Hearing (NBASLH)', description:'Advancing communication sciences for the Black community — mentorship and scholarships', url:'https://www.nbaslh.org', icon:'✊🏿' },
    { id:'nsslha', name:'National Student Speech Language Hearing Association (NSSLHA)', description:'Student organization for future SLPs and audiologists — leadership and professional growth', url:'https://www.nsslha.org', icon:'📚' }
  ],
  'chhs-comm': [
    { id:'nca', name:'National Communication Association (NCA)', description:'Advancing communication scholarship, education, and practice', url:'https://www.natcom.org', icon:'📢' },
    { id:'prsa', name:'Public Relations Society of America (PRSA)', description:'Advancing the profession of public relations — ethics, certification, and community', url:'https://www.prsa.org', icon:'📰' },
    { id:'aejmc', name:'Association for Education in Journalism and Mass Communication (AEJMC)', description:'Promoting the highest standards in journalism and mass communication education', url:'https://www.aejmc.org', icon:'🎓' }
  ],
  'chhs-kin-ex': [
    { id:'acsm', name:'American College of Sports Medicine (ACSM)', description:'World\'s largest sports medicine and exercise science organization — certifications, research', url:'https://www.acsm.org', icon:'🏃' },
    { id:'nsca', name:'National Strength and Conditioning Association (NSCA)', description:'Advancing strength and conditioning — CSCS and CPT certifications', url:'https://www.nsca.com', icon:'💪' },
    { id:'nata', name:'National Athletic Trainers Association (NATA)', description:'Professional membership for certified athletic trainers — advocacy, education, research', url:'https://www.nata.org', icon:'⚕️' }
  ],
  'chhs-kin-pre': [
    { id:'acsm', name:'American College of Sports Medicine (ACSM)', description:'World\'s largest sports medicine and exercise science organization — certifications, research', url:'https://www.acsm.org', icon:'🏃' },
    { id:'apta', name:'American Physical Therapy Association (APTA)', description:'Professional organization for physical therapists and PTs in training', url:'https://www.apta.org', icon:'🦿' },
    { id:'nsca', name:'National Strength and Conditioning Association (NSCA)', description:'Advancing strength and conditioning — CSCS and CPT certifications', url:'https://www.nsca.com', icon:'💪' }
  ],
  'chhs-kin-rsm': [
    { id:'nrpa', name:'National Recreation and Park Association (NRPA)', description:'Building strong, resilient communities through parks, recreation, and conservation', url:'https://www.nrpa.org', icon:'🏞️' },
    { id:'nassm', name:'North American Society for Sport Management (NASSM)', description:'Promoting sport management research, education, and professional development', url:'https://www.nassm.org', icon:'🏟️' },
    { id:'acsm', name:'American College of Sports Medicine (ACSM)', description:'World\'s largest sports medicine and exercise science organization — certifications, research', url:'https://www.acsm.org', icon:'🏃' }
  ],
  'chhs-hsm': [
    { id:'ache', name:'American College of Healthcare Executives (ACHE)', description:'International professional society for healthcare leaders — FACHE certification', url:'https://www.ache.org', icon:'🏥' },
    { id:'nahse', name:'National Association of Health Services Executives (NAHSE)', description:'Promoting diversity and inclusion in healthcare leadership', url:'https://www.nahse.org', icon:'✊🏿' },
    { id:'aupha', name:'Association of University Programs in Health Administration (AUPHA)', description:'Advancing health management education', url:'https://www.aupha.org', icon:'🎓' }
  ],
  'chhs-psych': [
    { id:'apa', name:'American Psychological Association (APA)', description:'Largest scientific and professional organization of psychologists — research, practice, standards', url:'https://www.apa.org', icon:'🧠' },
    { id:'abpsi', name:'Association of Black Psychologists (ABPsi)', description:'Advancing the creation, dissemination, and application of psychological knowledge for Black people', url:'https://abpsi.org', icon:'✊🏿' },
    { id:'psi-chi', name:'Psi Chi (International Psychology Honor Society)', description:'Recognizing and promoting excellence in psychology scholarship', url:'https://www.psichi.org', icon:'🏅' }
  ],
  'chhs-soc': [
    { id:'asa-soc', name:'American Sociological Association (ASA)', description:'Advancing sociology as a scientific discipline and profession serving the public good', url:'https://www.asanet.org', icon:'🏛️' },
    { id:'abs', name:'Association of Black Sociologists (ABS)', description:'Promoting research, teaching, and community service among Black sociologists', url:'https://www.associationofblacksociologists.org', icon:'✊🏿' },
    { id:'sssp', name:'Society for the Study of Social Problems (SSSP)', description:'Promoting research on significant social problems and social policy', url:'https://www.sssp1.org', icon:'🔍' }
  ],
  'chhs-sw': [
    { id:'nasw', name:'National Association of Social Workers (NASW)', description:'Largest membership organization of professional social workers — advocacy, ethics, licensing', url:'https://www.socialworkers.org', icon:'🤝' },
    { id:'nabsw', name:'National Association of Black Social Workers (NABSW)', description:'Addressing social issues impacting the Black community through advocacy and service', url:'https://www.nabsw.org', icon:'✊🏿' },
    { id:'cswe', name:'Council on Social Work Education (CSWE)', description:'Accrediting body for social work education — standards, research, and advocacy', url:'https://www.cswe.org', icon:'🎓' }
  ],

  // ── CAHSS ──
  'cahss-art-gd': [
    { id:'aiga', name:'AIGA (American Institute of Graphic Arts)', description:'The professional association for design — events, competitions, and career resources', url:'https://www.aiga.org', icon:'🎨' },
    { id:'gdc', name:'Graphic Design USA (GDUSA)', description:'Celebrating graphic design excellence — American Design Awards and industry news', url:'https://gdusa.com', icon:'✏️' },
    { id:'caa', name:'College Art Association (CAA)', description:'Advancing art and design in higher education — conferences, publications, career services', url:'https://www.collegeart.org', icon:'🖼️' }
  ],
  'cahss-cj': [
    { id:'acjs', name:'Academy of Criminal Justice Sciences (ACJS)', description:'Promoting criminal justice education, research, and policy analysis', url:'https://www.acjs.org', icon:'⚖️' },
    { id:'noble', name:'National Organization of Black Law Enforcement Executives (NOBLE)', description:'Ensuring equity in the administration of justice and public safety', url:'https://www.noblenational.org', icon:'✊🏿' },
    { id:'asc', name:'American Society of Criminology (ASC)', description:'Advancing criminological scholarship — research, teaching, and practice', url:'https://asc41.org', icon:'🔍' }
  ],
  'cahss-eng-afam': [
    { id:'ncte', name:'National Council of Teachers of English (NCTE)', description:'Advancing English language arts education through advocacy, research, and professional development', url:'https://ncte.org', icon:'📖' },
    { id:'mla', name:'Modern Language Association (MLA)', description:'Advancing the study and teaching of languages and literatures', url:'https://www.mla.org', icon:'📚' },
    { id:'cla', name:'College Language Association (CLA)', description:'Promoting the study of language and literature among faculty at HBCUs and institutions serving minorities', url:'https://www.clascholars.org', icon:'✊🏿' }
  ],
  'cahss-eng-cw': [
    { id:'awp', name:'Association of Writers & Writing Programs (AWP)', description:'Community for writers and creative writing programs — conferences, publications, career resources', url:'https://www.awpwriter.org', icon:'✍️' },
    { id:'ncte', name:'National Council of Teachers of English (NCTE)', description:'Advancing English language arts education through advocacy, research, and professional development', url:'https://ncte.org', icon:'📖' },
    { id:'pen', name:'PEN America', description:'Defending free expression and supporting writers worldwide', url:'https://pen.org', icon:'🖊️' }
  ],
  'cahss-eng-pro': [
    { id:'ncte', name:'National Council of Teachers of English (NCTE)', description:'Advancing English language arts education through advocacy, research, and professional development', url:'https://ncte.org', icon:'📖' },
    { id:'stc', name:'Society for Technical Communication (STC)', description:'Advancing technical communication — professional development and certification', url:'https://www.stc.org', icon:'📝' },
    { id:'mla', name:'Modern Language Association (MLA)', description:'Advancing the study and teaching of languages and literatures', url:'https://www.mla.org', icon:'📚' }
  ],
  'cahss-eng-tw': [
    { id:'stc', name:'Society for Technical Communication (STC)', description:'Advancing technical communication — professional development and certification', url:'https://www.stc.org', icon:'📝' },
    { id:'ncte', name:'National Council of Teachers of English (NCTE)', description:'Advancing English language arts education through advocacy, research, and professional development', url:'https://ncte.org', icon:'📖' },
    { id:'attw', name:'Association of Teachers of Technical Writing (ATTW)', description:'Supporting teachers and scholars of technical and professional writing', url:'https://attw.org', icon:'🎓' }
  ],
  'cahss-hist': [
    { id:'aha', name:'American Historical Association (AHA)', description:'The largest society of historians in the U.S. — research, teaching, and professional standards', url:'https://www.historians.org', icon:'📜' },
    { id:'asalh', name:'Association for the Study of African American Life and History (ASALH)', description:'Founded by Carter G. Woodson — promoting the study of Black life, history, and culture', url:'https://asalh.org', icon:'✊🏿' },
    { id:'oah', name:'Organization of American Historians (OAH)', description:'Promoting excellence in scholarship, teaching, and public understanding of American history', url:'https://www.oah.org', icon:'🏛️' }
  ],
  'cahss-jmc-mmj': [
    { id:'spj', name:'Society of Professional Journalists (SPJ)', description:'Protecting and promoting a free press — ethics, advocacy, and professional resources', url:'https://www.spj.org', icon:'📰' },
    { id:'nabj', name:'National Association of Black Journalists (NABJ)', description:'Advocating for diversity in newsrooms and media — scholarships, mentorship, and community', url:'https://www.nabj.org', icon:'✊🏿' },
    { id:'rtdna', name:'Radio Television Digital News Association (RTDNA)', description:'Advancing excellence in electronic journalism', url:'https://www.rtdna.org', icon:'📺' }
  ],
  'cahss-jmc-mmp': [
    { id:'nabj', name:'National Association of Black Journalists (NABJ)', description:'Advocating for diversity in newsrooms and media — scholarships, mentorship, and community', url:'https://www.nabj.org', icon:'✊🏿' },
    { id:'bea', name:'Broadcast Education Association (BEA)', description:'Advancing media education — production, research, and professional development', url:'https://www.beaweb.org', icon:'🎬' },
    { id:'nab', name:'National Association of Broadcasters (NAB)', description:'Advancing the interests of radio and TV broadcasters — technology, policy, and standards', url:'https://www.nab.org', icon:'📡' }
  ],
  'cahss-jmc-pr': [
    { id:'prsa', name:'Public Relations Society of America (PRSA)', description:'Advancing the profession of public relations — APR certification, ethics, and community', url:'https://www.prsa.org', icon:'📣' },
    { id:'nabj', name:'National Association of Black Journalists (NABJ)', description:'Advocating for diversity in newsrooms and media — scholarships, mentorship, and community', url:'https://www.nabj.org', icon:'✊🏿' },
    { id:'prssa', name:'Public Relations Student Society of America (PRSSA)', description:'Student organization fostering future PR professionals — leadership and networking', url:'https://prssa.prsa.org', icon:'📚' }
  ],
  'cahss-lib-act': [
    { id:'aaas', name:'American Academy of Arts & Sciences', description:'Honoring excellence and advancing interdisciplinary research for the public good', url:'https://www.amacad.org', icon:'🏛️' },
    { id:'aah', name:'Association for the Advancement of the Humanities (AAH)', description:'Supporting humanities scholarship, teaching, and public engagement', url:'https://www.neh.gov', icon:'📖' },
    { id:'ncbs', name:'National Council for Black Studies (NCBS)', description:'Advancing the discipline of Africana/Black Studies through education and research', url:'https://www.ncbsonline.org', icon:'✊🏿' }
  ],
  'cahss-lib-afam': [
    { id:'ncbs', name:'National Council for Black Studies (NCBS)', description:'Advancing the discipline of Africana/Black Studies through education and research', url:'https://www.ncbsonline.org', icon:'✊🏿' },
    { id:'asalh', name:'Association for the Study of African American Life and History (ASALH)', description:'Founded by Carter G. Woodson — promoting the study of Black life, history, and culture', url:'https://asalh.org', icon:'📜' },
    { id:'aaas', name:'American Academy of Arts & Sciences', description:'Honoring excellence and advancing interdisciplinary research for the public good', url:'https://www.amacad.org', icon:'🏛️' }
  ],
  'cahss-lib-law': [
    { id:'nba', name:'National Bar Association (NBA)', description:'Largest national association of predominantly African American lawyers, judges, and legal professionals', url:'https://www.nationalbar.org', icon:'⚖️' },
    { id:'lsac', name:'Law School Admission Council (LSAC)', description:'Connecting people to legal education — LSAT, application resources, and diversity initiatives', url:'https://www.lsac.org', icon:'📋' },
    { id:'ncbs', name:'National Council for Black Studies (NCBS)', description:'Advancing the discipline of Africana/Black Studies through education and research', url:'https://www.ncbsonline.org', icon:'✊🏿' }
  ],
  'cahss-music': [
    { id:'nafme', name:'National Association for Music Education (NAfME)', description:'Advancing music education — advocacy, professional development, and student programs', url:'https://nafme.org', icon:'🎵' },
    { id:'cms', name:'College Music Society (CMS)', description:'Forum for music faculty — teaching, performance, composition, and music technology', url:'https://www.music.org', icon:'🎼' },
    { id:'nasm', name:'National Association of Schools of Music (NASM)', description:'Accrediting body for music programs — standards for degrees and curriculum', url:'https://nasm.arts-accredit.org', icon:'🎓' }
  ],
  'cahss-poli': [
    { id:'apsa', name:'American Political Science Association (APSA)', description:'Advancing political science research, teaching, and engagement', url:'https://www.apsanet.org', icon:'🏛️' },
    { id:'ncobps', name:'National Conference of Black Political Scientists (NCOBPS)', description:'Advancing the study of politics and governance in the African American community', url:'https://www.ncobps.org', icon:'✊🏿' },
    { id:'pi-sigma-alpha', name:'Pi Sigma Alpha (Political Science Honor Society)', description:'National political science honor society — recognizing academic achievement', url:'https://www.pisigmaalpha.org', icon:'🏅' }
  ],
  'cahss-thtr-act': [
    { id:'usitt', name:'United States Institute for Theatre Technology (USITT)', description:'Connecting performing arts design and technology professionals', url:'https://www.usitt.org', icon:'🎭' },
    { id:'sag-aftra', name:'SAG-AFTRA', description:'Union for actors, broadcasters, and performing artists — contracts, protections, and benefits', url:'https://www.sagaftra.org', icon:'🎬' },
    { id:'btaa', name:'Black Theatre Association (BTA)', description:'Promoting excellence in Black theatre — networking, education, and performance', url:'https://www.aate.com', icon:'✊🏿' }
  ],
  'cahss-thtr-tech': [
    { id:'usitt', name:'United States Institute for Theatre Technology (USITT)', description:'Connecting performing arts design and technology professionals', url:'https://www.usitt.org', icon:'🎭' },
    { id:'iatse', name:'International Alliance of Theatrical Stage Employees (IATSE)', description:'Union representing technicians, artisans, and craftspeople in entertainment', url:'https://www.iatse.net', icon:'🔧' },
    { id:'setc', name:'Southeastern Theatre Conference (SETC)', description:'Connecting theatre professionals and students across the Southeast — auditions and workshops', url:'https://www.setc.org', icon:'🎪' }
  ],

  // ── CEd ──
  'ced-elem': [
    { id:'nea-ed', name:'National Education Association (NEA)', description:'The largest professional employee organization in the U.S. — advocacy for educators and students', url:'https://www.nea.org', icon:'🎓' },
    { id:'nctm', name:'National Council of Teachers of Mathematics (NCTM)', description:'Advocating for high-quality mathematics education for all students', url:'https://www.nctm.org', icon:'➗' },
    { id:'ncte', name:'National Council of Teachers of English (NCTE)', description:'Advancing English language arts education through advocacy and professional development', url:'https://ncte.org', icon:'📖' }
  ],
  'ced-edst-fam': [
    { id:'ncfr', name:'National Council on Family Relations (NCFR)', description:'Advancing family science through research, theory, and practice', url:'https://www.ncfr.org', icon:'👨‍👩‍👧' },
    { id:'nea-ed', name:'National Education Association (NEA)', description:'The largest professional employee organization in the U.S. — advocacy for educators and students', url:'https://www.nea.org', icon:'🎓' },
    { id:'naeyc', name:'National Association for the Education of Young Children (NAEYC)', description:'Promoting high-quality early learning — accreditation, resources, and advocacy', url:'https://www.naeyc.org', icon:'👶' }
  ],
  'ced-edst-lead': [
    { id:'nea-ed', name:'National Education Association (NEA)', description:'The largest professional employee organization in the U.S. — advocacy for educators and students', url:'https://www.nea.org', icon:'🎓' },
    { id:'ascd', name:'ASCD (Association for Supervision and Curriculum Development)', description:'Community of educators advancing best practices in teaching and learning', url:'https://www.ascd.org', icon:'📚' },
    { id:'nassp', name:'National Association of Secondary School Principals (NASSP)', description:'Advancing school leadership — professional learning, advocacy, and student programs', url:'https://www.nassp.org', icon:'🏫' }
  ],
  'ced-edst-tech': [
    { id:'iste', name:'International Society for Technology in Education (ISTE)', description:'Advancing the use of technology in education — standards, training, and innovation', url:'https://www.iste.org', icon:'💻' },
    { id:'nea-ed', name:'National Education Association (NEA)', description:'The largest professional employee organization in the U.S. — advocacy for educators and students', url:'https://www.nea.org', icon:'🎓' },
    { id:'aect', name:'Association for Educational Communications and Technology (AECT)', description:'Advancing knowledge and practice of educational technology and instructional design', url:'https://www.aect.org', icon:'🎮' }
  ],

  // ── CoST ──
  'cost-bio': [
    { id:'aibs', name:'American Institute of Biological Sciences (AIBS)', description:'Advancing biological research, education, and public policy', url:'https://www.aibs.org', icon:'🧬' },
    { id:'beta-beta-beta', name:'Beta Beta Beta (TriBeta) Biological Honor Society', description:'Recognizing academic achievement in biology and promoting scholarly activity', url:'https://www.tri-beta.org', icon:'🏅' },
    { id:'aaas-sci', name:'American Association for the Advancement of Science (AAAS)', description:'Advancing science, engineering, and innovation for the benefit of all people', url:'https://www.aaas.org', icon:'🔬' }
  ],
  'cost-bio-pre': [
    { id:'amsa', name:'American Medical Student Association (AMSA)', description:'Student-governed organization committed to health equity, advocacy, and medical education', url:'https://www.amsa.org', icon:'🩺' },
    { id:'snma', name:'Student National Medical Association (SNMA)', description:'Supporting underrepresented minority medical students — advocacy, mentorship, community', url:'https://snma.org', icon:'✊🏿' },
    { id:'aamc', name:'Association of American Medical Colleges (AAMC)', description:'Resources for pre-med students — MCAT, medical school applications, and career guidance', url:'https://www.aamc.org', icon:'🏥' }
  ],
  'cost-bio-law': [
    { id:'aibs', name:'American Institute of Biological Sciences (AIBS)', description:'Advancing biological research, education, and public policy', url:'https://www.aibs.org', icon:'🧬' },
    { id:'nba', name:'National Bar Association (NBA)', description:'Largest national association of predominantly African American lawyers and legal professionals', url:'https://www.nationalbar.org', icon:'⚖️' },
    { id:'lsac', name:'Law School Admission Council (LSAC)', description:'Connecting people to legal education — LSAT, application resources, and diversity initiatives', url:'https://www.lsac.org', icon:'📋' }
  ],
  'cost-chem': [
    { id:'acs', name:'American Chemical Society (ACS)', description:'World\'s largest scientific society — advancing chemistry for life. ACS certification for degrees.', url:'https://www.acs.org', icon:'⚗️' },
    { id:'nob-chem', name:'National Organization for the Professional Advancement of Black Chemists and Chemical Engineers (NOBCChE)', description:'Advancing Black professionals in chemistry and chemical engineering', url:'https://www.nobcche.org', icon:'✊🏿' },
    { id:'aaas-sci', name:'American Association for the Advancement of Science (AAAS)', description:'Advancing science, engineering, and innovation for the benefit of all people', url:'https://www.aaas.org', icon:'🔬' }
  ],
  'cost-chem-bio': [
    { id:'acs', name:'American Chemical Society (ACS)', description:'World\'s largest scientific society — advancing chemistry for life', url:'https://www.acs.org', icon:'⚗️' },
    { id:'asbmb', name:'American Society for Biochemistry and Molecular Biology (ASBMB)', description:'Advancing biochemistry and molecular biology through research and education', url:'https://www.asbmb.org', icon:'🧬' },
    { id:'nob-chem', name:'National Organization for the Professional Advancement of Black Chemists and Chemical Engineers (NOBCChE)', description:'Advancing Black professionals in chemistry and chemical engineering', url:'https://www.nobcche.org', icon:'✊🏿' }
  ],
  'cost-phys': [
    { id:'aps', name:'American Physical Society (APS)', description:'Advancing physics through research, education, and outreach — 55,000 members globally', url:'https://www.aps.org', icon:'⚛️' },
    { id:'nsbp', name:'National Society of Black Physicists (NSBP)', description:'Promoting the professional well-being of Black physicists and physics students', url:'https://www.nsbp.org', icon:'✊🏿' },
    { id:'sps', name:'Society of Physics Students (SPS)', description:'Community for physics students — research, outreach, and professional development', url:'https://www.spsnational.org', icon:'📚' }
  ],
  'cost-phys-eng': [
    { id:'aps', name:'American Physical Society (APS)', description:'Advancing physics through research, education, and outreach', url:'https://www.aps.org', icon:'⚛️' },
    { id:'nsbp', name:'National Society of Black Physicists (NSBP)', description:'Promoting the professional well-being of Black physicists and physics students', url:'https://www.nsbp.org', icon:'✊🏿' },
    { id:'ieee', name:'Institute of Electrical and Electronics Engineers (IEEE)', description:'World\'s largest technical professional organization — advancing technology for humanity', url:'https://www.ieee.org', icon:'⚡' }
  ],
  'cost-phys-bio': [
    { id:'aps', name:'American Physical Society (APS)', description:'Advancing physics through research, education, and outreach', url:'https://www.aps.org', icon:'⚛️' },
    { id:'nsbp', name:'National Society of Black Physicists (NSBP)', description:'Promoting the professional well-being of Black physicists and physics students', url:'https://www.nsbp.org', icon:'✊🏿' },
    { id:'bps', name:'Biophysical Society', description:'Advancing biophysics — molecular, cellular, and systems-level research', url:'https://www.biophysics.org', icon:'🧬' }
  ],
  'cost-math-app': [
    { id:'maa', name:'Mathematical Association of America (MAA)', description:'Advancing the mathematical sciences through teaching, research, and competitions', url:'https://www.maa.org', icon:'➗' },
    { id:'siam', name:'Society for Industrial and Applied Mathematics (SIAM)', description:'Advancing applied mathematics and computational science', url:'https://www.siam.org', icon:'📐' },
    { id:'nam', name:'National Association of Mathematicians (NAM)', description:'Promoting excellence in the mathematical sciences for underrepresented minorities', url:'https://www.nam-math.org', icon:'✊🏿' }
  ],
  'cost-math-ds': [
    { id:'asa-stat', name:'American Statistical Association (ASA)', description:'World\'s largest community of statisticians — education, research, and professional development', url:'https://www.amstat.org', icon:'📊' },
    { id:'siam', name:'Society for Industrial and Applied Mathematics (SIAM)', description:'Advancing applied mathematics and computational science', url:'https://www.siam.org', icon:'📐' },
    { id:'nam', name:'National Association of Mathematicians (NAM)', description:'Promoting excellence in the mathematical sciences for underrepresented minorities', url:'https://www.nam-math.org', icon:'✊🏿' }
  ],
  'cost-math-pure': [
    { id:'ams', name:'American Mathematical Society (AMS)', description:'Advancing mathematical research and scholarship worldwide', url:'https://www.ams.org', icon:'∞' },
    { id:'maa', name:'Mathematical Association of America (MAA)', description:'Advancing the mathematical sciences through teaching, research, and competitions', url:'https://www.maa.org', icon:'➗' },
    { id:'nam', name:'National Association of Mathematicians (NAM)', description:'Promoting excellence in the mathematical sciences for underrepresented minorities', url:'https://www.nam-math.org', icon:'✊🏿' }
  ],
  'cost-it': [
    { id:'comptia', name:'CompTIA (Computing Technology Industry Association)', description:'Leading IT industry trade association — A+, Network+, Security+ certifications', url:'https://www.comptia.org', icon:'🖥️' },
    { id:'acm', name:'Association for Computing Machinery (ACM)', description:'World\'s largest computing society — research, education, and career resources', url:'https://www.acm.org', icon:'💻' },
    { id:'bdpa', name:'Black Data Processing Associates (BDPA)', description:'Advancing minorities in IT — training, scholarships, and career development', url:'https://www.bdpa.org', icon:'✊🏿' }
  ],
  'cost-cm': [
    { id:'aic', name:'American Institute of Constructors (AIC)', description:'Professional association for individual constructors — AC and CPC certifications', url:'https://www.aic-build.org', icon:'🏗️' },
    { id:'agc', name:'Associated General Contractors of America (AGC)', description:'Leading association for the construction industry — advocacy, education, and safety', url:'https://www.agc.org', icon:'🔨' },
    { id:'cmaa', name:'Construction Management Association of America (CMAA)', description:'Advancing the CM profession — certification (CCM), education, and practice standards', url:'https://www.cmaanet.org', icon:'📋' }
  ],
  'cost-aet': [
    { id:'sme', name:'Society of Manufacturing Engineers (SME)', description:'Advancing manufacturing knowledge, technology, and professional development', url:'https://www.sme.org', icon:'🏭' },
    { id:'asq', name:'American Society for Quality (ASQ)', description:'Global community for quality professionals — Six Sigma, CQE, and other certifications', url:'https://asq.org', icon:'✅' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership', url:'https://www.nsbe.org', icon:'✊🏿' }
  ],
  'cost-auto': [
    { id:'sae', name:'SAE International', description:'Advancing mobility engineering — automotive, aerospace, and commercial vehicle standards', url:'https://www.sae.org', icon:'🚗' },
    { id:'ase-cert', name:'National Institute for Automotive Service Excellence (ASE)', description:'Certifying automotive professionals — technicians, service advisors, collision repair', url:'https://www.ase.com', icon:'🔧' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership', url:'https://www.nsbe.org', icon:'✊🏿' }
  ],
  'cost-elec': [
    { id:'ieee', name:'Institute of Electrical and Electronics Engineers (IEEE)', description:'World\'s largest technical professional organization — advancing technology for humanity', url:'https://www.ieee.org', icon:'⚡' },
    { id:'eta-intl', name:'ETA International', description:'Certifying electronics technicians worldwide — 80+ certification programs', url:'https://www.etainternational.org', icon:'📟' },
    { id:'nsbe', name:'National Society of Black Engineers (NSBE)', description:'Increasing the number of Black engineers — career fairs, scholarships, and leadership', url:'https://www.nsbe.org', icon:'✊🏿' }
  ],
  'cost-ehs-mgmt': [
    { id:'assp', name:'American Society of Safety Professionals (ASSP)', description:'Advancing occupational safety and health — CSP certification, education, advocacy', url:'https://www.assp.org', icon:'🦺' },
    { id:'neha', name:'National Environmental Health Association (NEHA)', description:'Advancing environmental health and protection — REHS certification and professional development', url:'https://www.neha.org', icon:'🌍' },
    { id:'aiha', name:'American Industrial Hygiene Association (AIHA)', description:'Protecting worker health through science — CIH certification and occupational exposure standards', url:'https://www.aiha.org', icon:'🔬' }
  ],
  'cost-ehs-sci': [
    { id:'neha', name:'National Environmental Health Association (NEHA)', description:'Advancing environmental health and protection — REHS certification and professional development', url:'https://www.neha.org', icon:'🌍' },
    { id:'assp', name:'American Society of Safety Professionals (ASSP)', description:'Advancing occupational safety and health — CSP certification, education, advocacy', url:'https://www.assp.org', icon:'🦺' },
    { id:'setac', name:'Society of Environmental Toxicology and Chemistry (SETAC)', description:'Environmental science, research, and education for sustainability', url:'https://www.setac.org', icon:'🧪' }
  ],
  'cost-geo': [
    { id:'asprs', name:'American Society for Photogrammetry and Remote Sensing (ASPRS)', description:'Advancing geospatial science — LiDAR, photogrammetry, GIS, and remote sensing', url:'https://www.asprs.org', icon:'🛰️' },
    { id:'nsps', name:'National Society of Professional Surveyors (NSPS)', description:'Advancing the surveying and geospatial profession — licensing, standards, education', url:'https://www.nsps.us.com', icon:'📐' },
    { id:'urisa', name:'Urban and Regional Information Systems Association (URISA)', description:'Advancing the effective use of geospatial information technology in government', url:'https://www.urisa.org', icon:'🗺️' }
  ],
  'cost-atms': [
    { id:'ams-met', name:'American Meteorological Society (AMS)', description:'Advancing atmospheric, oceanic, and related sciences — the Certified Broadcast Meteorologist seal', url:'https://www.ametsoc.org', icon:'🌪️' },
    { id:'nwa', name:'National Weather Association (NWA)', description:'Supporting operational meteorologists — forecasting, research, and professional development', url:'https://www.nwas.org', icon:'⛈️' },
    { id:'agu', name:'American Geophysical Union (AGU)', description:'Advancing Earth and space science — the largest community of geoscientists', url:'https://www.agu.org', icon:'🌍' }
  ],
  'cost-cgt-td': [
    { id:'acm-sig', name:'ACM SIGGRAPH', description:'Special interest group on computer graphics and interactive techniques — conferences, publications', url:'https://www.siggraph.org', icon:'🎮' },
    { id:'aiga', name:'AIGA (American Institute of Graphic Arts)', description:'The professional association for design — events, competitions, and career resources', url:'https://www.aiga.org', icon:'🎨' },
    { id:'autodesk', name:'Autodesk Certified Professional Network', description:'Industry-recognized certifications in AutoCAD, Revit, 3ds Max, and Maya', url:'https://www.autodesk.com/certification', icon:'💻' }
  ],
  'cost-cgt-ux': [
    { id:'uxpa', name:'User Experience Professionals Association (UXPA)', description:'International community for UX professionals — conferences, publications, career resources', url:'https://uxpa.org', icon:'📱' },
    { id:'ixda', name:'Interaction Design Association (IxDA)', description:'Global community for interaction designers — conferences, local groups, awards', url:'https://ixda.org', icon:'🖱️' },
    { id:'aiga', name:'AIGA (American Institute of Graphic Arts)', description:'The professional association for design — events, competitions, and career resources', url:'https://www.aiga.org', icon:'🎨' }
  ],
  'cost-ai': [
    { id:'aaai', name:'Association for the Advancement of Artificial Intelligence (AAAI)', description:'Advancing the scientific understanding and responsible use of AI', url:'https://www.aaai.org', icon:'🤖' },
    { id:'acm', name:'Association for Computing Machinery (ACM)', description:'World\'s largest computing society — research, education, and career resources', url:'https://www.acm.org', icon:'💻' },
    { id:'bdpa', name:'Black Data Processing Associates (BDPA)', description:'Advancing minorities in IT — training, scholarships, and career development', url:'https://www.bdpa.org', icon:'✊🏿' }
  ]
};

/* ═══════════════════════════════════════════════════════
   INJECTION LOGIC
   ═══════════════════════════════════════════════════════ */
let updated = 0, skipped = 0, errors = 0;

const dirs = fs.readdirSync(SEEDS).filter(d =>
  fs.statSync(path.join(SEEDS, d)).isDirectory()
);

for (const dir of dirs) {
  const brandPath = path.join(SEEDS, dir, 'branding.json');
  if (!fs.existsSync(brandPath)) continue;

  try {
    const branding = JSON.parse(fs.readFileSync(brandPath, 'utf8'));

    // Skip if already has orgs
    if (branding.professionalOrgs && branding.professionalOrgs.length > 0) {
      skipped++;
      continue;
    }

    // Find matching org data
    const orgs = ORG_DB[dir];
    if (!orgs) {
      console.log(`  ⚠ No org data for: ${dir}`);
      errors++;
      continue;
    }

    branding.professionalOrgs = orgs;
    fs.writeFileSync(brandPath, JSON.stringify(branding, null, 2) + '\n', 'utf8');
    updated++;
    console.log(`  ✅ ${dir} → ${orgs.length} orgs`);
  } catch (e) {
    console.error(`  ❌ Error: ${dir}: ${e.message}`);
    errors++;
  }
}

console.log(`\n═══ RESULTS ═══`);
console.log(`Updated: ${updated}`);
console.log(`Skipped (already had orgs): ${skipped}`);
console.log(`Errors/Missing: ${errors}`);
console.log(`Total: ${dirs.length}`);
