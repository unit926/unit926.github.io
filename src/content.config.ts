import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 데브로그 글 한 편이 가져야 하는 항목들.
// 글 파일 맨 위 --- 사이에 적는 값이 여기 정의와 맞아야 한다.
const devlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string().optional(),
      thumbnail: image(),
      thumbnailAlt: z.string().default(''),
      draft: z.boolean().default(false),
    }),
});

export const collections = { devlog };
