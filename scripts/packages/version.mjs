// Set the version of every package: npm run packages:version -- 0.2.0
// Then rebuild (npm run packages:build) so package.json files and inter-package ranges match.
import fs from 'node:fs';
import path from 'node:path';

const v = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(v ?? '')) {
  console.error('Usage: npm run packages:version -- <x.y.z>');
  process.exit(1);
}
const file = path.resolve(import.meta.dirname, '../../packages/version.json');
fs.writeFileSync(file, JSON.stringify({ version: v }, null, 2) + '\n');
console.log(`packages/version.json → ${v}. Now run: npm run packages:build`);
