const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const matches = [];

function walk(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const d of entries) {
		const p = path.join(dir, d.name);
		if (d.isDirectory()) {
			walk(p);
			continue;
		}

		if (!/\.jsx?$/.test(d.name)) continue;
		const content = fs.readFileSync(p, 'utf8');
		const re = /from\s+["'](\.\.\/.+?)["']/g;
		let m;
		while ((m = re.exec(content)) !== null) {
			const orig = m[1];
			const up = orig.match(/^(\.\.\/)+/);
			if (!up) continue;
			const target = path.resolve(path.dirname(p), orig);
			const relToSrc = path.relative(path.join(repo, 'src'), target);
			if (relToSrc.startsWith('..')) continue;
			const repl = '@/' + relToSrc.replace(/\\/g, '/').replace(/\.jsx?$/, '').replace(/\.js$/, '');
			matches.push({ file: path.relative(repo, p), orig, repl });
		}
	}
}

const srcDir = path.join(repo, 'src');
if (!fs.existsSync(srcDir)) {
	console.error('src not found');
	process.exit(1);
}

walk(srcDir);
fs.writeFileSync(path.join(repo, 'import-replacements.json'), JSON.stringify(matches, null, 2));
console.log('WROTE', matches.length);