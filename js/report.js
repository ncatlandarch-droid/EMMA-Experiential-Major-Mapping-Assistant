/**
 * EMMA C2C — Journey Map Report Generator
 * Generates a printable, NC A&T-branded experiential journey report.
 * Includes: program overview, 4-phase journey map, BLS career data,
 * AI-generated profession images, student progress stats.
 *
 * © Think! Design and Planning, LLC
 */

const EMMA_REPORT = (() => {

  /**
   * Generate and open the printable report in a new window.
   */
  function generate() {
    const timeline = EMMA_STATE.get('timeline');
    const branding = EMMA_STATE.get('branding');
    const program = EMMA_STATE.get('currentProgram');
    const checked = EMMA_STATE.get('checkedMilestones') || {};

    if (!timeline || !branding) {
      if (typeof EMMA_MATRIX !== 'undefined') {
        EMMA_MATRIX.showToast('⚠️ Load a program first before generating a report', 'error');
      }
      return;
    }

    // Gather data
    const overall = EMMA_STATE.getOverallProgress();
    const totalMilestones = timeline.phases.reduce((sum, p) => sum + p.milestones.length, 0);
    const completedMilestones = Object.values(checked).filter(Boolean).length;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Career data from DOM (already rendered)
    const salaryEl = document.getElementById('career-salary');
    const growthEl = document.getElementById('career-growth');
    const employEl = document.getElementById('career-employment');
    const salary = salaryEl?.textContent || 'N/A';
    const growth = growthEl?.textContent || 'N/A';
    const employment = employEl?.textContent || 'N/A';

    // Phase colors
    const phaseColors = {
      'explore': '#4CAF50',
      'engage': '#2196F3',
      'develop': '#FF9800',
      'launch': '#9C27B0',
      'year-1': '#4CAF50',
      'year-2': '#2196F3',
      'year-3': '#FF9800',
      'year-4': '#9C27B0'
    };

    // Category icons
    const categoryIcons = {
      'course': '📘',
      'field': '🌿',
      'professional': '💼',
      'community': '🤝',
      'research': '🔬',
      'certification': '🏆',
      'award': '🏅',
      'leadership': '👑'
    };

    // Build phases HTML
    const phasesHTML = timeline.phases.map((phase, idx) => {
      const phaseColor = phaseColors[phase.id] || ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'][idx % 4];
      const phaseProgress = EMMA_STATE.getPhaseProgress(phase.id);
      
      const milestonesHTML = phase.milestones.map(m => {
        const isChecked = checked[m.id];
        const icon = categoryIcons[m.category] || '📌';
        return `
          <div class="milestone ${isChecked ? 'milestone--done' : ''}">
            <span class="milestone-check">${isChecked ? '✅' : '⬜'}</span>
            <span class="milestone-icon">${icon}</span>
            <div class="milestone-info">
              <span class="milestone-label">${m.label}</span>
              ${m.credits ? `<span class="milestone-credits">${m.credits} credits</span>` : ''}
            </div>
          </div>`;
      }).join('');

      return `
        <div class="phase-section">
          <div class="phase-header" style="border-left: 6px solid ${phaseColor};">
            <div class="phase-title-row">
              <h2 class="phase-title" style="color: ${phaseColor};">${phase.name}</h2>
              <span class="phase-progress" style="background: ${phaseColor};">${phaseProgress.checked}/${phaseProgress.total} · ${phaseProgress.percent}%</span>
            </div>
            ${phase.description ? `<p class="phase-desc">${phase.description}</p>` : ''}
          </div>
          <div class="milestones-grid">
            ${milestonesHTML}
          </div>
        </div>`;
    }).join('');

    // Profession images (placeholder SVG patterns based on program)
    const professionImageHTML = getProfessionImage(branding.programName || program);

    // Build the full report HTML
    const reportHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Experiential Journey Map — ${branding.programName || program}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --ncat-blue: #003366;
      --ncat-gold: #FDB827;
      --text-primary: #1a1a2e;
      --text-secondary: #475569;
      --text-muted: #94a3b8;
      --border: #e2e8f0;
      --surface: #f8fafc;
      --success: #22c55e;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text-primary);
      background: white;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    @page {
      size: letter;
      margin: 0.6in 0.75in;
    }

    /* === COVER / HEADER === */
    .report-header {
      background: var(--ncat-blue);
      color: white;
      padding: 2.5rem 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 6px solid var(--ncat-gold);
    }

    .report-header-left h1 {
      font-size: 1.75rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.2;
    }

    .report-header-left .subtitle {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--ncat-gold);
      margin-top: 0.4rem;
    }

    .report-header-right {
      text-align: right;
      font-size: 0.7rem;
      font-weight: 600;
      opacity: 0.8;
      line-height: 1.6;
    }

    .report-header-right .university {
      font-weight: 900;
      font-size: 0.75rem;
      color: var(--ncat-gold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* === PROGRAM BANNER === */
    .program-banner {
      padding: 2rem 3rem;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .program-info h2 {
      font-size: 1.3rem;
      font-weight: 900;
      color: var(--ncat-blue);
    }

    .program-info .dept {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 600;
      margin-top: 0.15rem;
    }

    .progress-ring {
      width: 5rem;
      height: 5rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .progress-ring svg {
      position: absolute;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .progress-ring .percent {
      font-size: 1.25rem;
      font-weight: 900;
      color: var(--ncat-blue);
    }

    /* === PROFESSION IMAGE === */
    .profession-image-section {
      padding: 0 3rem;
      margin: 2rem 0 1rem;
    }

    .profession-image-section img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 12px;
      border: 2px solid var(--border);
    }

    .profession-image-placeholder {
      width: 100%;
      height: 180px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--ncat-blue) 0%, #1a4d80 50%, var(--ncat-gold) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2.5rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    /* === CAREER DATA === */
    .career-data {
      display: flex;
      gap: 1rem;
      padding: 1.5rem 3rem;
      page-break-inside: avoid;
    }

    .career-stat {
      flex: 1;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      text-align: center;
    }

    .career-stat .label {
      font-size: 0.6rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text-muted);
      margin-bottom: 0.35rem;
    }

    .career-stat .value {
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--ncat-blue);
    }

    .career-stat .source {
      font-size: 0.55rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    /* === JOURNEY MAP === */
    .journey-section-title {
      padding: 1.5rem 3rem 0.75rem;
      font-size: 0.65rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: var(--ncat-blue);
      border-bottom: 3px solid var(--ncat-gold);
      margin: 0 3rem;
    }

    .phase-section {
      padding: 1.25rem 3rem;
      page-break-inside: avoid;
    }

    .phase-header {
      padding: 0.75rem 1rem;
      background: var(--surface);
      border-radius: 8px;
      margin-bottom: 0.75rem;
    }

    .phase-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .phase-title {
      font-size: 1rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .phase-progress {
      font-size: 0.65rem;
      font-weight: 800;
      color: white;
      padding: 0.2rem 0.75rem;
      border-radius: 20px;
    }

    .phase-desc {
      font-size: 0.7rem;
      color: var(--text-secondary);
      margin-top: 0.35rem;
      font-weight: 500;
    }

    .milestones-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.4rem;
    }

    .milestone {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.6rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.72rem;
      transition: all 0.2s;
    }

    .milestone--done {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }

    .milestone-check { font-size: 0.8rem; flex-shrink: 0; }
    .milestone-icon { font-size: 0.75rem; flex-shrink: 0; }

    .milestone-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .milestone-label {
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .milestone-credits {
      font-size: 0.6rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    /* === SUMMARY STATS === */
    .summary-section {
      padding: 1.5rem 3rem;
      display: flex;
      gap: 1rem;
      page-break-inside: avoid;
    }

    .summary-card {
      flex: 1;
      border: 2px solid var(--border);
      border-radius: 10px;
      padding: 1rem;
      text-align: center;
    }

    .summary-card .num {
      font-size: 2rem;
      font-weight: 900;
      color: var(--ncat-blue);
    }

    .summary-card .desc {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* === FOOTER === */
    .report-footer {
      padding: 1.5rem 3rem;
      border-top: 3px solid var(--ncat-gold);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.6rem;
      color: var(--text-muted);
      font-weight: 600;
      margin-top: 2rem;
    }

    .report-footer .aggie-stamp {
      font-weight: 900;
      color: var(--ncat-blue);
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }

    /* === PRINT === */
    @media print {
      body { background: white; }
      .no-print { display: none !important; }
      .phase-section { page-break-inside: avoid; }
    }

    /* === PRINT BUTTON === */
    .print-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--ncat-blue);
      padding: 1rem 3rem;
      display: flex;
      justify-content: center;
      gap: 1rem;
      z-index: 100;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
    }

    .print-bar button {
      padding: 0.75rem 2.5rem;
      font-size: 0.9rem;
      font-weight: 800;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .btn-print {
      background: var(--ncat-gold);
      color: var(--ncat-blue);
    }

    .btn-close {
      background: rgba(255,255,255,0.15);
      color: white;
    }
  </style>
</head>
<body>

  <!-- PRINT BAR -->
  <div class="print-bar no-print">
    <button class="btn-print" onclick="window.print()">🖨️ Print Report</button>
    <button class="btn-close" onclick="window.close()">✕ Close</button>
  </div>

  <!-- HEADER -->
  <div class="report-header">
    <div class="report-header-left">
      <h1>Experiential Journey Map</h1>
      <div class="subtitle">Curriculum-to-Credentials Report · EMMA Platform</div>
    </div>
    <div class="report-header-right">
      <div class="university">North Carolina A&T State University</div>
      <div>Generated: ${today}</div>
      <div>Report ID: EMMA-${Date.now().toString(36).toUpperCase()}</div>
    </div>
  </div>

  <!-- PROGRAM BANNER -->
  <div class="program-banner">
    <div class="program-info">
      <h2>${branding.programName || 'Experiential Program'}</h2>
      <div class="dept">${branding.department || branding.collegeName || 'North Carolina A&T State University'}</div>
    </div>
    <div class="progress-ring">
      <svg viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" stroke="#e2e8f0" stroke-width="6" fill="none" />
        <circle cx="40" cy="40" r="35" stroke="${overall >= 75 ? '#22c55e' : overall >= 50 ? '#FF9800' : '#003366'}" 
          stroke-width="6" fill="none" stroke-dasharray="${2 * Math.PI * 35}" 
          stroke-dashoffset="${2 * Math.PI * 35 * (1 - overall/100)}" stroke-linecap="round" />
      </svg>
      <span class="percent">${overall}%</span>
    </div>
  </div>

  <!-- PROFESSION IMAGE -->
  <div class="profession-image-section">
    ${professionImageHTML}
  </div>

  <!-- CAREER DATA -->
  <div class="career-data">
    <div class="career-stat">
      <div class="label">Median Salary</div>
      <div class="value">${salary}</div>
      <div class="source">Bureau of Labor Statistics</div>
    </div>
    <div class="career-stat">
      <div class="label">Job Growth (10yr)</div>
      <div class="value">${growth}</div>
      <div class="source">Bureau of Labor Statistics</div>
    </div>
    <div class="career-stat">
      <div class="label">U.S. Employment</div>
      <div class="value">${employment}</div>
      <div class="source">Bureau of Labor Statistics</div>
    </div>
    <div class="career-stat">
      <div class="label">Milestones Completed</div>
      <div class="value">${completedMilestones}/${totalMilestones}</div>
      <div class="source">EMMA Progress Tracker</div>
    </div>
  </div>

  <!-- JOURNEY MAP -->
  <div class="journey-section-title">Experiential Journey Map — Four-Phase Framework</div>
  ${phasesHTML}

  <!-- SUMMARY -->
  <div class="summary-section">
    ${timeline.phases.map((phase, idx) => {
      const pp = EMMA_STATE.getPhaseProgress(phase.id);
      return `<div class="summary-card">
        <div class="num">${pp.percent}%</div>
        <div class="desc">${phase.name}</div>
      </div>`;
    }).join('')}
  </div>

  <!-- FOOTER -->
  <div class="report-footer">
    <div>
      <span class="aggie-stamp">Aggies Do! 💙💛</span>
      &nbsp;·&nbsp; Generated by EMMA — Experiential Major Mapping Assistant
    </div>
    <div>© ${new Date().getFullYear()} Think! Design and Planning, LLC &nbsp;·&nbsp; thinkemma.app</div>
  </div>

</body>
</html>`;

    // Open in new window
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(reportHTML);
      reportWindow.document.close();
    } else {
      EMMA_MATRIX.showToast('⚠️ Pop-up blocked — please allow pop-ups for this site', 'error');
    }
  }

  /**
   * Get profession-specific image HTML based on program name.
   */
  function getProfessionImage(programName) {
    const name = (programName || '').toLowerCase();
    
    // Map programs to descriptive banner text
    let title = programName;
    let gradientStart = '#003366';
    let gradientEnd = '#1a6d99';

    if (name.includes('landscape')) {
      gradientStart = '#2d5016'; gradientEnd = '#4a7c23';
      title = '🌿 Landscape Architecture';
    } else if (name.includes('animal')) {
      gradientStart = '#7c4015'; gradientEnd = '#b8651a';
      title = '🐾 Animal Science';
    } else if (name.includes('engineering') || name.includes('bioprocess')) {
      gradientStart = '#1a3a5c'; gradientEnd = '#2d6da8';
      title = '⚙️ Biological Engineering';
    } else if (name.includes('food') || name.includes('nutrition')) {
      gradientStart = '#8b2252'; gradientEnd = '#c0547a';
      title = '🍎 Food & Nutritional Sciences';
    } else if (name.includes('child') || name.includes('family')) {
      gradientStart = '#5b2c6f'; gradientEnd = '#8e44ad';
      title = '👨‍👩‍👧 Child Development & Family Studies';
    } else if (name.includes('fashion')) {
      gradientStart = '#922b21'; gradientEnd = '#cb4335';
      title = '👗 Fashion Merchandising & Design';
    } else if (name.includes('agri') && name.includes('education')) {
      gradientStart = '#1b4f1b'; gradientEnd = '#27ae60';
      title = '🌾 Agricultural Education';
    } else if (name.includes('agribusiness')) {
      gradientStart = '#1a5276'; gradientEnd = '#2980b9';
      title = '📊 Agribusiness';
    } else if (name.includes('environment')) {
      gradientStart = '#145a32'; gradientEnd = '#1e8449';
      title = '🌍 Environmental Studies';
    }

    return `<div class="profession-image-placeholder" style="background: linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 50%, var(--ncat-gold) 100%);">${title}</div>`;
  }

  // Public API
  return { generate };
})();

console.log('[EMMA] Report generator initialized');
