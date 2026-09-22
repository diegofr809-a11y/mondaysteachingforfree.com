# Master Catalog Expansion Engine
import json
import re
import os

print("Master catalog expander starting...")

def format_js_export(var_name, data):
    return f"export const {var_name} = {json.dumps(data, indent=2, ensure_ascii=False)};\n"

# Helper to generate song list from artist albums, singles, collaborations and additional tracks
def compile_full_song_list(artist_name, albums, singles, collaborations, existing_songs, default_cover):
    song_map = {}
    
    # 1. Existing songs
    for s in existing_songs:
        title = s.get('title', '').strip()
        if title:
            song_map[title.lower()] = s

    # 2. Tracks from albums
    base_plays = 75000000
    for alb in albums:
        alb_title = alb.get('title', 'Album')
        alb_cover = alb.get('coverUrl', default_cover)
        for t_name in alb.get('tracks', []):
            k = t_name.strip().lower()
            if k not in song_map:
                song_map[k] = {
                    'title': t_name.strip(),
                    'duration': '3:15',
                    'album': alb_title,
                    'plays': f"{base_plays:,}",
                    'coverUrl': alb_cover,
                    'soundCloudUrl': f"https://soundcloud.com/search/sounds?q={re.sub(r'[^a-zA-Z0-9 ]', '', artist_name)}+{re.sub(r'[^a-zA-Z0-9 ]', '', t_name)}"
                }
            base_plays = max(12000000, base_plays - 2400000)

    # 3. Singles
    for sg in singles:
        sg_title = sg.get('title', '').strip()
        k = sg_title.lower()
        if k not in song_map:
            song_map[k] = {
                'title': sg_title,
                'duration': '2:55',
                'album': 'Single',
                'plays': '85,000,000',
                'coverUrl': sg.get('coverUrl', default_cover),
                'soundCloudUrl': f"https://soundcloud.com/search/sounds?q={re.sub(r'[^a-zA-Z0-9 ]', '', artist_name)}+{re.sub(r'[^a-zA-Z0-9 ]', '', sg_title)}"
            }

    # 4. Collaborations
    for cb in collaborations:
        cb_title = cb.get('title', '').strip()
        k = cb_title.lower()
        if k not in song_map:
            song_map[k] = {
                'title': cb_title,
                'duration': '3:20',
                'album': f"feat. {cb.get('withArtist', '')}" if cb.get('withArtist') else 'Single',
                'plays': '120,000,000',
                'coverUrl': cb.get('coverUrl', default_cover),
                'soundCloudUrl': f"https://soundcloud.com/search/sounds?q={re.sub(r'[^a-zA-Z0-9 ]', '', artist_name)}+{re.sub(r'[^a-zA-Z0-9 ]', '', cb_title)}"
            }

    return list(song_map.values())

print("Helper functions defined successfully.")
