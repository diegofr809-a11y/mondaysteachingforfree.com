import json
import subprocess
import os

# Import all discography modules
from scripts.discography_database import MEXICAN_DISCOGRAPHIES
from scripts.discography_popular import POPULAR_CATALOG_EXPANSIONS
from scripts.discography_popular_part2 import POPULAR_CATALOG_EXPANSIONS_2
from scripts.discography_popular_part3 import POPULAR_CATALOG_EXPANSIONS_3
from scripts.mexican_all_discographies import MEXICAN_ALL_DISCOGRAPHIES
from scripts.discography_mexican_part2 import MEXICAN_DISCOGRAPHIES_PART2
from scripts.discography_latin_urban import LATIN_URBAN_DISCOGRAPHIES
from scripts.catalog_enrichment_data import ARTIST_DISCOGRAPHIES

ALL_KNOWLEDGE = {}
ALL_KNOWLEDGE.update(ARTIST_DISCOGRAPHIES)
ALL_KNOWLEDGE.update(MEXICAN_DISCOGRAPHIES)
ALL_KNOWLEDGE.update(MEXICAN_ALL_DISCOGRAPHIES)
ALL_KNOWLEDGE.update(MEXICAN_DISCOGRAPHIES_PART2)
ALL_KNOWLEDGE.update(POPULAR_CATALOG_EXPANSIONS)
ALL_KNOWLEDGE.update(POPULAR_CATALOG_EXPANSIONS_2)
ALL_KNOWLEDGE.update(POPULAR_CATALOG_EXPANSIONS_3)
ALL_KNOWLEDGE.update(LATIN_URBAN_DISCOGRAPHIES)

# Helper to normalize artist names for matching
def norm_name(name):
    return "".join(c for c in name.lower() if c.isalnum())

knowledge_map = {norm_name(k): v for k, v in ALL_KNOWLEDGE.items()}

# Get current artist lists from the 3 files
node_cmd = """
const { MEXICAN_ARTISTS_DATA } = await import("./src/data/mexicanArtistsData.js");
const { POPULAR_ARTISTS_DATA } = await import("./src/data/popularArtistsData.js");
const { LATIN_URBAN_ARTISTS_DATA } = await import("./src/data/latinUrbanArtistsData.js");

console.log(JSON.stringify({
  mexican: MEXICAN_ARTISTS_DATA,
  popular: POPULAR_ARTISTS_DATA,
  latin: LATIN_URBAN_ARTISTS_DATA,
}));
"""

out = subprocess.check_output(["node", "--input-type=module", "-e", node_cmd])
original_data = json.loads(out)

# High quality default covers
DEFAULT_COVERS = [
    "https://i1.sndcdn.com/artworks-dzr0iQ25h94R-0-t500x500.jpg",
    "https://i1.sndcdn.com/artworks-HiqENlLH65c8-0-t500x500.jpg",
    "https://i1.sndcdn.com/artworks-u3o9n6zY4T8w-0-t500x500.jpg",
    "https://i1.sndcdn.com/artworks-sIe6wPjD3n5M-0-t500x500.jpg"
]

def format_artist(artist_obj, default_category):
    name = artist_obj["name"]
    key = norm_name(name)
    disc = knowledge_map.get(key, {})
    
    avatarUrl = disc.get("avatarUrl") or artist_obj.get("avatarUrl") or DEFAULT_COVERS[0]
    bannerUrl = disc.get("bannerUrl") or artist_obj.get("bannerUrl") or avatarUrl
    genre = disc.get("genre") or artist_obj.get("genre") or "Global Music"
    monthlyListeners = disc.get("monthlyListeners") or artist_obj.get("monthlyListeners") or "15,000,000"
    bio = disc.get("bio") or artist_obj.get("bio") or f"{name} is an internationally recognized artist with a vast catalog of chart-topping songs."
    
    # 1. Albums
    albums = []
    # Merge existing albums and knowledge albums
    combined_albums = []
    if "albums" in disc:
        combined_albums.extend(disc["albums"])
    if "albums" in artist_obj:
        for a in artist_obj["albums"]:
            if isinstance(a, dict):
                if not any(x.get("title") == a.get("title") for x in combined_albums):
                    combined_albums.append(a)
            elif isinstance(a, str):
                if not any(x.get("title") == a for x in combined_albums):
                    combined_albums.append({"title": a, "year": 2022, "tracks": []})
                    
    for idx, alb in enumerate(combined_albums):
        if isinstance(alb, dict):
            alb_title = alb.get("title", f"Album {idx+1}")
            alb_year = alb.get("year", 2022)
            alb_cover = alb.get("coverUrl") or DEFAULT_COVERS[idx % len(DEFAULT_COVERS)]
            tracks_raw = alb.get("tracks", [])
            tracks_list = []
            for t in tracks_raw:
                if isinstance(t, dict):
                    tracks_list.append(t.get("title", "Track"))
                elif isinstance(t, str):
                    tracks_list.append(t)
            albums.append({
                "id": f"album-{norm_name(name)}-{idx+1}",
                "title": alb_title,
                "year": alb_year,
                "coverUrl": alb_cover,
                "tracks": tracks_list
            })

    # 2. Singles
    singles = []
    combined_singles = []
    if "singles" in disc:
        combined_singles.extend(disc["singles"])
    if "singles" in artist_obj:
        for s in artist_obj["singles"]:
            if isinstance(s, dict):
                if not any(x.get("title") == s.get("title") for x in combined_singles):
                    combined_singles.append(s)
            elif isinstance(s, str):
                if not any(x.get("title") == s for x in combined_singles):
                    combined_singles.append({"title": s, "year": 2023})
                    
    for idx, sgl in enumerate(combined_singles):
        if isinstance(sgl, dict):
            sgl_title = sgl.get("title", f"Single {idx+1}")
            sgl_year = sgl.get("year", 2023)
            sgl_cover = sgl.get("coverUrl") or DEFAULT_COVERS[(idx+1) % len(DEFAULT_COVERS)]
            singles.append({
                "title": sgl_title,
                "year": sgl_year,
                "coverUrl": sgl_cover
            })

    # 3. Collaborations
    collaborations = []
    combined_collabs = []
    if "collaborations" in disc:
        combined_collabs.extend(disc["collaborations"])
    if "collaborations" in artist_obj:
        for c in artist_obj["collaborations"]:
            if isinstance(c, dict):
                if not any(x.get("title") == c.get("title") for x in combined_collabs):
                    combined_collabs.append(c)
                    
    for idx, col in enumerate(combined_collabs):
        if isinstance(col, dict):
            col_title = col.get("title", f"Collab {idx+1}")
            col_with = col.get("withArtist", "Featured Artist")
            col_year = col.get("year", 2023)
            col_cover = col.get("coverUrl") or DEFAULT_COVERS[(idx+2) % len(DEFAULT_COVERS)]
            collaborations.append({
                "title": col_title,
                "withArtist": col_with,
                "year": col_year,
                "coverUrl": col_cover
            })

    # 4. Master Songs List (combining all albums' tracks, singles, collaborations, and existing songs)
    all_song_titles = []
    song_album_map = {}
    song_cover_map = {}
    
    # Add from albums
    for alb in albums:
        for trk in alb["tracks"]:
            if trk not in all_song_titles:
                all_song_titles.append(trk)
                song_album_map[trk] = alb["title"]
                song_cover_map[trk] = alb["coverUrl"]

    # Add from singles
    for sgl in singles:
        if sgl["title"] not in all_song_titles:
            all_song_titles.append(sgl["title"])
            song_album_map[sgl["title"]] = "Single"
            song_cover_map[sgl["title"]] = sgl["coverUrl"]

    # Add from collaborations
    for col in collaborations:
        if col["title"] not in all_song_titles:
            all_song_titles.append(col["title"])
            song_album_map[col["title"]] = f"feat. {col['withArtist']}"
            song_cover_map[col["title"]] = col["coverUrl"]

    # Add from previous topSongs/songs
    prev_songs = artist_obj.get("songs") or artist_obj.get("topSongs") or []
    for ps in prev_songs:
        t_name = ps.get("title") if isinstance(ps, dict) else ps
        if t_name and t_name not in all_song_titles:
            all_song_titles.append(t_name)
            song_album_map[t_name] = ps.get("album", "Essential") if isinstance(ps, dict) else "Essential"
            song_cover_map[t_name] = ps.get("coverUrl", avatarUrl) if isinstance(ps, dict) else avatarUrl

    # Construct the final songs array
    import random
    random.seed(len(name))
    
    final_songs = []
    for idx, stitle in enumerate(all_song_titles):
        plays_num = random.randint(45, 950) * 1000000 + random.randint(10000, 99999)
        mins = random.randint(2, 4)
        secs = random.randint(10, 58)
        dur = f"{mins}:{secs:02d}"
        
        final_songs.append({
            "title": stitle,
            "artist": name,
            "album": song_album_map.get(stitle, "Studio Release"),
            "duration": dur,
            "plays": f"{plays_num:,}",
            "coverUrl": song_cover_map.get(stitle, avatarUrl)
        })

    return {
        "id": f"artist-{norm_name(name)}",
        "name": name,
        "avatarUrl": avatarUrl,
        "bannerUrl": bannerUrl,
        "genre": genre,
        "monthlyListeners": monthlyListeners,
        "bio": bio,
        "albums": albums,
        "singles": singles,
        "collaborations": collaborations,
        "songs": final_songs,
        "topSongs": final_songs
    }

expanded_mexican = [format_artist(a, "mexican") for a in original_data["mexican"]]
expanded_popular = [format_artist(a, "popular") for a in original_data["popular"]]
expanded_latin = [format_artist(a, "latin") for a in original_data["latin"]]

print(f"Expanded Mexican: {len(expanded_mexican)} artists, total songs: {sum(len(a['songs']) for a in expanded_mexican)}")
print(f"Expanded Popular: {len(expanded_popular)} artists, total songs: {sum(len(a['songs']) for a in expanded_popular)}")
print(f"Expanded Latin: {len(expanded_latin)} artists, total songs: {sum(len(a['songs']) for a in expanded_latin)}")

# Write to JSON intermediate files
with open("scripts/expanded_mexican.json", "w", encoding="utf-8") as f:
    json.dump(expanded_mexican, f, indent=2, ensure_ascii=False)

with open("scripts/expanded_popular.json", "w", encoding="utf-8") as f:
    json.dump(expanded_popular, f, indent=2, ensure_ascii=False)

with open("scripts/expanded_latin.json", "w", encoding="utf-8") as f:
    json.dump(expanded_latin, f, indent=2, ensure_ascii=False)

print("JSON files successfully generated!")
