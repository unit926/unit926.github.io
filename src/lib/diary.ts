import { getCollection } from 'astro:content';
import { isoDate } from './date';

type AnyDiary = { id: string; data: { title: string; date: Date; slug?: string; draft: boolean } };

// 일기의 인터넷 주소 이름. 맨 위 slug 값이 있으면 그것을, 없으면 날짜를 쓴다.
export function diarySlug(entry: AnyDiary): string {
  const given = entry.data.slug?.trim();
  return given && given.length > 0 ? given : isoDate(entry.data.date);
}

export function diaryPath(entry: AnyDiary): string {
  return `/diary/${diarySlug(entry)}/`;
}

// 일기를 전부 읽어 최신순으로 돌려준다.
// draft: true 인 일기는 내 컴퓨터(미리보기)에서만 보이고 공개된 사이트에는 안 올라간다.
export async function loadDiary() {
  const showDrafts = import.meta.env.DEV;
  const entries = (await getCollection('diary', ({ data }: any) => showDrafts || !data.draft)) as unknown as AnyDiary[];

  // 주소가 겹치면 어느 일기가 뜰지 알 수 없다. 조용히 넘기지 않고 여기서 멈춘다.
  const seen = new Map<string, string>();
  for (const entry of entries) {
    const slug = diarySlug(entry);
    const before = seen.get(slug);
    if (before) {
      throw new Error(
        `일기 주소가 겹칩니다: "${slug}"\n  - ${before}\n  - ${entry.id}\n  두 일기 중 하나의 맨 위 slug 값을 다르게 바꿔 주세요.`
      );
    }
    seen.set(slug, entry.id);
  }

  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
