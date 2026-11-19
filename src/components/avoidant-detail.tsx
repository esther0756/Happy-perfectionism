import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Heart, Lightbulb, RotateCcw, Sprout } from "lucide-react";
import { SaveProfileButton } from "@/components/save-profile-button";

const situations = [
  {
    icon: BookOpen,
    title: "공부와 성취",
    examples: [
      "과제를 잘하고 싶어서 자료를 계속 찾아보지만 정작 작성을 시작하지 못합니다.",
      "공부 계획을 세우는 데 많은 시간을 사용하고, 계획대로 하지 못하면 공부 자체를 미룹니다.",
      "시험 준비를 충분히 하지 못했다고 생각하면 남은 시간에 할 수 있는 공부마저 포기하고 싶어집니다.",
    ],
    advice: [
      "공부나 과제를 시작할 때는 처음부터 높은 완성도를 목표로 하기보다, 시작하기 위한 최소한의 행동을 정해보세요.",
      "보고서를 작성해야 한다면 처음부터 완성도 높은 글을 쓰려고 하기보다, 목차를 만들고 첫 문단의 초안을 작성하는 것을 목표로 삼을 수 있습니다.",
      "시작하기 어렵다면 10분 동안만 작업해 보세요. 10분이 지난 뒤에는 계속할지, 잠시 쉬었다가 다시 시작할지 결정해도 괜찮습니다.",
      "중요한 것은 처음부터 잘하는 것이 아니라 실제로 행동을 시작하는 경험을 쌓는 것입니다.",
    ],
  },
  {
    icon: Heart,
    title: "인간관계",
    examples: [
      "자신의 의견을 말했다가 부정적인 평가를 받을까 봐 표현을 망설입니다.",
      "상대방에게 서운한 점이 있어도 대화가 잘못될까 걱정하며 말을 꺼내지 못합니다.",
      "새로운 사람과 친해지고 싶지만, 어색한 상황이 생길까 봐 먼저 다가가지 못합니다.",
    ],
    advice: [
      "자신의 생각을 완벽한 표현으로 전달하려고 하기보다, 현재 느끼는 감정이나 생각을 간단하게 말하는 연습을 해보세요.",
      "서운한 일이 있었다면 모든 상황을 정리한 뒤 말하려고 하기보다 ‘그때 조금 서운했는데, 네 생각도 들어보고 싶어’처럼 대화를 시작할 수 있습니다.",
      "대화에서 항상 적절한 말을 해야 하는 것은 아닙니다. 자신의 생각을 표현한 뒤 상대방의 반응을 들으며 조정해 나갈 수도 있습니다.",
      "작은 의견부터 표현하면서 예상했던 부정적인 결과가 실제로 일어났는지도 살펴보세요.",
    ],
  },
  {
    icon: RotateCcw,
    title: "일상과 자기관리",
    examples: [
      "계획을 세밀하게 세우지만 한 번 어긋나면 계획 전체를 포기합니다.",
      "운동이나 독서처럼 새로운 습관을 시작하기 전 준비에 많은 시간을 사용합니다.",
      "하루를 계획대로 보내지 못하면 남은 시간도 의미 없다고 느낍니다.",
    ],
    advice: [
      "계획을 세울 때는 이상적인 목표와 함께 최소한의 실천 기준을 정해보세요.",
      "하루에 1시간 운동하는 것이 목표라면 시간이 부족한 날에는 10분간 산책하는 것을 최소 실천 기준으로 설정할 수 있습니다.",
      "계획을 지키지 못한 날을 실패한 날로 판단하기보다 현재 상황에 맞게 조정할 수 있는 날로 바라보세요.",
      "하루 중 일부 계획이 어긋났다고 해서 나머지 시간까지 포기해야 하는 것은 아닙니다.",
    ],
  },
];

const questions = [
  "지금 이 일을 시작하지 못하는 이유는 무엇인가요?",
  "실제로 준비가 더 필요한 상황인가요, 아니면 결과가 만족스럽지 못할까 봐 걱정하고 있나요?",
  "완벽하게 해낼 필요가 없다면 지금 당장 무엇부터 시작할 수 있을까요?",
  "계획대로 진행되지 않았더라도 오늘 이어서 할 수 있는 일은 무엇인가요?",
];

export function AvoidantDetail() {
  return (
    <div className="detail-content">
      <section className="panel detail-section" aria-labelledby="avoidant-overview">
        <span className="detail-index">01 · 나의 모습 이해하기</span>
        <h2 id="avoidant-overview">당신의 완벽주의는 어떤 모습일까요?</h2>
        <p>회피형 완벽주의자는 일을 잘 해내고 싶은 마음이 크지만, 기대한 만큼 해내지 못할 가능성 때문에 시작을 망설이는 경향이 있습니다.</p>
        <p>충분히 준비한 뒤 시작하고 싶고, 처음부터 제대로 해내고 싶어 합니다. 하지만 완벽한 준비 상태를 기다리다 보면 오히려 시작이 늦어지거나, 중요한 결정을 계속 미루게 될 수 있습니다.</p>
        <p>주변에서는 이러한 모습을 게으르거나 의욕이 없는 태도로 받아들일 수도 있습니다. 그러나 실제로는 실패에 대한 부담, 결과에 대한 걱정, 잘 해내야 한다는 압박감이 행동을 어렵게 만들고 있을 수 있습니다.</p>
        <p className="detail-emphasis">회피형 완벽주의자의 핵심적인 어려움은 잘하고 싶은 마음이 오히려 시작을 방해한다는 점입니다.</p>
      </section>

      <section className="panel detail-section" aria-labelledby="avoidant-strengths">
        <span className="detail-index">02 · 내 안의 강점</span>
        <h2 id="avoidant-strengths"><Sprout size={20} aria-hidden="true" /> 이 성향이 가진 강점도 살펴보세요.</h2>
        <p>회피형 완벽주의의 어려움은 주로 행동을 시작하는 과정에서 나타납니다. 그러나 신중하게 준비하고 결과를 미리 고려하려는 태도는 상황에 따라 장점으로 작용할 수도 있습니다.</p>
        <ul className="detail-bullet-list">
          <li>일을 시작하기 전에 예상되는 문제를 발견하고 대비하는 데 도움이 될 수 있습니다.</li>
          <li>결과를 신중하게 검토하여 실수를 줄이는 데 도움이 될 수 있습니다.</li>
          <li>자신이 중요하게 생각하는 일에 충분한 시간과 노력을 투자하는 동기가 될 수 있습니다.</li>
        </ul>
        <p>다만 신중함이 지나치면 준비가 행동을 대신하게 될 수 있습니다.</p>
        <p className="detail-emphasis">준비가 실제 행동에 도움이 되고 있는지, 아니면 시작을 미루는 이유가 되고 있는지 구분해 보는 것이 중요합니다.</p>
      </section>

      <section className="panel detail-section" aria-labelledby="avoidant-daily">
        <span className="detail-index">03 · 일상에서 나타나는 모습</span>
        <h2 id="avoidant-daily">일상에서는 어떻게 나타날까요?</h2>
        <p>높은 기준에 도달하지 못할 것 같은 걱정이 커지면, 행동을 미루는 일이 반복되기도 합니다.</p>
        <div className="detail-cycle" aria-label="높은 기대, 실패 걱정, 시작 지연, 압박 증가, 포기와 후회가 반복되는 과정">
          {["높은 기대", "실패 걱정", "시작 지연", "압박 증가", "포기와 후회"].map((step, i) => (
            <div className="detail-cycle-step" key={step}>
              <span>{step}</span>{i < 4 && <ArrowRight size={15} aria-hidden="true" />}
            </div>
          ))}
        </div>
        <p className="detail-cycle-note">잠시 피하면 부담이 줄어들 수 있지만, 해야 할 일이 남아 있어 더 큰 압박감으로 이어질 수 있습니다. 완벽하지 않은 상태에서도 작은 행동을 시작하는 경험이 도움이 될 수 있습니다.</p>
        <div className="detail-situations">
          {situations.map(({ icon: Icon, title, examples, advice }, i) => (
            <article key={title} className="detail-situation">
              <h3><Icon size={19} aria-hidden="true" /> {i + 1}. {title}</h3>
              <h4>이런 경험이 있나요?</h4>
              <ul className="detail-bullet-list">{examples.map((example) => <li key={example}>{example}</li>)}</ul>
              <div className="detail-advice">
                <h4><Lightbulb size={17} aria-hidden="true" /> 이렇게 시도해 보세요.</h4>
                {advice.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel detail-section" aria-labelledby="avoidant-questions">
        <span className="detail-index">04 · 나를 돌아보는 질문</span>
        <h2 id="avoidant-questions">스스로에게 질문해 보세요.</h2>
        <p>다음 질문을 통해 자신의 행동을 살펴볼 수 있습니다.</p>
        <ul className="detail-question-list">
          {questions.map((question) => <li key={question}><CheckCircle2 size={17} aria-hidden="true" /><span>{question}</span></li>)}
        </ul>
        <p>모든 질문에 바로 답할 필요는 없습니다. 자신이 어떤 상황에서 행동을 미루는지 알아차리는 것부터 시작해 보세요.</p>
      </section>

      <section className="panel detail-section detail-conclusion" aria-labelledby="avoidant-conclusion">
        <span className="detail-index">05 · 마지막으로 기억할 점</span>
        <h2 id="avoidant-conclusion">처음부터 완벽할 필요는 없습니다.</h2>
        <p>높은 기준을 갖는 것 자체가 문제는 아닙니다. 다만 그 기준 때문에 시도할 기회가 줄어들고 있다면, 목표에 도달하는 방식을 조정할 필요가 있습니다.</p>
        <p>처음부터 만족스러운 결과가 나오지 않아도 수정하고 개선할 기회는 남아 있습니다.</p>
        <p className="detail-emphasis">완벽한 준비를 마친 뒤 시작하는 것만이 좋은 방법은 아닙니다. 때로는 시작한 뒤에 부족한 부분을 채워 나가는 것이 더 효과적일 수 있습니다.</p>
        <p>오늘 미루고 있던 일 중 하나를 선택해, 10분 동안 할 수 있는 행동부터 시작해 보세요.</p>
      </section>

      <section className="panel detail-save" aria-labelledby="avoidant-save">
        <span className="detail-index">기록하며 실천하기</span>
        <h2 id="avoidant-save">나에게 맞는 연습을 기록에서 만나보세요.</h2>
        <p>‘변화를 위한 세 가지 연습’은 결과 페이지 대신 일상 기록 화면에서 확인할 수 있습니다. 유형을 저장하면 이후 방문할 때도 맞춤 연습을 볼 수 있습니다.</p>
        <SaveProfileButton slug="avoidant" />
        <p className="fine-print">선택한 유형만 이 브라우저에 저장합니다. 검사 응답과 점수는 저장하지 않습니다. 언제든 기록 화면에서 유형을 바꾸거나 지울 수 있습니다.</p>
        <Link href="/journal" className="text-link">일상 기록으로 이동 <ArrowRight size={16} /></Link>
      </section>
      <p className="source-note">유형별 기본 특징은 사이트에 안내된 참고 자료를 바탕으로 하며, 일상 사례와 실천 방법은 자기이해를 위해 확장한 내용입니다. 전문적인 진단을 대신하지 않습니다.</p>
    </div>
  );
}
