# 귀차니즘 극복 도우미 (no-zero-day)

ADHD 사용자의 "시작하기 어려움(귀차니즘)"을 돕는 모바일 웹앱 프로토타입.

## 핵심 플로우

- **쪼개기** — 할 일을 잘게 나눠 원하는 단계부터 하나씩
- **같이하기** — 마스코트와 함께하는 바디 더블 집중 세션 (라이브 타이머)
- **일단 5분** — 가장 낮은 마찰로 시작하고, 시작 자체를 보상

탭: **홈 / 기록 / 마이**

---

## 프로젝트 구조

```
no-zero-day/
├── site/                  # Vite + React 프론트엔드
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── lib/           # 날짜, 테마, 방법론, 진행도 유틸
│   │   ├── store/         # useStore (Zustand, localStorage)
│   │   ├── services/      # apiClient.js (백엔드 연동 stub)
│   │   ├── components/
│   │   └── screens/
│   ├── server/            # Express 백엔드 (mock 데이터)
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── data/
│   ├── vite.config.js
│   ├── .env.example       # 프론트엔드 환경변수 예시
│   └── server/.env.example
```

---

## 배포 구조

| 레이어 | 호스팅 | URL |
|--------|--------|-----|
| 프론트엔드 (정적) | GitHub Pages | `https://danmiee.github.io/no-zero-day/` |
| 백엔드 (Express) | Render / Railway (별도) | `https://<your-app>.onrender.com` |

> **현재 상태**: 프론트엔드는 `localStorage`로 동작 (백엔드 없이 Pages만으로 완전히 동작).
> `src/services/apiClient.js` 는 향후 백엔드 연동 시 사용할 stub.

---

## 로컬 개발

### 프론트엔드만 (백엔드 없이)

```bash
cd no-zero-day/site
npm install
npm run dev
# http://localhost:5173
```

### 프론트엔드 + 백엔드 함께

```bash
# 터미널 1 — 백엔드
cd no-zero-day/site/server
cp .env.example .env
npm install
npm start
# http://localhost:3001

# 터미널 2 — 프론트엔드
cd no-zero-day/site
cp .env.example .env   # VITE_API_BASE_URL= 비워두면 Vite 프록시가 /api → 3001 포워딩
npm install
npm run dev
```

### 환경변수

**프론트엔드 (`site/.env`)**

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `VITE_API_BASE_URL` | 백엔드 API 주소 (비워두면 Vite 프록시 사용) | `""` |

**백엔드 (`site/server/.env`)**

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `PORT` | Express 포트 | `3001` |
| `CORS_ORIGIN` | 추가 허용 CORS 출처 (쉼표 구분) | (하드코드된 기본값 참고) |
| `NODE_ENV` | 환경 | `development` |

---

## GitHub Pages 배포

```bash
npm run build   # dist/ 생성 (base: /no-zero-day/)
```

- Settings → Pages → Branch: `main` / `dist` (또는 CI 연동)
- `vite.config.js`의 `base: '/no-zero-day/'` 가 리소스 경로를 자동 처리

---

## 비고

- 상태는 브라우저 `localStorage` (`gcn_store_v3`) 에 저장됩니다. "마이 → 데이터 초기화" 로 리셋.
- 백엔드는 현재 in-memory mock 데이터를 사용합니다 (재시작 시 초기화).
- 디자인 시스템: 뉴트럴 파스텔, Pretendard 타이포.
