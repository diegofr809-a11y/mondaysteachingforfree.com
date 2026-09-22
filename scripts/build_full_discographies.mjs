// scripts/build_full_discographies.mjs
import fs from 'fs';
import path from 'path';

console.log('Loading existing datasets...');

import { MEXICAN_ARTISTS_DATA } from '../src/data/mexicanArtistsData.js';
import { POPULAR_ARTISTS_DATA } from '../src/data/popularArtistsData.js';
import { LATIN_URBAN_ARTISTS_DATA } from '../src/data/latinUrbanArtistsData.js';

console.log(`Current: Mexican (${MEXICAN_ARTISTS_DATA.length}), Popular (${POPULAR_ARTISTS_DATA.length}), Latin Urban (${LATIN_URBAN_ARTISTS_DATA.length})`);
