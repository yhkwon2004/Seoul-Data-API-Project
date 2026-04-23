# Seoul Data API Project

서울시 소상공인을 위한 **실시간 데이터 기반 AI 비즈니스 코치** 웹 프로토타입입니다.

## 핵심 기능
- 이메일 ID + 영문/숫자 조합 비밀번호 정책 로그인
- 개인정보 수집·이용 동의(필수/선택) UI
- 프로필 설정(업종/지역/알림 채널)
- 플리마켓·행사 공지와 신청 액션 가이드
- 실시간 데이터(JSON) 입력 → AI 분석 결과(JSON) 출력
- 글자 크기 조절, 다국어(한국어/영어), 모바일 반응형

## 코드 구조
- `index.html`: 화면 레이아웃/폼/출력 영역
- `styles.css`: 반응형/접근성 스타일
- `app.js`: UI 이벤트 및 상태 관리
- `coachEngine.js`: 순수 분석 엔진(검증/전처리/추천)
- `tests/coachEngine.test.js`: 분석 엔진 단위 테스트

## 실행 방법
1. 브라우저에서 `index.html` 파일을 엽니다.
2. 샘플 데이터 버튼 또는 실시간 JSON 입력 후 분석을 실행합니다.

## 테스트
```bash
npm test
```

## 참고 데이터
- 서울 열린데이터 광장 OA-21285
  - https://data.seoul.go.kr/dataList/OA-21285/A/1/datasetView.do


## 배포
- GitHub Pages 자동 배포 워크플로우 제공: `.github/workflows/deploy-pages.yml`
- 상세 절차: `DEPLOYMENT.md`
