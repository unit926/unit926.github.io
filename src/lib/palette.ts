// 사이트 색 — 바꾸는 자리는 맨 아래 PALETTE 한 글자다(a · b · c · d · e · f).
// 네 벌은 2026-10-24 시험판에서 같은 그림에 입혀 비교했고 C(먹과 주홍)로 정했다가, 같은 날 E(짙은 청색과 주황)로 바꿨다.
// 2026-10-25 어두운 다섯 벌을 다시 비교해 F(흑연과 얼음)로 바꿨다.
// 현관과 방 · 데브로그 모니터 · 일기 · 영어판이 모두 여기서 색을 받아 간다.
//
// 칠하는 규칙 — 누를 수 있는 물건에만 포인트 색(s1 · s2 · s3)을 칠하고, 꾸밈은 회색 단계(a1 · a2 · a3)로만 칠한다.

const PALETTES = {
  // A · 재와 호박 — 밝은 잿빛 + 호박색
  a: {
    bg: '#ECE9E3', hi: '#FBF9F5', wall: '#E9E5DE', wall2: '#DCD7CE', ceil: '#F1EEE9', floor: '#CEC7BB',
    a1: '#E3DFD8', a2: '#CDC7BD', a3: '#A39C91', dk: '#2A2623', ink: '#23201D', 'ink-soft': '#6F675E',
    s1: '#F2D6A2', s2: '#DFA449', s3: '#A6681F', on: '#2A1E12', ok: '#4E8A5A', bad: '#C1473A',
    shc: '#3B2D1E', sho: '.12', hat: '#23201D', hato: '.36',
    'sky-d': '#D3DEE3', 'sky-e': '#EECCA8', 'sky-n': '#2C333F', sun: '#F7E6B4', moon: '#F3EEDB', bld: '#BCC4C8', 'bld-n': '#1C222B', bw: '#E6ECEE',
    sheet: '#FBF9F5', veil: 'rgba(236,233,227,.78)', grain: '.55', blend: 'multiply', scheme: 'light',
  },
  // B · 밤 — 어두운 잿빛 + 호박 불빛
  b: {
    bg: '#17181B', hi: '#34363C', wall: '#222428', wall2: '#1A1C1F', ceil: '#1D1F22', floor: '#2B2C30',
    a1: '#2B2D32', a2: '#35383E', a3: '#4B4F57', dk: '#0C0D0F', ink: '#E6E0D3', 'ink-soft': '#A39C90',
    s1: '#EDC27A', s2: '#CD8E38', s3: '#8E5D1F', on: '#22170B', ok: '#6DB07A', bad: '#E06A5A',
    shc: '#000', sho: '.38', hat: '#000', hato: '.6',
    'sky-d': '#7E93A0', 'sky-e': '#A9806A', 'sky-n': '#10151C', sun: '#F0D896', moon: '#ECE5CC', bld: '#4F5963', 'bld-n': '#080B10', bw: '#8F9DA6',
    sheet: '#26282C', veil: 'rgba(15,16,18,.6)', grain: '.35', blend: 'screen', scheme: 'dark',
  },
  // C · 먹과 주홍 — 밝은 잿빛 + 주홍
  c: {
    bg: '#EEECE8', hi: '#FCFBF9', wall: '#EBE9E5', wall2: '#DEDBD5', ceil: '#F3F1EE', floor: '#D0CCC5',
    a1: '#E5E2DD', a2: '#D0CCC5', a3: '#A29E97', dk: '#26262A', ink: '#1F1F23', 'ink-soft': '#6A6862',
    s1: '#F3C6B5', s2: '#DD6847', s3: '#A43A25', on: '#2A120C', ok: '#4E8A5A', bad: '#B8322A',
    shc: '#2A2220', sho: '.12', hat: '#1F1F23', hato: '.36',
    'sky-d': '#D6DFE3', 'sky-e': '#EFCDB4', 'sky-n': '#2B313B', sun: '#F7E4C4', moon: '#F3EEDF', bld: '#BFC5C9', 'bld-n': '#1B2028', bw: '#E8EDEF',
    sheet: '#FCFBF9', veil: 'rgba(238,236,232,.78)', grain: '.55', blend: 'multiply', scheme: 'light',
  },
  // D · 푸른 재 — 푸른 잿빛 + 호박색
  d: {
    bg: '#E6EAEB', hi: '#F8FAFA', wall: '#E2E7E8', wall2: '#D1D8DA', ceil: '#ECF0F0', floor: '#C0C9CC',
    a1: '#DAE0E2', a2: '#C2CBCE', a3: '#8C989D', dk: '#1B242A', ink: '#1D2931', 'ink-soft': '#5B6970',
    s1: '#F1D19A', s2: '#DA9C41', s3: '#9D6320', on: '#2A1E12', ok: '#4E8A5A', bad: '#C1473A',
    shc: '#1C2A33', sho: '.12', hat: '#1D2931', hato: '.36',
    'sky-d': '#CFDCE2', 'sky-e': '#EBCBAA', 'sky-n': '#28303B', sun: '#F6E5B6', moon: '#F1EEDF', bld: '#B3BEC3', 'bld-n': '#19202A', bw: '#E3EAED',
    sheet: '#F8FAFA', veil: 'rgba(230,234,235,.78)', grain: '.5', blend: 'multiply', scheme: 'light',
  },
  // E · 짙은 청색과 주황 — 어두운 청색 + 쨍한 주황
  e: {
    bg: '#0A0F18', hi: '#2E3A4E', wall: '#0F1724', wall2: '#0B111C', ceil: '#0D1420', floor: '#192230',
    a1: '#172235', a2: '#2D3B50', a3: '#46566E', dk: '#05080D', ink: '#E6E9EE', 'ink-soft': '#9AA4B4',
    s1: '#FFB37E', s2: '#FF6A1A', s3: '#C24A0C', on: '#2A1206', ok: '#6DB07A', bad: '#F0645A',
    shc: '#000', sho: '.38', hat: '#000', hato: '.6',
    'sky-d': '#6F86A3', 'sky-e': '#A47A6A', 'sky-n': '#0A101A', sun: '#F0D896', moon: '#E6E9EE', bld: '#3E4B60', 'bld-n': '#060910', bw: '#7F8FA6',
    sheet: '#182131', veil: 'rgba(10,15,24,.6)', grain: '.35', blend: 'screen', scheme: 'dark',
  },
  // F · 흑연과 얼음 — 어두운 흑연 + 옅은 하늘빛
  f: {
    bg: '#121316', hi: '#33363C', wall: '#1C1D21', wall2: '#16171A', ceil: '#18191C', floor: '#26282D',
    a1: '#222428', a2: '#2D3035', a3: '#444850', dk: '#0A0B0D', ink: '#E6E7EA', 'ink-soft': '#9EA1A8',
    s1: '#C3DCF5', s2: '#7FB2E5', s3: '#4A7CB0', on: '#0C1A28', ok: '#6DB07A', bad: '#E06A5A',
    shc: '#000', sho: '.38', hat: '#000', hato: '.6',
    'sky-d': '#7E8FA0', 'sky-e': '#8A8496', 'sky-n': '#0E1117', sun: '#ECE6D0', moon: '#E6E7EA', bld: '#474B53', 'bld-n': '#08090C', bw: '#8C929C',
    sheet: '#1E2024', veil: 'rgba(14,15,17,.6)', grain: '.35', blend: 'screen', scheme: 'dark',
  },
} as const;

export const PALETTE: keyof typeof PALETTES = 'f';

// 쪽마다 <head> 에 넣는 색 한 덩어리 — :root 에 --bg · --ink 같은 이름으로 깔린다
export function paletteStyle(): string {
  const p = PALETTES[PALETTE];
  const vars = Object.entries(p).filter(([k]) => k !== 'scheme').map(([k, v]) => `--${k}:${v}`).join(';');
  return `<style>:root{${vars};color-scheme:${p.scheme}}</style>`;
}
