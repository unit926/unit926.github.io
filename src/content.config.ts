import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { isoDate } from './lib/date';

// 글 한 편이 가져야 하는 항목들. 글 파일 맨 위 --- 사이에 적는 값이 여기와 맞아야 한다.
//
// slug 는 인터넷 주소에 쓰이는 이름이다. npm run new 가 알아서 넣어 주고,
// 한글판과 영문판이 같은 slug 를 가지면 두 글이 짝으로 묶인다.
// 비워두면 date 값을 주소로 쓴다. 파일 이름은 주소와 상관이 없다.
//
// slug 가 날짜 모양이면 옵시디언이 저장할 때 따옴표를 벗겨서 날짜 값으로 바꿔 놓는다.
// 그래서 글자와 날짜를 둘 다 받고, 날짜로 들어오면 2026-09-17 모양으로 되돌린다.
// 이게 없으면 람호가 옵시디언에서 글을 고칠 때마다 사이트가 안 만들어진다 (2026-09-17).
const slugField = z
  .union([z.string(), z.date()])
  .optional()
  .transform((value) => (value instanceof Date ? isoDate(value) : value));

const postSchema = ({ image }: { image: () => any }) =>
  z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    thumbnail: image(),
    thumbnailAlt: z.string().default(''),
    draft: z.boolean().default(false),
    slug: slugField,
  });

const devlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog' }),
  schema: postSchema,
});

const devlogEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog-en' }),
  schema: postSchema,
});

// 일기 — 방 서랍 속 일기장에 뜨는 글. 한글 한 편만 쓴다(영문판 짝 없음).
// npm run diary (바탕화면 「6. 새 일기 만들기」)가 만들어 준다. 사진은 안 붙인다.
const diary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/diary' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    slug: slugField,
  }),
});

export const collections = { devlog, devlogEn, diary };
