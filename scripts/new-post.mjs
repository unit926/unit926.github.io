// 새 데브로그 글을 만든다. 한글판과 영문판이 같이 생긴다.
//
//   npm run new                 (오늘 날짜로 만든다)
//   npm run new -- 2026-09-17   (그 날짜로 만든다)

import { writeFile, mkdir, readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const KO = path.join(ROOT, 'src', 'content', 'devlog');
const EN = path.join(ROOT, 'src', 'content', 'devlog-en');

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
  console.error('  2026-09-17 모양으로 주세요.  예:  npm run new -- 2026-09-17\n');
  process.exit(1);
}

await mkdir(KO, { recursive: true });
await mkdir(EN, { recursive: true });

const taken = new Set([...(await usedSlugs(KO)), ...(await usedSlugs(EN))]);
let slug = date;
let n = 2;
while (taken.has(slug)) {
  slug = `${date}-${n}`;
  n += 1;
}

function koBody() {
  return `---
title: 제목을 여기에 적습니다
date: ${date}
summary: 목록에 한 줄로 뜨는 짧은 소개입니다. 지워도 됩니다.
thumbnail: ../../assets/devlog/_준비중.webp
thumbnailAlt: 썸네일 설명
draft: true
slug: "${slug}"
---

여기부터 본문입니다.

사진은 \`npm run images\` 를 먼저 돌린 뒤, 나온 줄을 붙여 넣으세요.

다 쓰셨으면 맨 위 draft 를 false 로 바꾸세요. 그래야 공개됩니다.
`;
}

function enBody() {
  return `---
title: Write the English title here
date: ${date}
summary: One-line summary shown in the list. You can delete this.
thumbnail: ../../assets/devlog/_준비중.webp
thumbnailAlt: Thumbnail description
draft: true
slug: "${slug}"
---

English text goes here.

Set draft to false when it is ready.
`;
}

const koFile = path.join(KO, `${slug}.md`);
const enFile = path.join(EN, `${slug}.md`);

await writeFile(koFile, koBody(), 'utf8');
await writeFile(enFile, enBody(), 'utf8');

console.log(`\n  글 두 개를 만들었습니다.\n`);
console.log(`    한글판   src/content/devlog/${slug}.md`);
console.log(`    영문판   src/content/devlog-en/${slug}.md`);
console.log(`\n  주소는 이렇게 됩니다.`);
console.log(`    한글판   /devlog/${slug}/`);
console.log(`    영문판   /en/devlog/${slug}/`);
console.log(`\n  파일 이름은 옵시디언에서 마음대로 바꾸셔도 됩니다.`);
console.log(`  주소는 맨 위 slug 값이 정하니 그 줄만 건드리지 마세요.`);
console.log(`  지금은 둘 다 draft: true 라서 나만 볼 수 있습니다.\n`);
