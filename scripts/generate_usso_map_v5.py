"""
EMMA USSO Major Map Generator V5
─────────────────────────────────
Performs XML surgery on the official USSO Management major-map template
to produce pixel-perfect Landscape Architecture (CAES-LA) major maps.

Approach:
  1. Open the template .docx (ZIP of XML)
  2. Parse word/document.xml with lxml
  3. Replace text in ALL <w:t> nodes — including those inside
     <w:txbxContent> text boxes and VML fallback shapes
  4. Populate content sections from branding.json + timeline.json
  5. Save as a new .docx in the project output/ directory

Usage:
  python scripts/generate_usso_map_v5.py --program caes-la
"""

import argparse
import io
import json
import re
import sys
import zipfile
from datetime import datetime
from pathlib import Path
from lxml import etree

# ── Encoding safety ──────────────────────────────────────────────────
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# ── Paths ─────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant')
TEMPLATE_PATH = PROJECT_ROOT / 'assets' / 'templates' / 'usso-major-map-template.docx'
DATA_DIR = PROJECT_ROOT / 'data' / 'seeds'
OUTPUT_DIR = PROJECT_ROOT / 'output'

# ── XML namespaces used in Word OOXML ─────────────────────────────────
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'


# ═══════════════════════════════════════════════════════════════════════
#  CORE XML SURGERY
# ═══════════════════════════════════════════════════════════════════════

def get_paragraph_text(p_elem):
    """Extract the full concatenated text from a <w:p> paragraph element."""
    parts = []
    for t in p_elem.iter(f'{{{W}}}t'):
        if t.text:
            parts.append(t.text)
    return ''.join(parts)


def replace_in_paragraph(p_elem, old_text, new_text):
    """
    Replace old_text with new_text within a single <w:p> element,
    handling text that is split across multiple <w:r>/<w:t> runs.
    Only modifies the minimum number of <w:t> elements necessary.
    Returns True if a replacement was made.
    """
    t_elements = list(p_elem.iter(f'{{{W}}}t'))
    if not t_elements:
        return False

    # Build full text and map each character → (t_elem, char_index)
    char_map = []
    full_text = ''
    for t in t_elements:
        txt = t.text or ''
        for i, ch in enumerate(txt):
            char_map.append((t, i))
        full_text += txt

    idx = full_text.find(old_text)
    if idx == -1:
        return False

    end_idx = idx + len(old_text)
    if not char_map or end_idx > len(char_map):
        return False

    start_t, start_char = char_map[idx]
    end_t, end_char = char_map[end_idx - 1]

    if start_t is end_t:
        # Simple: match within a single <w:t>
        orig = start_t.text or ''
        start_t.text = orig[:start_char] + new_text + orig[end_char + 1:]
    else:
        # Match spans multiple <w:t> elements
        orig_start = start_t.text or ''
        start_t.text = orig_start[:start_char] + new_text

        in_range = False
        for t in t_elements:
            if t is start_t:
                in_range = True
                continue
            if in_range:
                if t is end_t:
                    orig_end = t.text or ''
                    t.text = orig_end[end_char + 1:]
                    break
                else:
                    t.text = ''

    # Ensure xml:space="preserve" on modified elements so Word keeps whitespace
    for t in [start_t, end_t]:
        if t.text and (' ' in t.text or t.text != t.text.strip()):
            t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')

    return True


def replace_all_occurrences(root, old_text, new_text):
    """
    Replace ALL occurrences of old_text across every <w:p> in the document,
    including those inside <w:txbxContent> text boxes (both drawingML and VML).
    """
    if not old_text or old_text == new_text:
        return
    # Iterate every paragraph in the entire XML tree
    for p in root.iter(f'{{{W}}}p'):
        # Keep replacing in same paragraph until no more matches
        while replace_in_paragraph(p, old_text, new_text):
            pass


def replace_paragraph_full_text(p_elem, new_text):
    """
    Replace the ENTIRE visible text content of a paragraph with new_text,
    keeping the first <w:r>/<w:t>'s formatting. Clears extra runs.
    """
    t_elements = list(p_elem.iter(f'{{{W}}}t'))
    if not t_elements:
        return
    # Set first <w:t> to new text
    t_elements[0].text = new_text
    t_elements[0].set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    # Clear remaining <w:t> elements
    for t in t_elements[1:]:
        t.text = ''


def find_textboxes_containing(root, search_text):
    """
    Find all <w:txbxContent> elements that contain search_text
    (concatenated across their <w:t> nodes).
    Returns list of txbxContent elements.
    """
    results = []
    # Search in both w:txbxContent (from drawingML) and v:textbox content
    for txbx in root.iter(f'{{{W}}}txbxContent'):
        full = ''
        for t in txbx.iter(f'{{{W}}}t'):
            if t.text:
                full += t.text
        if search_text in full:
            results.append(txbx)
    return results


def get_bullet_paragraphs(txbx_content, after_header=None):
    """
    Get bullet-list paragraphs from a txbxContent element.
    If after_header is given, only return paragraphs after the header line.
    Returns list of <w:p> elements that use list numbering (numPr).
    """
    paragraphs = list(txbx_content.iter(f'{{{W}}}p'))
    start_collecting = after_header is None

    result = []
    for p in paragraphs:
        full_text = get_paragraph_text(p)

        if not start_collecting:
            if after_header and after_header in full_text:
                start_collecting = True
            continue

        # Check if this paragraph has bullet numbering
        ppr = p.find(f'{{{W}}}pPr')
        if ppr is not None:
            numpr = ppr.find(f'{{{W}}}numPr')
            if numpr is not None:
                result.append(p)

    return result


def replace_bullet_list(txbx_elements, header_text, new_items):
    """
    In text boxes containing header_text, find the bulleted items
    and replace them with new_items. Handles both drawingML and VML copies.
    """
    for txbx in txbx_elements:
        bullets = get_bullet_paragraphs(txbx, after_header=header_text)
        for i, p in enumerate(bullets):
            if i < len(new_items):
                replace_paragraph_full_text(p, new_items[i])
            else:
                # Clear excess original bullets
                replace_paragraph_full_text(p, '')


def replace_description_block(root, marker_text, new_description):
    """
    Find the 'WHAT IS ...' text box and replace the description paragraph.
    The description is typically a non-bulleted paragraph within the same textbox,
    appearing as the main body text after the header.
    """
    # Find text boxes with the "WHAT IS" header
    for txbx in root.iter(f'{{{W}}}txbxContent'):
        full = ''
        for t in txbx.iter(f'{{{W}}}t'):
            if t.text:
                full += t.text

        if marker_text not in full:
            continue

        # The description is typically the long prose paragraph (no list numbering)
        # that appears right after the header
        paragraphs = list(txbx.iter(f'{{{W}}}p'))
        found_header = False
        for p in paragraphs:
            p_text = get_paragraph_text(p)
            if marker_text in p_text:
                found_header = True
                continue
            if found_header:
                # Check this is a prose paragraph (not a bullet)
                ppr = p.find(f'{{{W}}}pPr')
                has_numpr = False
                if ppr is not None:
                    has_numpr = ppr.find(f'{{{W}}}numPr') is not None
                # If it's a substantial text paragraph, replace it
                if not has_numpr and len(p_text) > 30:
                    replace_paragraph_full_text(p, new_description)
                    break


# ═══════════════════════════════════════════════════════════════════════
#  DATA LOADING
# ═══════════════════════════════════════════════════════════════════════

def load_program_data(slug):
    """Load branding.json and timeline.json for a given program slug."""
    seed_dir = DATA_DIR / slug
    with open(seed_dir / 'branding.json', 'r', encoding='utf-8') as f:
        branding = json.load(f)
    with open(seed_dir / 'timeline.json', 'r', encoding='utf-8') as f:
        timeline = json.load(f)
    return branding, timeline


def extract_experiential_milestones(timeline):
    """
    Extract non-course milestones from timeline.json, organized by
    year (phase) and category for the Page 2 checklist.
    Returns dict: {(year_idx, category): [milestone_labels]}
    """
    milestones = {}
    cat_keys = ['Purpose', 'Communities', 'LocalGlobal', 'Identity']

    for phase_idx, phase in enumerate(timeline.get('phases', [])):
        for m in phase.get('milestones', []):
            if m.get('type') == 'course':
                continue
            cat = m.get('category', '')
            if cat in cat_keys:
                key = (phase_idx, cat)
                if key not in milestones:
                    milestones[key] = []
                milestones[key].append(m.get('label', ''))

    return milestones


# ═══════════════════════════════════════════════════════════════════════
#  MAIN GENERATOR
# ═══════════════════════════════════════════════════════════════════════

def generate_map(slug):
    """Generate the USSO major map for the given program slug."""
    print(f'📋 Loading data for: {slug}')
    branding, timeline = load_program_data(slug)

    # ── Extract data from branding.json ──────────────────────────────
    prog_name = branding.get('programName', '')
    college_raw = branding.get('collegeName', '')
    # Strip parenthetical abbreviation: "College of ... (CAES)" → "College of ..."
    college = re.sub(r'\s*\([A-Za-z]+\)\s*', ' ', college_raw).strip()
    description = branding.get('programDescription', '')
    prog_short = prog_name.split(' in ')[-1] if ' in ' in prog_name else prog_name

    co = branding.get('careerOutlook', {})
    study_topics = co.get('studyTopics', [])
    job_titles = co.get('jobTitles', [])
    growth_rate = co.get('growthRate', 'N/A')
    median_salary = co.get('medianSalary', 'N/A')
    total_jobs = co.get('totalJobs', 'N/A')

    orgs = branding.get('professionalOrgs', [])
    org_names = [o.get('name', str(o)) if isinstance(o, dict) else str(o) for o in orgs]

    exp_milestones = extract_experiential_milestones(timeline)

    # ── Step 1: Build global text replacements ────────────────────────
    # Order matters: longest/most-specific first to avoid partial matches
    global_replacements = [
        # Full degree title (most specific first)
        ('Bachelor of Science in Management', 'Bachelor of Science in Landscape Architecture'),

        # College name
        ('Deese College of Business and Economics', college),

        # "WHAT IS MANAGEMENT?" header → "WHAT IS LANDSCAPE ARCHITECTURE?"
        ('WHAT IS MANAGEMENT?', f'WHAT IS {prog_short.upper()}?'),
        ('WHAT IS MANAGEMENT ?', f'WHAT IS {prog_short.upper()}?'),

        # Section headers with MGMT abbreviation
        ('WHAT TOPICS TO MGMT MAJORS STUDY?', f'WHAT TOPICS DO {prog_short.upper()} MAJORS STUDY?'),
        ('WHAT DO MGMT MAJORS DO AFTER GRADUATION?', f'WHAT DO {prog_short.upper()} MAJORS DO AFTER GRADUATION?'),

        # Uppercase program name (catch remaining instances)
        ('MANAGEMENT', 'LANDSCAPE ARCHITECTURE'),

        # Title case
        ('Management', 'Landscape Architecture'),

        # Lowercase
        ('management', 'landscape architecture'),

        # Abbreviation (careful: only replace standalone MGMT)
        ('MGMT', 'LA'),

        # Career subsection headers from Management template
        ('Business & Operations', 'Design Practice'),
        ('Business Administration', 'Landscape Design'),
        ('Consulting and Leadership Development', 'Environmental Planning & Design'),
        ('Entrepreneurship', 'Ecological Design'),
        ('Nonprofit & Public Sector', 'Public Sector & Community Design'),
        ('Consulting', 'Environmental Planning'),
        ('Nonprofit', 'Public Sector'),

        # Quick Facts — verified BLS May 2024 + program data
        # Template has 6 stat boxes with percentages + descriptions
        ('62% ', f'{median_salary} '),
        ('of LA majors receive', f'median salary for landscape architects (BLS May 2024)'),
        ('53% ', f'{growth_rate.split("(")[0].strip()} '),
        ('of LA majors secure a career position or graduate', f'projected growth {growth_rate.split("(")[1].replace(")", "").strip() if "(" in growth_rate else ""} — ~1,700 openings/year (BLS)'),
        ('42%', f'{total_jobs}'),
        ('of LA majors with a concentration in Landscape Design complete leadership roles in student organizations', f'total landscape architecture jobs nationwide (BLS 2024)'),
        ('36%', f'1976'),
        ('of LA majors with a concentration in Human Resources participate in externships with actual employers.', f'— year NC A&T established its landscape architecture program'),
        ('31%', f'Only'),
        ('of LA majors with a concentration in International Landscape Architecture participate in study abroad experiences', f'HBCU in the nation offering a LAAB-accredited undergraduate BSLA degree'),
        ('30%', f'24'),
        ('of LA majors with a concentration in Human Resources have local HR mentors to guide their career trajectory.', f'LDAR studio and lecture courses across the 4-year curriculum'),
    ]

    # ── Step 2: Parse document XML and apply replacements ─────────────
    print('🔧 Opening template and performing XML surgery...')

    with zipfile.ZipFile(str(TEMPLATE_PATH), 'r') as zin:
        doc_xml = zin.read('word/document.xml')

    root = etree.fromstring(doc_xml)

    # Phase A: Global text replacements across ALL <w:t> nodes
    for old_text, new_text in global_replacements:
        replace_all_occurrences(root, old_text, new_text)

    # Phase B: Replace "WHAT IS" description paragraph
    what_is_header = f'WHAT IS {prog_short.upper()}?'
    replace_description_block(root, what_is_header, description)

    # Phase C: Replace study topics text box (18 paragraphs in template)
    # Structure: Para 0=header, 1-5=study bullets, 6-7=unique prose,
    #            8-10=practice bullets, 11=life skills header, 12-17=life skills
    study_boxes = find_textboxes_containing(root, 'TOPICS')
    if study_boxes and study_topics:
        for txbx in study_boxes:
            paras = list(txbx.iter(f'{{{W}}}p'))
            # Para 0 = header (already replaced by global)
            # Paras 1-5 = study topic bullets (replace with our study topics)
            for i in range(1, min(6, len(paras))):
                if i - 1 < len(study_topics):
                    replace_paragraph_full_text(paras[i], study_topics[i - 1])
            # Paras 6-7 = "What makes [program] unique..." prose
            if len(paras) > 6:
                replace_paragraph_full_text(paras[6],
                    f'What makes landscape architecture unique is its focus on real-world application. You won\u2019t')
            if len(paras) > 7:
                replace_paragraph_full_text(paras[7],
                    'just learn theories\u2014you\u2019ll practice them through:')
            # Paras 8-10 = practice method bullets
            practice_items = [
                'Studio projects and design critiques',
                'Internships and field experiences',
                'Community engagement and service-learning projects'
            ]
            for i in range(8, min(11, len(paras))):
                if i - 8 < len(practice_items):
                    replace_paragraph_full_text(paras[i], practice_items[i - 8])
            # Para 11 = "You'll also build important life skills" (keep as-is)
            # Paras 12-17 = life skills bullets
            life_skills = [
                'Environmental stewardship',
                'Critical thinking & problem solving',
                'Visual communication',
                'Technical proficiency (CAD, GIS, 3D)',
                'Collaboration & teamwork',
                'Professional ethics'
            ]
            for i in range(12, min(18, len(paras))):
                if i - 12 < len(life_skills):
                    replace_paragraph_full_text(paras[i], life_skills[i - 12])

    # Phase D: Replace career directions text box (27 paragraphs)
    # Structure: header, intro prose, blank, then 4 subsections each with
    #            header + 3-4 bullets + blank separator
    career_boxes = find_textboxes_containing(root, 'AFTER GRADUATION')
    if career_boxes and job_titles:
        for txbx in career_boxes:
            paras = list(txbx.iter(f'{{{W}}}p'))
            # Para 0 = section header (already replaced by global)
            # Para 1 = intro prose
            if len(paras) > 1:
                replace_paragraph_full_text(paras[1],
                    'One of the best things about a landscape architecture degree is flexibility\u2014it prepares you for '
                    'careers in design firms, government agencies, nonprofits, and more. Instead of locking you into '
                    'one path, it gives you skills you can apply across many fields.')
            # Para 2 = blank spacer
            # Subsection 1: Design Practice (paras 3-7)
            if len(paras) > 3:
                replace_paragraph_full_text(paras[3], '\U0001f3d7\ufe0f Design Practice')
            career_sub1 = ['Landscape Designer', 'Site Planner', 'Urban Designer',
                           'Designing parks, campuses, streetscapes, and public spaces']
            for i in range(4, min(8, len(paras))):
                if i - 4 < len(career_sub1):
                    replace_paragraph_full_text(paras[i], career_sub1[i - 4])
            # Subsection 2: Environmental Planning (paras 8-11)
            if len(paras) > 8:
                replace_paragraph_full_text(paras[8], '\U0001f33f Environmental Planning & Restoration')
            career_sub2 = ['Green Infrastructure Specialist', 'Environmental Restoration Designer',
                           'Stormwater Management Designer']
            for i in range(9, min(12, len(paras))):
                if i - 9 < len(career_sub2):
                    replace_paragraph_full_text(paras[i], career_sub2[i - 9])
            # Para 12 = blank spacer
            if len(paras) > 12:
                replace_paragraph_full_text(paras[12], '')
            # Subsection 3: Public Sector (paras 13-17)
            if len(paras) > 13:
                replace_paragraph_full_text(paras[13], '\U0001f3db\ufe0f Government & Public Sector')
            career_sub3 = ['Parks & Recreation Planner', 'Campus & Institutional Planner',
                           'Working with NPS, NRCS/USDA, State DOTs, and municipal agencies',
                           'Shaping policy on green infrastructure and public space']
            for i in range(14, min(18, len(paras))):
                if i - 14 < len(career_sub3):
                    replace_paragraph_full_text(paras[i], career_sub3[i - 14])
            # Para 18 = blank spacer
            if len(paras) > 18:
                replace_paragraph_full_text(paras[18], '')
            # Subsection 4: Consulting & Private (paras 19-22)
            if len(paras) > 19:
                replace_paragraph_full_text(paras[19], '\U0001f4bc Consulting & Private Development')
            career_sub4 = ['Project Manager', 'Land Development Consultant',
                           'Working with firms like AECOM, SWA, Sasaki, HOK, Design Workshop']
            for i in range(20, min(23, len(paras))):
                if i - 20 < len(career_sub4):
                    replace_paragraph_full_text(paras[i], career_sub4[i - 20])
            # Para 23 = blank spacer
            if len(paras) > 23:
                replace_paragraph_full_text(paras[23], '')
            # Subsection 5: Licensure (paras 24-26)
            if len(paras) > 24:
                replace_paragraph_full_text(paras[24], '\U0001f4dd Licensure & Advanced Practice')
            career_sub5 = ['Pursue LARE licensure after 4 years of professional experience',
                           'Advance to principal, partner, or department head roles']
            for i in range(25, min(27, len(paras))):
                if i - 25 < len(career_sub5):
                    replace_paragraph_full_text(paras[i], career_sub5[i - 25])

    # Phase E: Quick Facts — already handled via global_replacements above

    # Phase F: Replace student organizations
    # The org names in the template are split across <w:t> nodes
    # so we replace by the individual words we found in the scan
    org_text = '  |  '.join(org_names) if org_names else 'Contact your advisor for student organization opportunities.'
    org_replacements = [
        ('Exceptional', org_names[0] if len(org_names) > 0 else ''),
        ('Minorities', ''),
        ('in', ''),
        ('Students', ''),
        ('Alpha', org_names[1] if len(org_names) > 1 else ''),
        ('Kappa', ''),
        ('Psi', ''),
    ]
    # Instead of word-by-word, replace the full org band text
    # Find the org text boxes and replace bullet content
    org_boxes = find_textboxes_containing(root, 'JOIN')
    if org_boxes:
        for txbx in org_boxes:
            paras = list(txbx.iter(f'{{{W}}}p'))
            for p in paras:
                p_text = get_paragraph_text(p)
                # Replace the org listing paragraph (not the header)
                if p_text and 'JOIN' not in p_text and 'STUDENT' not in p_text and len(p_text) > 5:
                    replace_paragraph_full_text(p, org_text)

    # Phase G: Replace Page 2 checklist milestones
    # The checklist is a real Word table with 5 rows × 5 columns.
    # Row 0 = year headers, Rows 1-4 = category rows
    # Cell 0 = category label, Cells 1-4 = year milestone lists
    # Each content cell has 10-11 paragraphs in the Management template.
    TC = f'{{{W}}}tc'
    TR = f'{{{W}}}tr'
    TBL = f'{{{W}}}tbl'
    
    tables = list(root.iter(TBL))
    cat_keys = ['Purpose', 'Communities', 'LocalGlobal', 'Identity']
    
    for tbl in tables:
        tbl_text = ''
        for t in tbl.iter(f'{{{W}}}t'):
            if t.text:
                tbl_text += t.text
        
        if 'DISCOVER' in tbl_text or 'EXPLORE' in tbl_text or 'FRESHMAN' in tbl_text:
            # Use findall for direct children only (not recursive iter)
            rows = tbl.findall(f'{{{W}}}tr')
            print(f'   📋 Checklist table: {len(rows)} rows')
            
            for cat_idx, cat_key in enumerate(cat_keys):
                row_idx = cat_idx + 1  # skip header row
                if row_idx >= len(rows):
                    break
                row = rows[row_idx]
                cells = row.findall(f'{{{W}}}tc')
                
                for year_idx in range(4):
                    cell_idx = year_idx + 1
                    if cell_idx >= len(cells):
                        break
                    cell = cells[cell_idx]
                    key = (year_idx, cat_key)
                    items = exp_milestones.get(key, [])
                    
                    # Truncate milestone labels to ~50 chars to prevent overflow
                    short_items = []
                    for item in items:
                        if len(item) > 55:
                            # Truncate at last space before 55 chars
                            cut = item[:55].rfind(' ')
                            if cut > 20:
                                short_items.append(item[:cut])
                            else:
                                short_items.append(item[:55])
                        else:
                            short_items.append(item)
                    
                    # Get paragraphs in this cell (direct children only)
                    cell_paras = cell.findall(f'{{{W}}}p')
                    
                    # Replace text — don't exceed the template's paragraph count
                    max_items = min(len(short_items), len(cell_paras))
                    for p_idx, p in enumerate(cell_paras):
                        if p_idx < max_items:
                            replace_paragraph_full_text(p, short_items[p_idx])
                        else:
                            replace_paragraph_full_text(p, '')
            
            print(f'   ✅ Checklist milestones populated')
            break

    # ── Step 3: Serialize and write output ────────────────────────────
    modified_xml = etree.tostring(root, xml_declaration=True,
                                   encoding='UTF-8', standalone=True)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Build output filename
    slug_upper = slug.upper().replace('-', '-')
    output_filename = f'{slug_upper}_Experiential_Major_Map.docx'
    output_path = OUTPUT_DIR / output_filename

    with zipfile.ZipFile(str(TEMPLATE_PATH), 'r') as zin:
        with zipfile.ZipFile(str(output_path), 'w', zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename == 'word/document.xml':
                    zout.writestr(item, modified_xml)
                else:
                    zout.writestr(item, zin.read(item.filename))

    print(f'✅ Generated: {output_path}')
    print(f'   📄 File size: {output_path.stat().st_size:,} bytes')

    # ── Verification pass ─────────────────────────────────────────────
    verify_output(output_path, branding)

    return str(output_path)


def verify_output(docx_path, branding):
    """Quick verification that key replacements landed correctly."""
    print('\n🔍 Verification pass...')
    with zipfile.ZipFile(str(docx_path), 'r') as z:
        xml_data = z.read('word/document.xml')

    # Decode to string for checking
    xml_str = xml_data.decode('utf-8')

    checks = {
        'Program name': 'Landscape Architecture',
        'College name': 'Agriculture and Environmental Sciences',
        'No residual "Management"': 'Management' not in xml_str.replace('Landscape Architecture', '').replace('Stormwater Management', ''),
        'No residual "MGMT"': 'MGMT' not in xml_str,
        'Description present': branding['programDescription'][:50] in xml_str,
    }

    all_passed = True
    for label, check in checks.items():
        if isinstance(check, bool):
            status = '✅' if check else '❌'
            if not check:
                all_passed = False
            print(f'   {status} {label}')
        else:
            found = check in xml_str
            status = '✅' if found else '❌'
            if not found:
                all_passed = False
            print(f'   {status} {label}: {"found" if found else "NOT FOUND"}')

    if all_passed:
        print('\n🎉 All verification checks passed!')
    else:
        print('\n⚠️  Some checks failed — review output document manually.')


# ═══════════════════════════════════════════════════════════════════════
#  CLI ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description='EMMA USSO Major Map Generator V5 — '
                    'XML surgery on the official USSO template'
    )
    parser.add_argument(
        '--program', '-p',
        default='caes-la',
        help='Program slug (default: caes-la). '
             'Must match a directory under data/seeds/'
    )
    parser.add_argument(
        '--template', '-t',
        default=None,
        help='Override template .docx path '
             '(default: assets/templates/usso-major-map-template.docx)'
    )
    parser.add_argument(
        '--output-dir', '-o',
        default=None,
        help='Override output directory (default: output/)'
    )
    args = parser.parse_args()

    # Allow template override
    global TEMPLATE_PATH, OUTPUT_DIR
    if args.template:
        TEMPLATE_PATH = Path(args.template)
    if args.output_dir:
        OUTPUT_DIR = Path(args.output_dir)

    # Validate inputs
    if not TEMPLATE_PATH.exists():
        print(f'❌ Template not found: {TEMPLATE_PATH}')
        sys.exit(1)

    seed_dir = DATA_DIR / args.program
    if not seed_dir.exists():
        print(f'❌ Program data not found: {seed_dir}')
        sys.exit(1)

    generate_map(args.program)


if __name__ == '__main__':
    main()
