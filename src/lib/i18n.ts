// 화면에 뜨는 말은 전부 여기 모아 둔다. 문구를 고칠 때 여기만 보면 된다.

export const LANGS = ['ko', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const ui = {
  ko: {
    siteName: '흑색잔상',
    siteDescription: '흑색잔상(Ashen Afterimage) 개발 일지',
    devlog: '데브로그',
    about: '소개',
    presskit: '프레스킷',
    aboutDescription: '흑색잔상(Ashen Afterimage) 소개',
    presskitDescription: '흑색잔상(Ashen Afterimage) 프레스킷',
    backToList: '데브로그 목록으로',
    emptyTitle: '아직 올린 글이 없습니다',
    emptyBody: '첫 데브로그를 쓰면 여기에 나옵니다.',
    preparing: '준비 중입니다.',
    byline: '흑색잔상 (Ashen Afterimage) · 람호 / unit926',
    menuLabel: '사이트 메뉴',
    langLabel: '언어',
  },
  en: {
    siteName: 'Ashen Afterimage',
    siteDescription: 'Development log for Ashen Afterimage',
    devlog: 'Devlog',
    about: 'About',
    presskit: 'Press kit',
    aboutDescription: 'About Ashen Afterimage',
    presskitDescription: 'Press kit for Ashen Afterimage',
    backToList: 'Back to devlog',
    emptyTitle: 'No posts yet',
    emptyBody: 'The first devlog entry will appear here.',
    preparing: 'Coming soon.',
    byline: 'Ashen Afterimage · unit926',
    menuLabel: 'Site menu',
    langLabel: 'Language',
  },
} as const;

// 탭 세 개의 주소. 한국어는 주소에 표시가 없고 영어는 /en/ 아래에 있다.
export function tabsFor(lang: Lang) {
  const base = lang === 'ko' ? '' : '/en';
  return [
    { href: `${base}/`, label: ui[lang].devlog, key: 'devlog' },
    { href: `${base}/about/`, label: ui[lang].about, key: 'about' },
    { href: `${base}/presskit/`, label: ui[lang].presskit, key: 'presskit' },
  ];
}

// 지금 보고 있는 화면의 반대말 판 주소.
export function otherLangPath(lang: Lang, pathname: string): string {
  if (lang === 'ko') return `/en${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
  const stripped = pathname.replace(/^\/en/, '');
  return stripped === '' ? '/' : stripped;
}

// 주소를 보고 어느 말로 된 화면인지 가린다.
export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ko';
}
