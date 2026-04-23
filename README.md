# Seoul Data API Project

서울시 소상공인을 위한 실시간 데이터 기반 AI 코치 웹앱입니다.

## 핵심 UX
- 토스 느낌의 미니멀/신뢰형 UI (다크 사이드바 + 밝은 카드)
- 로그인/회원가입/약관을 우측 슬라이드 패널로 숨김 처리
- 초보용 빠른 입력 폼 + 고급 JSON 입력 토글
- 분석 결과는 KPI 카드/액션 리스트 중심으로 노출
- 원할 때만 `결과 JSON 다운로드` (화면에 JSON 상시 노출 없음)

## 실행
```bash
npm test
python -m http.server 8080
```
브라우저에서 `http://localhost:8080`

## 배포
- GitHub Pages 워크플로우: `.github/workflows/deploy-pages.yml`
- 상세 절차: `DEPLOYMENT.md`
