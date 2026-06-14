"""
Analyze the official USSO Word template structure.
Extract XML structure, text runs, images, and formatting.
"""
import zipfile, sys, io, os, json
from lxml import etree

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

TEMPLATE = r'C:\Users\Chris\Downloads\Experiential Journey - Major Map - DRAFT (2).docx'
OUT_DIR = r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\scratch\template_analysis'
os.makedirs(OUT_DIR, exist_ok=True)

# 1. List all files in the docx ZIP
print("=" * 60)
print("FILES IN TEMPLATE")
print("=" * 60)
with zipfile.ZipFile(TEMPLATE, 'r') as z:
    for info in z.infolist():
        print(f"  {info.filename:50s}  {info.file_size:>8,} bytes")
    
    # 2. Extract document.xml
    doc_xml = z.read('word/document.xml')
    with open(os.path.join(OUT_DIR, 'document.xml'), 'wb') as f:
        f.write(doc_xml)
    
    # 3. Extract styles.xml
    if 'word/styles.xml' in z.namelist():
        styles_xml = z.read('word/styles.xml')
        with open(os.path.join(OUT_DIR, 'styles.xml'), 'wb') as f:
            f.write(styles_xml)
    
    # 4. Extract images
    for name in z.namelist():
        if name.startswith('word/media/'):
            img_data = z.read(name)
            img_name = os.path.basename(name)
            with open(os.path.join(OUT_DIR, img_name), 'wb') as f:
                f.write(img_data)
            print(f"\n  📷 Extracted image: {img_name} ({len(img_data):,} bytes)")

# 5. Parse document.xml and extract all text
print("\n" + "=" * 60)
print("ALL TEXT IN DOCUMENT (in order)")
print("=" * 60)

NS = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
}

tree = etree.fromstring(doc_xml)

# Get all paragraphs
paragraphs = tree.findall('.//w:p', NS)
print(f"\nTotal paragraphs: {len(paragraphs)}")

for i, para in enumerate(paragraphs):
    # Get paragraph text
    runs = para.findall('.//w:r', NS)
    text_parts = []
    for run in runs:
        t_elements = run.findall('.//w:t', NS)
        for t in t_elements:
            if t.text:
                text_parts.append(t.text)
    
    full_text = ''.join(text_parts).strip()
    if full_text:
        # Check for formatting
        pPr = para.find('w:pPr', NS)
        style = ''
        if pPr is not None:
            pStyle = pPr.find('w:pStyle', NS)
            if pStyle is not None:
                style = pStyle.get(f'{{{NS["w"]}}}val', '')
        
        print(f"\n  P{i:03d} [{style:20s}]: {full_text[:120]}")

# 6. Find all unique text strings for replacement mapping
print("\n" + "=" * 60)
print("REPLACEMENT TARGETS")
print("=" * 60)

# Find key strings to replace
targets = [
    "Management",
    "Bachelor of Science in Management",
    "Deese College of Business and Economics",
    "management degree",
    "management major",
    "MGMT",
]

for target in targets:
    # Search across all text nodes
    found = False
    for t_node in tree.findall('.//w:t', NS):
        if t_node.text and target.lower() in t_node.text.lower():
            print(f"  ✅ Found '{target}' in single <w:t>: '{t_node.text[:80]}'")
            found = True
    
    if not found:
        # Check if split across runs
        for para in paragraphs:
            runs = para.findall('.//w:r', NS)
            combined = ''
            for run in runs:
                for t in run.findall('.//w:t', NS):
                    if t.text:
                        combined += t.text
            if target.lower() in combined.lower():
                print(f"  ⚠️  Found '{target}' SPLIT across runs: '{combined[:80]}'")
                found = True
                break
    
    if not found:
        print(f"  ❌ NOT FOUND: '{target}'")

print(f"\n✅ Analysis saved to: {OUT_DIR}")
