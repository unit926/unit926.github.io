import type { Lang } from './i18n';

const EN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// 날짜를 화면에 찍는 방식은 여기 한 곳에서만 정한다.
// 세계시 기준으로 읽는다. 사이트를 만드는 컴퓨터가 어느 나라에 있든 같은 날짜가 나오게 하기 위해서다.
export function formatDate(date: Date, lang: Lang = 'ko'): string {
  const y = date.getUTCFullYear();
  const mIndex = date.getUTCMonth();
  const d = date.getUTCDate();

  if (lang === 'en') return `${EN_MONTHS[mIndex]} ${d}, ${y}`;

  return `${y}. ${String(mIndex + 1).padStart(2, '0')}. ${String(d).padStart(2, '0')}.`;
}

// 글의 주소에 쓰는 날짜 모양. 2026-09-17
export function isoDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
