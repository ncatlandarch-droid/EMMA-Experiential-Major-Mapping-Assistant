"""
Add experiential milestones to CAES-LA timeline.json
and tag existing milestones with type: "course"
"""
import json, sys, io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

TIMELINE_PATH = Path(r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\data\seeds\caes-la\timeline.json')

# Load existing timeline
with open(TIMELINE_PATH, 'r', encoding='utf-8') as f:
    timeline = json.load(f)

# Tag all existing milestones as "course"
for phase in timeline['phases']:
    for m in phase['milestones']:
        if 'type' not in m:
            m['type'] = 'course'

# ── EXPERIENTIAL MILESTONES ──
experiential = {
    "year-1": [
        # Purpose
        {"id": "y1-exp-purpose-1", "label": "Complete a career interest or strengths assessment through Career Services", "category": "Purpose", "semester": "fall"},
        {"id": "y1-exp-purpose-2", "label": "Attend 'What is Landscape Architecture?' departmental info session", "category": "Purpose", "semester": "fall"},
        {"id": "y1-exp-purpose-3", "label": "Meet with academic advisor to map 4-year goals", "category": "Purpose", "semester": "fall"},
        {"id": "y1-exp-purpose-4", "label": "Attend guest lectures from practicing landscape architects", "category": "Purpose", "semester": "spring"},
        {"id": "y1-exp-purpose-5", "label": "Explore different LA career paths (urban design, parks, ecological restoration)", "category": "Purpose", "semester": "spring"},
        {"id": "y1-exp-purpose-6", "label": "Begin a design reflection journal", "category": "Purpose", "semester": "fall"},
        {"id": "y1-exp-purpose-7", "label": "Reflect on personal values and career interests", "category": "Purpose", "semester": "spring"},
        {"id": "y1-exp-purpose-8", "label": "Set 1-2 short-term academic goals", "category": "Purpose", "semester": "fall"},
        # Communities
        {"id": "y1-exp-communities-1", "label": "Join the ASLA student chapter", "category": "Communities", "semester": "fall"},
        {"id": "y1-exp-communities-2", "label": "Attend NRED department welcome events and mixers", "category": "Communities", "semester": "fall"},
        {"id": "y1-exp-communities-3", "label": "Connect with an upperclassmen peer mentor in the LA program", "category": "Communities", "semester": "fall"},
        {"id": "y1-exp-communities-4", "label": "Join BLAN (Black Landscape Architecture Network)", "category": "Communities", "semester": "fall"},
        {"id": "y1-exp-communities-5", "label": "Attend campus involvement fairs and explore interdisciplinary orgs", "category": "Communities", "semester": "fall"},
        {"id": "y1-exp-communities-6", "label": "Participate in first-year learning community activities", "category": "Communities", "semester": "spring"},
        {"id": "y1-exp-communities-7", "label": "Build relationships with faculty through office hours", "category": "Communities", "semester": "spring"},
        # LocalGlobal
        {"id": "y1-exp-localglobal-1", "label": "Attend CAES welcome-back and community engagement events", "category": "LocalGlobal", "semester": "fall"},
        {"id": "y1-exp-localglobal-2", "label": "Participate in campus landscape walking tours and site sketching", "category": "LocalGlobal", "semester": "fall"},
        {"id": "y1-exp-localglobal-3", "label": "Volunteer at a local park cleanup or tree planting event", "category": "LocalGlobal", "semester": "spring"},
        {"id": "y1-exp-localglobal-4", "label": "Explore Greensboro's built environment through observation walks", "category": "LocalGlobal", "semester": "spring"},
        {"id": "y1-exp-localglobal-5", "label": "Attend a community planning meeting or public hearing", "category": "LocalGlobal", "semester": "spring"},
        # Identity
        {"id": "y1-exp-identity-1", "label": "Create or update your LinkedIn profile", "category": "Identity", "semester": "fall"},
        {"id": "y1-exp-identity-2", "label": "Attend Career Services resume workshop", "category": "Identity", "semester": "fall"},
        {"id": "y1-exp-identity-3", "label": "Start a digital portfolio (website or folder)", "category": "Identity", "semester": "spring"},
        {"id": "y1-exp-identity-4", "label": "Attend the CAES Career Fair", "category": "Identity", "semester": "spring"},
        {"id": "y1-exp-identity-5", "label": "Learn about LARE licensure pathway requirements", "category": "Identity", "semester": "spring"},
        {"id": "y1-exp-identity-6", "label": "Complete a professional dress or business etiquette workshop", "category": "Identity", "semester": "spring"},
        {"id": "y1-exp-identity-7", "label": "Participate in first-year professional development seminars", "category": "Identity", "semester": "fall"},
    ],
    "year-2": [
        # Purpose
        {"id": "y2-exp-purpose-1", "label": "Declare focus area within LA (design, planning, ecology)", "category": "Purpose", "semester": "fall"},
        {"id": "y2-exp-purpose-2", "label": "Refine career interests through studio coursework and critiques", "category": "Purpose", "semester": "fall"},
        {"id": "y2-exp-purpose-3", "label": "Conduct informational interviews with LA professionals", "category": "Purpose", "semester": "spring"},
        {"id": "y2-exp-purpose-4", "label": "Set long-term career and academic goals", "category": "Purpose", "semester": "fall"},
        {"id": "y2-exp-purpose-5", "label": "Attend industry guest lectures and webinars", "category": "Purpose", "semester": "spring"},
        {"id": "y2-exp-purpose-6", "label": "Explore minor or certificate options (GIS, sustainability, planning)", "category": "Purpose", "semester": "spring"},
        {"id": "y2-exp-purpose-7", "label": "Identify preferred work environments (firm, agency, nonprofit)", "category": "Purpose", "semester": "spring"},
        {"id": "y2-exp-purpose-8", "label": "Revisit and update academic plan with advisor", "category": "Purpose", "semester": "spring"},
        # Communities
        {"id": "y2-exp-communities-1", "label": "Take a leadership role in ASLA student chapter", "category": "Communities", "semester": "fall"},
        {"id": "y2-exp-communities-2", "label": "Volunteer through student organizations in the Greensboro community", "category": "Communities", "semester": "spring"},
        {"id": "y2-exp-communities-3", "label": "Attend ASLA regional or state chapter events", "category": "Communities", "semester": "spring"},
        {"id": "y2-exp-communities-4", "label": "Mentor incoming freshmen in the LA program", "category": "Communities", "semester": "fall"},
        {"id": "y2-exp-communities-5", "label": "Participate in interdisciplinary design charrettes", "category": "Communities", "semester": "spring"},
        {"id": "y2-exp-communities-6", "label": "Attend CAES Speaker Series events", "category": "Communities", "semester": "fall"},
        {"id": "y2-exp-communities-7", "label": "Engage in case-based learning with peers", "category": "Communities", "semester": "spring"},
        # LocalGlobal
        {"id": "y2-exp-localglobal-1", "label": "Explore study abroad opportunities (faculty-led or independent)", "category": "LocalGlobal", "semester": "fall"},
        {"id": "y2-exp-localglobal-2", "label": "Participate in community design service projects", "category": "LocalGlobal", "semester": "spring"},
        {"id": "y2-exp-localglobal-3", "label": "Attend civic engagement events related to urban development", "category": "LocalGlobal", "semester": "spring"},
        {"id": "y2-exp-localglobal-4", "label": "Visit local landscape architecture firms or project sites", "category": "LocalGlobal", "semester": "spring"},
        {"id": "y2-exp-localglobal-5", "label": "Participate in SFRIC community engagement activities", "category": "LocalGlobal", "semester": "fall"},
        # Identity
        {"id": "y2-exp-identity-1", "label": "Update portfolio with Year 1-2 studio work", "category": "Identity", "semester": "spring"},
        {"id": "y2-exp-identity-2", "label": "Attend mock interview workshops", "category": "Identity", "semester": "spring"},
        {"id": "y2-exp-identity-3", "label": "Apply for summer internship opportunities", "category": "Identity", "semester": "spring"},
        {"id": "y2-exp-identity-4", "label": "Attend professional conferences (ASLA, CELA)", "category": "Identity", "semester": "spring"},
        {"id": "y2-exp-identity-5", "label": "Begin LARE exam preparation awareness", "category": "Identity", "semester": "spring"},
        {"id": "y2-exp-identity-6", "label": "Participate in design competitions", "category": "Identity", "semester": "spring"},
        {"id": "y2-exp-identity-7", "label": "Attend career panels featuring LA alumni", "category": "Identity", "semester": "fall"},
    ],
    "year-3": [
        # Purpose
        {"id": "y3-exp-purpose-1", "label": "Clarify career focus area within landscape architecture", "category": "Purpose", "semester": "fall"},
        {"id": "y3-exp-purpose-2", "label": "Reflect on internship experiences and lessons learned", "category": "Purpose", "semester": "fall"},
        {"id": "y3-exp-purpose-3", "label": "Evaluate career fit through real-world project work", "category": "Purpose", "semester": "spring"},
        {"id": "y3-exp-purpose-4", "label": "Set post-graduation goals (grad school, employment, licensure)", "category": "Purpose", "semester": "spring"},
        {"id": "y3-exp-purpose-5", "label": "Engage in advanced design research", "category": "Purpose", "semester": "spring"},
        {"id": "y3-exp-purpose-6", "label": "Refine personal design philosophy statement", "category": "Purpose", "semester": "spring"},
        {"id": "y3-exp-purpose-7", "label": "Participate in career coaching sessions", "category": "Purpose", "semester": "fall"},
        {"id": "y3-exp-purpose-8", "label": "Explore graduate school options (MLA programs)", "category": "Purpose", "semester": "spring"},
        # Communities
        {"id": "y3-exp-communities-1", "label": "Attend ASLA Annual Meeting or regional conference", "category": "Communities", "semester": "fall"},
        {"id": "y3-exp-communities-2", "label": "Build professional network through firm visits and alumni", "category": "Communities", "semester": "spring"},
        {"id": "y3-exp-communities-3", "label": "Lead design charrettes or community workshops", "category": "Communities", "semester": "spring"},
        {"id": "y3-exp-communities-4", "label": "Serve as student ambassador for the LA program", "category": "Communities", "semester": "fall"},
        {"id": "y3-exp-communities-5", "label": "Present work at department reviews or symposia", "category": "Communities", "semester": "spring"},
        {"id": "y3-exp-communities-6", "label": "Collaborate on interdisciplinary research projects", "category": "Communities", "semester": "spring"},
        {"id": "y3-exp-communities-7", "label": "Maintain professional organization memberships", "category": "Communities", "semester": "fall"},
        # LocalGlobal
        {"id": "y3-exp-localglobal-1", "label": "Complete study abroad or faculty-led travel studio", "category": "LocalGlobal", "semester": "summer"},
        {"id": "y3-exp-localglobal-2", "label": "Engage in community-based design/build projects", "category": "LocalGlobal", "semester": "spring"},
        {"id": "y3-exp-localglobal-3", "label": "Participate in service-learning with community partners", "category": "LocalGlobal", "semester": "fall"},
        {"id": "y3-exp-localglobal-4", "label": "Apply design skills to real community challenges", "category": "LocalGlobal", "semester": "spring"},
        {"id": "y3-exp-localglobal-5", "label": "Attend conferences funded by department or university", "category": "LocalGlobal", "semester": "spring"},
        # Identity
        {"id": "y3-exp-identity-1", "label": "Complete a professional internship", "category": "Identity", "semester": "summer"},
        {"id": "y3-exp-identity-2", "label": "Prepare comprehensive design portfolio", "category": "Identity", "semester": "spring"},
        {"id": "y3-exp-identity-3", "label": "Submit work to ASLA Student Awards competition", "category": "Identity", "semester": "spring"},
        {"id": "y3-exp-identity-4", "label": "Network at professional events and career fairs", "category": "Identity", "semester": "spring"},
        {"id": "y3-exp-identity-5", "label": "Align skills with career interests through self-assessment", "category": "Identity", "semester": "fall"},
        {"id": "y3-exp-identity-6", "label": "Research graduate school options if applicable", "category": "Identity", "semester": "spring"},
        {"id": "y3-exp-identity-7", "label": "Refine personal mission statement", "category": "Identity", "semester": "spring"},
    ],
    "year-4": [
        # Purpose
        {"id": "y4-exp-purpose-1", "label": "Finalize career goals and target employers/firms", "category": "Purpose", "semester": "fall"},
        {"id": "y4-exp-purpose-2", "label": "Complete capstone or senior thesis project", "category": "Purpose", "semester": "spring"},
        {"id": "y4-exp-purpose-3", "label": "Align job search with personal values and design philosophy", "category": "Purpose", "semester": "fall"},
        {"id": "y4-exp-purpose-4", "label": "Reflect on 4-year academic and professional growth", "category": "Purpose", "semester": "spring"},
        {"id": "y4-exp-purpose-5", "label": "Clarify leadership and design philosophy", "category": "Purpose", "semester": "fall"},
        {"id": "y4-exp-purpose-6", "label": "Prepare personal career narrative", "category": "Purpose", "semester": "spring"},
        {"id": "y4-exp-purpose-7", "label": "Evaluate strengths and growth areas", "category": "Purpose", "semester": "fall"},
        {"id": "y4-exp-purpose-8", "label": "Identify long-term career trajectory", "category": "Purpose", "semester": "spring"},
        # Communities
        {"id": "y4-exp-communities-1", "label": "Mentor junior students in the LA program", "category": "Communities", "semester": "fall"},
        {"id": "y4-exp-communities-2", "label": "Present capstone at CAES research symposium", "category": "Communities", "semester": "spring"},
        {"id": "y4-exp-communities-3", "label": "Maintain professional network connections", "category": "Communities", "semester": "spring"},
        {"id": "y4-exp-communities-4", "label": "Participate in alumni transition activities", "category": "Communities", "semester": "spring"},
        {"id": "y4-exp-communities-5", "label": "Attend graduation and transition ceremonies", "category": "Communities", "semester": "spring"},
        {"id": "y4-exp-communities-6", "label": "Give back to the LA program community", "category": "Communities", "semester": "spring"},
        {"id": "y4-exp-communities-7", "label": "Connect with ASLA emerging professionals group", "category": "Communities", "semester": "spring"},
        # LocalGlobal
        {"id": "y4-exp-localglobal-1", "label": "Apply design skills to community impact projects", "category": "LocalGlobal", "semester": "fall"},
        {"id": "y4-exp-localglobal-2", "label": "Explore national and international job opportunities", "category": "LocalGlobal", "semester": "spring"},
        {"id": "y4-exp-localglobal-3", "label": "Engage in pro-bono community design work", "category": "LocalGlobal", "semester": "fall"},
        {"id": "y4-exp-localglobal-4", "label": "Present portfolio to external reviewers and professionals", "category": "LocalGlobal", "semester": "spring"},
        {"id": "y4-exp-localglobal-5", "label": "Explore global landscape architecture practice", "category": "LocalGlobal", "semester": "spring"},
        # Identity
        {"id": "y4-exp-identity-1", "label": "Finalize professional portfolio for job applications", "category": "Identity", "semester": "fall"},
        {"id": "y4-exp-identity-2", "label": "Apply to positions at target firms and organizations", "category": "Identity", "semester": "spring"},
        {"id": "y4-exp-identity-3", "label": "Create LARE exam preparation plan", "category": "Identity", "semester": "spring"},
        {"id": "y4-exp-identity-4", "label": "Attend final career fair and networking events", "category": "Identity", "semester": "fall"},
        {"id": "y4-exp-identity-5", "label": "Practice professional interviews", "category": "Identity", "semester": "fall"},
        {"id": "y4-exp-identity-6", "label": "Create 5-year professional development plan", "category": "Identity", "semester": "spring"},
        {"id": "y4-exp-identity-7", "label": "Complete professional headshot and update LinkedIn", "category": "Identity", "semester": "spring"},
    ]
}

# Add experiential milestones to each phase
for phase in timeline['phases']:
    phase_id = phase['id']
    if phase_id in experiential:
        for exp_m in experiential[phase_id]:
            milestone = {
                "id": exp_m["id"],
                "label": exp_m["label"],
                "courseRef": "Experiential",
                "credits": 0,
                "category": exp_m["category"],
                "semester": exp_m["semester"],
                "type": "experiential",
                "description": exp_m["label"],
                "skills": []
            }
            phase['milestones'].append(milestone)

# Count results
total_course = 0
total_exp = 0
for phase in timeline['phases']:
    c = sum(1 for m in phase['milestones'] if m.get('type') == 'course')
    e = sum(1 for m in phase['milestones'] if m.get('type') == 'experiential')
    total_course += c
    total_exp += e
    print(f"  {phase['name']}: {c} course + {e} experiential = {c+e} total")

print(f"\n  TOTAL: {total_course} course + {total_exp} experiential = {total_course + total_exp} milestones")

# Save
with open(TIMELINE_PATH, 'w', encoding='utf-8') as f:
    json.dump(timeline, f, indent=2, ensure_ascii=False)

print(f"\n✅ Updated: {TIMELINE_PATH.name}")
