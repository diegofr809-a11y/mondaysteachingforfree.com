import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// 1. Mexican Artists
const mexData = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/expanded_mexican.json'), 'utf8'));
const mexContent = `// Full authentic discographies for Regional Mexican and Corridos artists
export const MEXICAN_ARTISTS_DATA = ${JSON.stringify(mexData, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, 'src/data/mexicanArtistsData.js'), mexContent, 'utf8');
console.log('Wrote mexicanArtistsData.js, artists:', mexData.length);

// 2. Popular Artists
const popData = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/expanded_popular.json'), 'utf8'));
const popContent = `// Full authentic discographies for Popular and International artists
export const POPULAR_ARTISTS_DATA = ${JSON.stringify(popData, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, 'src/data/popularArtistsData.js'), popContent, 'utf8');
console.log('Wrote popularArtistsData.js, artists:', popData.length);

// 3. Latin Urban Artists
const latinData = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/expanded_latin.json'), 'utf8'));
const latinContent = `// Full authentic discographies for Latin Urban and Reggaeton artists
export const LATIN_URBAN_ARTISTS_DATA = ${JSON.stringify(latinData, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, 'src/data/latinUrbanArtistsData.js'), latinContent, 'utf8');
console.log('Wrote latinUrbanArtistsData.js, artists:', latinData.length);

console.log('All 3 data files successfully written!');
