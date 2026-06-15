"""Check milestone counts per cell to diagnose the overflow."""
import json, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open(r'c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\data\seeds\caes-la\timeline.json', 'r', encoding='utf-8') as f:
    timeline = json.load(f)

cat_keys = ['Purpose', 'Communities', 'LocalGlobal', 'Identity']
cat_labels = {
    'Purpose': 'DISCOVER PURPOSE',
    'Communities': 'CULTIVATE COMMUNITIES', 
    'LocalGlobal': 'CHANGE LOCALLY & GLOBALLY',
    'Identity': 'DEVELOP PROFESSIONAL IDENTITY'
}

print("MILESTONE COUNTS PER CELL")
print("=" * 70)
for phase_idx, phase in enumerate(timeline.get('phases', [])):
    year_label = phase.get('label', f'Year {phase_idx+1}')
    
    for cat in cat_keys:
        milestones = [m for m in phase.get('milestones', []) 
                     if m.get('category') == cat and m.get('type') != 'course']
        print(f"  Year {phase_idx+1} | {cat_labels[cat]:35s} | {len(milestones):2d} milestones")
        for m in milestones:
            label = m.get('label', '')
            print(f"    [{len(label):3d} chars] {label[:80]}")
    print()

# Compare to Management template
print("\nMANAGEMENT TEMPLATE has ~8-10 milestones per cell")
print("Our LA data has how many per cell?")
total = 0
for phase_idx, phase in enumerate(timeline.get('phases', [])):
    for cat in cat_keys:
        milestones = [m for m in phase.get('milestones', []) 
                     if m.get('category') == cat and m.get('type') != 'course']
        total += len(milestones)
        if len(milestones) > 10:
            print(f"  ⚠️ OVERFLOW: Year {phase_idx+1} {cat} has {len(milestones)} milestones!")
print(f"\nTotal experiential milestones: {total}")
