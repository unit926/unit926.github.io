// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // 사이트 주소. 도메인을 바꾸면 이 줄만 바꾸면 된다.
  site: 'https://unit926.com',

  // 한국어가 기본이라 주소에 표시가 안 붙고, 영어는 /en/ 아래로 간다.
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    routing: { prefixDefaultLocale: false },
  },
});
