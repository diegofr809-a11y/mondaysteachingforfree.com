import json
import os
import re

print("Loading existing catalogs...")

def load_json_from_js(filepath, var_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    prefix = f"export const {var_name} = "
    if prefix in content:
        start_idx = content.find(prefix) + len(prefix)
        json_str = content[start_idx:].strip()
        if json_str.endswith(';'):
            json_str = json_str[:-1].strip()
        return json.loads(json_str)
    raise ValueError(f"Could not parse {var_name} from {filepath}")

def save_json_to_js(filepath, var_name, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f"export const {var_name} = ")
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write(";\n")
    print(f"Successfully saved {var_name} to {filepath} ({len(data)} artists)")

# Load cache
with open('./src/data/soundcloudCache.json', 'r', encoding='utf-8') as f:
    cache = json.load(f)

print(f"Loaded cache with {len(cache.get('tracks', {}))} tracks and {len(cache.get('artists', {}))} artists.")
