"""
EMMA USSO Major Map Generator V5
Surgical run-level text replacement. Only modifies the specific <w:t> 
elements that contain search text, handling cross-run splits carefully.
"""
import json, sys, io, re, zipfile
from pathlib import Path
from lxml import etree
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

TEMPLATE_PATH = Path(r'C:\Users\Chris\Downloads\BS in Animal Science.docx')
PROJECT_ROOT = Path(r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant')
DATA_DIR = PROJECT_ROOT / 'data' / 'seeds'
OUTPUT_DIR = Path(r'C:\Users\Chris\Downloads\USSO-Maps')
OUTPUT_DIR.mkdir(exist_ok=True)

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'


def replace_in_paragraph(p_elem, old_text, new_text):
    """
    Replace old_text with new_text within a single <w:p> element,
    handling text split across multiple <w:r>/<w:t> elements.
    Only modifies the minimum number of <w:t> elements necessary.
    Returns True if a replacement was made.
    """
    t_elements = list(p_elem.iter(f'{{{W}}}t'))
    if not t_elements:
        return False

    # Build full text and map each character to its source (t_elem, char_index)
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

    # Find which t_elements are involved
    if not char_map or end_idx > len(char_map):
        return False

    start_t, start_char = char_map[idx]
    end_t, end_char = char_map[end_idx - 1]

    if start_t is end_t:
        # Simple case: match is within a single <w:t> element
        orig = start_t.text or ''
        start_t.text = orig[:start_char] + new_text + orig[end_char + 1:]
    else:
        # Match spans multiple <w:t> elements
        # Put replacement in start_t, clear intermediates, trim end_t
        orig_start = start_t.text or ''
        start_t.text = orig_start[:start_char] + new_text

        # Clear all intermediate elements and trim end
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

    return True


def do_replacements(xml_bytes, replacements):
    """Parse XML, do all replacements across paragraphs, return modified XML."""
    root = etree.fromstring(xml_bytes)

    for old_text, new_text in replacements:
        if not old_text or old_text == new_text:
            continue
        # Try replacement in every paragraph in the document
        for p in root.iter(f'{{{W}}}p'):
            replace_in_paragraph(p, old_text, new_text)

    return etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)


def load_program_data(slug):
    seed_dir = DATA_DIR / slug
    with open(seed_dir / 'branding.json', 'r', encoding='utf-8') as f:
        branding = json.load(f)
    with open(seed_dir / 'timeline.json', 'r', encoding='utf-8') as f:
        timeline = json.load(f)
    return branding, timeline


def generate_map(slug):
    branding, timeline = load_program_data(slug)

    prog_name = branding.get('programName', 'Program Name')
    college_raw = branding.get('collegeName', 'College')
    college = re.sub(r'\s*\([A-Za-z]+\)\s*', ' ', college_raw).strip()
    tagline = branding.get('tagline', '')
    description = branding.get('programDescription', '')
    prog_short = prog_name.split(' in ')[-1] if ' in ' in prog_name else prog_name

    co = branding.get('careerOutlook', {})
    careers = co.get('relatedFields', [])[:10]
    employers = co.get('topEmployers', [])[:8]

    highlights = branding.get('programHighlights', [])
    if not highlights:
        ks = co.get('keySkills', [])
        certs = co.get('certifications', [])
        if ks:
            highlights.append('Strong foundation in ' + ', '.join(ks[:3]))
        for c in certs[:2]:
            highlights.append('Pathway to ' + str(c))
        if co.get('medianSalary'):
            highlights.append('Median salary of ' + str(co['medianSalary']))
        if co.get('growthRate'):
            highlights.append('BLS projects ' + str(co['growthRate']) + ' job growth')
    while len(highlights) < 5:
        highlights.append('')

    grad = branding.get('graduatePathways', [])
    if not grad:
        grad = ["Master\u2019s programs in " + prog_short + " and related fields",
                "Doctoral programs based on student interests",
                "Professional certifications and licensure", ""]
    while len(grad) < 4:
        grad.append('')

    orgs = branding.get('professionalOrgs', [])
    org_names = [o.get('name', o) if isinstance(o, dict) else str(o) for o in orgs]
    while len(org_names) < 6:
        org_names.append('')
    while len(careers) < 10:
        careers.append('')
    while len(employers) < 8:
        employers.append('')

    # ── Replacement pairs (longest/most specific first) ──
    replacements = [
        # Title
        ('Bachelor of Science in Animal Science', prog_name),
        # College
        ('College of Agriculture and Environmental Sciences', college),
        # Section headers
        ('WHAT IS ANIMAL SCIENCE ?', f'WHAT IS {prog_short.upper()}?'),
        ('WHAT IS ANIMAL SCIENCE?', f'WHAT IS {prog_short.upper()}?'),
        ('WHAT DO ANIMAL SCIENCE MAJORS DO AFTER GRADUATION?', f'WHAT DO {prog_short.upper()} MAJORS DO AFTER GRADUATION?'),
        ('WHAT DO ANIMAL SCIENCE  MAJORS DO AFTER GRADUATION?', f'WHAT DO {prog_short.upper()} MAJORS DO AFTER GRADUATION?'),
        # Tagline
        ('Graduates develop practical expertise that supports careers advancing animal welfare, strengthening global food systems, and contributing to veterinary, pharmaceutical, and research innovation.', tagline),
        # Description
        ('The Bachelor of Science in Animal Science provides a comprehensive, science-based education focused on the study of domestic livestock, including sheep, cattle, goats, swine, horses, and poultry. Students develop a strong foundation in biological and physical sciences while gaining specialized knowledge in animal health, nutrition, reproduction, and management. Through a combination of coursework and experiential learning, including summer internships, students build practical skills in critical thinking, research, and industry-relevant problem-solving. The program prepares graduates for advanced study in veterinary or human medicine, as well as entry-level careers in animal and biotechnology industries, Cooperative Extension, agricultural research, and government agencies such as the U.S. Department of Agriculture.', description),
        # Highlights
        ('University Farm over 500 acres with all major agricultural species: cattle (beef and dairy), poultry, swine, small ruminants, and equine units.', highlights[0]),
        ('Over 8 research labs geared to researching animal health, food and fiber production, and sustainable animal husbandry.', highlights[1]),
        ('The only HBCU with a functioning dairy that is also equipped with a robotic milking system.', highlights[2]),
        ('Certificate programs, such as Biotechnology and Equine Management, are offered and easily incorporated into the curriculum.', highlights[3]),
        ('Several active student organizations, such as the Pre-Veterinary Medical Association, MANRRS, Dairy Science Club, Equine Science Club, and Poultry Science Club.', highlights[4]),
        # Careers
        ('Animal Scientist', careers[0]),
        ('Livestock Production Manager', careers[1]),
        ('Animal Nutritionist', careers[2]),
        ('Animal Health Technician', careers[3]),
        ('Veterinary Technician/Assistant', careers[4]),
        ('Agricultural Extension Agent', careers[5]),
        ('Agricultural/Laboratory Research Technician', careers[6]),
        ('Animal Welfare Specialist', careers[7]),
        ('Quality Assurance Specialist', careers[8]),
        ('Meat/Poultry Production Supervisor', careers[9]),
        # Employers
        ('Universities and agricultural research stations', employers[0]),
        ('Meat, Poultry, and Food Production companies', employers[1]),
        ('Livestock and Dairy operations', employers[2]),
        ('Zoos, animal shelters, and animal welfare organizations', employers[3]),
        ('State and Federal Government and Regulatory Sectors (State Department ofAgriculture, USDA, FDA, CDC, NIH)', employers[4]),
        ('State and Federal Government and Regulatory Sectors (State Department of Agriculture, USDA, FDA, CDC, NIH)', employers[4]),
        ('Veterinary Clinics and Animal Hospitals', employers[5]),
        ('Animal Health and pharmaceutical companies', employers[6]),
        # Grad pathways
        ("Master\u2019s of Science, MS (animal health systems, animal production, nutrition)", grad[0]),
        ("Master's of Science, MS (animal health systems, animal production, nutrition)", grad[0]),
        ('Doctor of Veterinary Medicine, DVM', grad[1]),
        ("Doctor of Philosophy, PhD (specialization fields based on students\u2019 interests)", grad[2]),
        ("Doctor of Philosophy, PhD (specialization fields based on students' interests)", grad[2]),
        ('Professional/Experiential certification courses (1-2 years)', grad[3]),
        # Orgs
        ('Pre-Veterinary Medical Association', org_names[0]),
        ('Minorities in Agriculture, Natural Resources, and Related Sciences (MANRRS)', org_names[1]),
        ('Poultry Science Club', org_names[2]),
        ('Dairy Science Organization', org_names[3]),
        ('Equine Science Club', org_names[4]),
        ('Gamma Sigma Delta', org_names[5]),
    ]

    # ── Page 2 checklist ──
    phases = timeline.get('phases', [])
    cat_keys = ['Purpose', 'Communities', 'LocalGlobal', 'Identity']
    original_cells = {
        (1,1): 'Students should explore the Department of Animal Sciences Canvas page for opportunities that align with their interests.',
        (1,2): 'Students are encouraged to get involved with a research lab, the University Farm, or the University Vivarium.',
        (1,3): 'Consider applying to and joining the CAES Undergraduate Research Scholars Program.',
        (1,4): 'Veterinary medical applications, medical school applications, and graduate school interests.',
        (2,1): 'Join organizations such as the Pre-Veterinary Medical Association or MANRRS, Dairy Science Club, Equine Science Club or Poultry Science Club, as well as a self-interest organization.',
        (2,2): 'Volunteer either through student organizations or animal-based organizations in the Greensboro community.',
        (2,3): 'Attend conferences that may be funded by national organizations or the Department, College, or University',
        (2,4): 'Veterinary medical applications, medical school applications, and graduate school interests.',
        (3,1): "Attend the University and College of Agriculture and Environmental Sciences\u2019 welcome-back and community engagement events throughout the semester.",
        (3,2): 'Explore study abroad opportunities either through faculty-led trips or through independent organizations',
        (4,1): 'Student organizations, as well as other partners such as the Honors College and the Council of Presidents, will host a range of professional development topics.',
        (4,2): 'Students should attend the CAES Speaker Series, curated to help them explore their interests and connect with industry and regulatory professionals.',
        (4,3): 'Students should seek opportunities through the Department, such as the Dairy Challenge and Poultry Judging, to further expand their understanding and leadership traits.',
    }

    for (ri, ci), orig_text in original_cells.items():
        cat_key = cat_keys[ri - 1]
        phase = phases[ci - 1] if (ci - 1) < len(phases) else None
        milestones = []
        if phase:
            milestones = [m for m in phase.get('milestones', []) if m.get('category') == cat_key]
        new_text = '; '.join([m.get('label', '') for m in milestones[:3]]) if milestones else 'See your advisor for opportunities.'
        replacements.append((orig_text, new_text))

    # ── Process ZIP ──
    ts = datetime.now().strftime('%H%M')
    output_path = OUTPUT_DIR / f'{slug}_Major_Map_{ts}.docx'

    with zipfile.ZipFile(str(TEMPLATE_PATH), 'r') as zin:
        with zipfile.ZipFile(str(output_path), 'w', zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)
                if item.filename == 'word/document.xml':
                    data = do_replacements(data, replacements)
                zout.writestr(item, data)

    print(f'\u2705 Generated: {output_path.name}')
    return str(output_path)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == '--all':
            count = 0
            for slug_dir in sorted(DATA_DIR.iterdir()):
                if slug_dir.is_dir() and (slug_dir / 'branding.json').exists():
                    try:
                        generate_map(slug_dir.name)
                        count += 1
                    except Exception as e:
                        print(f'\u274c {slug_dir.name}: {e}')
            print(f'\n\U0001f389 Generated {count} maps!')
        else:
            generate_map(sys.argv[1])
    else:
        generate_map('caes-la')
