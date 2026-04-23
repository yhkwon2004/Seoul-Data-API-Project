export function toAverage(min, max) {
  return (Number(min) + Number(max)) / 2;
}

export function validateInputSchema(data) {
  const requiredTop = ["위치", "현재시간", "인구데이터", "미래인구", "상권데이터", "교통", "날씨", "이벤트"];
  for (const key of requiredTop) {
    if (!(key in data)) throw new Error(`필수 필드 누락: ${key}`);
  }
  if (!Array.isArray(data.미래인구) || data.미래인구.length < 3) {
    throw new Error("미래인구는 최소 3개 시간대가 필요합니다.");
  }
}

export function chooseProducts(temp, rain, age20, age3040) {
  if (Number(rain) > 0) return ["컵밥/주먹밥", "우산·우비", "따뜻한 음료"];
  if (Number(temp) >= 25) return ["아이스 음료", "과일컵", "트렌디 디저트"];
  if (age3040 >= 40) return ["식사형 도시락", "핫커피", "든든한 간식"];
  if (age20 >= 35) return ["크로플·쿠키", "탄산/에이드", "포토존 굿즈"];
  return ["핫도그", "아메리카노", "핸드메이드 소품"];
}

export function analyze(payload) {
  validateInputSchema(payload);

  const nowPopulation = toAverage(payload.인구데이터.최소, payload.인구데이터.최대);
  const f3 = toAverage(payload.미래인구[2].최소, payload.미래인구[2].최대);
  const popChange3hPct = Number((((f3 - nowPopulation) / nowPopulation) * 100).toFixed(1));

  const eventFactor = payload.이벤트.행사여부 ? 1.3 : 1;
  const congestionPoint = payload.인구데이터.혼잡도.includes("매우") ? 30 : payload.인구데이터.혼잡도.includes("붐") ? 24 : 14;
  const trafficPoint = payload.교통.상태.includes("정체") ? 12 : 7;
  const growthPoint = popChange3hPct > 4 ? 22 : popChange3hPct > 0 ? 16 : 8;
  const spendingPoint = Number(payload.상권데이터.소비수준) >= 70000 ? 18 : 10;

  const successProbability = Math.min(99, Math.round((congestionPoint + trafficPoint + growthPoint + spendingPoint) * eventFactor));
  const state = successProbability >= 85 ? "매우좋음" : successProbability >= 70 ? "좋음" : successProbability >= 55 ? "보통" : "나쁨";

  const hourlyNow = Math.round((nowPopulation * 0.065) * (payload.상권데이터.소비수준 / 10000) * eventFactor);
  const hourly3h = Math.round((f3 * 0.072) * (payload.상권데이터.소비수준 / 10000) * eventFactor);
  const salesChange = hourly3h > hourlyNow ? "증가" : hourly3h < hourlyNow ? "감소" : "유지";

  const age = payload.인구데이터.연령대;
  const majorAge = Object.entries(age).sort((a, b) => b[1] - a[1])[0];
  const age3040 = Number(age["30대"]) + Number(age["40대"]);
  const products = chooseProducts(payload.날씨.기온, payload.날씨.강수, Number(age["20대"]), age3040);

  return {
    "현재상태": state,
    "매출예측": {
      "현재": `시간당 ${hourlyNow.toLocaleString()}원 (성공확률 ${successProbability}%)`,
      "3시간후": `시간당 ${hourly3h.toLocaleString()}원 (인구변화율 ${popChange3hPct}%)`,
      "변화": salesChange
    },
    "고객분석": {
      "주요연령층": `${majorAge[0]} (${majorAge[1]}%)`,
      "성별비율": `남성 ${payload.인구데이터.남성비율}% / 여성 ${payload.인구데이터.여성비율}%`,
      "특징": `${Number(age["20대"]) >= 35 ? "트렌디 소비 성향 강함" : "실속형 구매 성향"}, 교통 ${payload.교통.상태}로 ${payload.교통.상태.includes("정체") ? "체류시간 증가" : "빠른 회전"}`
    },
    "추천전략": [
      `피크 1시간 전(예상 ${payload.미래인구[1].시간})에 베스트셀러 3종을 매대 전면 배치하고, 시식/샘플링을 20분만 집중 운영하세요.`,
      `현재 인구 ${Math.round(nowPopulation)}명, 3시간 후 ${Math.round(f3)}명(${popChange3hPct}%) 기준으로 판매 인력은 최소 2인(주문/제조 분리)으로 운영하세요.`,
      `행사 '${payload.이벤트.행사명 || "없음"}' 유입 대비 세트메뉴를 단품 합산가 대비 10% 낮춰 객단가를 높이세요.`,
      `20대 비율 ${age["20대"]}%이므로 SNS 인증 시 1,000원 할인 또는 토핑 무료 이벤트를 19:00~20:30에 실행하세요.`,
      `교통 속도 ${payload.교통.속도}km/h에서는 대기열 4명 이상 시 즉시 '빠른결제 전용 라인'을 열어 이탈을 막으세요.`,
      `${payload.날씨.미세먼지 === "나쁨" ? "포장 중심" : "현장 취식 + 포장 병행"}으로 안내문을 분리해 결제 의사결정 시간을 줄이세요.`
    ],
    "준비물체크리스트": [
      "카드단말기 예비배터리, QR결제 안내판, 현금 거스름돈, 위생장갑/집게",
      `${Number(payload.날씨.강수) > 0 ? "우비/방수커버/미끄럼방지매트" : "보냉팩/아이스박스/차광막"}`,
      `${products.join(", ")} 재고를 기본 대비 20% 가산 준비`
    ],
    "재고전략": [
      `${popChange3hPct >= 0 ? "상위 SKU를 120~130%" : "상위 SKU도 90~100%"} 범위로 준비하고 저회전 SKU는 70% 수준으로 축소하세요.`,
      "30분 단위로 누적 판매량을 확인해 목표 대비 80% 미만이면 즉시 묶음할인(1+1/세트할인)으로 회전속도를 높이세요."
    ],
    "리스크": [
      `${Number(payload.날씨.강수) > 0 ? "비로 인한 보행 감소" : "급격한 기온 변화"} 리스크: 방수/보냉 운영안과 대체 메뉴를 동시에 준비하세요.`,
      `${popChange3hPct < 0 ? `3시간 후 수요 ${Math.abs(popChange3hPct)}% 감소` : "야간 시간대 수요 하락"} 리스크: 종료 1시간 전 소진판매 룰을 미리 실행하세요.`,
      `${payload.교통.상태.includes("원활") ? "체류시간 짧아" : "정체 해소 시"} 충동구매 이탈 리스크: 주문-수령 동선을 2단계로 단순화하세요.`
    ],
    "지금팔아야하는상품TOP3": products,
    "판매타이밍": `집중 판매 시간은 ${payload.미래인구[0].시간}~${payload.미래인구[2].시간}, 최대 피크는 ${payload.미래인구[1].시간} 예상입니다.`,
    "매출극대화포인트": "피크 30분 전 사전조리 + 세트메뉴 + 빠른결제 라인 3가지를 동시에 실행하면 매출과 회전율을 같이 올릴 수 있습니다.",
    "지금행동해야할것3가지": [
      "10분 내 상위 상품 3종을 입구 방향으로 재배치하세요.",
      "20분 내 행사 방문객 전용 세트 프로모션 배너를 노출하세요.",
      "30분 내 재고 카운트 기준표를 만들고 30분마다 기록하세요."
    ],
    "AI한줄요약": `지금은 ${state} 구간(성공확률 ${successProbability}%)이며, ${payload.미래인구[1].시간} 피크 전에 상품·결제·프로모션을 선제 배치하면 매출 극대화가 가능합니다.`
  };
}
