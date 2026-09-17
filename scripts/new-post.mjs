// 새 데브로그 글 파일을 만든다.
//
//   npm run new                 (오늘 날짜로 만든다)
//   npm run new -- 2026-09-17   (그 날짜로 만든다)

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const POSTS = path.join(ROOT, 'src', 'content', 'devlog');

function todayLocal() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

const date = (process.argv[2] || todayLocal()).trim();

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`\n  날짜가 이상합니다: "${date}"`);
  console.error('  2026-09-17 모양으로 주세요.  예:  npm run new -- 2026-09-17\n');
  process.exit(1);
}

await mkdir(POSTS, { recursive: true });

let name = `${date}.md`;
let n = 2;
while (existsSync(path.join(POSTS, name))) {
  name = `${date}-${n}.md`;
  n += 1;
}

const body = `---
title: 제목을 여기에 적습니다
date: ${date}
summary: 목록에 한 줄로 뜨는 짧은 소개입니다. 지워도 됩니다.
thumbnail: ../../assets/devlog/_준비중.webp
thumbnailAlt: 썸네일 설명
draft: true
---

여기부터 본문입니다.

사진은 \`npm run images\` 를 먼저 돌린 뒤, 나온 줄을 붙여 넣으세요.

다 쓰셨으면 맨 위 draft 를 false 로 바꾸세요. 그래야 공개됩니다.
`;

await writeFile(path.join(POSTS, name), body, 'utf8');

console.log(`\n  새 글을 만들었습니다:  src/content/devlog/${name}`);
console.log(`  주소는 이렇게 됩니다:  /devlog/${name.replace(/\.md$/, '')}/`);
console.log(`  지금은 draft: true 라서 나만 볼 수 있습니다.\n`);
