export const THEME_KEY_MAP = { simple: 'garden', cute: 'exploration', calm: 'cafe' };

export function normalizeThemeKey(theme) {
  return THEME_KEY_MAP[theme] || theme || 'garden';
}

export const THEME_META = {
  garden:      { name: '정원', mascot: '새싹 콩이', home: '오늘의 정원', action: '돌보기' },
  exploration: { name: '탐험', mascot: '탐험 콩이', home: '오늘의 지도', action: '출발' },
  cafe:        { name: '카페', mascot: '카페 콩이', home: '오늘의 자리', action: '착석' },
};

export function currentThemeKey() {
  return normalizeThemeKey(document.documentElement.dataset.theme);
}

export function themeMeta(key) {
  return THEME_META[normalizeThemeKey(key || currentThemeKey())] || THEME_META.garden;
}
