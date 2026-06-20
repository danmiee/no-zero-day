export const METHOD_META = {
  a: { name: '쪼개기',   accent: 'var(--lav)',   accentInk: 'var(--lav-ink)' },
  b: { name: '같이하기', accent: 'var(--mint)',  accentInk: 'var(--mint-ink)' },
  c: { name: '일단 5분', accent: 'var(--peach)', accentInk: 'var(--peach-ink)' },
};

export const METHOD_LIST = [
  { id: 'a', name: '쪼개기',   desc: '잘게 나눠 딱 한 걸음부터',         accent: 'var(--lav)',   accentInk: 'var(--lav-ink)' },
  { id: 'b', name: '같이하기', desc: '마스코트가 옆에서 함께 집중',       accent: 'var(--mint)',  accentInk: 'var(--mint-ink)' },
  { id: 'c', name: '일단 5분', desc: '딱 5분만, 부담 없이 시작',          accent: 'var(--peach)', accentInk: 'var(--peach-ink)' },
];

export const RECO_WHY = {
  a: '마음이 복잡할 때, 잘게 쪼개면 가벼워져요',
  b: '혼자가 아니라는 게 제일 큰 힘이 돼요',
  c: '지금은 딱 5분이면 충분해요',
};

export function recommendMethod(mood) {
  if (!mood) return 'c';
  if (mood.energy === '낮음') return 'c';
  if (mood.feel === '외로움') return 'b';
  if (mood.feel === '막막함' || mood.feel === '불안함') return 'a';
  if (mood.energy === '높음') return 'a';
  return 'c';
}
