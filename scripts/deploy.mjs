// 사이트를 확인하고 깃허브에 올린다.
//
//   npm run deploy
//
// ① 사이트가 제대로 만들어지는지 먼저 확인한다 (깨졌으면 올리지 않는다)
// ② 바뀐 것을 담고 오늘 날짜로 기록을 남긴다
// ③ 깃허브로 올린다

import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', ...opts });
}

function todayLabel() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}(${DAYS[d.getDay()]})`;
}

console.log('\n  [1/3] 사이트가 제대로 만들어지는지 확인합니다.\n');
try {
  run('npm run build', { stdio: 'inherit' });
} catch {
  console.error('\n  [막힘] 사이트를 만들다 멈췄습니다. 위에 나온 오류를 보세요.');
  console.error('         올리지 않았습니다. 고친 뒤 다시 누르시면 됩니다.\n');
  process.exit(1);
}

console.log('\n  [2/3] 바뀐 것을 담습니다.\n');
run('git add -A');

const staged = run('git diff --cached --name-only').trim();
if (staged.length === 0) {
  console.log('  바뀐 것이 없습니다. 올릴 것이 없어서 그냥 끝냅니다.\n');
  process.exit(0);
}

for (const line of staged.split('\n')) console.log(`    ${line.trim()}`);

const message = `${todayLabel()} 데브로그`;
try {
  run(`git commit -m "${message}"`);
} catch (e) {
  console.error('\n  [막힘] 기록을 남기다 멈췄습니다.');
  console.error(String(e.stdout || e.message));
  process.exit(1);
}

console.log(`\n  [3/3] 깃허브로 올립니다.\n`);
try {
  run('git push', { stdio: 'inherit' });
} catch {
  console.error('\n  [막힘] 올리다 멈췄습니다. 위 메시지를 보세요.');
  console.error('         기록은 이미 남았으니, 문제를 고치고 다시 누르면 그대로 올라갑니다.\n');
  process.exit(1);
}

console.log('\n  [끝] 올렸습니다.');
console.log('       2~3분 뒤 https://unit926.com 에 반영됩니다.');
console.log('       진행 상황은 여기서 봅니다:');
console.log('       https://github.com/unit926/unit926.github.io/actions\n');
