/**
 * EMMA C2C — Utility Renderer
 * Renders the left utility panel: category legend + resource links with checkmarks.
 * Resources count toward overall progress — students should review/acknowledge each one.
 */

const EMMA_UTILITY = (() => {
  /**
   * Render the full utility panel contents.
   */
  function render() {
    renderCategoryLegend();
    renderResourceLinks();
    renderCareerCard();
    renderOpportunities();
    renderProfessionalOrgs();
  }

  /**
   * Render category legend from branding.json categoryColors.
   */
  function renderCategoryLegend() {
    const container = document.getElementById('category-legend-items');
    if (!container) return;

    const branding = EMMA_STATE.get('branding');
    if (!branding || !branding.categoryColors) return;

    container.innerHTML = '';
    const cats = branding.categoryColors;

    Object.keys(cats).forEach(key => {
      const cat = cats[key];
      const item = document.createElement('div');
      item.className = 'category-legend-item';
      item.style.cssText = `border-left: 3px solid ${cat.hex};`;

      item.innerHTML = `
        <div class="category-legend-label">${cat.emoji} ${cat.label}</div>
        ${cat.description ? `<div class="category-legend-desc">${cat.description}</div>` : ''}
      `;

      container.appendChild(item);
    });
  }

  /**
   * Render resource links with checkboxes from resources.json.
   */
  function renderResourceLinks() {
    const container = document.getElementById('utility-links-container');
    if (!container) return;

    const resources = EMMA_STATE.get('resources');
    if (!resources || !resources.utilityLinks) return;

    container.innerHTML = '';

    // Resource progress header
    const resProgress = EMMA_STATE.getResourceProgress();
    const header = document.createElement('div');
    header.className = 'resource-progress-header';
    header.innerHTML = `
      <span class="resource-progress-label">📋 Resources Reviewed</span>
      <span class="resource-progress-count" id="resource-progress-count">${resProgress.done}/${resProgress.total}</span>
    `;
    container.appendChild(header);

    // Render ALL resources as a flat grid (no category sub-headers — legend handles that)
    resources.utilityLinks.forEach(link => {
      const isChecked = EMMA_STATE.get('checkedResources')[link.id] || false;

      const card = document.createElement('div');
      card.className = `utility-link-card${isChecked ? ' resource-checked' : ''}`;
      card.id = `utility-${link.id}`;
      card.dataset.resourceId = link.id;

      card.innerHTML = `
        <div class="resource-checkbox${isChecked ? ' checked' : ''}" role="checkbox" aria-checked="${isChecked}" tabindex="0">
          ${isChecked ? '✓' : ''}
        </div>
        <span class="utility-link-icon">${link.icon || '🔗'}</span>
        <div class="utility-link-text">
          <span class="utility-link-title">${escapeHtml(link.title)}</span>
          <span class="utility-link-subtitle">${escapeHtml(link.subtitle || '')}</span>
        </div>
      `;

      // Click on checkbox toggles check state
      const checkbox = card.querySelector('.resource-checkbox');
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        handleResourceCheck(link, card);
      });

      checkbox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleResourceCheck(link, card);
        }
      });

      // Click on card opens link
      card.addEventListener('click', (e) => {
        if (e.target.closest('.resource-checkbox')) return;
        window.open(link.url || '#', '_blank', 'noopener');
      });

      // Hover glow tracking
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });

      container.appendChild(card);
    });
  }

  /**
   * Handle resource checkbox click.
   */
  function handleResourceCheck(link, card) {
    const newState = EMMA_STATE.toggleResource(link.id);

    // Update visual
    card.classList.toggle('resource-checked', newState);
    const checkbox = card.querySelector('.resource-checkbox');
    checkbox.classList.toggle('checked', newState);
    checkbox.setAttribute('aria-checked', newState);
    checkbox.textContent = newState ? '✓' : '';

    // Update resource progress count
    const resProgress = EMMA_STATE.getResourceProgress();
    const countEl = document.getElementById('resource-progress-count');
    if (countEl) countEl.textContent = `${resProgress.done}/${resProgress.total}`;

    // Update main progress bar (resources contribute to overall %)
    EMMA_MATRIX.updateHeaderProgress();
    EMMA_MATRIX.updatePhaseRings();

    // Confetti for resource acknowledgment
    if (newState && typeof EMMA_CONFETTI !== 'undefined') {
      EMMA_CONFETTI.fire('small');
    }

    // Toast
    if (newState) {
      EMMA_MATRIX.showToast(`✅ ${link.title} reviewed`, 'success');
    }

    // Firebase sync
    if (typeof EMMA_SYNC !== 'undefined') {
      EMMA_SYNC.saveProgress();
    }
  }

  /**
   * Escape HTML to prevent XSS.
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Render career outlook summary card.
   */
  function renderCareerCard() {
    const container = document.getElementById('career-outlook-container');
    if (!container) return;
    container.innerHTML = '';

    const branding = EMMA_STATE.get('branding');
    const career = branding?.careerOutlook;
    if (!career) return;

    const isLive = career.dataSource === 'live';
    const badge = isLive
      ? '<span style="font-size:9px; background:#22C55E; color:white; padding:1px 6px; border-radius:8px; font-weight:700; margin-left:4px;">LIVE</span>'
      : '<span style="font-size:9px; background:#888; color:white; padding:1px 6px; border-radius:8px; font-weight:700; margin-left:4px;">STATIC</span>';

    const card = document.createElement('div');
    card.className = 'career-outlook-card';
    card.innerHTML = `
      <div class="career-card-header">
        <span>📊 Career Outlook${badge}</span>
        ${career.dataYear ? `<span style="font-size:9px; color:var(--theme-text-secondary);">${career.dataYear} data</span>` : ''}
      </div>
      <div class="career-card-grid">
        <div class="career-stat">
          <div class="career-stat-value">${career.medianSalary || 'N/A'}</div>
          <div class="career-stat-label">Median Salary</div>
        </div>
        <div class="career-stat">
          <div class="career-stat-value">${career.growthRate || 'N/A'}</div>
          <div class="career-stat-label">Job Growth</div>
        </div>
        <div class="career-stat">
          <div class="career-stat-value">${career.totalJobs || 'N/A'}</div>
          <div class="career-stat-label">U.S. Jobs</div>
        </div>
      </div>
      ${career.outlook ? `<p style="font-size:11px; color:var(--theme-text-secondary); line-height:1.5; margin:0;">${career.outlook}</p>` : ''}
    `;
    container.appendChild(card);
  }

  /**
   * Render SFRIC field opportunities from branding.json sfricProjects.
   * Each project links to AVA for the visualization experience.
   */
  function renderOpportunities() {
    const container = document.getElementById('sfric-container');
    if (!container) return;
    container.innerHTML = '';

    const branding = EMMA_STATE.get('branding');
    const projects = branding?.sfricProjects;
    const aslaCategories = branding?.aslaAwardCategories;
    if (!projects?.length) return;

    // ─── SFRIC Opportunities Header ───
    const header = document.createElement('div');
    header.className = 'sfric-section-header';
    header.innerHTML = `
      <div class="sfric-header-title">
        <span class="sfric-header-icon">🌱</span>
        <span>SFRIC Field Opportunities</span>
        <span class="sfric-live-badge">LIVE</span>
      </div>
      <div class="sfric-header-subtitle">Small Farm Research & Innovation Center — Real projects, real sites</div>
    `;
    container.appendChild(header);

    // ─── Project Cards ───
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'sfric-project-card';
      card.dataset.projectId = project.id;

      // Match applicable courses to student's checked milestones
      const checked = EMMA_STATE.get('checkedMilestones') || {};
      const timeline = EMMA_STATE.get('timeline');
      const matchedCourses = (project.applicableCourses || []).map(code => {
        // Find if this course's milestone is checked
        let isComplete = false;
        if (timeline?.phases) {
          for (const phase of timeline.phases) {
            const ms = phase.milestones.find(m => m.courseRef?.startsWith(code));
            if (ms && checked[ms.id]) { isComplete = true; break; }
          }
        }
        return { code, isComplete };
      });

      const statusColor = project.status === 'Active' ? '#22C55E' : '#888';

      card.innerHTML = `
        <div class="sfric-card-top">
          <div class="sfric-project-name">${escapeHtml(project.name)}</div>
          <span class="sfric-status-badge" style="background:${statusColor}">${project.status}</span>
        </div>
        <div class="sfric-project-location">📍 ${escapeHtml(project.location)}</div>
        <p class="sfric-project-desc">${escapeHtml(project.description)}</p>

        <div class="sfric-courses-row">
          ${matchedCourses.map(mc => `
            <span class="sfric-course-tag${mc.isComplete ? ' completed' : ''}" title="${mc.code}${mc.isComplete ? ' ✓ Completed' : ''}">
              ${mc.isComplete ? '✅' : '📘'} ${mc.code}
            </span>
          `).join('')}
        </div>

        <div class="sfric-roles-row">
          ${(project.roles || []).map(r => `<span class="sfric-role-tag">${escapeHtml(r)}</span>`).join('')}
        </div>

        ${project.aslaCategory ? `<div class="sfric-asla-badge">🏆 ASLA: ${escapeHtml(project.aslaCategory)}</div>` : ''}

        <a href="${project.avaUrl || '#'}" target="_blank" rel="noopener" class="sfric-ava-link" onclick="event.stopPropagation();">
          🔭 Explore in AVA →
        </a>
      `;

      container.appendChild(card);
    });

    // ─── ASLA Award Categories (collapsed by default) ───
    if (aslaCategories?.length) {
      const aslaContainer = document.getElementById('asla-awards-container');
      if (aslaContainer) aslaContainer.innerHTML = '';

      const aslaSection = document.createElement('div');
      aslaSection.className = 'sfric-asla-section';
      aslaSection.innerHTML = `
        <button class="sfric-asla-toggle" id="asla-toggle-btn">
          🏆 ASLA Award Categories for Capstone
          <span class="sfric-toggle-arrow">▶</span>
        </button>
        <div class="sfric-asla-list" id="asla-awards-list" style="display:none;">
          ${aslaCategories.map(cat => `
            <div class="sfric-asla-item">
              <div class="sfric-asla-name">${escapeHtml(cat.name)}</div>
              <div class="sfric-asla-desc">${escapeHtml(cat.description)}</div>
              <div class="sfric-asla-deliverables">
                <span class="sfric-asla-del-label">Deliverable Set:</span>
                ${cat.deliverables.map(d => `<span class="sfric-deliverable-tag">${escapeHtml(d)}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
      if (aslaContainer) aslaContainer.appendChild(aslaSection);

      // Toggle behavior
      aslaSection.querySelector('#asla-toggle-btn').addEventListener('click', () => {
        const list = document.getElementById('asla-awards-list');
        const arrow = aslaSection.querySelector('.sfric-toggle-arrow');
        const isHidden = list.style.display === 'none';
        list.style.display = isHidden ? 'block' : 'none';
        arrow.textContent = isHidden ? '▼' : '▶';
      });
    }
  }

  /**
   * Render professional organization links from branding.json.
   */
  function renderProfessionalOrgs() {
    const container = document.getElementById('pro-orgs-container');
    if (!container) return;
    container.innerHTML = '';

    const branding = EMMA_STATE.get('branding');
    const orgs = branding?.professionalOrgs;
    if (!orgs?.length) return;

    const title = document.createElement('h3');
    title.className = 'utility-section-title';
    title.textContent = 'Professional Organizations';
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'pro-orgs-grid';

    orgs.forEach(org => {
      const card = document.createElement('a');
      card.href = org.url || '#';
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'pro-org-card';
      card.innerHTML = `
        <span class="pro-org-icon">${org.icon || '🏛️'}</span>
        <div class="pro-org-text">
          <span class="pro-org-name">${escapeHtml(org.name)}</span>
          <span class="pro-org-desc">${escapeHtml(org.description || '')}</span>
        </div>
        <span class="pro-org-arrow">→</span>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  // Public API
  return { render };
})();

console.log('[EMMA] Utility renderer initialized');
