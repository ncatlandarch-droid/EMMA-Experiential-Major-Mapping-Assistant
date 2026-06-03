#!/usr/bin/env node
/**
 * inject-history.js — Add ncatHistory field to each DB entry in report.js
 * Each history blurb connects the program to NC A&T's legacy.
 */
const fs = require('fs');
const path = require('path');

const HISTORY = {
  'landscape': `Founded in 2015, NC A&T's Landscape Architecture program is the only LAAB-accredited program at an HBCU in the nation. Born from the university's land-grant mission to serve communities, it prepares students to design equitable, sustainable environments. The program continues A&T's 130+ year legacy of empowering African Americans to shape the built world.`,

  'animal': `NC A&T's Animal Science program traces its roots to the university's 1891 founding as a land-grant institution. The program has produced generations of veterinarians, animal nutritionists, and agricultural scientists. A&T's 600-acre University Farm provides hands-on learning that directly connects to the university's agricultural heritage.`,

  'bioe': `NC A&T's Biological Engineering program, housed in the College of Agriculture, combines engineering principles with biological sciences. As a land-grant university, A&T has long emphasized applied science to solve real-world problems — from water quality to sustainable food systems.`,

  'food': `Food and Nutritional Sciences at NC A&T reflects the university's land-grant mission to improve health and nutrition in underserved communities. A&T has been a leader in food science research since the mid-20th century, with faculty advancing food safety, nutrition education, and community health across North Carolina.`,

  'fashion': `Fashion at NC A&T connects to a rich tradition of Black creativity and entrepreneurship. The program combines design, textile science, and business — empowering students to enter an industry where African American designers have historically been underrepresented but increasingly influential.`,

  'child': `Child Development and Family Studies at NC A&T reflects the university's deep commitment to community well-being. Since the mid-20th century, A&T has trained educators and family specialists who strengthen families across North Carolina's African American communities and beyond.`,

  'aged': `Agricultural Education at NC A&T dates to the university's founding. As one of the nation's 1890 land-grant institutions, A&T has been central to training agricultural educators who serve rural and underserved communities throughout the South. The program honors the legacy of Black farmers and agricultural extension workers.`,

  'agbm': `Agribusiness at NC A&T combines the university's agricultural land-grant mission with modern business education. The program addresses a critical need: ensuring African American representation in agricultural business leadership, where Black farmers and entrepreneurs have historically faced barriers to market access and capital.`,

  'envs': `Environmental Science at NC A&T addresses the critical intersection of environmental justice and scientific inquiry. A&T has been a national leader in environmental justice research, recognizing that communities of color disproportionately bear environmental burdens — and training scientists to change that reality.`,

  'acct': `NC A&T's Accounting program, within the Willie A. Deese College of Business and Economics, has produced more African American CPAs than almost any other university in the nation. The college earned AACSB accreditation in 1979, making it one of the first HBCU business schools to achieve this distinction.`,

  'fin': `The Finance program at NC A&T is part of the AACSB-accredited Deese College of Business. A&T has been intentional about building a pipeline of African American finance professionals who are now leading at Goldman Sachs, Bank of America, and other major institutions. The university's proximity to Charlotte — the nation's second-largest banking center — provides unique advantages.`,

  'econ': `Economics at NC A&T has a distinguished history of producing scholars and policy leaders. The program benefits from the Deese College's AACSB accreditation and A&T's commitment to developing economists who bring diverse perspectives to questions of equity, development, and market systems.`,

  'mgmt': `Management at NC A&T builds on the university's long tradition of developing African American business leaders. From the earliest days of the Deese College of Business, A&T has emphasized leadership, entrepreneurship, and strategic thinking — producing executives who lead Fortune 500 companies and thriving small businesses alike.`,

  'bit': `Business Information Technology at NC A&T bridges the gap between business strategy and technological innovation. The program reflects A&T's forward-thinking approach to preparing students for the digital economy, where tech-savvy business leaders are essential.`,

  'mktg': `Marketing at NC A&T prepares students for an industry where diverse perspectives drive innovation. The Deese College has produced marketing leaders who understand multicultural markets and have reshaped how major brands connect with diverse consumers across America.`,

  'scm': `Supply Chain Management at NC A&T addresses one of the fastest-growing fields in business. A&T's program benefits from North Carolina's position as a logistics hub and the university's industry partnerships with companies like FedEx, Procter & Gamble, and the U.S. Department of Defense.`,

  'coe-eng': `NC A&T's College of Engineering is the #1 producer of African American engineers in the nation — a distinction held for over two decades. Founded in 1956, the college has grown into a research powerhouse with ABET-accredited programs across nine disciplines and over $100 million in annual research expenditures.`,

  'cs': `Computer Science at NC A&T produces more African American CS graduates than virtually any other university. The program has deep partnerships with Google, Apple, Microsoft, and other tech giants. A&T's CS graduates are changing the face of Silicon Valley and proving that talent has no racial boundary.`,

  'ise': `Industrial & Systems Engineering at NC A&T trains students to optimize complex systems across manufacturing, healthcare, and logistics. The program reflects A&T's engineering college's reputation as the top producer of Black engineers, with ISE graduates leading operations at companies like Boeing, Amazon, and Toyota.`,

  'nurs': `NC A&T's School of Nursing has been training nurses since 1953, addressing a critical shortage of African American nurses in the healthcare system. Today, A&T nursing graduates serve in hospitals, clinics, and communities across the nation, bringing cultural competency and compassion to patient care.`,

  'slpa': `Speech-Language Pathology at NC A&T addresses a significant diversity gap — only about 4% of ASHA-certified SLPs are Black. A&T's program is actively changing this statistic, producing culturally competent speech-language pathologists who serve diverse communities where bilingual and multicultural expertise is essential.`,

  'comm': `Communication Studies at NC A&T prepares students for careers in an increasingly connected world. The university has a rich tradition of producing powerful communicators — from civil rights leaders who organized the 1960 Greensboro sit-ins to modern media professionals shaping national conversations.`,

  'kin': `Kinesiology at NC A&T combines the university's strong athletics tradition with rigorous health science education. The program produces athletic trainers, exercise physiologists, and health educators who serve communities where health disparities are most acute.`,

  'hsm': `Health Services Management at NC A&T addresses the critical need for diverse healthcare administrators. The program trains leaders who understand the unique challenges facing underserved communities and can manage healthcare systems that deliver equitable care to all populations.`,

  'psych': `Psychology at NC A&T has grown into one of the largest programs in the College of Health and Human Sciences. The program emphasizes cultural competency and addresses the mental health needs of communities where psychological services have been historically underfunded and stigmatized.`,

  'soc': `Sociology at NC A&T examines the social structures that shape communities — from racial inequality to urbanization. The program draws on the university's location in Greensboro, a city central to the Civil Rights Movement, where four A&T freshmen launched the 1960 sit-in movement that changed America.`,

  'sw': `Social Work at NC A&T embodies the university's motto "Mens et Manus" (Mind and Hand) — combining intellectual rigor with hands-on service. The CSWE-accredited program has produced generations of social workers who champion equity and serve North Carolina's most vulnerable populations.`,

  'cj': `Criminal Justice at NC A&T examines the intersection of law enforcement, community safety, and social justice. In a region and nation grappling with policing reform, A&T's program trains professionals who bring both empathy and expertise to the justice system.`,

  'eng': `English at NC A&T carries forward the university's tradition of powerful storytelling and advocacy. From the sit-in movement of 1960 to today, A&T students and alumni have used the written word to challenge injustice, preserve Black history, and create literature that moves the world.`,

  'hist': `History at NC A&T is taught in a living classroom — the university itself is a landmark of American history. Four A&T freshmen launched the Greensboro sit-in movement on February 1, 1960, changing the course of the Civil Rights Movement. History students walk the same campus where American history was made.`,

  'poli': `Political Science at NC A&T has produced elected officials, policy analysts, and civic leaders at every level of government. The program draws inspiration from the university's activist heritage — where students didn't just study political change, they created it.`,

  'jmc': `Journalism and Mass Communication at NC A&T is ACEJMC-accredited and has produced award-winning journalists, broadcasters, and media professionals. The program honors the tradition of the Black press, which has been essential to documenting and advancing African American life and civil rights.`,

  'lib': `Liberal Studies at NC A&T provides a versatile foundation that connects to the university's commitment to producing well-rounded thinkers and leaders. The interdisciplinary approach prepares students for law school, public service, and careers that require critical thinking across multiple domains.`,

  'art': `Visual Arts at NC A&T celebrates the rich tradition of African American artistic expression. The program encompasses studio art, graphic design, and art education — connecting students to a lineage of Black artists who have shaped American visual culture from the Harlem Renaissance to today.`,

  'music': `Music at NC A&T is inseparable from the university's identity — the "Blue and Gold Marching Machine" is one of the most celebrated HBCU bands in the nation. Beyond the field, A&T's music program trains performers, educators, and producers who carry forward the African American musical tradition.`,

  'thtr': `Theatre Arts at NC A&T connects to a vibrant tradition of Black theatre that uses performance to tell stories, challenge assumptions, and build community. The Richard B. Harrison Players, named after the legendary actor who taught at A&T, is one of the oldest African American theatre companies in the country.`,

  'elem': `Elementary Education at NC A&T continues the university's founding mission — A&T was established in 1891 as a school for training teachers. Today, the program produces educators who bring cultural responsiveness and academic rigor to classrooms across North Carolina and beyond.`,

  'edst': `Education Studies at NC A&T builds on 130+ years of teacher preparation excellence. The College of Education has evolved from its origins as a normal school into a modern program that addresses educational equity, technology integration, and family engagement in diverse learning communities.`,

  'aet': `Applied Engineering Technology at NC A&T bridges the gap between engineering theory and manufacturing practice. The program reflects A&T's land-grant mission to provide practical, hands-on education that leads directly to workforce impact — producing technologists who keep America's factories running.`,

  'auto': `Automotive Engineering Technology at NC A&T prepares students for the future of transportation. From internal combustion to electric vehicles, A&T's program combines hands-on shop experience with cutting-edge technology, training the diverse workforce that the automotive industry urgently needs.`,

  'bio': `Biology at NC A&T has produced generations of physicians, researchers, and scientists. The program is a cornerstone of the pre-medical pipeline for African American students, with A&T graduates going on to medical schools, PhD programs, and research institutions across the nation.`,

  'cm': `Construction Management at NC A&T prepares students to build America's infrastructure. The program addresses a critical diversity gap in the construction industry, training project managers and superintendents who bring both technical expertise and fresh perspectives to billion-dollar building projects.`,

  'ehs': `Environmental Health and Safety at NC A&T combines environmental science with occupational health — fields where African Americans have historically been underrepresented. The program trains professionals who protect workers and communities from environmental hazards, advancing environmental justice.`,

  'geo': `Geomatics at NC A&T is one of only a few ABET-accredited geomatics programs at an HBCU. The program trains land surveyors, GIS specialists, and geospatial professionals who map and measure the physical world — essential work for infrastructure development, urban planning, and disaster response.`,

  'chem': `Chemistry at NC A&T has a distinguished research tradition, with faculty and students advancing knowledge in materials science, analytical chemistry, and pharmaceutical research. The program is a key pipeline for African American chemists entering industry and graduate programs.`,

  'elec': `Electronics Technology at NC A&T provides hands-on training in the electronic systems that power modern life. From telecommunications to industrial automation, the program reflects A&T's commitment to producing technologists who are ready for immediate workforce impact.`,

  'it': `Information Technology at NC A&T prepares students for the digital infrastructure that underlies modern business and government. The program benefits from A&T's strong tech industry connections and its reputation as a top producer of African American technology professionals.`,

  'cgt': `Computer Graphics Technology at NC A&T merges creativity with technical skill — training designers, animators, and UX professionals who shape digital experiences. The program reflects the growing demand for diverse perspectives in tech and design industries.`,

  'math': `Mathematics at NC A&T has produced mathematicians, data scientists, and actuaries who excel in quantitative fields. The program honors the legacy of pioneering Black mathematicians and continues to build the pipeline of African American talent in STEM.`,

  'atms': `Atmospheric Sciences at NC A&T is one of the few meteorology programs at an HBCU, addressing a significant diversity gap in the geosciences. A&T graduates are becoming the weather forecasters, climate scientists, and emergency management professionals that communities across America need.`,

  'phys': `Physics at NC A&T produces researchers and professionals in one of science's most fundamental disciplines. The program has contributed to groundbreaking research in materials science, optics, and computational physics, building the pipeline of African American physicists.`,
};

// Read report.js
const reportPath = path.join(__dirname, '..', 'js', 'report.js');
let code = fs.readFileSync(reportPath, 'utf8');

let updated = 0;
let skipped = 0;

for (const [key, history] of Object.entries(HISTORY)) {
  // Find the DB entry and check if it already has ncatHistory
  const entryRegex = new RegExp(`'${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{`);
  const match = code.match(entryRegex);
  if (!match) {
    console.log(`  ⚠ Key not found: ${key}`);
    skipped++;
    continue;
  }

  if (code.includes(`'${key}'`) && code.includes('ncatHistory') && code.indexOf('ncatHistory', code.indexOf(`'${key}'`)) < code.indexOf(`'${key}'`) + 2000) {
    console.log(`  ⏭ Already has ncatHistory: ${key}`);
    skipped++;
    continue;
  }

  // Insert ncatHistory after the overview field
  const overviewPattern = new RegExp(
    `('${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{[^}]*?overview:\\s*'[^']*?'),`
  );
  const overviewMatch = code.match(overviewPattern);
  if (overviewMatch) {
    const escaped = history.replace(/'/g, "\\'").replace(/\n/g, ' ');
    code = code.replace(overviewMatch[0], overviewMatch[1] + `,\n      ncatHistory: '${escaped}',`);
    console.log(`  ✅ ${key}`);
    updated++;
  } else {
    console.log(`  ⚠ Could not find overview for: ${key}`);
    skipped++;
  }
}

fs.writeFileSync(reportPath, code, 'utf8');
console.log(`\n═══ RESULTS ═══`);
console.log(`Updated: ${updated}`);
console.log(`Skipped: ${skipped}`);
console.log(`Total: ${updated + skipped}`);
