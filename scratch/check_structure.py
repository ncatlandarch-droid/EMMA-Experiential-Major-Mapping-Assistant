"""Check Page 2 structure - is checklist a table or text boxes?"""
import zipfile, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from lxml import etree

TEMPLATE = r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\assets\templates\usso-major-map-template.docx'
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

z = zipfile.ZipFile(TEMPLATE, 'r')
root = etree.fromstring(z.read('word/document.xml'))

# Count tables
tables = list(root.iter(f'{{{W}}}tbl'))
print(f"Total tables: {len(tables)}")

for i, tbl in enumerate(tables):
    rows = list(tbl.findall(f'{{{W}}}tr'))
    tbl_text = ''
    for t in tbl.iter(f'{{{W}}}t'):
        if t.text:
            tbl_text += t.text
    preview = tbl_text[:150].replace('\n', ' ')
    print(f"\nTable {i}: {len(rows)} rows")
    print(f"  Text: {preview}...")
    
    if 'DISCOVER' in tbl_text or 'EXPLORE' in tbl_text or 'FRESHMAN' in tbl_text or 'PURPOSE' in tbl_text:
        print(f"  >>> THIS IS THE CHECKLIST TABLE <<<")
        for r_idx, row in enumerate(rows):
            cells = list(row.findall(f'{{{W}}}tc'))
            print(f"  Row {r_idx}: {len(cells)} cells")
            for c_idx, cell in enumerate(cells):
                cell_text = ''
                paras = list(cell.iter(f'{{{W}}}p'))
                for t in cell.iter(f'{{{W}}}t'):
                    if t.text:
                        cell_text += t.text
                cell_preview = cell_text[:60].replace('\n', ' ')
                print(f"    Cell {c_idx} ({len(paras)} paras): {cell_preview}")

# Also check text boxes for checklist content  
print("\n\nCHECKLIST TEXT BOXES:")
for txbx in root.iter(f'{{{W}}}txbxContent'):
    full = ''
    for t in txbx.iter(f'{{{W}}}t'):
        if t.text:
            full += t.text
    if any(kw in full for kw in ['DISCOVER', 'PROFESSIONAL', 'CHECKLIST', 'FRESHMAN', 'PURPOSE', 'Create a basic resume']):
        preview = full[:200].replace('\n', ' ')
        paras = list(txbx.iter(f'{{{W}}}p'))
        print(f"\n  TextBox ({len(paras)} paras): {preview}...")
