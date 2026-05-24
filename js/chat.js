/* ============================================================
   EMMA C2C — Chat Module
   AI-powered Q&A using Gemini API
   ============================================================ */

window.EMMA_CHAT = (() => {
  'use strict';

  const GEMINI_MODEL = 'gemini-2.0-flash';

  /**
   * Build system context for Emma from currently loaded program data.
   * Includes BLS career outlook, milestones, progress, and career counselor persona.
   */
  function buildContext() {
    const branding = EMMA_STATE.get('branding') || {};
    const timeline = EMMA_STATE.get('timeline') || {};
    const matrix = EMMA_STATE.get('matrix') || {};
    const checked = EMMA_STATE.get('checkedMilestones') || {};
    const resources = EMMA_STATE.get('resources') || {};

    const programName = branding.programName || 'Unknown Program';
    const milestones = (timeline.phases || []).flatMap(p => p.milestones || []);
    const completedIds = Object.keys(checked).filter(k => checked[k]);
    const total = milestones.length;
    const pct = total > 0 ? Math.round((completedIds.length / total) * 100) : 0;
    const career = branding.careerOutlook || {};

    // Build milestone listing with checked status
    const milestoneList = milestones.map(m => {
      const done = checked[m.id] ? '✅' : '⬜';
      return `${done} ${m.label} (${m.category}, ${m.credits || '?'} cr, ${m.semester || ''}) — ${m.description || 'No description'}`;
    }).join('\n');

    // Career outlook section
    const careerSection = career.field ? `
CAREER OUTLOOK (Bureau of Labor Statistics):
- Field: ${career.field} (BLS ${career.blsCode || ''})
- Job Growth: ${career.growthRate || 'N/A'}
- Median Salary: ${career.medianSalary || 'N/A'}
- Entry Level: ${career.entryLevelSalary || 'N/A'}  |  Top: ${career.topSalary || 'N/A'}
- Total U.S. Jobs: ${career.totalJobs || 'N/A'}
- Top Employers: ${(career.topEmployers || []).join(', ')}
- Certifications: ${(career.certifications || []).join(', ')}
- Related Fields: ${(career.relatedFields || []).join(', ')}
- Key Skills: ${(career.keySkills || []).join(', ')}
- Industry Outlook: ${career.outlook || ''}` : '';

    return `You are Emma, an AI career counselor and experiential mapping assistant at NC A&T State University.
You are warm, knowledgeable, encouraging, and specific. You know this student's exact program, their progress, and real career data.

PROGRAM INFORMATION:
- Program: ${programName}
- College: ${branding.collegeName || 'CAES'}
- Department: ${branding.departmentName || 'Unknown'}
- Degree: ${branding.degreeType || 'BS'}
- Accreditation: ${branding.validationLabel || 'None specified'}
- Licensure Exam: ${branding.licensureExam || 'None'}

STUDENT PROGRESS: ${completedIds.length}/${total} milestones completed (${pct}%)

PHASE OVERVIEW:
${(timeline.phases || []).map(p => `- ${p.name} (${p.subtitle}): ${(p.milestones || []).length} milestones`).join('\n')}

ALL MILESTONES:
${milestoneList}
${careerSection}

YOUR ROLE AS CAREER COUNSELOR:
- Answer questions about courses, prerequisites, career pathways, and salary expectations
- Reference specific BLS data (growth rate, salary, employers) when discussing career prospects
- Explain how specific milestones connect to professional competencies and job readiness
- Give personalized advice based on the student's current progress percentage
- Discuss accreditation requirements and how courses map to them
- Recommend specific resources (Handshake, Career Services, Study Abroad) when relevant
- If a student asks about job outlook, cite real BLS statistics
- If they ask about employers, name specific companies from the data
- Be warm, professional, and concise (2-4 sentences unless more detail is needed)
- Always relate advice back to their specific program and career goals
- If you don't know something, say so honestly and suggest where to find the answer`;
  }

  /**
   * Send a message to Gemini and get Emma's response.
   */
  async function askEmma(userMessage) {
    const systemContext = buildContext();

    try {
      const response = await fetch('/.netlify/functions/gemini-chat-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemContext, userMessage })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('[EMMA_CHAT] Proxy error:', err);
        return "I'm having trouble connecting right now. Please try again in a moment.";
      }

      const data = await response.json();
      return data.text || "I'm not sure how to answer that. Try asking about your courses, milestones, or career prospects!";
    } catch (err) {
      console.error('[EMMA_CHAT] Network error:', err);
      return "Couldn't reach Emma's AI. Check your internet connection and try again.";
    }
  }

  /**
   * Add a message bubble to the chat UI.
   */
  function addMessage(text, sender = 'emma') {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';
    bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                           .replace(/\n/g, '<br>');

    msg.appendChild(bubble);
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Handle user sending a message.
   */
  async function handleSend() {
    const input = document.getElementById('chat-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    // Show user message
    addMessage(text, 'user');
    input.value = '';

    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    const typingMsg = document.createElement('div');
    typingMsg.className = 'chat-msg emma';
    typingMsg.id = typingId;
    typingMsg.innerHTML = '<div class="chat-msg-bubble" style="opacity:0.6;">Emma is thinking...</div>';
    document.getElementById('chat-messages')?.appendChild(typingMsg);
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;

    // Get Emma's response
    const response = await askEmma(text);

    // Remove typing indicator and show response
    document.getElementById(typingId)?.remove();
    addMessage(response, 'emma');
  }

  /**
   * Initialize chat UI event handlers.
   */
  function init() {
    // Send button
    document.getElementById('chat-send-btn')?.addEventListener('click', handleSend);

    // Enter key
    document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    console.log('[EMMA_CHAT] ✅ Chat module initialized (inline mode)');
  }

  return { init, askEmma, addMessage };
})();
