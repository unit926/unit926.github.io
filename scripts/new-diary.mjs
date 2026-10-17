// 새 일기를 만든다. 한글판 한 편만 생긴다(데브로그처럼 영문판 짝을 만들지 않는다).
// 방 넷째 벽 수납장 서랍을 누르면 뜨는 일기장에 날짜 순으로 쌓인다.
//
//   npm run diary                 (오늘 날짜로 만든다)
//   npm run diary -- 2026-10-17   (그 날짜로 만든다)

import { writeFile, mkdir, readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIR = path.join(ROOT, 'src', 'content', 'diary');

function todayLocal() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

// 이미 쓰인 주소 이름을 전부 모은다. 파일 이름이 아니라 글 안의 slug 값을 본다.
async function usedSlugs(dir) {
  if (!existsSync(dir)) return new Set();
  const names = (await readdir(dir)).filter((n) => n.endsWith('.md'));
  const found = new Set();
  for (const n of names) {
    const text = await readFile(path.join(dir, n), 'utf8');
    const m = /^slug:\s*(.+)$/m.exec(text);
    const d = /^date:\s*(\d{4}-\d{2}-\d{2})/m.exec(text);
    if (m) found.add(m[1].trim().replace(/^["']|["']$/g, ''));
    else if (d) found.add(d[1]);
  }
  return found;
}

const date = (process.argv[2] || todayLocal()).trim();

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`\n  날짜가 이상합니다: "${date}"`);
  console.error('  2026-10-17 모양으로 주세요.  예:  npm run diary -- 2026-10-17\n');
  process.exit(1);
}

await mkdir(DIR, { recursive: true });

const taken = await usedSlugs(DIR);
let slug = date;
let n = 2;
while (taken.has(slug)) {
  slug = `${date}-${n}`;
  n += 1;
}

const body = `---
title: 일기 제목을 여기에 적습니다
date: ${date}
draft: true
slug: "${slug}"
---

여기부터 일기입니다.

다 쓰셨으면 맨 위 draft 를 false 로 바꾸세요. 그래야 공개됩니다.
공개되면 누구나 읽을 수 있습니다.
`;

const file = path.join(DIR, `${slug}.md`);
await writeFile(file, body, 'utf8');

console.log(`\n  일기 한 편을 만들었습니다.\n`);
console.log(`    파일   src/content/diary/${slug}.md`);
console.log(`    주소   /diary/${slug}/`);
console.log(`\n  옵시디언으로 열어서 쓰시면 됩니다. 파일 이름은 바꾸셔도 됩니다.`);
console.log(`  주소는 맨 위 slug 값이 정하니 그 줄만 건드리지 마세요.`);
console.log(`  지금은 draft: true 라서 나만 볼 수 있습니다.\n`);
