import { getCollection } from 'astro:content';
import { isoDate } from './date';
import type { Lang } from './i18n';

const COLLECTION = { ko: 'devlog', en: 'devlogEn' } as const;

type AnyPost = { id: string; data: { date: Date; slug?: string; draft: boolean } };

// 인터넷 주소에 쓰는 이름. 파일 이름과는 아무 상관이 없다.
// 맨 위 slug 값이 있으면 그것을 쓰고, 없으면 날짜를 쓴다.
export function postSlug(post: AnyPost): string {
  const given = post.data.slug?.trim();
  return given && given.length > 0 ? given : isoDate(post.data.date);
}

export function postPath(lang: Lang, post: AnyPost): string {
  const base = lang === 'ko' ? '' : '/en';
  return `${base}/devlog/${postSlug(post)}/`;
}

// 글을 전부 읽어 최신순으로 돌려준다.
// draft: true 인 글은 내 컴퓨터에서만 보이고 공개된 사이트에는 안 올라간다.
export async function loadPosts(lang: Lang) {
  const showDrafts = import.meta.env.DEV;
  const posts = await getCollection(COLLECTION[lang], ({ data }: any) => showDrafts || !data.draft);

  // 주소가 겹치면 어느 글이 뜰지 알 수 없다. 조용히 넘기지 않고 여기서 멈춘다.
  const seen = new Map<string, string>();
  for (const post of posts as unknown as AnyPost[]) {
    const slug = postSlug(post);
    const before = seen.get(slug);
    if (before) {
      throw new Error(
        `글 주소가 겹칩니다: "${slug}"\n` +
          `  - ${before}\n` +
          `  - ${post.id}\n` +
          `  두 글 중 하나의 맨 위 slug 값을 다르게 바꿔 주세요.`
      );
    }
    seen.set(slug, post.id);
  }

  return posts.sort((a: any, b: any) => b.data.date.valueOf() - a.data.date.valueOf());
}
