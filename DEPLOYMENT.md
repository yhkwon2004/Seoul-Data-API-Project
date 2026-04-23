# 배포 가이드

## 1) GitHub Pages 자동 배포
이 저장소에는 `.github/workflows/deploy-pages.yml`이 포함되어 있습니다.

### 사전 설정
1. GitHub 저장소 **Settings → Pages**로 이동
2. **Build and deployment**의 Source를 **GitHub Actions**로 선택
3. 기본 브랜치를 `main`(또는 `master`)로 사용

### 배포 방법
- `main` 또는 `master` 브랜치에 push하면 자동으로 테스트(`npm test`) 후 배포됩니다.
- 또는 Actions 탭에서 **Deploy static site to GitHub Pages** 워크플로우를 수동 실행할 수 있습니다.

### 배포 산출물
- `index.html`
- `app.js`
- `coachEngine.js`
- `styles.css`

## 2) 로컬 확인
```bash
npm test
python -m http.server 8080
```
브라우저에서 `http://localhost:8080` 접속
