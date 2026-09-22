// Complete Catalog Generator for All 104 Artists
import fs from 'fs';

import { MEXICAN_ARTISTS_DATA } from '../src/data/mexicanArtistsData.js';
import { POPULAR_ARTISTS_DATA } from '../src/data/popularArtistsData.js';
import { LATIN_URBAN_ARTISTS_DATA } from '../src/data/latinUrbanArtistsData.js';

import { POPULAR_CATALOG_EXPANSIONS } from './discography_popular.py'; // We'll write this in JS

console.log('Building complete catalog generator...');
