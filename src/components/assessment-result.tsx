import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import {
  assessmentConfig,
  type CompletedAssessment,
} from "@/config/assessment";
import { profiles } from "@/lib/content";
import { TypeSymbol } from "./illustrations";

export function AssessmentResult({
  outcome,
}: {
  outcome: CompletedAssessment;
}) {
  const tied = outcome.primary.length > 1;
  return (
    <div className="assessment-result">
      <section aria-labelledby="result-heading">
        <div className="result-intro">
          <span className="eyebrow">20개의 질문으로 만난 나의 마음</span>
          <h2 id="result-heading" tabIndex={-1}>
            {tied
              ? "여러 유형이 함께 나타났어요."
              : "이번 응답에서 가장 높게 나타난 유형이에요."}
          </h2>
          {tied && (
            <p>
              {outcome.primary.length}개 유형이 {outcome.primary[0].total}점으로
              같아요. 한 가지로 정하지 않고 함께 살펴봐요.
            </p>
          )}
        </div>
        <div className={`result-primary-list ${tied ? "is-tied" : ""}`}>
          {outcome.primary.map((score) => {
            const profile = profiles.find(
              (profile) => profile.slug === score.type,
            )!;
            return (
              <article
                key={score.type}
                className={`result-primary ${profile.color}`}
              >
                <div className="result-primary-heading">
                  <TypeSymbol symbol={profile.symbol} />
                  <div>
                    <span className="eyebrow">
                      {tied ? "공동 1위" : "나의 첫 번째 유형"}
                    </span>
                    <h3>{profile.name} 완벽주의</h3>
                  </div>
                  <span className="result-total">
                    <strong>{score.total}</strong> / {score.max}점
                  </span>
                </div>
                <p className="result-quote">“{profile.quote}”</p>
                <p className="result-description">{profile.description}</p>
                <div className="result-traits">
                  <div>
                    <h4>내 안의 강점</h4>
                    <p>{profile.strength}</p>
                  </div>
                  <div>
                    <h4>마음이 힘들어질 때</h4>
                    <p>{profile.difficulty}</p>
                  </div>
                </div>
                <div className="button-row">
                  <Link
                    href={`/practice?type=${profile.slug}`}
                    prefetch={false}
                    className="button primary"
                  >
                    <Leaf size={16} />
                    나에게 맞는 마음 연습
                  </Link>
                  <Link
                    href={`/types/${profile.slug}`}
                    prefetch={false}
                    className="button secondary"
                  >
                    이 유형 더 알아보기 <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      {outcome.secondary.length > 0 && (
        <section
          className="result-secondary"
          aria-labelledby="secondary-heading"
        >
          <h2 id="secondary-heading">함께 살펴볼 두 번째 유형</h2>
          <p>
            첫 번째 유형과 점수 차이가 {assessmentConfig.secondaryMaxGap}점
            이내예요. 내 안에 이런 모습도 함께 있을 수 있어요.
          </p>
          <div className="result-secondary-list">
            {outcome.secondary.map((score) => {
              const profile = profiles.find(
                (profile) => profile.slug === score.type,
              )!;
              return (
                <Link
                  key={score.type}
                  href={`/types/${profile.slug}`}
                  prefetch={false}
                  className="result-secondary-item"
                >
                  <span className={`result-small-symbol ${profile.color}`}>
                    <TypeSymbol symbol={profile.symbol} />
                  </span>
                  <span>
                    <strong>{profile.name} 완벽주의</strong>
                    <small>
                      {profile.subtitle}
                      {outcome.secondary.length > 1 ? " · 공동 2위" : ""}
                    </small>
                  </span>
                  <span className="result-secondary-score">
                    {score.total} / {score.max}점
                  </span>
                  <ArrowRight size={16} />
                </Link>
              );
            })}
          </div>
        </section>
      )}
      <section
        className="panel result-score-panel"
        aria-labelledby="scores-heading"
      >
        <h2 id="scores-heading">네 가지 마음의 점수</h2>
        <p className="panel-description">
          각 유형은 5문항의 합계로, 5~20점 사이예요.
        </p>
        <ol className="result-score-list">
          {outcome.scores.map((score) => {
            const profile = profiles.find(
              (profile) => profile.slug === score.type,
            )!;
            const shared =
              outcome.scores.filter((other) => other.total === score.total)
                .length > 1;
            return (
              <li
                key={score.type}
                aria-label={`${profile.name} ${score.total}점`}
              >
                <div className="result-score-label">
                  <span>
                    {profile.name}{" "}
                    <small>
                      {shared ? "공동 " : ""}
                      {score.rank}위
                    </small>
                  </span>
                  <strong>
                    {score.total} <small>/ {score.max}점</small>
                  </strong>
                </div>
                <div className="result-score-track" aria-hidden="true">
                  <div
                    className={`result-score-fill ${profile.color}`}
                    style={{ width: `${(score.total / score.max) * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
        <details className="result-method">
          <summary>점수는 어떻게 계산하나요?</summary>
          <p>
            자료의 원래 문항 번호를 기준으로 1~5번은 회피형, 6~10번은 감독형,
            11~15번은 자책형, 16~20번은 안정형으로 합산해요. 질문이 섞여도
            분류는 그대로예요.
          </p>
          <p>
            가장 높은 유형을 먼저 보여드려요. 최고점이 같으면 모두 공동 1위로
            표시해요. 1위가 하나일 때, 두 번째 유형과 점수 차이가{" "}
            {assessmentConfig.secondaryMaxGap}점 이내이면 작은 카드로 함께
            보여드려요. 2위가 같으면 해당 유형을 모두 표시해요.
          </p>
          <p>
            {assessmentConfig.secondaryMaxGap}점 차이는 여러 모습을 함께
            살펴보기 위한 사이트의 표시 기준이며, 임상적으로 검증된 기준점은
            아니에요.
          </p>
        </details>
      </section>
      <p className="source-note">
        {assessmentConfig.source}
        <br />
        질문 자료의 합산 방식에 따른 자기이해용 결과예요. 전문적인 심리 진단을
        대신하지 않으며, 상황에 따라 나의 모습은 달라질 수 있어요.
      </p>
      <div className="button-row result-next">
        <Link href="/types" className="button secondary">
          다른 유형도 살펴보기 <ArrowRight size={16} />
        </Link>
        <Link href="/journal" className="button ghost">
          오늘의 작은 실천 기록하기
        </Link>
      </div>
    </div>
  );
}
