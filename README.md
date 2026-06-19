# 귀차니즘 극복 도우미 (ADHD task-initiation helper)

ADHD 사용자의 "시작하기 어려움(귀차니즘)"을 돕는 모바일 앱 프로토타입.
순수 HTML + React(브라우저 Babel) 로 동작하며 빌드 단계가 필요 없습니다.

## 핵심 플로우
- **쪼개기** — 할 일을 잘게 나눠 원하는 단계부터 하나씩
- **같이하기** — 마스코트와 함께하는 바디 더블 집중 세션 (라이브 타이머)
- **일단 5분** — 가장 낮은 마찰로 시작하고 시작 자체를 보상
- **할 일 추가** (제목·날짜·시간), **기록**, **나** 탭 포함

## 파일 구성
| 파일 | 역할 |
|------|------|
| `index.html` | 진입점. 폰트·토큰·뷰포트 스케일러, 스크립트 로딩 |
| `ios-frame.jsx` | iPhone 디바이스 프레임 |
| `app-ui.jsx` | 공통 컴포넌트 + 데이터 저장소(localStorage) |
| `app-flows.jsx` | 홈 / 방식 선택 / 3개 플로우 |
| `app-tabs.jsx` | 할 일 추가 · 기록 · 나 + 화면 내비게이션 |

## 로컬 실행
정적 파일이라 서버만 있으면 됩니다.
```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```
(React·Babel·Pretendard 폰트는 CDN에서 로드되므로 실행 시 인터넷이 필요합니다.)

## GitHub Pages 배포
1. 이 폴더 내용을 저장소 루트에 커밋
2. Settings → Pages → Branch: `main` / root 선택
3. 발행된 URL 접속 (`index.html` 자동 인식)

## 비고
- 상태는 브라우저 `localStorage`(`gcn_store_v3`)에 저장됩니다. "나 → 데이터 초기화"로 리셋.
- 디자인 시스템: 뉴트럴 파스텔, Pretendard 타이포.
