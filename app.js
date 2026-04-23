import { analyze } from "./coachEngine.js";

const i18n = {
  ko: {
    appTitle: "서울 소상공인 AI 비즈니스 코치",
    appSubtitle: "실시간 도시데이터·기상·행사 기반 매출 최적화 플랫폼",
    fontSize: "글자 크기",
    lang: "언어",
    authTitle: "로그인 / 회원가입",
    email: "이메일(ID)",
    password: "비밀번호(영문+숫자, 8~20자)",
    login: "로그인",
    pwHint: "영문 1자 이상 + 숫자 1자 이상, 8~20자",
    consentTitle: "개인정보 수집·이용 동의",
    requiredConsent: "필수 동의: 회원 인증 및 맞춤 추천 제공",
    optionalConsent: "선택 동의: 행사/프로모션 알림 수신",
    consentDetailTitle: "약관 자세히 보기",
    consentDetail: "수집항목: 이메일, 프로필, 서비스 이용 로그. 보유기간: 회원 탈퇴 시 또는 관련 법령 준수 기간.",
    profileTitle: "프로필 설정",
    storeName: "상호명",
    businessType: "업종",
    mainArea: "주 활동 지역",
    notification: "알림 채널",
    saveProfile: "프로필 저장",
    marketTitle: "플리마켓/행사 공지 및 신청 도우미",
    inputTitle: "실시간 데이터 입력(JSON)",
    analyze: "AI 분석 실행",
    sample: "샘플 데이터",
    copy: "결과 복사",
    outputTitle: "AI 코치 분석 결과(JSON)",
    footer: "서울시 소상공인 정착 지원 · 모바일 대응 · 접근성 옵션 제공"
  },
  en: {
    appTitle: "Seoul Small Business AI Coach",
    appSubtitle: "Real-time city, weather, and event based sales optimization",
    fontSize: "Font size",
    lang: "Language",
    authTitle: "Login / Sign Up",
    email: "Email (ID)",
    password: "Password (letters+numbers, 8-20)",
    login: "Login",
    pwHint: "At least 1 letter + 1 number, 8-20 chars",
    consentTitle: "Privacy Consent",
    requiredConsent: "Required: account verification and personalized recommendations",
    optionalConsent: "Optional: event/promotion notifications",
    consentDetailTitle: "View terms",
    consentDetail: "Collected: email, profile, usage logs. Retention: until account deletion or legal period.",
    profileTitle: "Profile settings",
    storeName: "Store name",
    businessType: "Business type",
    mainArea: "Main operation area",
    notification: "Notification channel",
    saveProfile: "Save profile",
    marketTitle: "Flea Market / Event assistant",
    inputTitle: "Input real-time JSON",
    analyze: "Run AI analysis",
    sample: "Load sample",
    copy: "Copy result",
    outputTitle: "AI analysis result (JSON)",
    footer: "Seoul SMB support · mobile responsive · accessibility options"
  }
};

const sampleInput = {
  "위치": "홍대 관광특구",
  "현재시간": "2026-04-23T18:00:00+09:00",
  "인구데이터": {
    "최소": 9300,
    "최대": 14000,
    "혼잡도": "붐빔",
    "남성비율": 46,
    "여성비율": 54,
    "연령대": { "10대": 13, "20대": 44, "30대": 23, "40대": 14, "50대": 6 }
  },
  "미래인구": [
    { "시간": "19:00", "최소": 10500, "최대": 15100, "혼잡도": "붐빔" },
    { "시간": "20:00", "최소": 11200, "최대": 16600, "혼잡도": "매우붐빔" },
    { "시간": "21:00", "최소": 9800, "최대": 14400, "혼잡도": "붐빔" }
  ],
  "상권데이터": { "활성도": "활발", "소비수준": 81000 },
  "교통": { "상태": "정체", "속도": 18 },
  "날씨": { "기온": "26", "강수": "0", "미세먼지": "보통" },
  "이벤트": { "행사여부": true, "행사명": "홍대 야간 거리공연 축제" }
};

const eventNotices = [
  { name: "서울밤도깨비마켓", deadline: "2026-05-01", place: "여의도 한강공원", status: "접수중", action: "식품위생교육 수료증 첨부" },
  { name: "DDP 플리마켓", deadline: "2026-04-30", place: "동대문디자인플라자", status: "마감임박", action: "사업자등록증·품목사진 제출" },
  { name: "성수 로컬메이커 페어", deadline: "2026-05-06", place: "성수 언더스탠드에비뉴", status: "접수중", action: "부스 운영계획 입력" }
];

const $ = (id) => document.getElementById(id);
const outputJson = $("outputJson");

function applyI18n(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });
}

function renderEvents() {
  $("eventList").innerHTML = eventNotices.map((event) => `
    <article class="event-item">
      <strong>${event.name}</strong> <span class="status-badge">${event.status}</span>
      <p>장소: ${event.place}</p>
      <p>접수 마감: ${event.deadline}</p>
      <p>신청 액션: ${event.action}</p>
      <button type="button">신청 시작</button>
    </article>
  `).join("");
}

function setFont(size) {
  document.body.classList.remove("font-large", "font-xlarge");
  if (size === "large") document.body.classList.add("font-large");
  if (size === "xlarge") document.body.classList.add("font-xlarge");
  localStorage.setItem("ui_font_size", size);
}

function setLanguage(lang) {
  applyI18n(lang);
  localStorage.setItem("ui_language", lang);
}

function initEvents() {
  $("loadSampleBtn").addEventListener("click", () => {
    $("inputJson").value = JSON.stringify(sampleInput, null, 2);
  });

  $("analyzeBtn").addEventListener("click", () => {
    try {
      const payload = JSON.parse($("inputJson").value);
      const result = analyze(payload);
      outputJson.classList.remove("error-text");
      outputJson.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
      outputJson.classList.add("error-text");
      outputJson.textContent = `입력 데이터 오류: ${error.message}`;
    }
  });

  $("copyResultBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(outputJson.textContent);
    } catch {
      // clipboard unavailable in some browsers
    }
  });

  $("authForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("email").value.trim();
    const password = $("password").value;
    const requiredConsent = $("agreeRequired").checked;
    const pwRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,20}$/;

    if (!email || !pwRule.test(password)) {
      $("authStatus").textContent = "로그인 실패: 이메일/비밀번호 규칙을 확인하세요.";
      return;
    }
    if (!requiredConsent) {
      $("authStatus").textContent = "필수 개인정보 동의가 필요합니다.";
      return;
    }

    localStorage.setItem("coach_user", JSON.stringify({ email, lastLogin: new Date().toISOString() }));
    $("authStatus").textContent = "로그인 성공: 데이터 분석 기능을 사용할 수 있습니다.";
  });

  $("profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const profile = {
      storeName: $("storeName").value,
      businessType: $("businessType").value,
      mainArea: $("mainArea").value,
      notificationMode: $("notificationMode").value
    };
    localStorage.setItem("coach_profile", JSON.stringify(profile));
    $("profileStatus").textContent = "프로필 저장 완료: 맞춤 추천이 강화됩니다.";
  });

  $("fontSizeControl").addEventListener("change", (e) => setFont(e.target.value));
  $("languageControl").addEventListener("change", (e) => setLanguage(e.target.value));
}

function init() {
  const lang = localStorage.getItem("ui_language") || "ko";
  const font = localStorage.getItem("ui_font_size") || "normal";

  $("languageControl").value = lang;
  $("fontSizeControl").value = font;

  setLanguage(lang);
  setFont(font);
  renderEvents();
  $("inputJson").value = JSON.stringify(sampleInput, null, 2);
  initEvents();
}

init();
