/**
 * 문항: 사용자가 제공한 「생활 속 완벽주의 유형 체크리스트」 이미지 전사.
 * 이미지에 적힌 출처: 윤닥(2022), 오늘도 시작하지 못하는 당신을 위해, 한빛비즈.
 * 표시된 배정/합산 안내는 자료의 기록이며 검증된 판정 규칙이 아니다.
 * 동점, 응답 척도의 중간 명칭, 타당도와 사용 범위는 아직 확인되지 않았다.
 * 승인 전에는 분류/합산/순위 산출을 하지 않는다. UI에서 응답 완료만 안내한다.
 */
export const assessmentConfig = {
  status: "pending_validation",
  scoringEnabled: false,
  version: "source-image-1",
  source:
    "윤닥(2022), 『오늘도 시작하지 못하는 당신을 위해』, 한빛비즈. 제공된 이미지 기준.",
  sourceDescription: {
    groups: {
      avoidant: [1, 2, 3, 4, 5],
      controlling: [6, 7, 8, 9, 10],
      selfCritical: [11, 12, 13, 14, 15],
      balanced: [16, 17, 18, 19, 20],
    },
    methodInImage: "유형별 합산 점수가 높은 순서대로 정리",
    validated: false,
  },
} as const;

export const questions = [
  {
    id: 1,
    text: "나는 일을 할 때 완벽하게 해내지 못할 것 같으면 시작을 미룬다.",
  },
  { id: 2, text: "일을 미루면서 쉬지도 못하고 늘 마음이 불편하다." },
  {
    id: 3,
    text: "어떤 일을 확실하게 잘해낼 확신이 없을 때는 시도 자체를 꺼린다.",
  },
  {
    id: 4,
    text: "주변에서는 나를 태평하다고 하지만, 나는 성과를 얻지 못할까 봐 두렵고 불안하다.",
  },
  { id: 5, text: "나는 확실하게 못 할 바에야 안 하는 게 낫다고 생각한다." },
  { id: 6, text: "주변 사람들이 맡은 부분에서 최선을 다했으면 좋겠다." },
  { id: 7, text: "내 주위 사람들에게 상당히 높은 기준을 가지고 있다." },
  {
    id: 8,
    text: "내 주변 사람들이 최선을 다하지 않는 것을 보면 답답하거나 화가 난다.",
  },
  { id: 9, text: "내 주변 사람들이 어떤 일이든 나만큼만 하면 좋겠다." },
  {
    id: 10,
    text: "나는 스스로 성장하려고 노력하지 않는 사람들을 보면 참을 수 없다.",
  },
  {
    id: 11,
    text: "실수나 실패가 잦으면 사람들은 나에게 실망할 것이라 생각한다.",
  },
  { id: 12, text: "사람들을 만나면 그들의 표정, 반응 등을 자주 신경 쓴다." },
  { id: 13, text: "다른 사람들과 자주 비교하며 스트레스를 받는 편이다." },
  {
    id: 14,
    text: "내가 실수하면 주변 사람들이 나를 형편없다고 생각할 것이다.",
  },
  { id: 15, text: "나는 장점보다 단점이 많은 사람이다." },
  {
    id: 16,
    text: "나는 스스로 다소 높은 기준을 세우더라도, 실천하는 과정에서 성취감(만족감)을 느낀다.",
  },
  { id: 17, text: "다른 사람들의 인정이나 부정적인 평가에 신경 쓰지 않는다." },
  { id: 18, text: "나의 기준은 내가 정하고 판단한다." },
  { id: 19, text: "나는 실패를 통해 배우고 성장한다." },
  { id: 20, text: "결과보다는 과정의 성취감을 중요시한다." },
] as const;

export type Answer = 1 | 2 | 3 | 4;
export type Answers = Partial<Record<number, Answer>>;

export function getAssessmentOutcome(answers: Answers) {
  const complete = questions.every(({ id }) =>
    [1, 2, 3, 4].includes(answers[id] ?? 0),
  );
  // Fail closed: enabling a flag alone must never introduce an unreviewed scoring algorithm.
  return {
    status: complete ? "pending_validation" : "incomplete",
    answered: questions.filter((q) => answers[q.id]).length,
  } as const;
}

export function shuffledQuestionIds() {
  const ids: number[] = questions.map((q) => q.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}
