import { analyze } from "./coachEngine.js";

const baseSample = {
  "위치": "홍대 관광특구",
  "현재시간": "2026-04-23T18:00:00+09:00",
  "인구데이터": {
    "최소": 9200,
    "최대": 13800,
    "혼잡도": "붐빔",
    "남성비율": 48,
    "여성비율": 52,
    "연령대": { "10대": 14, "20대": 42, "30대": 24, "40대": 13, "50대": 7 }
  },
  "미래인구": [
    { "시간": "19:00", "최소": 10200, "최대": 14900, "혼잡도": "붐빔" },
    { "시간": "20:00", "최소": 11300, "최대": 16100, "혼잡도": "매우붐빔" },
    { "시간": "21:00", "최소": 9800, "최대": 14300, "혼잡도": "붐빔" }
  ],
  "상권데이터": { "활성도": "활발", "소비수준": 76000 },
  "교통": { "상태": "정체", "속도": 19 },
  "날씨": { "기온": "24", "강수": "0", "미세먼지": "보통" },
  "이벤트": { "행사여부": true, "행사명": "홍대 야간 버스킹 페스티벌" }
};

const $ = (id) => document.getElementById(id);
let lastResult = null;

function openPanel(id) {
  $(id).classList.add("open");
  $(id).setAttribute("aria-hidden", "false");
}
function closePanel(id) {
  $(id).classList.remove("open");
  $(id).setAttribute("aria-hidden", "true");
}

function buildPayloadFromQuickInput() {
  return {
    ...baseSample,
    "위치": $("qbArea").value,
    "인구데이터": {
      ...baseSample["인구데이터"],
      "혼잡도": $("qbCongestion").value,
      "최소": Number($("qbMin").value),
      "최대": Number($("qbMax").value)
    },
    "날씨": {
      ...baseSample["날씨"],
      "기온": String($("qbTemp").value),
      "강수": String($("qbRain").value)
    }
  };
}

function renderResult(result) {
  lastResult = result;
  $("kpiState").textContent = result["현재상태"] || "-";
  $("kpiTrend").textContent = result["매출예측"]?.["변화"] || "-";
  $("kpiTop").textContent = result["지금팔아야하는상품TOP3"]?.[0] || "-";

  const strategyList = $("strategyList");
  strategyList.innerHTML = (result["추천전략"] || []).slice(0, 5).map((s) => `<li>${s}</li>`).join("");

  const actionList = $("actionList");
  actionList.innerHTML = (result["지금행동해야할것3가지"] || []).map((s) => `<li>${s}</li>`).join("");
}

function downloadJson() {
  if (!lastResult) return;
  const blob = new Blob([JSON.stringify(lastResult, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `seoul-coach-result-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function init() {
  $("inputJson").value = JSON.stringify(baseSample, null, 2);

  $("openAccountPanel").addEventListener("click", () => openPanel("accountPanel"));
  $("openTermsPanel").addEventListener("click", () => openPanel("termsPanel"));
  document.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", () => closePanel(btn.dataset.close)));

  $("toggleAdvancedBtn").addEventListener("click", () => {
    $("advancedSection").classList.toggle("hidden");
  });

  $("analyzeBtn").addEventListener("click", () => {
    try {
      const payload = $("advancedSection").classList.contains("hidden")
        ? buildPayloadFromQuickInput()
        : JSON.parse($("inputJson").value);
      renderResult(analyze(payload));
    } catch (e) {
      $("strategyList").innerHTML = `<li>입력 오류: ${e.message}</li>`;
      $("actionList").innerHTML = "";
    }
  });

  $("downloadJsonBtn").addEventListener("click", downloadJson);

  $("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("email").value.trim();
    const password = $("password").value;
    const pwRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,20}$/;
    if (!$("agreeRequired").checked) return $("authStatus").textContent = "필수 약관 동의가 필요합니다.";
    if (!email || !pwRule.test(password)) return $("authStatus").textContent = "이메일/비밀번호 규칙을 확인하세요.";
    localStorage.setItem("coach_user", JSON.stringify({ email }));
    $("authStatus").textContent = "로그인 완료";
  });

  $("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("coach_profile", JSON.stringify({
      storeName: $("storeName").value,
      mainArea: $("mainArea").value
    }));
    $("profileStatus").textContent = "프로필 저장 완료";
  });
}

init();
