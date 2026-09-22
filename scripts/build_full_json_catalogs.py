import json
import re
import os

from scripts.discography_database import MEXICAN_DISCOGRAPHIES
from scripts.discography_popular import POPULAR_CATALOG_EXPANSIONS
from scripts.discography_popular_part2 import POPULAR_CATALOG_EXPANSIONS_2
from scripts.mexican_all_discographies import MEXICAN_ALL_DISCOGRAPHIES
from scripts.catalog_enrichment_data import ARTIST_DISCOGRAPHIES

print("Merging all discography dictionaries...")

ALL_KNOWLEDGE = {}
ALL_KNOWLEDGE.update(ARTIST_DISCOGRAPHIES)
ALL_KNOWLEDGE.update(MEXICAN_DISCOGRAPHIES)
ALL_KNOWLEDGE.update(MEXICAN_ALL_DISCOGRAPHIES)
ALL_KNOWLEDGE.update(POPULAR_CATALOG_EXPANSIONS)
ALL_KNOWLEDGE.update(POPULAR_CATALOG_EXPANSIONS_2)

print(f"Total artists in knowledge base: {len(ALL_KNOWLEDGE)}")

# Output summary of available keys
for k in sorted(ALL_KNOWLEDGE.keys()):
    disc = ALL_KNOWLEDGE[k]
    alb_cnt = len(disc.get("albums", []))
    sgl_cnt = len(disc.get("singles", []))
    print(f"  - {k}: {alb_cnt} albums, {sgl_cnt} singles")
