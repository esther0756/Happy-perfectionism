import { controllingDetail } from "./detail-controlling";
import { selfCriticalDetail } from "./detail-self-critical";
import { balancedDetail } from "./detail-balanced";

export const expandedProfiles = {
  controlling: controllingDetail,
  "self-critical": selfCriticalDetail,
  balanced: balancedDetail,
} as const;

export type ExpandedProfileSlug = keyof typeof expandedProfiles;

export const journalExercises = {
  avoidant: [
    {
      title: "시작을 위한 기준과 완성을 위한 기준을 구분해 보세요.",
      paragraphs: [
        "처음부터 만족스러운 결과물을 만들려고 하면 시작하기 어려울 수 있습니다.",
        "작업을 시작하기 전에 ‘오늘은 어디까지 하면 시작에 성공한 것일까?’를 정해보세요.",
        "예를 들어 발표 자료를 만드는 날이라면 첫 번째 목표를 ‘슬라이드 10장을 완성하기’보다 ‘전체 발표의 목차를 작성하기’로 설정할 수 있습니다.",
      ],
      action: "오늘 시작에 성공했다고 볼 수 있는 최소한의 행동을 적어보세요.",
    },
    {
      title: "예상한 실패와 실제 결과를 비교해 보세요.",
      paragraphs: [
        "어떤 일을 시작하기 망설여질 때, 무엇이 가장 걱정되는지 한 문장으로 기록해 보세요.",
        "이후 행동한 결과를 확인하고, 예상했던 문제가 실제로 얼마나 발생했는지 비교해 보세요.",
        "이를 반복하면 실패에 대한 걱정이 현실적인 위험인지, 예상보다 크게 느끼고 있는 부담인지 구분하는 데 도움이 될 수 있습니다.",
      ],
      action: "걱정되는 결과 한 가지를 적고, 행동 후 실제 결과와 비교해 보세요.",
    },
    {
      title: "미뤘던 일을 다시 시작하는 연습을 해보세요.",
      paragraphs: [
        "이미 계획이 틀어졌더라도 처음부터 다시 준비할 필요는 없습니다.",
        "현재 상황에서 이어서 할 수 있는 가장 작은 행동을 찾아보세요.",
        "계획을 지킨 날뿐 아니라, 중단했던 일을 다시 시작한 날도 의미 있는 실천으로 기록해 보세요.",
      ],
      action: "오늘 다시 이어서 할 수 있는 가장 작은 행동을 적어보세요.",
    },
  ],
  controlling: controllingDetail.exercises,
  "self-critical": selfCriticalDetail.exercises,
  balanced: balancedDetail.exercises,
} as const;
