/**
 * EMMA C2C â€” Export Engine
 * Generates PDF and JSON progress reports for advisor review.
 */

const EMMA_EXPORT = (() => {
  /**
   * Export progress as a downloadable JSON file.
   */
  function exportJSON() {
    const snapshot = EMMA_STATE.getSnapshot();
    const branding = EMMA_STATE.get('branding');
    const timeline = EMMA_STATE.get('timeline');
    const matrix = EMMA_STATE.get('matrix');

    const exportData = {
      meta: {
        exported: new Date().toISOString(),
        platform: 'EMMA â€” Experiential Major Mapping Assistant',
        version: '1.0.0',
        institution: branding?.institutionName,
        program: branding?.programName,
        degreeType: branding?.degreeType
      },
      progress: snapshot,
      phaseBreakdown: timeline?.phases.map(phase => {
        const prog = EMMA_STATE.getPhaseProgress(phase.id);
        return {
          phase: phase.name,
          subtitle: phase.subtitle,
          progress: `${prog.checked}/${prog.total} (${prog.percent}%)`,
          milestones: phase.milestones.map(m => ({
            id: m.id,
            label: m.label,
            courseRef: m.courseRef,
            category: m.category,
            checked: snapshot.checkedMilestones[m.id] || false
          }))
        };
      }),
      validationSummary: matrix?.validationTracks.map(track => ({
        track: track.name,
        sections: track.sections.map(section => {
          const prog = EMMA_STATE.getValidationProgress(section);
          return {
            name: section.name,
            progress: `${prog.completed}/${prog.required} (${prog.percent}%)`,
            isVerified: prog.isVerified
          };
        })
      }))
    };

    downloadFile(
      JSON.stringify(exportData, null, 2),
      `emma-progress-${snapshot.program}-${dateStamp()}.json`,
      'application/json'
    );

    if (typeof EMMA_MATRIX !== 'undefined') {
      EMMA_MATRIX.showToast('ðŸ’¾ Progress exported as JSON', 'success');
    }
  }

  /**
   * Export progress as a formatted PDF using the browser print API.
   * Creates a clean print-friendly view.
   */
  function exportPDF() {
    const branding = EMMA_STATE.get('branding');
    const timeline = EMMA_STATE.get('timeline');
    const matrix = EMMA_STATE.get('matrix');
    const snapshot = EMMA_STATE.getSnapshot();

    if (!branding || !timeline) {
      alert('No program loaded. Please select a program first.');
      return;
    }

    // Prompt for student info
    const studentName = prompt('Student Name (for report header):', '') || 'Student';
    const bannerNum = prompt('Banner ID # (e.g., 900XXXXXX):', '') || 'â€”';

    // Get email from Firebase user if available
    const user = EMMA_STATE.get('user');
    const email = user?.email || localStorage.getItem('emma_student_email') || '';

    // Build print HTML
    const printHTML = buildPrintDocument(branding, timeline, matrix, snapshot, {
      studentName,
      bannerNum,
      email
    });

    // Open print window
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Trigger print after content loads
    printWindow.addEventListener('load', () => {
      setTimeout(() => printWindow.print(), 300);
    });

    if (typeof EMMA_MATRIX !== 'undefined') {
      EMMA_MATRIX.showToast('ðŸ“„ Print/PDF view opened', 'success');
    }
  }

  /**
   * Build a clean print-friendly HTML document with A&T branding.
   */
  function buildPrintDocument(branding, timeline, matrix, snapshot, studentInfo = {}) {
    const primaryColor = branding.brandingColors.primaryHex;
    const secondaryColor = branding.brandingColors.secondaryHex;
    const overallProgress = snapshot.overallProgress;
    const logoUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/') + 'assets/images/ncat-logo-white.png';
    const printDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const printTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });

    let phasesHTML = '';
    timeline.phases.forEach(phase => {
      const prog = EMMA_STATE.getPhaseProgress(phase.id);
      phasesHTML += `
        <div class="phase-section">
          <h3 style="color:${primaryColor}; border-bottom:2px solid ${secondaryColor}; padding-bottom:4px; margin-bottom:8px;">
            ${phase.name} â€” ${phase.subtitle} (${prog.percent}%)
          </h3>
          <table>
            <thead><tr><th>Status</th><th>Milestone</th><th>Course</th><th>Category</th></tr></thead>
            <tbody>
              ${phase.milestones.map(m => `
                <tr>
                  <td style="text-align:center; font-size:18px;">${snapshot.checkedMilestones[m.id] ? 'âœ…' : 'â¬œ'}</td>
                  <td>${m.label}</td>
                  <td style="color:#666;">${m.courseRef || 'â€”'}</td>
                  <td><span style="padding:2px 6px; border-radius:4px; font-size:11px; background:${getCategoryBg(m.category)}; color:${getCategoryColor(m.category)};">${m.category}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    });

    let validationHTML = '';
    if (matrix?.validationTracks) {
      matrix.validationTracks.forEach(track => {
        validationHTML += `<h3 style="color:${primaryColor}; margin-top:20px;">${track.name}</h3>`;
        track.sections.forEach(section => {
          const prog = EMMA_STATE.getValidationProgress(section);
          validationHTML += `
            <div style="margin-bottom:8px; padding:8px; background:#f5f5f5; border-radius:6px;">
              <strong>${section.name}</strong>
              <span style="float:right; font-weight:bold; color:${prog.isVerified ? '#059669' : primaryColor};">
                ${prog.isVerified ? 'âœ… Verified' : `${prog.completed}/${prog.required}`}
              </span>
            </div>
          `;
        });
      });
    }

    // Career outlook section
    const career = branding.careerOutlook || {};
    const careerHTML = career.field ? `
      <div style="background:#f0f4f8; border:1px solid #d0d8e0; border-radius:8px; padding:16px; margin:20px 0;">
        <h3 style="color:${primaryColor}; margin:0 0 8px 0;">Career Outlook â€” ${career.field}</h3>
        <div style="display:flex; gap:24px; flex-wrap:wrap;">
          ${career.medianSalary ? `<div><strong>Median Salary:</strong> ${career.medianSalary}</div>` : ''}
          ${career.growthRate ? `<div><strong>Job Growth:</strong> ${career.growthRate}</div>` : ''}
          ${career.totalJobs ? `<div><strong>U.S. Jobs:</strong> ${career.totalJobs}</div>` : ''}
        </div>
      </div>
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EMMA Progress Report â€” ${branding.programName}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 0; color: #1a1a2e; max-width: 900px; margin: 0 auto; }

    .report-header {
      background: ${primaryColor};
      color: white;
      padding: 24px 32px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .report-header img { height: 60px; }
    .report-header-text h1 { margin: 0; font-size: 20px; font-weight: 700; }
    .report-header-text p { margin: 4px 0 0; font-size: 12px; opacity: 0.85; }

    .student-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 24px;
      padding: 16px 32px;
      background: #f8f9fa;
      border-bottom: 2px solid ${secondaryColor};
      font-size: 13px;
    }
    .student-info .label { color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .student-info .value { font-weight: 600; color: #1a1a2e; }

    .report-body { padding: 24px 32px; }
    h2 { color: ${primaryColor}; font-size: 18px; margin-top: 24px; }
    .subtitle { color: #666; font-size: 14px; }
    .progress-bar { height: 14px; background: #eee; border-radius: 7px; margin: 16px 0; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, ${primaryColor}, ${secondaryColor}); border-radius: 7px; }
    .progress-label { text-align: center; font-weight: 700; font-size: 20px; color: ${primaryColor}; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th, td { padding: 6px 10px; text-align: left; border-bottom: 1px solid #eee; font-size: 13px; }
    th { background: ${primaryColor}10; font-weight: 600; }
    .phase-section { margin-bottom: 24px; page-break-inside: avoid; }

    .report-footer {
      margin-top: 40px;
      padding: 16px 32px;
      border-top: 2px solid ${primaryColor};
      font-size: 10px;
      color: #999;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body { padding: 0; }
      .no-print { display: none; }
      .report-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .student-info { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <!-- Official NC A&T Header -->
  <div class="report-header">
    <img src="${logoUrl}" alt="NC A&T Logo" onerror="this.style.display='none'">
    <div class="report-header-text">
      <h1>EMMA Progress Report</h1>
      <p>Experiential Major Mapping Assistant Â· North Carolina A&T State University</p>
    </div>
  </div>

  <!-- Student Information Block -->
  <div class="student-info">
    <div>
      <div class="label">Student Name</div>
      <div class="value">${studentInfo.studentName || 'â€”'}</div>
    </div>
    <div>
      <div class="label">Banner ID</div>
      <div class="value">${studentInfo.bannerNum || 'â€”'}</div>
    </div>
    <div>
      <div class="label">Program</div>
      <div class="value">${branding.programName}</div>
    </div>
    <div>
      <div class="label">Date of Print</div>
      <div class="value">${printDate} at ${printTime}</div>
    </div>
    ${studentInfo.email ? `
    <div>
      <div class="label">Email</div>
      <div class="value">${studentInfo.email}</div>
    </div>` : ''}
    <div>
      <div class="label">College / Department</div>
      <div class="value">${branding.collegeName || 'â€”'}</div>
    </div>
  </div>

  <div class="report-body">
    <!-- Overall Progress -->
    <div class="progress-label">${overallProgress}% Complete</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width:${overallProgress}%"></div>
    </div>

    ${careerHTML}

    <h2>4-Year Experiential Map</h2>
    ${phasesHTML}

    <h2>Credential Validation Summary</h2>
    ${validationHTML}
  </div>

  <!-- Footer -->
  <div class="report-footer">
    <span>Generated by EMMA â€” Experiential Major Mapping Assistant Â· Think! Design and Planning, LLC</span>
    <span>This report is a student self-assessment tool and does not constitute official academic records.</span>
  </div>

  <div style="text-align:center; padding:20px;" class="no-print">
    <button onclick="window.print()" style="padding:12px 32px; background:${primaryColor}; color:white; border:none; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600;">
      ðŸ–¨ï¸ Print / Save as PDF
    </button>
  </div>

</body>
</html>`;
  }

  function getCategoryColor(cat) {
    const map = { Purpose: '#2563EB', Communities: '#059669', LocalGlobal: '#D97706', Identity: '#7C3AED' };
    return map[cat] || '#666';
  }

  function getCategoryBg(cat) {
    const map = { Purpose: '#2563EB15', Communities: '#05966915', LocalGlobal: '#D9770615', Identity: '#7C3AED15' };
    return map[cat] || '#f0f0f0';
  }

  function dateStamp() {
    return new Date().toISOString().split('T')[0];
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export the Experiential Journey Map Content Form as a Word-compatible .doc
   * Admin-only feature â€” generates a pre-filled intake form from EMMA's live data.
   */
  function exportWordForm() {
    const branding = EMMA_STATE.get('branding');
    const timeline = EMMA_STATE.get('timeline');
    const matrix = EMMA_STATE.get('matrix');

    if (!branding || !timeline) {
      if (typeof EMMA_MATRIX !== 'undefined') {
        EMMA_MATRIX.showToast('âš ï¸ No program loaded. Select a program first.', 'warning');
      }
      return;
    }

    // Build phase grids for Section 4
    const categories = {
      Purpose: { emoji: 'ðŸ”', title: 'Discover & Demonstrate Purpose', sub: 'Connecting passion to purpose' },
      Communities: { emoji: 'ðŸ¤', title: 'Cultivate Your Communities', sub: 'Building belonging and networks' },
      LocalGlobal: { emoji: 'ðŸŒ', title: 'Engage Locally & Globally', sub: 'Applying knowledge beyond campus' },
      Identity: { emoji: 'ðŸ’¼', title: 'Develop Professional Identity', sub: 'Building career readiness and credentials' }
    };

    function buildThemeGrid(catKey) {
      const cat = categories[catKey];
      let rows = ['<tr>'];
      timeline.phases.forEach(phase => {
        const milestones = phase.milestones.filter(m => m.category === catKey);
        const items = milestones.map(m => 
          `<b>${m.courseRef.split(' â€” ')[0]}</b> â€” ${m.courseRef.split(' â€” ')[1] || ''}: ${m.label}`
        ).join('<br><br>');
        rows.push(`<td>${items || '<i>See advisor for opportunities</i>'}</td>`);
      });
      rows.push('</tr>');

      return `
        <h3><span class="section-emoji">${cat.emoji}</span> ${cat.title} | ${cat.sub}</h3>
        <table class="grid-table">
          <tr>
            <th style="width:25%;">Year 1 â€“ ${timeline.phases[0]?.subtitle || 'Explore'}</th>
            <th style="width:25%;">Year 2 â€“ ${timeline.phases[1]?.subtitle || 'Engage'}</th>
            <th style="width:25%;">Year 3 â€“ ${timeline.phases[2]?.subtitle || 'Develop'}</th>
            <th style="width:25%;">Year 4 â€“ ${timeline.phases[3]?.subtitle || 'Launch'}</th>
          </tr>
          ${rows.join('')}
        </table>`;
    }

    // Career outlook
    const co = branding.careerOutlook || {};

    // Build full document
    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="Microsoft Word 15">
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
  @page { size:8.5in 11in; margin:1in; }
  body { font-family:'Calibri',Arial,sans-serif; font-size:11pt; color:#333; line-height:1.4; }
  h1 { font-size:18pt; color:#003366; text-align:center; margin-bottom:4pt; }
  h2 { font-size:14pt; color:#003366; border-bottom:2px solid #C4A000; padding-bottom:4pt; margin-top:24pt; margin-bottom:12pt; }
  h3 { font-size:12pt; color:#003366; margin-top:14pt; margin-bottom:6pt; }
  .subtitle { text-align:center; font-size:13pt; color:#555; margin-bottom:2pt; }
  .purpose-box { background:#F0F4F8; border-left:4px solid #C4A000; padding:10pt 14pt; margin-bottom:18pt; font-size:10pt; color:#444; }
  table { width:100%; border-collapse:collapse; margin-bottom:14pt; }
  table.form-table td { border:1px solid #999; padding:6pt 8pt; vertical-align:top; font-size:10.5pt; }
  table.form-table td:first-child { width:35%; font-weight:bold; background:#F7F7F7; color:#003366; }
  table.grid-table th { background:#003366; color:white; font-size:10pt; padding:6pt 8pt; border:1px solid #003366; text-align:center; }
  table.grid-table td { border:1px solid #999; padding:6pt 8pt; vertical-align:top; font-size:9.5pt; }
  .bold-tagline { font-weight:bold; font-size:11pt; color:#003366; padding:8pt; background:#F0F4F8; border-left:4px solid #C4A000; margin-bottom:12pt; }
  ul { margin-top:4pt; padding-left:18pt; }
  li { margin-bottom:4pt; font-size:10.5pt; }
  .footer { text-align:center; font-size:9pt; color:#888; margin-top:30pt; border-top:1px solid #ccc; padding-top:8pt; }
  .next-steps { background:#F0F4F8; border:1px solid #ccc; padding:10pt 14pt; margin-top:18pt; font-size:10pt; }
  .page-break { page-break-before:always; }
</style>
</head>
<body>

<h1>NC A&amp;T Experiential Journey Map</h1>
<p class="subtitle"><b>Major Program Content Form</b></p>
<p class="subtitle">Generated from EMMA Â· ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

<div class="purpose-box">
<b>PURPOSE:</b> This form gathers the content needed to build your department's Experiential Major Map â€” a two-page visual tool that connects students to academic milestones, experiential learning, and career pathways across all four years.
</div>

<h2>SECTION 1 | MAJOR IDENTIFICATION</h2>
<table class="form-table">
<tr><td>Major / Program Name</td><td>${branding.programName || ''}</td></tr>
<tr><td>College / School</td><td>${branding.collegeName || ''}</td></tr>
<tr><td>Department</td><td>${branding.departmentName || ''}</td></tr>
<tr><td>Degree Type</td><td>${branding.degreeType || ''}</td></tr>
<tr><td>Concentrations / Tracks</td><td>${branding.concentrations || 'None â€” single-track professional degree program'}</td></tr>
<tr><td>Department Chair Name</td><td>${branding.departmentChair || ''}</td></tr>
<tr><td>Chair Email Address</td><td>${branding.departmentChairEmail || ''}</td></tr>
<tr><td>Best Point of Contact</td><td>${branding.contactName || ''}<br>${branding.contactEmail || ''}</td></tr>
<tr><td>Advising Contact</td><td>${branding.advisingContact || branding.contactName || ''}<br>${branding.advisingEmail || branding.contactEmail || ''}</td></tr>
</table>

<h2>SECTION 2 | MAJOR INTRODUCTION &amp; HIGHLIGHTS</h2>
<h3>Bold Tagline / Value Statement</h3>
<div class="bold-tagline">${branding.tagline || ''}</div>
<h3>Program Description</h3>
<p>${branding.programDescription || ''}</p>

<h2>SECTION 3 | CAREERS &amp; GRADUATE PATHWAYS</h2>
<h3>Common Job Titles for Graduates</h3>
<table class="form-table"><tr><td style="width:100%;" colspan="2">
${(co.jobTitles || co.relatedFields || []).map((e, i) => `${i + 1}. ${e}`).join('<br>') || 'See career outlook data'}
</td></tr></table>

<h3>Common Employers &amp; Industries</h3>
<table class="form-table"><tr><td style="width:100%;" colspan="2">
${(co.topEmployers || []).map((e, i) => `${i + 1}. ${e}`).join('<br>') || 'See career outlook data'}
</td></tr></table>

<h3>Licensure / Certifications</h3>
<table class="form-table"><tr><td style="width:100%;" colspan="2">
${(co.certifications || []).map(c => `â€¢ <b>${c}</b>`).join('<br>') || 'N/A'}
</td></tr></table>

<div class="page-break"></div>
<h2>SECTION 4 | EXPERIENTIAL LEARNING BY ACADEMIC YEAR</h2>
${buildThemeGrid('Purpose')}
${buildThemeGrid('Communities')}
<div class="page-break"></div>
${buildThemeGrid('LocalGlobal')}
${buildThemeGrid('Identity')}

<div class="page-break"></div>
<h2>SECTION 5 | ADVISOR NOTES</h2>
<h3>Key Deadlines / Milestones</h3>
<table class="form-table">
${timeline.phases.map(p => `<tr><td>${p.name} (${p.subtitle})</td><td>${p.milestones.length} milestones: ${p.milestones.map(m => m.courseRef.split(' â€” ')[0]).join(', ')}</td></tr>`).join('')}
</table>

<h2>SECTION 6 | SUBMISSION &amp; APPROVAL</h2>
<table class="form-table">
<tr><td>Generated by</td><td>EMMA â€” Experiential Major Mapping Assistant</td></tr>
<tr><td>Program</td><td>${branding.programName || ''}</td></tr>
<tr><td>Date Generated</td><td>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
<tr><td>Total Milestones</td><td>${timeline.phases.reduce((sum, p) => sum + p.milestones.length, 0)}</td></tr>
</table>

<div class="next-steps">
<b>NEXT STEPS:</b> Review this auto-generated form, edit as needed, and submit to the University Student Success Office. Final maps will be published digitally on ncat.edu and printed for student advising use.
</div>

<div class="footer">
Generated by EMMA Â· Developed by the University Student Success Office | NC Agricultural &amp; Technical State University | ncat.edu
</div>

</body></html>`;

    const slug = branding.slug || 'program';
    downloadFile(html, `Experiential-Journey-Map_${slug}_${dateStamp()}.doc`, 'application/msword');

    if (typeof EMMA_MATRIX !== 'undefined') {
      EMMA_MATRIX.showToast('ðŸ“ Major Map Form exported as Word document', 'success');
    }
  }

  /**
   * Export a polished 2-page USSO-format Experiential Major Map.
   * Page 1: Program Overview  |  Page 2: Aggie Experience Checklist
   * Opens in a new browser window with a Print / Save as PDF button.
   */
  function exportMajorMap() {
    const branding = EMMA_STATE.get('branding');
    const timeline = EMMA_STATE.get('timeline');

    if (!branding || !timeline) {
      alert('No program loaded. Please select a program first.');
      return;
    }

    const html = buildMajorMapDocument(branding, timeline);

    // Open in a new window (same pattern as exportPDF)
    const mapWindow = window.open('', '_blank', 'width=1000,height=800');
    mapWindow.document.write(html);
    mapWindow.document.close();

    if (typeof EMMA_MATRIX !== 'undefined') {
      EMMA_MATRIX.showToast('ðŸ“‹ USSO Major Map opened â€” use Print / Save as PDF', 'success');
    }
  }

  /**
   * Build the 2-page USSO Experiential Major Map HTML document.
   */
  function buildMajorMapDocument(branding, timeline) {
    // â”€â”€ Official NC A&T USSO Colors â”€â”€
    const NAVY  = '#003366';
    const GOLD  = '#FDB827';
    const WHITE = '#FFFFFF';

    // â”€â”€ Data extraction â”€â”€
    const programName = branding.programName || 'Undeclared';
    const shortName = programName.replace(/^Bachelor of (?:Science|Arts|Fine Arts) in /, '');
    const collegeName = (branding.collegeName || '').replace(/\s*\([A-Z]+\)\s*/g, ' ').trim();
    const tagline = branding.tagline || '';
    const description = branding.programDescription || '';
    const career = branding.careerOutlook || {};

    // Highlights
    let highlights = branding.programHighlights || [];
    if (!highlights.length) {
      const ks = career.keySkills || [];
      const certs = career.certifications || [];
      if (ks.length) highlights.push(`Strong foundation in ${ks.slice(0, 3).join(', ')}`);
      certs.slice(0, 2).forEach(c => highlights.push(`Pathway to ${c}`));
      if (career.medianSalary) highlights.push(`Median salary: ${career.medianSalary}`);
      if (!highlights.length) highlights = ['Hands-on experiential learning', 'Faculty mentorship', 'Career-ready graduates'];
    }

    // Study topics (new field)
    const studyTopics = career.studyTopics || [];

    // Job titles + employers
    const jobTitles = career.jobTitles || career.relatedFields || [];
    const employers = career.topEmployers || [];

    // Certifications
    const certifications = career.certifications || [];

    // Quick facts (percentages from BLS / program data)
    const quickFacts = [];
    if (career.medianSalary) quickFacts.push({ pct: career.medianSalary, text: `median salary for ${shortName.toLowerCase()} professionals` });
    if (career.growthRate) quickFacts.push({ pct: career.growthRate, text: 'projected job growth' });
    if (career.totalJobs) quickFacts.push({ pct: career.totalJobs, text: 'total jobs nationwide' });

    // Graduate pathways
    const gradPathways = branding.graduatePathways || [];

    // Professional orgs
    const orgs = (branding.professionalOrgs || []).map(o => typeof o === 'string' ? o : o.name);

    // Milestones by category per phase
    const categories = [
      { key: 'Purpose',     emoji: 'ðŸ”', title: 'DISCOVER &\nDEMONSTRATE PURPOSE',    sub: 'Connecting passion to purpose' },
      { key: 'Communities', emoji: 'ðŸ¤', title: 'CULTIVATE COMMUNITIES',             sub: 'Building networks and belonging' },
      { key: 'LocalGlobal', emoji: 'ðŸŒ', title: 'ENGAGE LOCALLY & GLOBALLY',         sub: 'Applying knowledge beyond campus' },
      { key: 'Identity',    emoji: 'ðŸ’¼', title: 'DEVELOP PROFESSIONAL\nIDENTITY',     sub: 'Gaining credentials and achieving career readiness' }
    ];

    const phaseLabels = [
      { year: 'YEAR 1 â€“ FRESHMAN',  theme: 'EXPLORE', sub: 'Orientation & Discovery' },
      { year: 'YEAR 2 â€“ SOPHOMORE', theme: 'ENGAGE',  sub: 'Leadership & Skill Building' },
      { year: 'YEAR 3 â€“ JUNIOR',    theme: 'DEVELOP', sub: 'Internships & Networking' },
      { year: 'YEAR 4 â€“ SENIOR',    theme: 'LAUNCH',  sub: 'Capstone & Career Search' }
    ];

    // Build checklist grid rows
    function buildChecklistRows() {
      let rows = '';
      categories.forEach(cat => {
        rows += `<tr>
          <td class="cat-label">
            <div style="font-size:18px; margin-bottom:3px;">${cat.emoji}</div>
            <div class="cat-title">${cat.title.replace('\n','<br>')}</div>
            <div class="cat-sub">${cat.sub}</div>
          </td>`;

        timeline.phases.forEach(phase => {
          const milestones = phase.milestones.filter(m => m.category === cat.key && m.type !== 'course');
          const items = milestones.map(m => `<div class="ms-item">â–ª ${m.label}</div>`).join('');
          rows += `<td class="ms-cell">${items || '<div class="ms-item" style="color:#999; font-style:italic;">See your advisor for opportunities.</div>'}</td>`;
        });

        rows += '</tr>';
      });
      return rows;
    }

    // â”€â”€ NC A&T Logo as embedded SVG/text badge â”€â”€
    const logoUrl = 'https://www.ncat.edu/_resources/img/logos/at-logo-gold-blue.png';

    // â”€â”€ Assemble HTML â”€â”€
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Experiential Major Map â€” ${shortName}</title>
  <style>
    /* â”€â”€ Base â”€â”€ */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; color: #222; background: #e8e8e8; }

    /* â”€â”€ Print Setup â”€â”€ */
    @page { size: letter landscape; margin: 0; }
    @media print {
      body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page { page-break-after: always; box-shadow: none !important; margin: 0 !important; }
      .page:last-child { page-break-after: auto; }
    }

    /* â”€â”€ Page Container â”€â”€ */
    .page {
      width: 10in; height: 7.5in; margin: 20px auto;
      padding: 0; overflow: hidden; position: relative;
      background: #fff;
      box-shadow: 0 2px 16px rgba(0,0,0,0.15);
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â• PAGE 1 â•â•â•â•â•â•â•â•â•â•â•â• */

    /* Header band */
    .p1-top-bar {
      background: ${NAVY}; color: rgba(255,255,255,0.5);
      font-size: 7px; padding: 3px 20px; text-align: right;
    }
    .p1-header {
      background: ${NAVY}; color: ${WHITE};
      padding: 12px 24px 10px; display: flex; align-items: center; justify-content: space-between;
    }
    .p1-header-text { flex: 1; }
    .p1-header h1 {
      font-size: 20px; font-weight: 800; letter-spacing: 3px;
      text-transform: uppercase; margin-bottom: 4px;
    }
    .p1-header .degree {
      font-size: 15px; font-weight: 700; margin-bottom: 2px;
    }
    .p1-header .college {
      font-size: 9px; font-weight: 400; opacity: 0.8;
    }
    .p1-logo {
      width: 70px; height: 70px; flex-shrink: 0; margin-left: 16px;
    }
    .p1-logo img { width: 100%; height: 100%; object-fit: contain; }

    /* Tagline */
    .p1-tagline {
      background: ${GOLD}; color: ${NAVY};
      font-size: 10px; font-weight: 700; font-style: italic;
      padding: 7px 24px; line-height: 1.4;
    }

    /* 3-column body */
    .p1-body {
      display: flex; padding: 10px 20px 0; gap: 16px;
      height: calc(100% - 190px);
    }
    .p1-col-left   { flex: 0 0 38%; overflow: hidden; }
    .p1-col-middle { flex: 0 0 34%; overflow: hidden; }
    .p1-col-right  { flex: 1; overflow: hidden; }

    /* Section headers */
    .sec-title {
      font-size: 10px; font-weight: 800; color: ${NAVY};
      text-transform: uppercase; letter-spacing: 0.3px;
      margin-bottom: 5px; margin-top: 10px;
    }
    .sec-title:first-child { margin-top: 0; }
    .sec-title-line {
      border-bottom: 2px solid ${GOLD}; padding-bottom: 3px;
    }

    /* Body text */
    .body-text { font-size: 9px; line-height: 1.45; color: #333; margin-bottom: 6px; }
    .body-text-sm { font-size: 8.5px; line-height: 1.4; color: #333; }

    /* Bullet lists */
    .bl { list-style: none; padding: 0; margin: 0; }
    .bl li {
      font-size: 9px; line-height: 1.35; padding: 1.5px 0 1.5px 10px;
      position: relative; color: #333;
    }
    .bl li::before {
      content: 'â–ª'; position: absolute; left: 0; color: ${NAVY}; font-weight: 700;
    }
    .bl-sm li { font-size: 8.5px; }

    /* Quick Facts column */
    .quick-fact {
      background: ${NAVY}; color: ${WHITE}; border-radius: 6px;
      padding: 10px 12px; margin-bottom: 8px; text-align: center;
    }
    .quick-fact .qf-value {
      font-size: 18px; font-weight: 800; color: ${GOLD};
      display: block; margin-bottom: 2px;
    }
    .quick-fact .qf-label {
      font-size: 8px; line-height: 1.3; opacity: 0.9;
    }
    .cert-badge {
      background: #f0f0f0; border-radius: 4px; padding: 4px 8px;
      font-size: 8px; display: inline-block; margin: 2px 3px;
      color: ${NAVY}; font-weight: 600;
    }

    /* Orgs band */
    .p1-orgs-band {
      background: ${GOLD}; color: ${NAVY}; padding: 8px 24px;
      position: absolute; bottom: 18px; left: 0; right: 0;
    }
    .p1-orgs-band .org-title {
      font-size: 9px; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.5px; margin-bottom: 3px;
    }
    .p1-orgs-band .org-list { font-size: 8px; line-height: 1.4; }

    /* Footer */
    .p1-footer {
      background: ${NAVY}; color: rgba(255,255,255,0.5);
      font-size: 7px; padding: 3px 20px; text-align: center;
      position: absolute; bottom: 0; left: 0; right: 0;
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â• PAGE 2 â•â•â•â•â•â•â•â•â•â•â•â• */

    .p2-header {
      background: ${GOLD}; color: ${NAVY}; padding: 12px 24px 8px; text-align: center;
    }
    .p2-header h1 {
      font-size: 20px; font-weight: 800; letter-spacing: 2px;
    }
    .p2-header p {
      font-size: 9px; font-weight: 400; margin-top: 3px;
      font-style: italic; color: #c00;
    }

    .p2-grid {
      width: 100%; border-collapse: collapse;
      margin: 0; font-size: 8px;
    }
    .p2-grid th {
      background: ${NAVY}; color: ${WHITE};
      font-weight: 700; text-align: center;
      padding: 6px 4px; font-size: 9px;
      border: 1px solid #fff;
    }
    .p2-grid th .year-label { font-size: 9px; display: block; font-weight: 800; }
    .p2-grid th .theme-label { font-size: 8px; display: block; margin-top: 1px; color: ${GOLD}; }
    .p2-grid th .theme-sub { font-size: 7px; display: block; font-style: italic; font-weight: 400; opacity: 0.8; }
    .p2-grid th.corner { background: ${NAVY}; width: 140px; }

    .p2-grid td.cat-label {
      background: ${NAVY}; color: ${WHITE};
      font-weight: 700; text-align: center; width: 140px;
      vertical-align: middle; padding: 8px 6px;
      border: 1px solid #fff;
    }
    .cat-title {
      font-size: 8px; text-transform: uppercase; letter-spacing: 0.3px;
      line-height: 1.3; margin-top: 2px;
    }
    .cat-sub {
      font-size: 7px; font-weight: 400; font-style: italic;
      margin-top: 2px; opacity: 0.8;
    }
    .p2-grid td.ms-cell {
      border: 1px solid #ddd; padding: 5px 6px; vertical-align: top;
      background: #fff; width: calc((100% - 140px) / 4);
    }
    .ms-item {
      font-size: 7.5px; line-height: 1.35; padding: 1px 0;
      color: #333;
    }

    .p2-footer {
      background: ${NAVY}; color: rgba(255,255,255,0.5);
      font-size: 7px; padding: 3px 20px; text-align: center;
      position: absolute; bottom: 0; left: 0; right: 0;
    }

    /* Print button */
    .print-bar { text-align: center; padding: 16px; background: #e8e8e8; }
    .print-bar button {
      padding: 12px 36px; background: ${NAVY}; color: ${WHITE};
      border: none; border-radius: 8px; cursor: pointer;
      font-size: 14px; font-weight: 700; font-family: inherit;
    }
    .print-bar button:hover { background: #00264d; }
  </style>
</head>
<body>

  <!-- PRINT BUTTON -->
  <div class="print-bar no-print">
    <button onclick="window.print()">ðŸ–¨ï¸ Print / Save as PDF</button>
  </div>

  <!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• PAGE 1 â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
  <div class="page">
    <div class="p1-top-bar">Â© 2026 | University Student Success Office | ncat.edu</div>

    <div class="p1-header">
      <div class="p1-header-text">
        <h1>EXPERIENTIAL MAJOR MAP</h1>
        <div class="degree">${programName}</div>
        <div class="college">${collegeName} | North Carolina Agricultural and Technical State University</div>
      </div>
      <div class="p1-logo"><img src="${logoUrl}" alt="NC A&T" onerror="this.style.display='none'"></div>
    </div>

    <div class="p1-tagline">${tagline}</div>

    <div class="p1-body">
      <!-- â”€â”€ LEFT COLUMN: What Is + Study Topics â”€â”€ -->
      <div class="p1-col-left">
        <div class="sec-title sec-title-line">WHAT IS ${shortName.toUpperCase()}?</div>
        <p class="body-text">${description}</p>

        ${studyTopics.length ? `
        <div class="sec-title sec-title-line">WHAT TOPICS DO ${shortName.toUpperCase()} MAJORS STUDY?</div>
        <ul class="bl bl-sm">
          ${studyTopics.map(t => `<li>${t}</li>`).join('')}
        </ul>` : `
        <div class="sec-title sec-title-line">PROGRAM HIGHLIGHTS</div>
        <ul class="bl bl-sm">
          ${highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>`}
      </div>

      <!-- â”€â”€ MIDDLE COLUMN: Careers â”€â”€ -->
      <div class="p1-col-middle">
        <div class="sec-title sec-title-line">WHAT DO ${shortName.toUpperCase()} MAJORS DO AFTER GRADUATION?</div>

        ${jobTitles.length ? `
        <div class="sec-title" style="margin-top:8px; font-size:9px;">Common Careers</div>
        <ul class="bl bl-sm">
          ${jobTitles.map(j => `<li>${j}</li>`).join('')}
        </ul>` : ''}

        ${employers.length ? `
        <div class="sec-title" style="margin-top:8px; font-size:9px;">Common Employers & Industries</div>
        <ul class="bl bl-sm">
          ${employers.map(e => `<li>${e}</li>`).join('')}
        </ul>` : ''}

        ${gradPathways.length ? `
        <div class="sec-title" style="margin-top:8px; font-size:9px;">Graduate & Professional Pathways</div>
        <ul class="bl bl-sm">
          ${gradPathways.map(g => `<li>${g}</li>`).join('')}
        </ul>` : ''}
      </div>

      <!-- â”€â”€ RIGHT COLUMN: Quick Facts â”€â”€ -->
      <div class="p1-col-right">
        <div class="sec-title sec-title-line">QUICK FACTS!</div>

        ${quickFacts.map(qf => `
        <div class="quick-fact">
          <span class="qf-value">${qf.pct}</span>
          <span class="qf-label">${qf.text}</span>
        </div>`).join('')}

        ${certifications.length ? `
        <div class="sec-title" style="margin-top:10px; font-size:9px;">Certifications & Licensure</div>
        <div style="margin-top:4px;">
          ${certifications.map(c => `<span class="cert-badge">${c}</span>`).join('')}
        </div>` : ''}

        ${highlights.length && studyTopics.length ? `
        <div class="sec-title" style="margin-top:10px; font-size:9px;">Program Highlights</div>
        <ul class="bl bl-sm">
          ${highlights.slice(0, 4).map(h => `<li>${h}</li>`).join('')}
        </ul>` : ''}
      </div>
    </div>

    <!-- ORGANIZATIONS BAND -->
    <div class="p1-orgs-band">
      <div class="org-title">WHAT STUDENT ORGANIZATIONS COULD I JOIN?</div>
      <div class="org-list">${orgs.join('  |  ') || 'Contact your advisor for student organization opportunities.'}</div>
    </div>
    <div class="p1-footer">Â© 2026 | University Student Success Office | ncat.edu</div>
  </div>

  <!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• PAGE 2 â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
  <div class="page">
    <div class="p2-header">
      <h1>YOUR AGGIE EXPERIENCE CHECKLIST!</h1>
      <p>In addition to your courses, work towards these experiential learning milestones and high-impact practices throughout your academic career.</p>
    </div>

    <table class="p2-grid">
      <thead>
        <tr>
          <th class="corner"></th>
          ${phaseLabels.map(pl => `
          <th>
            <span class="year-label">${pl.year}</span>
            <span class="theme-label">â– ${pl.theme} â–</span>
            <span class="theme-sub">${pl.sub}</span>
          </th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${buildChecklistRows()}
      </tbody>
    </table>

    <div class="p2-footer">Â© 2026 | University Student Success Office | ncat.edu</div>
  </div>

</body>
</html>`;
  }


  // Public API
  return { exportJSON, exportPDF, exportWordForm, exportMajorMap };
})();

console.log('[EMMA] Export engine initialized');

