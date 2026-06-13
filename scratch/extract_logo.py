import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from docx import Document
from pathlib import Path

doc = Document(r'C:\Users\Chris\Downloads\BS in Animal Science.docx')

output_dir = Path(r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\assets\images')
for rel in doc.part.rels.values():
    if 'image' in rel.reltype:
        img_data = rel.target_part.blob
        ext = Path(rel.target_ref).suffix
        out_path = output_dir / f'ncat-logo-usso{ext}'
        with open(out_path, 'wb') as f:
            f.write(img_data)
        print(f'Extracted: {out_path} ({len(img_data)} bytes)')
