import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from docx import Document
from docx.oxml.ns import qn

doc = Document(r'C:\Users\Chris\Downloads\BS in Animal Science.docx')

# Check all elements in document body
body = doc.element.body
print("=== TOP-LEVEL BODY ELEMENTS ===")
for i, child in enumerate(body):
    tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
    text = child.text or ''
    if tag == 'p':
        para_text = ''.join(node.text or '' for node in child.iter(qn('w:t')))
        print(f'  [{i}] <{tag}> "{para_text[:80]}"')
    elif tag == 'tbl':
        rows = child.findall(qn('w:tr'))
        print(f'  [{i}] <{tag}> ({len(rows)} rows)')
    elif tag == 'sectPr':
        print(f'  [{i}] <{tag}> (section properties)')
    else:
        print(f'  [{i}] <{tag}>')

# Look for text boxes / shapes
print("\n=== LOOKING FOR SHAPES/TEXTBOXES ===")
for drawing in body.iter(qn('w:drawing')):
    print(f'  Found drawing element')
for pict in body.iter(qn('w:pict')):
    print(f'  Found pict element')
for txbxContent in body.iter(qn('w:txbxContent')):
    texts = ''.join(node.text or '' for node in txbxContent.iter(qn('w:t')))
    print(f'  TextBox: "{texts[:120]}"')

# Check all tables in detail
print("\n=== ALL TABLES (including nested) ===")
for ti, tbl in enumerate(body.iter(qn('w:tbl'))):
    rows = tbl.findall(qn('w:tr'))
    print(f'\nTable {ti}: {len(rows)} rows')
    for ri, row in enumerate(rows):
        cells = row.findall(qn('w:tc'))
        print(f'  Row {ri}: {len(cells)} cells')
        for ci, cell in enumerate(cells):
            texts = ''.join(node.text or '' for node in cell.iter(qn('w:t')))
            shd = cell.find(f'.//{qn("w:shd")}')
            fill = shd.get(qn('w:fill')) if shd is not None else None
            print(f'    Cell[{ci}]: fill={fill}, "{texts[:60]}"')
