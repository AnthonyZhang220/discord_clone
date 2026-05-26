const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const mapPath = path.join(repo, 'import-replacements.json');
if (!fs.existsSync(mapPath)) {
  console.error('import-replacements.json not found');
  process.exit(1);
}

const entries = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const byFile = new Map();
for (const e of entries) {
  const filePath = path.join(repo, e.file);
  if (!byFile.has(filePath)) byFile.set(filePath, []);
  byFile.get(filePath).push(e);
}

let changed = 0;
for (const [filePath, changes] of byFile) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  let origContent = content;
  for (const c of changes) {
    // Replace both single and double quote import forms and require() if any
    const escOrig = c.orig.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp("from\\s+(['\"])" + escOrig + "\\1", 'g');
    content = content.replace(re, `from "${c.repl}"`);
    // also replace import '...'; style
    const re2 = new RegExp("(['\"])" + escOrig + "\\1", 'g');
    content = content.replace(re2, `"${c.repl}"`);
  }
  if (content !== origContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    changed++;
    console.log('Updated', path.relative(repo, filePath));
  }
}

console.log('Done. Files changed:', changed);
