// 사진을 줄여서 사이트 폴더에 넣는다.
//
//   npm run images                 (오늘 날짜로 넣는다)
//   npm run images -- 2026-09-17   (그 날짜로 넣는다)
//
// _사진넣는곳 폴더에 있는 사진을 전부 가로 1600픽셀 WebP로 줄여
// src/assets/devlog/ 에 넣고, 원본은 _사진넣는곳/처리완료/ 로 옮긴다.
// 원본은 저장소에 올라가지 않는다(.gitignore).

import sharp from 'sharp';
import { readdir, mkdir, rename, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const INBOX = path.join(ROOT, '_사진넣는곳');
const DONE = path.join(INBOX, '처리완료');
const OUT = path.join(ROOT, 'src', 'assets', 'devlog');

const MAX_WIDTH = 1600;
const QUALITY = 80;
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);
const REFUSED = new Set(['.gif', '.mp4', '.mov', '.webm', '.avi', '.mkv']);

function todayLocal() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function human(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  return `${Math.round(bytes / 1024)}KB`;
}

const prefix = (process.argv[2] || todayLocal()).trim();

if (!/^\d{4}-\d{2}-\d{2}(-[a-z0-9-]+)?$/.test(prefix)) {
  console.error(`\n  이름이 이상합니다: "${prefix}"`);
  console.error('  2026-09-17 모양으로 주세요.  예:  npm run images -- 2026-09-17\n');
  process.exit(1);
}

await mkdir(INBOX, { recursive: true });
await mkdir(DONE, { recursive: true });
await mkdir(OUT, { recursive: true });

const all = (await readdir(INBOX, { withFileTypes: true })).filter((e) => e.isFile()).map((e) => e.name);

const refused = all.filter((n) => REFUSED.has(path.extname(n).toLowerCase()));
const files = all
  .filter((n) => ALLOWED.has(path.extname(n).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, 'ko'));

if (refused.length > 0) {
  console.log('\n  아래 파일은 넣지 않았습니다. 움직이는 그림과 동영상은 저장소를 크게 만듭니다.');
  console.log('  동영상은 유튜브에 올리고 글에는 주소만 적으세요.');
  for (const n of refused) console.log(`    - ${n}`);
}

if (files.length === 0) {
  console.log(`\n  줄일 사진이 없습니다.`);
  console.log(`  이 폴더에 사진을 넣고 다시 실행하세요:`);
  console.log(`    ${INBOX}\n`);
  process.exit(0);
}

// 같은 날짜로 이미 넣어둔 사진이 있으면 그 다음 번호부터 매긴다.
const existing = existsSync(OUT) ? await readdir(OUT) : [];
const numberPattern = new RegExp(`^${prefix}-(\d{2})\.webp$`);
const used = existing.map((n) => numberPattern.exec(n)).filter(Boolean).map((m) => Number(m[1]));
let next = used.length > 0 ? Math.max(...used) + 1 : 1;

const results = [];
let beforeTotal = 0;
let afterTotal = 0;

for (const name of files) {
  const from = path.join(INBOX, name);
  const outName = `${prefix}-${String(next).padStart(2, '0')}.webp`;
  const to = path.join(OUT, outName);

  const before = (await stat(from)).size;
  const meta = await sharp(from).metadata();

  await sharp(from)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(to);

  const after = (await stat(to)).size;
  const outMeta = await sharp(to).metadata();

  let moved = path.join(DONE, name);
  let dup = 1;
  while (existsSync(moved)) {
    const ext = path.extname(name);
    moved = path.join(DONE, `${path.basename(name, ext)}(${dup})${ext}`);
    dup += 1;
  }
  await rename(from, moved);

  results.push({ outName, meta, outMeta, before, after });
  beforeTotal += before;
  afterTotal += after;
  next += 1;
}

console.log(`\n  사진 ${results.length}장을 줄여서 넣었습니다.\n`);
for (const r of results) {
  const size = `${r.meta.width}x${r.meta.height} → ${r.outMeta.width}x${r.outMeta.height}`;
  console.log(`    ${r.outName}   ${size}   ${human(r.before)} → ${human(r.after)}`);
}
console.log(`\n  합계  ${human(beforeTotal)} → ${human(afterTotal)}`);
console.log(`  원본은 _사진넣는곳/처리완료/ 로 옮겼습니다. 저장소에는 올라가지 않습니다.\n`);

console.log('  ── 글 맨 위 thumbnail 줄에 넣을 것 ──');
console.log(`    thumbnail: ../../assets/devlog/${results[0].outName}\n`);

console.log('  ── 본문에 넣을 줄 (복사해서 쓰세요) ──');
for (const r of results) {
  console.log(`    ![](../../assets/devlog/${r.outName})`);
}
console.log('');
