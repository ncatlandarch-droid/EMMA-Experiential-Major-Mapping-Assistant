import sys, io, zipfile
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Read the template's document.xml
with zipfile.ZipFile(r'C:\Users\Chris\Downloads\BS in Animal Science.docx', 'r') as z:
    doc_xml = z.read('word/document.xml').decode('utf-8')

# Search for key phrases to see how Word stores them
search_terms = [
    'Animal Science',
    'Bachelor of Science',
    'WHAT IS ANIMAL',
    'EXPERIENTIAL MAJOR MAP',
    'Graduates develop',
    'animal welfare',
    'provides a comprehensive',
    'University Farm',
    'Pre-Veterinary',
    'WHAT DO ANIMAL',
]

print("=== CHECKING IF STRINGS EXIST IN RAW XML ===")
for term in search_terms:
    found = term in doc_xml
    print(f"  {'✅' if found else '❌'} '{term}' -> {'FOUND' if found else 'NOT FOUND'}")

# Show context around "Animal Science" to see XML structure
import re
matches = list(re.finditer(r'Animal Science', doc_xml))
print(f"\n=== 'Animal Science' appears {len(matches)} times ===")
for i, m in enumerate(matches[:5]):
    start = max(0, m.start() - 100)
    end = min(len(doc_xml), m.end() + 100)
    context = doc_xml[start:end]
    # Clean for display
    context = context.replace('\n', ' ')
    print(f"\n  Match {i}: ...{context}...")

# Check how "Bachelor of Science in Animal Science" appears
matches2 = list(re.finditer(r'Bachelor of Science in Animal Science', doc_xml))
print(f"\n=== Full 'Bachelor of Science in Animal Science' appears {len(matches2)} times ===")

# Look for split text - when "Animal" and "Science" are in separate <w:t> tags
# This pattern finds <w:t>...Animal...</w:t>...<w:t>...Science...</w:t>
split_pattern = r'Animal</w:t>.*?Science'
split_matches = list(re.finditer(split_pattern, doc_xml, re.DOTALL))
print(f"\n=== Split 'Animal...Science' across tags: {len(split_matches)} times ===")
for i, m in enumerate(split_matches[:3]):
    snippet = doc_xml[m.start():m.end()]
    if len(snippet) > 300:
        snippet = snippet[:300] + '...'
    print(f"  Split {i}: {snippet}")
