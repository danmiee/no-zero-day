export const fmt = (n) => String(n).padStart(2, '0');

export const todayISO = () => {
  const d = new Date();
  return d.getFullYear() + '-' + fmt(d.getMonth() + 1) + '-' + fmt(d.getDate());
};

export const addDaysISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + fmt(d.getMonth() + 1) + '-' + fmt(d.getDate());
};

export function whenLabel(iso) {
  if (!iso) return '날짜 없음';
  if (iso === todayISO()) return '오늘';
  if (iso === addDaysISO(1)) return '내일';
  if (iso === addDaysISO(2)) return '모레';
  const [, m, d] = iso.split('-');
  return parseInt(m) + '월 ' + parseInt(d) + '일';
}

export function timeLabel(t) {
  if (!t) return null;
  let [h, m] = t.split(':').map(Number);
  const ap = h < 12 ? '오전' : '오후';
  h = h % 12;
  if (h === 0) h = 12;
  return ap + ' ' + h + ':' + fmt(m);
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
export function todayDisplayLabel() {
  const d = new Date();
  return `오늘 · ${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}
