const fs = require('fs');
const text = fs.readFileSync('/tmp/s3_index.js', 'utf8');

// Look for navigation tabs
const tabMatches = text.match(/\{[^}]*id:\s*["'](?:games|apps|chat|ai|settings|browser)[^}]*\}/gi);
console.log('Tab matches:', tabMatches);

// Search for any arrays containing apps
const appArrayMatch = text.match(/apps\s*[:=]\s*\[[^\]]+\]/gi);
console.log('apps array matches:', appArrayMatch?.length);

// Search for string occurrences of "Apps" or "apps"
const appOccurrences = [];
let idx = 0;
while ((idx = text.toLowerCase().indexOf('apps', idx)) !== -1) {
  appOccurrences.push(text.substring(Math.max(0, idx - 50), Math.min(text.length, idx + 100)));
  idx += 5;
  if (appOccurrences.length > 20) break;
}
console.log('Occurrences of "apps":', appOccurrences.slice(0, 10));
