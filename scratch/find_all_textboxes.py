"""Find ALL text boxes and their content to identify blank areas."""
import zipfile, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from lxml import etree

OUTPUT = r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\output\CAES-LA_Experiential_Major_Map.docx'
TEMPLATE = r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\assets\templates\usso-major-map-template.docx'
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

print("=" * 70)
print("ALL TEXT BOXES IN OUTPUT (looking for blanks)")
print("=" * 70)

z = zipfile.ZipFile(OUTPUT, 'r')
root = etree.fromstring(z.read('word/document.xml'))

for i, txbx in enumerate(root.iter(f'{{{W}}}txbxContent')):
    paras = list(txbx.iter(f'{{{W}}}p'))
    full = ''
    for t in txbx.iter(f'{{{W}}}t'):
        if t.text:
            full += t.text
    
    # Flag empty or sparse text boxes
    has_empty = any(
        not ''.join(t.text or '' for t in p.iter(f'{{{W}}}t')).strip()
        for p in paras
        if p.find(f'{{{W}}}pPr') is not None and p.find(f'{{{W}}}pPr').find(f'{{{W}}}numPr') is not None
    )
    
    status = '⚠️ HAS EMPTY BULLETS' if has_empty else '✅'
    print(f"\nTextBox {i} ({len(paras)} paras) {status}")
    print(f"  {full[:200]}")

# Now check the TEMPLATE for "life skills" section
print("\n\n" + "=" * 70)
print("ORIGINAL TEMPLATE - 'life skills' section")
print("=" * 70)

z2 = zipfile.ZipFile(TEMPLATE, 'r')
root2 = etree.fromstring(z2.read('word/document.xml'))

for i, txbx in enumerate(root2.iter(f'{{{W}}}txbxContent')):
    full = ''
    for t in txbx.iter(f'{{{W}}}t'):
        if t.text:
            full += t.text
    if 'life skills' in full.lower() or 'build important' in full.lower() or 'such as' in full.lower():
        print(f"\nTextBox {i}: {full[:500]}")

# Also check for ALL content areas on page 1
print("\n\n" + "=" * 70)
print("TEMPLATE - ALL TEXT BOXES (to find 'life skills' and other missed areas)")
print("=" * 70)

for i, txbx in enumerate(root2.iter(f'{{{W}}}txbxContent')):
    paras = list(txbx.iter(f'{{{W}}}p'))
    full = ''
    for t in txbx.iter(f'{{{W}}}t'):
        if t.text:
            full += t.text
    if len(full) > 20:
        print(f"\nTextBox {i} ({len(paras)} paras):")
        print(f"  {full[:300]}")
