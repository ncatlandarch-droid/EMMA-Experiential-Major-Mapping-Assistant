const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.author = 'W. Christopher Harrison';
pptx.company = 'North Carolina Agricultural and Technical State University';
pptx.title = 'EMMA — Student Experiential Journey Mapping';
pptx.subject = 'Journey Mapping Presentation';
pptx.layout = 'LAYOUT_WIDE';

const AGGIE_BLUE = '004684', AGGIE_GOLD = 'FDB927', WHITE = 'FFFFFF', DARK = '0a0e1a';
const LIGHT_BG = 'F0F4F8', DARK_BLUE = '002d56', MID_BLUE = '005a9e';
const GREEN = '059669', PURPLE = '7C3AED';

function addGoldTopBar(s) { s.addShape('rect', { x:0, y:0, w:13.33, h:0.06, fill:{color:AGGIE_GOLD} }); }
function addAngledAccent(s, c=AGGIE_GOLD) { s.addShape('rtTriangle', { x:10.5, y:0, w:2.83, h:7.5, fill:{color:c, transparency:85} }); }
function addBrandFooter(s, dark=false) {
  const bg = dark ? DARK_BLUE : AGGIE_BLUE;
  s.addShape('rect', { x:0, y:6.9, w:13.33, h:0.6, fill:{color:bg} });
  s.addShape('rect', { x:0, y:6.88, w:13.33, h:0.03, fill:{color:AGGIE_GOLD} });
  s.addText('NORTH CAROLINA AGRICULTURAL AND TECHNICAL STATE UNIVERSITY', { x:0.5, y:6.95, w:8, h:0.4, fontSize:7.5, color:AGGIE_GOLD, fontFace:'Calibri', align:'left', letterSpacing:3, bold:true });
  s.addText('AGGIES DO.', { x:10.5, y:6.95, w:2.5, h:0.4, fontSize:9, color:AGGIE_GOLD, fontFace:'Calibri', align:'right', bold:true, letterSpacing:2 });
}
function addBlueLeftBar(s) { s.addShape('rect', { x:0, y:0, w:0.15, h:7.5, fill:{color:AGGIE_BLUE} }); }
function sectionLabel(s, t) {
  s.addText(t, { x:0.6, y:0.3, w:10, h:0.35, fontSize:10, fontFace:'Calibri', color:AGGIE_GOLD, bold:true, letterSpacing:5 });
  s.addShape('rect', { x:0.6, y:0.72, w:2.5, h:0.03, fill:{color:AGGIE_GOLD} });
}

// ═══ SLIDE 1 — TITLE ═══
let slide = pptx.addSlide();
slide.background = { fill: AGGIE_BLUE };
addGoldTopBar(slide); addAngledAccent(slide);
slide.addText('NORTH CAROLINA A&T STATE UNIVERSITY', { x:0.8, y:0.5, w:10, h:0.4, fontSize:10, fontFace:'Calibri', color:AGGIE_GOLD, bold:true, letterSpacing:4 });
slide.addText('COLLEGE OF AGRICULTURE & ENVIRONMENTAL SCIENCES', { x:0.8, y:0.88, w:10, h:0.3, fontSize:8, fontFace:'Calibri', color:WHITE, letterSpacing:3, transparency:25 });
slide.addShape('rect', { x:0.8, y:1.35, w:3.5, h:0.04, fill:{color:AGGIE_GOLD} });
slide.addText('EMMA', { x:0.8, y:1.6, w:9, h:1.2, fontSize:64, fontFace:'Calibri', color:WHITE, bold:true });
slide.addText('Student Experiential\nJourney Mapping', { x:0.8, y:2.7, w:9, h:1.4, fontSize:34, fontFace:'Calibri Light', color:WHITE, lineSpacingMultiple:1.1 });
slide.addText('Experiential Major Mapping Assistant', { x:0.8, y:4.1, w:9, h:0.5, fontSize:17, fontFace:'Calibri', color:AGGIE_GOLD, italic:true });
slide.addShape('rect', { x:0.8, y:4.85, w:2.5, h:0.03, fill:{color:AGGIE_GOLD} });
slide.addText('W. Christopher Harrison, MLA\nAssistant Professor\nDepartment of Natural Resources & Environmental Design', { x:0.8, y:5.1, w:8, h:1.0, fontSize:11, fontFace:'Calibri', color:WHITE, lineSpacingMultiple:1.4, transparency:10 });
slide.addText('thinkemma.app', { x:0.8, y:6.2, w:3, h:0.4, fontSize:15, fontFace:'Calibri', color:AGGIE_GOLD, bold:true });
slide.addShape('rect', { x:0, y:6.9, w:13.33, h:0.6, fill:{color:DARK_BLUE} });
slide.addShape('rect', { x:0, y:6.88, w:13.33, h:0.03, fill:{color:AGGIE_GOLD} });
slide.addText('Student Experiential Journey Mapping Project  •  May 2026', { x:0.5, y:6.95, w:12, h:0.4, fontSize:8, color:AGGIE_GOLD, fontFace:'Calibri', align:'center', letterSpacing:2 });

// ═══ SLIDE 2 — THE CHALLENGE ═══
slide = pptx.addSlide();
slide.background = { fill: DARK };
addGoldTopBar(slide); addBrandFooter(slide, true); addAngledAccent(slide, AGGIE_BLUE);
sectionLabel(slide, 'THE CHALLENGE');
slide.addText('Siloed Data.\nFragmented Tracking.\nNo Unified View.', { x:0.8, y:1.0, w:10, h:2.0, fontSize:36, fontFace:'Calibri Light', color:WHITE, bold:true, lineSpacingMultiple:1.15 });
slide.addShape('rect', { x:0.8, y:3.15, w:3, h:0.03, fill:{color:AGGIE_GOLD} });
const lp = [
  { icon:'📄', title:'Static Journey Maps', desc:'Printed PDFs with no interactivity,\nno progress tracking, no updates' },
  { icon:'🔒', title:'Siloed Systems', desc:'Advising notes in one place, transcripts\nin another, experiences untracked' },
  { icon:'👤', title:'Every Advisor Is Different', desc:'No consistent way to track or\ncredential experiential completion' },
];
const rp = [
  { icon:'📊', title:'No Engagement Data', desc:"Faculty can't see which students are\ngaining experiences — or missing them" },
  { icon:'🔗', title:'No Career Connection', desc:"Students don't see how experiences\nconnect to career outcomes" },
  { icon:'🏫', title:'College-by-College', desc:'Each of 9 colleges maps it differently —\nno scalable platform exists' },
];
lp.forEach((p,i) => { const y=3.4+(i*1.05); slide.addShape('rect',{x:0.6,y,w:5.6,h:0.9,fill:{color:DARK_BLUE},rectRadius:0.08}); slide.addText(`${p.icon}  ${p.title}`,{x:0.8,y:y+0.08,w:5,h:0.32,fontSize:13,fontFace:'Calibri',color:AGGIE_GOLD,bold:true}); slide.addText(p.desc,{x:0.8,y:y+0.42,w:5,h:0.42,fontSize:10,fontFace:'Calibri',color:WHITE,transparency:15,lineSpacingMultiple:1.2}); });
rp.forEach((p,i) => { const y=3.4+(i*1.05); slide.addShape('rect',{x:6.5,y,w:5.6,h:0.9,fill:{color:DARK_BLUE},rectRadius:0.08}); slide.addText(`${p.icon}  ${p.title}`,{x:6.7,y:y+0.08,w:5,h:0.32,fontSize:13,fontFace:'Calibri',color:AGGIE_GOLD,bold:true}); slide.addText(p.desc,{x:6.7,y:y+0.42,w:5,h:0.42,fontSize:10,fontFace:'Calibri',color:WHITE,transparency:15,lineSpacingMultiple:1.2}); });

// ═══ SLIDE 3 — EMMA HOW IT WORKS ═══
slide = pptx.addSlide();
slide.background = { fill: WHITE };
addGoldTopBar(slide); addBrandFooter(slide); addBlueLeftBar(slide);
sectionLabel(slide, 'EMMA CAPABILITY');
slide.addText('Interactive Journey Mapping — Built for NC A&T', { x:0.6, y:0.9, w:11, h:0.5, fontSize:24, fontFace:'Calibri', color:AGGIE_BLUE, bold:true });
slide.addShape('rect', { x:0.6, y:1.5, w:11, h:0.02, fill:{color:AGGIE_GOLD} });
slide.addShape('rect', { x:0.6, y:1.7, w:5.8, h:4.7, fill:{color:LIGHT_BG}, rectRadius:0.1 });
slide.addText('INTERACTIVE FEATURES', { x:0.8, y:1.85, w:5.4, h:0.35, fontSize:10, fontFace:'Calibri', color:AGGIE_BLUE, bold:true, letterSpacing:3 });
slide.addShape('rect', { x:0.8, y:2.25, w:2, h:0.02, fill:{color:AGGIE_GOLD} });
const features = [
  { icon:'🗺️', title:'Dynamic Milestone Tracking', desc:'4-year journey organized by phase:\nExplore → Engage → Develop → Launch' },
  { icon:'🎓', title:'Major-Specific Guidance', desc:'16 CAES programs loaded with real\ncurriculum data, BLS codes, and career paths' },
  { icon:'📊', title:'Visualized Progress', desc:'Animated progress bars, stat blocks,\nand category-based completion tracking' },
  { icon:'🎤', title:'AI Voice Coaching', desc:'Gemini Neural TTS avatar speaks,\ncelebrates, and guides students' },
  { icon:'💰', title:'Live Career Data', desc:'Bureau of Labor Statistics API\nauto-populates salary & job outlook' },
];
features.forEach((f,i) => { const y=2.45+(i*0.75); slide.addText(`${f.icon}  ${f.title}`,{x:0.9,y,w:5.2,h:0.28,fontSize:12,fontFace:'Calibri',color:AGGIE_BLUE,bold:true}); slide.addText(f.desc,{x:1.3,y:y+0.28,w:4.8,h:0.4,fontSize:9.5,fontFace:'Calibri',color:'555770',lineSpacingMultiple:1.2}); });
slide.addShape('rect', { x:6.7, y:1.7, w:5.5, h:4.7, fill:{color:AGGIE_BLUE}, rectRadius:0.1 });
slide.addText('WHAT STUDENTS SEE', { x:6.9, y:1.85, w:5, h:0.35, fontSize:10, fontFace:'Calibri', color:AGGIE_GOLD, bold:true, letterSpacing:3 });
slide.addShape('rect', { x:6.9, y:2.25, w:2, h:0.02, fill:{color:AGGIE_GOLD} });
const sv = ['Select their college & program','See their personalized 4-year map','Check milestones as completed','Progress bar animates in real time','Emma avatar speaks encouragement','Career strip shows salary & growth','Export PDF for advising/employers'];
sv.forEach((s,i) => { const y=2.5+(i*0.52); const n='①②③④⑤⑥⑦'[i]; slide.addShape('rect',{x:6.9,y,w:5,h:0.42,fill:{color:MID_BLUE},rectRadius:0.05}); slide.addText(`${n}  ${s}`,{x:7.1,y,w:4.6,h:0.42,fontSize:12,fontFace:'Calibri',color:WHITE,valign:'middle'}); });
slide.addShape('rect', { x:6.9, y:6.1, w:5, h:0.45, fill:{color:AGGIE_GOLD}, rectRadius:0.05 });
slide.addText('16 CAES programs loaded  •  thinkemma.app', { x:6.9, y:6.1, w:5, h:0.45, fontSize:11, fontFace:'Calibri', color:AGGIE_BLUE, bold:true, align:'center', valign:'middle' });

// ═══ SLIDE 4 — DATA TABLE ═══
slide = pptx.addSlide();
slide.background = { fill: WHITE };
addGoldTopBar(slide); addBrandFooter(slide); addBlueLeftBar(slide);
sectionLabel(slide, 'DATA ARCHITECTURE');
slide.addText('What EMMA Tracks — Real Data, Real Sources', { x:0.6, y:0.9, w:11, h:0.5, fontSize:24, fontFace:'Calibri', color:AGGIE_BLUE, bold:true });
slide.addShape('rect', { x:0.6, y:1.5, w:11, h:0.02, fill:{color:AGGIE_GOLD} });
slide.addShape('rect', { x:0.6, y:1.7, w:11.5, h:0.45, fill:{color:AGGIE_BLUE}, rectRadius:0.03 });
slide.addText('Data Metric', { x:0.8, y:1.7, w:3.5, h:0.45, fontSize:11, fontFace:'Calibri', color:AGGIE_GOLD, bold:true, valign:'middle' });
slide.addText('What EMMA Stores', { x:4.3, y:1.7, w:4.5, h:0.45, fontSize:11, fontFace:'Calibri', color:AGGIE_GOLD, bold:true, valign:'middle' });
slide.addText('Source System', { x:8.8, y:1.7, w:3.2, h:0.45, fontSize:11, fontFace:'Calibri', color:AGGIE_GOLD, bold:true, valign:'middle' });
const rows = [
  ['📋  Course Milestones','24 courses per program with credits, semester,\ninstructor, LAAB standards, learning objectives','Curriculum data files\n(faculty-verified JSON)'],
  ['📊  Career Outlook','BLS code, median salary, growth rate,\ntop employers, certifications, key skills','Bureau of Labor Statistics\nAPI (live fetch)'],
  ['🎯  Experiential Categories','4 categories: Purpose, Communities,\nLocal & Global, Professional Identity','University experiential\nlearning framework'],
  ['📈  Student Progress','Per-milestone check-off, completion %,\ncategory breakdown, timestamps','Student interaction\n(Firestore + localStorage)'],
  ['🏛️  Accreditation Mapping','LAAB standards (LA), ABET (Engineering),\nACEND (Nutrition), DPI (Teaching)','Accreditation body\npublished standards'],
  ['🌱  Field Opportunities','SFRIC projects, student roles, applicable\ncourses, site locations, AVA 3D links','SFRIC project database\n(faculty-curated)'],
  ['👤  Advising Notes','PDF export with branding, progress summary,\nmilestone audit trail for review','Generated on-demand\nfrom student data'],
  ['🎤  AI Coaching Context','Progress state, year, completion %, category\ngaps → personalized voice guidance','Gemini API +\npre-recorded WAVs'],
];
rows.forEach((r,i) => { const y=2.2+(i*0.53); const bg=i%2===0?LIGHT_BG:WHITE; slide.addShape('rect',{x:0.6,y,w:11.5,h:0.5,fill:{color:bg}}); slide.addText(r[0],{x:0.8,y,w:3.5,h:0.5,fontSize:10,fontFace:'Calibri',color:AGGIE_BLUE,bold:true,valign:'middle'}); slide.addText(r[1],{x:4.3,y,w:4.5,h:0.5,fontSize:8.5,fontFace:'Calibri',color:'1a1a2e',valign:'middle',lineSpacingMultiple:1.1}); slide.addText(r[2],{x:8.8,y,w:3.2,h:0.5,fontSize:8.5,fontFace:'Calibri',color:'555770',valign:'middle',italic:true,lineSpacingMultiple:1.1}); });
slide.addShape('rect', { x:0.6, y:6.55, w:11.5, h:0.25, fill:{color:AGGIE_BLUE}, rectRadius:0.03 });
slide.addText('🔒  FERPA Compliant: No PII stored in seed data. Student progress stored in authenticated Firestore (Google SSO) with localStorage fallback.', { x:0.8, y:6.55, w:11, h:0.25, fontSize:7.5, fontFace:'Calibri', color:WHITE, valign:'middle' });

// ═══ SLIDE 5 — ECOSYSTEM ═══
slide = pptx.addSlide();
slide.background = { fill: AGGIE_BLUE };
addGoldTopBar(slide); addAngledAccent(slide, DARK_BLUE);
sectionLabel(slide, 'THE ECOSYSTEM');
slide.addText('EMMA Syncs Into a Unified View', { x:0.6, y:0.9, w:8, h:0.6, fontSize:28, fontFace:'Calibri', color:WHITE, bold:true });
slide.addText('Four connected platforms scaffold the full arc of professional formation', { x:0.6, y:1.5, w:9, h:0.35, fontSize:12, fontFace:'Calibri', color:WHITE, italic:true, transparency:20 });
slide.addShape('rect', { x:0.6, y:1.95, w:3, h:0.03, fill:{color:AGGIE_GOLD} });
const eco = [
  { name:'EMMA', emoji:'🎯', sub:'Experiential Major Mapping Assistant', desc:'Interactive journey mapping with AI voice coaching,\nlive career data, and milestone tracking', url:'thinkemma.app', color:AGGIE_GOLD, tc:AGGIE_BLUE },
  { name:'AVA', emoji:'🌍', sub:'Adaptive Visualization Assistant', desc:'CesiumJS 3D digital twin + SITES v2 sustainability\nscoring (250 pts, 10 sections)', url:'ava3-digital-twin.netlify.app', color:MID_BLUE, tc:WHITE },
  { name:'GRANT', emoji:'💰', sub:'Grant Research & Award Navigation', desc:'AI-guided funding pipeline — NOI wizard,\nproposal drafting, award tracking', url:'thinkgranted.app', color:MID_BLUE, tc:WHITE },
  { name:'ISLA', emoji:'📚', sub:'Interactive Study & Licensure Assistant', desc:'Adaptive exam prep with SM-2 spaced\nrepetition + Coach Perry AI', url:'larelab.app', color:MID_BLUE, tc:WHITE },
];
eco.forEach((a,i) => { const y=2.2+(i*1.08); slide.addShape('rect',{x:0.6,y,w:7.0,h:0.95,fill:{color:a.color},rectRadius:0.08}); slide.addText(`${a.emoji}  ${a.name}`,{x:0.8,y:y+0.05,w:2.5,h:0.35,fontSize:18,fontFace:'Calibri',color:a.tc,bold:true}); slide.addText(a.sub,{x:3.2,y:y+0.05,w:4.2,h:0.35,fontSize:9,fontFace:'Calibri',color:a.tc,italic:true,valign:'middle',transparency:20}); slide.addText(a.desc,{x:0.8,y:y+0.42,w:5,h:0.45,fontSize:9,fontFace:'Calibri',color:a.tc,transparency:10,lineSpacingMultiple:1.15}); slide.addText(a.url,{x:5.5,y:y+0.55,w:2,h:0.3,fontSize:9,fontFace:'Calibri',color:a.tc,bold:true,align:'right'}); });
slide.addShape('rect', { x:8.0, y:2.2, w:4.5, h:4.1, fill:{color:DARK_BLUE}, rectRadius:0.1 });
slide.addText('HOW THEY CONNECT', { x:8.2, y:2.35, w:4, h:0.3, fontSize:9, fontFace:'Calibri', color:AGGIE_GOLD, bold:true, letterSpacing:3 });
slide.addShape('rect', { x:8.2, y:2.7, w:2, h:0.02, fill:{color:AGGIE_GOLD} });
const conn = ['🎯 EMMA tracks milestones →\n     feeds exam readiness to ISLA','🌍 AVA site assessments →\n     become EMMA field milestones','💰 GRANT funds projects →\n     create new SFRIC field placements','📚 ISLA mastery data →\n     validates EMMA professional domain','🔄 All platforms share →\n     Firebase Auth + Firestore'];
conn.forEach((c,i) => { slide.addText(c,{x:8.3,y:2.9+(i*0.65),w:4,h:0.55,fontSize:9.5,fontFace:'Calibri',color:WHITE,lineSpacingMultiple:1.2}); });
slide.addShape('rect', { x:0, y:6.9, w:13.33, h:0.6, fill:{color:DARK_BLUE} });
slide.addShape('rect', { x:0, y:6.88, w:13.33, h:0.03, fill:{color:AGGIE_GOLD} });
slide.addText('"Isolated tools inform. Connected platforms transform."', { x:0.5, y:6.95, w:12, h:0.4, fontSize:9, color:AGGIE_GOLD, fontFace:'Calibri', align:'center', italic:true, letterSpacing:1 });

// ═══ SLIDE 6 — CANVAS INTEGRATION ═══
slide = pptx.addSlide();
slide.background = { fill: WHITE };
addGoldTopBar(slide); addBrandFooter(slide); addBlueLeftBar(slide);
sectionLabel(slide, 'CANVAS LMS INTEGRATION');
slide.addText('Ready When You Are', { x:0.6, y:0.9, w:11, h:0.5, fontSize:28, fontFace:'Calibri', color:AGGIE_BLUE, bold:true });
slide.addShape('rect', { x:0.6, y:1.5, w:11, h:0.02, fill:{color:AGGIE_GOLD} });
const levels = [
  { level:'Level 1', title:'Embedded Link', time:'1 week', desc:'EMMA opens inside Canvas as a module link.\nNo coding changes needed — just an admin-approved URL.\nCAN BE DEPLOYED IMMEDIATELY.', color:'22C55E' },
  { level:'Level 2', title:'LTI 1.3 Basic', time:'2–3 weeks', desc:'Full SSO with NC A&T identity.\nAuto-detects program from course context.\nProgress persists server-side.', color:AGGIE_BLUE },
  { level:'Level 3', title:'LTI 1.3 + Grade Passback', time:'4–6 weeks', desc:'Milestone completions push to Canvas gradebook.\nFaculty see experiential progress alongside course grades.', color:MID_BLUE },
  { level:'Level 4', title:'Deep Integration', time:'8–12 weeks', desc:'Deep linking, roster sync, advisor analytics.\nCross-course milestone tracking.', color:PURPLE },
];
levels.forEach((l,i) => { const y=1.75+(i*1.2); slide.addShape('rect',{x:0.6,y,w:11.5,h:1.05,fill:{color:LIGHT_BG},rectRadius:0.08}); slide.addShape('rect',{x:0.6,y,w:0.12,h:1.05,fill:{color:l.color},rectRadius:0.03}); slide.addText(l.level,{x:0.9,y:y+0.05,w:1.5,h:0.3,fontSize:9,fontFace:'Calibri',color:l.color,bold:true,letterSpacing:2}); slide.addText(l.title,{x:0.9,y:y+0.3,w:3,h:0.35,fontSize:16,fontFace:'Calibri',color:AGGIE_BLUE,bold:true}); slide.addText(l.time,{x:0.9,y:y+0.65,w:2,h:0.25,fontSize:10,fontFace:'Calibri',color:'555770',italic:true}); slide.addText(l.desc,{x:4.5,y:y+0.05,w:7.2,h:0.95,fontSize:10,fontFace:'Calibri',color:'1a1a2e',lineSpacingMultiple:1.3,valign:'middle'}); });
slide.addShape('rect', { x:0.6, y:6.55, w:11.5, h:0.25, fill:{color:AGGIE_BLUE}, rectRadius:0.03 });
slide.addText('🔒  FERPA Compliant  •  No PII in seed data  •  Firestore + Google SSO  •  We need: Canvas LTI Developer Key from NC A&T IT', { x:0.8, y:6.55, w:11, h:0.25, fontSize:7.5, fontFace:'Calibri', color:WHITE, valign:'middle' });

// ═══ SLIDE 7 — FEEDBACK ASK ═══
slide = pptx.addSlide();
slide.background = { fill: WHITE };
addGoldTopBar(slide); addBrandFooter(slide); addBlueLeftBar(slide);
sectionLabel(slide, 'COLLABORATIVE DESIGN PHASE');
slide.addText('We Built This for You.\nNow We Need Your Input.', { x:0.6, y:0.9, w:11, h:1.0, fontSize:28, fontFace:'Calibri', color:AGGIE_BLUE, bold:true, lineSpacingMultiple:1.15 });
slide.addShape('rect', { x:0.6, y:2.0, w:11, h:0.02, fill:{color:AGGIE_GOLD} });
const fb = [
  { title:'🔧  Workflow Fit', color:'2563EB', q:['Does the 4-category framework\n(Purpose, Communities, Local & Global,\nIdentity) align with your program?','What milestones matter most\nfor YOUR students?','How do you currently track\nexperiential engagement?'] },
  { title:'👤  Usability', color:GREEN, q:['Would students actually use this\nvoluntarily — or need it assigned?','Should AI coaching be opt-in\nor always-on?','Is the PDF export useful for\nyour advising process?'] },
  { title:'🎯  Strategic Impact', color:PURPLE, q:['How does this support your\naccreditation self-study?','Would Canvas LTI integration\nchange your adoption calculus?','Could this help with retention\nand student success metrics?'] },
];
fb.forEach((area,i) => { const x=0.6+(i*4.1); slide.addShape('rect',{x,y:2.3,w:3.9,h:0.5,fill:{color:area.color},rectRadius:0.06}); slide.addText(area.title,{x,y:2.3,w:3.9,h:0.5,fontSize:13,fontFace:'Calibri',color:WHITE,bold:true,align:'center',valign:'middle'}); area.q.forEach((q,j) => { const y=2.95+(j*1.15); slide.addShape('rect',{x,y,w:3.9,h:1.0,fill:{color:LIGHT_BG},rectRadius:0.06}); slide.addText(q,{x:x+0.15,y:y+0.08,w:3.6,h:0.85,fontSize:10.5,fontFace:'Calibri',color:'1a1a2e',lineSpacingMultiple:1.25,valign:'middle'}); }); });
slide.addShape('rect', { x:1.5, y:6.25, w:9, h:0.45, fill:{color:AGGIE_GOLD}, rectRadius:0.05 });
slide.addText("Your journey maps + EMMA's platform = a system that works for every college.", { x:1.5, y:6.25, w:9, h:0.45, fontSize:12, fontFace:'Calibri', color:AGGIE_BLUE, bold:true, align:'center', valign:'middle' });

// ═══ SLIDE 8 — Q&A ═══
slide = pptx.addSlide();
slide.background = { fill: AGGIE_BLUE };
addGoldTopBar(slide); addAngledAccent(slide);
slide.addText('Questions?', { x:0, y:1.5, w:13.33, h:1.5, fontSize:64, fontFace:'Calibri Light', color:WHITE, bold:true, align:'center', valign:'middle' });
slide.addShape('rect', { x:4.5, y:3.2, w:4.33, h:0.04, fill:{color:AGGIE_GOLD} });
slide.addText("Let's discuss how EMMA can support\nyour students and your programs.", { x:2, y:3.6, w:9.33, h:1.0, fontSize:18, fontFace:'Calibri', color:WHITE, align:'center', transparency:10, lineSpacingMultiple:1.4 });
const qLinks = [{n:'EMMA',u:'thinkemma.app'},{n:'AVA',u:'ava3-digital-twin.netlify.app'},{n:'GRANT',u:'thinkgranted.app'},{n:'ISLA',u:'larelab.app'}];
qLinks.forEach((l,i) => { const x=2.0+(i*2.5); slide.addShape('rect',{x,y:5.0,w:2.2,h:0.75,fill:{color:MID_BLUE},rectRadius:0.08}); slide.addText(l.n,{x,y:5.0,w:2.2,h:0.38,fontSize:16,fontFace:'Calibri',color:AGGIE_GOLD,bold:true,align:'center',valign:'bottom'}); slide.addText(l.u,{x,y:5.38,w:2.2,h:0.32,fontSize:8,fontFace:'Calibri',color:WHITE,align:'center',valign:'top',transparency:20}); });
slide.addShape('rect', { x:0, y:6.9, w:13.33, h:0.6, fill:{color:DARK_BLUE} });
slide.addShape('rect', { x:0, y:6.88, w:13.33, h:0.03, fill:{color:AGGIE_GOLD} });
slide.addText('W. Christopher Harrison  •  wcharris@ncat.edu  •  Natural Resources & Environmental Design  •  CAES', { x:0.5, y:6.93, w:10, h:0.5, fontSize:8, fontFace:'Calibri', color:AGGIE_GOLD, align:'center', letterSpacing:1 });
slide.addText('© 2026 Think! Design and Planning, LLC', { x:10.5, y:6.93, w:2.5, h:0.5, fontSize:6.5, fontFace:'Calibri', color:AGGIE_GOLD, align:'right', transparency:30 });

// ═══ SAVE ═══
const outPath = path.join('C:\\Users\\Chris\\Downloads', 'EMMA_Journey_Mapping_Presentation.pptx');
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log('✅ Saved to: ' + outPath);
}).catch(err => {
  console.error('❌ Error:', err);
});
