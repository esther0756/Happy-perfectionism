import type { ProfileSlug } from "@/lib/content";

/**
 * 문항: 사용자가 제공한 「생활 속 완벽주의 유형 체크리스트」 이미지 전사.
 * 이미지에 적힌 출처: 윤닥(2022), 오늘도 시작하지 못하는 당신을 위해, 한빛비즈.
 * 사용자의 요청으로 이미지의 문항 배정과 단순 합산 방식을 활성화했다.
 * 공동 순위와 둘째 유형의 표시 기준은 사이트의 표시 정책이다.
 * 자동 합산의 활성화가 검사의 임상적 타당성 검증을 의미하지는 않는다.
 */
export const assessmentConfig = {
  version: "source-image-sum-1",
  source:
    "윤닥(2022), 『오늘도 시작하지 못하는 당신을 위해』, 한빛비즈. 제공된 이미지 기준.",
  groups: {
    avoidant: [1, 2, 3, 4, 5],
    controlling: [6, 7, 8, 9, 10],
    "self-critical": [11, 12, 13, 14, 15],
    balanced: [16, 17, 18, 19, 20],
  } satisfies Record<ProfileSlug, readonly number[]>,
  answerValues: [1, 2, 3, 4],
  secondaryMaxGap: 2,
  tiePolicy: "shared_rank",
  methodInImage: "유형별 합산 점수가 높은 순서대로 정리",
  clinicallyValidated: false,
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

export type Answer = (typeof assessmentConfig.answerValues)[number];
export type Answers = Partial<Record<number, Answer>>;

export type TypeScore = {
  type: ProfileSlug;
  total: number;
  max: number;
  rank: number;
};
export type CompletedAssessment = {
  status: "complete";
  answered: number;
  scores: TypeScore[];
  primary: TypeScore[];
  secondary: TypeScore[];
};
export type AssessmentOutcome =
  | CompletedAssessment
  | { status: "incomplete"; answered: number };

export function getAssessmentOutcome(answers: Answers): AssessmentOutcome {
  const answered = questions.filter(({ id }) =>
    assessmentConfig.answerValues.includes(answers[id] as Answer),
  ).length;
  if (answered !== questions.length) return { status: "incomplete", answered };

  // Display order never participates in scoring; each answer belongs to its source ID.
  const types = Object.keys(assessmentConfig.groups) as ProfileSlug[];
  const totals = types
    .map((type) => ({
      type,
      total: assessmentConfig.groups[type].reduce(
        (sum, id) => sum + answers[id]!,
        0,
      ),
      max: assessmentConfig.groups[type].length * 4,
    }))
    .sort((a, b) => b.total - a.total);
  const scores = totals.map((score) => ({
    ...score,
    rank: 1 + totals.filter((other) => other.total > score.total).length,
  }));
  const primary = scores.filter((score) => score.rank === 1);
  // Tied first places are all primary. Tied second places share the smaller card.
  const secondary =
    primary.length === 1
      ? scores.filter(
          (score) =>
            score.rank === 2 &&
            primary[0].total - score.total <= assessmentConfig.secondaryMaxGap,
        )
      : [];
  return {
    status: "complete",
    answered,
    scores,
    primary,
    secondary,
  };
}

export function shuffledQuestionIds() {
  const ids: number[] = questions.map((q) => q.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}
