export const fmt = (n) => String(n).padStart(2, '0');

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export const todayISO = () => {
  const d = new Date();
  return d.getFullYear() + '-' + fmt(d.getMonth() + 1) + '-' + fmt(d.getDate());
};

export const addDaysISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + fmt(d.getMonth() + 1) + '-' + fmt(d.getDate());
};

export function weekdayFromISO(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return WEEKDAY_LABELS[new Date(y, m - 1, d).getDay()];
}

export function whenLabel(iso) {
  if (!iso) return '날짜 없음';
  const [y, m, d] = iso.split('-').map(Number);
  const day = weekdayFromISO(iso);
  return `${String(y).slice(2)}.${fmt(m)}.${fmt(d)}.(${day})`;
}

export function timeLabel(t) {
  if (!t) return null;
  let [h, m] = t.split(':').map(Number);
  const ap = h < 12 ? '오전' : '오후';
  h = h % 12;
  if (h === 0) h = 12;
  return ap + ' ' + h + ':' + fmt(m);
}

export function todayDisplayLabel() {
  const d = new Date();
  return `오늘 · ${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY_LABELS[d.getDay()]})`;
}
