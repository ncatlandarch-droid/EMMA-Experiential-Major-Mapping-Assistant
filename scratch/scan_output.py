"""Scan the Management template to find all text that needs replacing."""
import zipfile, io, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from lxml import etree

TEMPLATE = r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\assets\templates\usso-major-map-template.docx'
OUTPUT = r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\output\CAES-LA_Experiential_Major_Map.docx'

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

def scan_doc(path, label):
    print(f"\n{'='*60}")
    print(f"  {label}")
    print(f"{'='*60}")
    z = zipfile.ZipFile(path, 'r')
    root = etree.fromstring(z.read('word/document.xml'))
    
    # Get all unique text nodes
    all_text = []
    for t in root.iter(f'{{{W}}}t'):
        if t.text and t.text.strip():
            all_text.append(t.text)
    
    # Print all unique text sorted by length (longest first to see content blocks)
    seen = set()
    for txt in all_text:
        if txt.strip() and txt.strip() not in seen:
            seen.add(txt.strip())
    
    for txt in sorted(seen, key=len, reverse=True):
        if len(txt) > 3:  # skip very short fragments
            print(f"  [{len(txt):3d}] {txt[:120]}")
    
    print(f"\n  Total unique text nodes: {len(seen)}")

# Scan the OUTPUT to find what's empty or still has Management content
print("\n" + "="*60)
print("  SCANNING OUTPUT FOR BLANK/PROBLEM AREAS")  
print("="*60)

z = zipfile.ZipFile(OUTPUT, 'r')
root = etree.fromstring(z.read('word/document.xml'))

# Find paragraphs with empty or very short text in text boxes
for txbx in root.iter(f'{{{W}}}txbxContent'):
    paras = list(txbx.iter(f'{{{W}}}p'))
    for p in paras:
        texts = []
        for t in p.iter(f'{{{W}}}t'):
            if t.text:
                texts.append(t.text)
        full = ''.join(texts).strip()
        if not full:
            # Check if paragraph has formatting (meaning it's supposed to have content)
            ppr = p.find(f'{{{W}}}pPr')
            if ppr is not None:
                numpr = ppr.find(f'{{{W}}}numPr')
                if numpr is not None:
                    print(f"  ⚠️ EMPTY BULLET: paragraph has numPr but no text")

# Check for remaining Management references
print("\n--- Checking for residual Management/MGMT ---")
for t in root.iter(f'{{{W}}}t'):
    if t.text:
        lower = t.text.lower()
        if 'management' in lower or 'mgmt' in lower:
            print(f"  ❌ RESIDUAL: '{t.text[:80]}'")

# Find Quick Facts content
print("\n--- Quick Facts content ---")
for t in root.iter(f'{{{W}}}t'):
    if t.text and ('%' in t.text or '$' in t.text or 'receive' in t.text or 'secure' in t.text or 'majors' in t.text.lower()):
        print(f"  📊 '{t.text[:100]}'")

# Find Organizations content
print("\n--- Organizations content ---")
for t in root.iter(f'{{{W}}}t'):
    if t.text and ('organization' in t.text.lower() or 'society' in t.text.lower() or 'alpha' in t.text.lower() or 'sigma' in t.text.lower() or 'asla' in t.text.lower() or 'blan' in t.text.lower() or 'exceptional' in t.text.lower()):
        print(f"  🏛️ '{t.text[:100]}'")

# Scan original template for Quick Facts exact values
print("\n--- ORIGINAL TEMPLATE Quick Facts ---")
z2 = zipfile.ZipFile(TEMPLATE, 'r')
root2 = etree.fromstring(z2.read('word/document.xml'))
for t in root2.iter(f'{{{W}}}t'):
    if t.text and ('%' in t.text or '$' in t.text or 'receive' in t.text or 'secure' in t.text or 'QUICK' in t.text):
        print(f"  📊 ORIG: '{t.text[:100]}'")

# Scan original for orgs
print("\n--- ORIGINAL TEMPLATE Organizations ---")
for t in root2.iter(f'{{{W}}}t'):
    if t.text and ('Exceptional' in t.text or 'Society' in t.text or 'Alpha' in t.text or 'Sigma' in t.text or 'STUDENT' in t.text or 'JOIN' in t.text):
        print(f"  🏛️ ORIG: '{t.text[:100]}'")

# Find career direction subsection headers in original
print("\n--- ORIGINAL Career Direction Subsections ---")
for t in root2.iter(f'{{{W}}}t'):
    if t.text and ('Business' in t.text or 'Human Resource' in t.text or 'Consulting' in t.text or 'Entrepreneur' in t.text or 'Nonprofit' in t.text or 'Operations' in t.text):
        print(f"  💼 ORIG: '{t.text[:100]}'")
