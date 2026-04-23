import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze, chooseProducts, toAverage, validateInputSchema } from '../coachEngine.js';

const sample = {
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

test('toAverage works', () => {
  assert.equal(toAverage(10, 20), 15);
});

test('validateInputSchema throws on missing field', () => {
  assert.throws(() => validateInputSchema({}), /필수 필드 누락/);
});

test('chooseProducts returns rain items', () => {
  assert.deepEqual(chooseProducts(20, 5, 10, 20), ["컵밥/주먹밥", "우산·우비", "따뜻한 음료"]);
});

test('analyze returns expected top level fields', () => {
  const result = analyze(sample);
  assert.ok(result['현재상태']);
  assert.ok(result['매출예측']);
  assert.equal(Array.isArray(result['추천전략']), true);
  assert.equal(Array.isArray(result['지금팔아야하는상품TOP3']), true);
});
