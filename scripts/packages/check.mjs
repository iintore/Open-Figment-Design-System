// Pre-publish checks for every package: publint (package.json, exports, files) and
// Are the Types Wrong (types resolve for import and require under every module resolution).
// Packs each package into .packages-pack/ and prints its size. Run after packages:build.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '../..');
const PKGS = path.join(ROOT, 'packages');
const OUT = path.join(ROOT, '.packages-pack');
const bin = (n) => path.join(ROOT, 'node_modules', '.bin', n);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
const dirs = fs.readdirSync(PKGS).filter((d) => fs.existsSync(path.join(PKGS, d, 'package.json')));
let failed = 0;
for (const d of dirs) {
  const dir = path.join(PKGS, d);
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  const problems = [];
  try {
    execFileSync(bin('publint'), ['--strict', '--level', 'warning'], { cwd: dir, stdio: 'pipe' });
  } catch (e) {
    problems.push('publint: ' + String(e.stdout || e.message).trim().split('\n').slice(-4).join(' '));
  }
  const [info] = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', OUT], { cwd: dir, stdio: ['ignore', 'pipe', 'ignore'] }).toString());
  if (pkg.main) {
    const cssEntries = Object.keys(pkg.exports).filter((k) => !/\.json$|\*$/.test(k) && k !== '.');
    try {
      execFileSync(bin('attw'), [path.join(OUT, info.filename), '--format', 'table-flipped', '--quiet', ...(cssEntries.length ? ['--entrypoints', '.', ...cssEntries] : ['--entrypoints', '.'])], { stdio: 'pipe' });
    } catch (e) {
      problems.push('attw: ' + String(e.stdout || e.message).trim().split('\n').slice(0, 6).join(' '));
    }
  }
  const kb = (info.unpackedSize / 1024).toFixed(1);
  console.log(`${problems.length ? '✗' : '✓'} ${pkg.name.padEnd(34)} ${String(info.entryCount).padStart(3)} files ${kb.padStart(7)} kB`);
  for (const p of problems) console.log('    ' + p);
  failed += problems.length ? 1 : 0;
}
console.log(failed ? `\n${failed} package(s) failed` : `\nAll ${dirs.length} packages pass. Tarballs: .packages-pack/`);
process.exit(failed ? 1 : 0);
