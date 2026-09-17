import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 글 한 편이 가져야 하는 항목들. 글 파일 맨 위 --- 사이에 적는 값이 여기와 맞아야 한다.
//
// slug 는 인터넷 주소에 쓰이는 이름이다. npm run new 가 알아서 넣어 주고,
// 한글판과 영문판이 같은 slug 를 가지면 두 글이 짝으로 묶인다.
// 비워두면 date 값을 주소로 쓴다. 파일 이름은 주소와 상관이 없다.
const postSchema = ({ image }: { image: () => any }) =>
  z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    thumbnail: image(),
    thumbnailAlt: z.string().default(''),
    draft: z.boolean().default(false),
    slug: z.string().optional(),
  });

const devlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog' }),
  schema: postSchema,
});

const devlogEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog-en' }),
  schema: postSchema,
});

export const collections = { devlog, devlogEn };
