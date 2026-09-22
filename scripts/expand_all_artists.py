import json
import re
import os

print("Starting complete artist catalog expansion across all datasets...")

# Helper to read JS export
def read_js_array(file_path, var_name):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()
    pattern = rf"export\s+const\s+{var_name}\s*=\s*(\[[\s\S]*?\]);\s*$"
    match = re.search(pattern, text)
    if not match:
        # Fallback search
        start = text.find(f"export const {var_name} = ") + len(f"export const {var_name} = ")
        raw = text[start:].strip()
        if raw.endswith(';'):
            raw = raw[:-1].strip()
        return json.loads(raw)
    return json.loads(match.group(1))

def write_js_array(file_path, var_name, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(f"export const {var_name} = ")
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write(";\n")
    print(f"Updated {file_path} with {len(data)} artists.")

print("Base setup ready.")
