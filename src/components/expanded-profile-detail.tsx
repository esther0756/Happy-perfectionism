import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Heart,
  Lightbulb,
  RotateCcw,
  Sprout,
} from "lucide-react";
import { SaveProfileButton } from "@/components/save-profile-button";
import {
  expandedProfiles,
  type ExpandedProfileSlug,
} from "@/lib/expanded-profiles";

const situationIcons = [BookOpen, Heart, RotateCcw];

export function ExpandedProfileDetail({ slug }: { slug: ExpandedProfileSlug }) {
  const detail = expandedProfiles[slug];
  return (
    <div className="detail-content">
      <section className="panel detail-section" aria-labelledby={`${slug}-overview`}>
        <span className="detail-index">01 · 나의 모습 이해하기</span>
        <h2 id={`${slug}-overview`}>당신의 완벽주의는 어떤 모습일까요?</h2>
        {detail.intro.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        <p className="detail-emphasis">{detail.introEmphasis}</p>
      </section>

      <section className="panel detail-section" aria-labelledby={`${slug}-strengths`}>
        <span className="detail-index">02 · 내 안의 강점</span>
        <h2 id={`${slug}-strengths`}>
          <Sprout size={20} aria-hidden="true" /> 이 성향이 가진 강점도 살펴보세요.
        </h2>
        {detail.strengthIntro.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        <ul className="detail-bullet-list">
          {detail.strengths.map((strength) => <li key={strength}>{strength}</li>)}
        </ul>
        {detail.strengthAfter.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        <p className="detail-emphasis">{detail.strengthEmphasis}</p>
      </section>

      <section className="panel detail-section" aria-labelledby={`${slug}-daily`}>
        <span className="detail-index">03 · 일상에서 나타나는 모습</span>
        <h2 id={`${slug}-daily`}>일상에서는 어떻게 나타날까요?</h2>
        <p>{detail.cycleIntro}</p>
        <div className="detail-cycle" aria-label={detail.cycle.join(", ")}>
          {detail.cycle.map((step, i) => (
            <div className="detail-cycle-step" key={step}>
              <span>{step}</span>
              {i < detail.cycle.length - 1 && <ArrowRight size={15} aria-hidden="true" />}
            </div>
          ))}
        </div>
        {detail.cycleAfter.map((paragraph, i) => (
          <p className="detail-cycle-note" key={i}>{paragraph}</p>
        ))}
        <div className="detail-situations">
          {detail.situations.map(({ title, examples, advice }, i) => {
            const Icon = situationIcons[i];
            return (
              <article className="detail-situation" key={title}>
                <h3><Icon size={19} aria-hidden="true" /> {i + 1}. {title}</h3>
                <h4>이런 경험이 있나요?</h4>
                <ul className="detail-bullet-list">
                  {examples.map((example) => <li key={example}>{example}</li>)}
                </ul>
                <div className="detail-advice">
                  <h4><Lightbulb size={17} aria-hidden="true" /> 이렇게 시도해 보세요.</h4>
                  {advice.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel detail-section" aria-labelledby={`${slug}-questions`}>
        <span className="detail-index">04 · 나를 돌아보는 질문</span>
        <h2 id={`${slug}-questions`}>스스로에게 질문해 보세요.</h2>
        <p>다음 질문을 통해 자신의 행동을 살펴볼 수 있습니다.</p>
        <ul className="detail-question-list">
          {detail.questions.map((question) => (
            <li key={question}>
              <CheckCircle2 size={17} aria-hidden="true" />
              <span>{question}</span>
            </li>
          ))}
        </ul>
        <p>{detail.questionsAfter}</p>
      </section>

      <section className="panel detail-section detail-conclusion" aria-labelledby={`${slug}-conclusion`}>
        <span className="detail-index">05 · 마지막으로 기억할 점</span>
        <h2 id={`${slug}-conclusion`}>{detail.conclusionTitle}</h2>
        <p>{detail.conclusionBefore}</p>
        <p className="detail-emphasis">{detail.conclusionEmphasis}</p>
        <p>{detail.conclusionAfter}</p>
      </section>

      <section className="panel detail-save" aria-labelledby={`${slug}-save`}>
        <span className="detail-index">기록하며 실천하기</span>
        <h2 id={`${slug}-save`}>나에게 맞는 연습을 기록에서 만나보세요.</h2>
        <p>‘변화를 위한 세 가지 연습’은 결과 페이지 대신 일상 기록 화면에서 확인할 수 있습니다. 유형을 저장하면 이후 방문할 때도 맞춤 연습을 볼 수 있습니다.</p>
        <SaveProfileButton slug={slug} />
        <p className="fine-print">
          선택한 유형만 이 브라우저에 저장합니다. 검사 응답과 점수는 저장하지 않습니다.
          언제든 기록 화면에서 유형을 바꾸거나 지울 수 있습니다.
        </p>
        <Link href="/journal" className="text-link">
          일상 기록으로 이동 <ArrowRight size={16} />
        </Link>
      </section>
      <p className="source-note">
        유형별 기본 특징은 사이트에 안내된 참고 자료를 바탕으로 하며,
        일상 사례와 실천 방법은 자기이해를 위해 확장한 내용입니다.
        전문적인 심리 진단을 대신하지 않습니다.
      </p>
    </div>
  );
}
