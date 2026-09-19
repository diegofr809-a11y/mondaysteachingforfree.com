import fs from 'fs';
import path from 'path';

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Ensure 404.html in dist for GitHub Pages routing
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'dist/404.html');
}

// 2. Mirror dist/assets to root assets/ so GitHub Pages root deployment can load compiled bundles directly
if (fs.existsSync('dist/assets')) {
  copyDir('dist/assets', 'assets');
}

// 3. Mirror dist to docs/ so GitHub Pages "/docs" folder deployment works seamlessly
if (fs.existsSync('dist')) {
  copyDir('dist', 'docs');
}

console.log('Successfully prepared GitHub Pages assets (dist, docs, and root assets)');
