import { normalizeThemeKey } from './theme';

export const PLANT_STAGES = ['씨앗', '새싹', '잎 두 장', '큰 잎', '꽃봉오리', '활짝 핀 꽃'];

export const PROGRESS_META = {
  garden: {
    unitLabel: '모은 씨앗',
    unit: '개',
    stages: PLANT_STAGES,
    line: '작은 씨앗이 오늘의 정원으로 자라고 있어요.',
  },
  exploration: {
    unitLabel: '찾은 표식',
    unit: '개',
    stages: ['빈 지도', '첫 발자국', '갈림길 표시', '경로 연결', '목적지 발견', '완성된 지도'],
    line: '표식을 찍을수록 지도가 넓어지고 있어요.',
  },
  cafe: {
    unitLabel: '받은 스탬프',
    unit: '개',
    stages: ['빈 메뉴판', '기본 메뉴', '추천 메뉴', '따뜻한 한 잔', '스페셜 메뉴', '완성된 보드'],
    line: '방문이 쌓일수록 메뉴판이 풍성해지고 있어요.',
  },
};

export function plantStage(seeds) {
  return seeds <= 0 ? 0 : seeds <= 2 ? 1 : seeds <= 5 ? 2 : seeds <= 9 ? 3 : seeds <= 14 ? 4 : 5;
}

export function progressMeta(theme, seeds = 0) {
  const key = normalizeThemeKey(theme);
  const meta = PROGRESS_META[key] || PROGRESS_META.garden;
  const stage = plantStage(seeds);
  return { ...meta, stage, stageName: meta.stages[stage] };
}
