"""Get the exact paragraph-by-paragraph breakdown of template TextBox 0 and TextBox 6."""
import zipfile, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from lxml import etree

TEMPLATE = r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\assets\templates\usso-major-map-template.docx'
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

z = zipfile.ZipFile(TEMPLATE, 'r')
root = etree.fromstring(z.read('word/document.xml'))

for box_idx, txbx in enumerate(root.iter(f'{{{W}}}txbxContent')):
    if box_idx not in [0, 6]:
        continue
    
    print(f"\n{'='*70}")
    print(f"TEMPLATE TextBox {box_idx} — PARAGRAPH BY PARAGRAPH")
    print(f"{'='*70}")
    
    paras = list(txbx.iter(f'{{{W}}}p'))
    for p_idx, p in enumerate(paras):
        text = ''
        for t in p.iter(f'{{{W}}}t'):
            if t.text:
                text += t.text
        
        # Check formatting
        ppr = p.find(f'{{{W}}}pPr')
        has_numpr = False
        if ppr is not None:
            has_numpr = ppr.find(f'{{{W}}}numPr') is not None
        
        fmt = '  BULLET' if has_numpr else '  PROSE'
        print(f"  Para {p_idx:2d} [{fmt}] ({len(text):3d} chars): {text[:100]}")
