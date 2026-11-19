import { test, expect } from "@playwright/test";
import {
  getAssessmentOutcome,
  shuffledQuestionIds,
  type Answer,
  type Answers,
} from "../src/config/assessment";

const sample: Answer[] = [
  4, 4, 4, 3, 3, 2, 2, 3, 2, 2, 3, 3, 4, 3, 3, 2, 2, 3, 3, 2,
];
const toAnswers = (responses: number[]) =>
  Object.fromEntries(
    responses.map((value, index) => [index + 1, value]),
  ) as Answers;

test("이미지의 5문항씩 네 분류를 합산하고 2점 이내의 둘째 유형을 고른다", () => {
  const result = getAssessmentOutcome(toAnswers(sample));
  expect(result.status).toBe("complete");
  if (result.status !== "complete")
    throw new Error("완료된 응답이 필요합니다.");
  expect(result.scores).toEqual([
    { type: "avoidant", total: 18, max: 20, rank: 1 },
    { type: "self-critical", total: 16, max: 20, rank: 2 },
    { type: "balanced", total: 12, max: 20, rank: 3 },
    { type: "controlling", total: 11, max: 20, rank: 4 },
  ]);
  expect(result.primary.map((s) => s.type)).toEqual(["avoidant"]);
  expect(result.secondary.map((s) => s.type)).toEqual(["self-critical"]);
});

test("섞인 순서로 입력해도 문항 ID별 합계가 같고 20문항은 중복되지 않는다", () => {
  const order = shuffledQuestionIds();
  expect([...order].sort((a, b) => a - b)).toEqual(
    Array.from({ length: 20 }, (_, i) => i + 1),
  );
  const shuffled = Object.fromEntries(
    order.map((id) => [id, sample[id - 1]]),
  ) as Answers;
  expect(getAssessmentOutcome(shuffled)).toEqual(
    getAssessmentOutcome(toAnswers(sample)),
  );
});

test("빈 응답·누락·잘못된 척도 값에는 유형이나 부분 점수를 반환하지 않는다", () => {
  expect(getAssessmentOutcome({})).toEqual({
    status: "incomplete",
    answered: 0,
  });
  for (const value of [undefined, 0, 5, 2.5, Number.NaN, "3", null]) {
    const responses = { ...toAnswers(sample), 20: value, 21: 4 } as Answers;
    expect(getAssessmentOutcome(responses)).toEqual({
      status: "incomplete",
      answered: 19,
    });
  }
});

test("3점 차이의 둘째 유형은 작은 카드에 표시하지 않는다", () => {
  const responses = [...sample];
  responses[12] = 3; // 18 / 15: 15점이어도 차이가 3점이면 제외.
  const result = getAssessmentOutcome(toAnswers(responses));
  expect(result.status === "complete" && result.secondary).toEqual([]);
});

test("2위 동점은 임의로 한 유형을 고르지 않고 함께 표시한다", () => {
  const responses = [...sample];
  responses.splice(5, 5, 3, 3, 4, 3, 3); // 18 / 16 / 16 / 12.
  const result = getAssessmentOutcome(toAnswers(responses));
  expect(
    result.status === "complete" && result.secondary.map((s) => s.type),
  ).toEqual(["controlling", "self-critical"]);
});

test("최고점 동점은 공동 1위로 표시하고 더 낮은 순위를 둘째 유형으로 올리지 않는다", () => {
  const responses = [...sample];
  responses.splice(5, 5, 4, 4, 4, 3, 3); // 18 / 18 / 16 / 12.
  const result = getAssessmentOutcome(toAnswers(responses));
  expect(
    result.status === "complete" && result.primary.map((s) => s.type),
  ).toEqual(["avoidant", "controlling"]);
  expect(result.status === "complete" && result.secondary).toEqual([]);
});

for (const answer of [1, 4])
  test(`모두 ${answer}점이면 네 유형이 모두 ${answer * 5}점의 공동 결과다`, () => {
    const result = getAssessmentOutcome(toAnswers(Array(20).fill(answer)));
    expect(result.status).toBe("complete");
    if (result.status !== "complete")
      throw new Error("완료된 응답이 필요합니다.");
    expect(result.primary).toHaveLength(4);
    expect(
      result.primary.every((s) => s.total === answer * 5 && s.rank === 1),
    ).toBe(true);
    expect(result.secondary).toEqual([]);
  });

test("둘째 유형은 절대 점수가 아닌 첫째와의 차이로 표시한다", () => {
  const responses = Array(20).fill(1);
  responses[0] = 3; // 7 / 5 / 5 / 5.
  const result = getAssessmentOutcome(toAnswers(responses));
  expect(
    result.status === "complete" && result.secondary.map((s) => s.total),
  ).toEqual([5, 5, 5]);
});
