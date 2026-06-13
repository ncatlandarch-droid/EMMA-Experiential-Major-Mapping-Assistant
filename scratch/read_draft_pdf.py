import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Try to extract text from the DRAFT template PDF
try:
    import fitz  # PyMuPDF
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'PyMuPDF', '-q'])
    import fitz

pdf_path = r'C:\Users\Chris\Downloads\Experiential Journey - Major Map - DRAFT (1).pdf'
doc = fitz.open(pdf_path)

print(f"Pages: {doc.page_count}")
for i, page in enumerate(doc):
    print(f"\n{'='*60}")
    print(f"PAGE {i+1} ({page.rect.width:.0f} x {page.rect.height:.0f})")
    print(f"{'='*60}")
    text = page.get_text("text")
    print(text[:2000])
    
    # Also check for images
    images = page.get_images(full=True)
    print(f"\nImages on page {i+1}: {len(images)}")

doc.close()
