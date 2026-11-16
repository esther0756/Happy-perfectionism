"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Info,
  LockKeyhole,
  RotateCcw,
  Sprout,
} from "lucide-react";
import {
  assessmentConfig,
  getAssessmentOutcome,
  questions,
  shuffledQuestionIds,
  type Answer,
} from "@/config/assessment";
import { useApp } from "@/lib/state";
import { GrowingIllustration } from "@/components/illustrations";
import { Modal, PageIntro } from "@/components/ui";

export default function TestPage() {
  const { quiz, setQuiz } = useApp();
  const [confirmRestart, setConfirmRestart] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const answered = Object.keys(quiz.answers).length;
  const question = questions.find((q) => q.id === quiz.order[quiz.index]);
  const start = () => {
    setQuiz({
      order: shuffledQuestionIds(),
      answers: {},
      index: 0,
      completed: false,
    });
    setConfirmRestart(false);
  };
  const move = (direction: number) => {
    setQuiz((q) => ({ ...q, index: q.index + direction }));
    requestAnimationFrame(() => heading.current?.focus());
  };
  const finish = () => {
    if (getAssessmentOutcome(quiz.answers).status === "pending_validation") {
      setQuiz((q) => ({ ...q, completed: true }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className="narrow-page">
      <PageIntro
        eyebrow="나를 이해하는 첫 번째 걸음"
        title="나의 완벽주의를 만나볼까요?"
      >
        <p>정답은 없어요. 요즘 나의 모습과 가장 가까운 쪽을 골라주세요.</p>
      </PageIntro>
      {!quiz.order.length ? (
        <>
          <section className="panel test-intro-card">
            <div className="test-intro-art">
              <GrowingIllustration />
            </div>
            <div>
              <h2>
                잘하고 싶은 마음에도
                <br />
                여러 모습이 있어요.
              </h2>
              <div className="test-facts">
                <span>
                  <Check size={17} />
                  20문항 · 1~4점 중 선택
                </span>
                <span>
                  <Clock3 size={17} />
                  나를 돌아보는 약 5분의 시간
                </span>
                <span>
                  <LockKeyhole size={17} />
                  사이트를 닫으면 응답이 사라져요
                </span>
              </div>
              <div className="gentle-note">
                <Info size={17} />
                <span>
                  현재는 질문 체험 버전이에요. 채점 규칙을 검토 중이므로 점수와
                  유형 판정은 제공하지 않아요.
                </span>
              </div>
              <button className="button primary full" onClick={start}>
                질문 시작하기 <ArrowRight size={17} />
              </button>
            </div>
          </section>
          <p className="source-note">
            {assessmentConfig.source}
            <br />
            제공된 자료를 바탕으로 질문을 옮겼으며, 전문적인 심리 진단을
            대신하지 않습니다.
          </p>
        </>
      ) : quiz.completed ? (
        <>
          <section className="panel completion-card">
            <span className="round-icon sage">
              <Sprout size={31} />
            </span>
            <span className="eyebrow">20개의 질문, 나를 돌아본 시간</span>
            <h2>내 마음에 귀 기울여줘서 고마워요.</h2>
            <p>
              모든 질문에 답했어요. 어떤 문항이 특히 마음에 남았나요?
              <br />그 질문이 오늘 나를 이해하는 작은 실마리가 될 수 있어요.
            </p>
            <div className="gentle-note">
              <Info size={19} />
              <span>
                <strong>유형 판정은 아직 준비 중이에요.</strong>
                <br />
                자료의 채점 방식과 동점 처리 등을 검증하기 전까지 유형을
                자동으로 확정하지 않아요. 아래에서 네 가지 모습을 직접 살펴볼 수
                있어요.
              </span>
            </div>
            <div className="button-row center">
              <Link href="/types" className="button primary">
                네 가지 유형 살펴보기 <ArrowRight size={17} />
              </Link>
              <Link href="/journal" className="button secondary">
                오늘의 작은 실천 기록하기
              </Link>
            </div>
          </section>
          <details className="response-list">
            <summary>내가 선택한 응답 다시 살펴보기</summary>
            {questions.map((q) => (
              <div className="response-item" key={q.id}>
                <span>{q.text}</span>
                <strong>{quiz.answers[q.id]} / 4</strong>
              </div>
            ))}
          </details>
          <div className="button-row">
            <button
              className="button ghost small"
              onClick={() => {
                setQuiz((q) => ({ ...q, completed: false, index: 0 }));
              }}
            >
              <ArrowLeft size={14} />
              응답 수정하기
            </button>
            <button
              className="button ghost small"
              onClick={() => setConfirmRestart(true)}
            >
              <RotateCcw size={14} />
              처음부터 다시
            </button>
          </div>
        </>
      ) : (
        question && (
          <>
            <div className="quiz-top">
              <span>
                <strong>{answered}</strong> / 20개 응답
              </span>
              <span>나의 속도로, 천천히</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="검사 응답 진행률"
              aria-valuemin={0}
              aria-valuemax={20}
              aria-valuenow={answered}
            >
              <div
                className="progress-fill"
                style={{ width: `${(answered / 20) * 100}%` }}
              />
            </div>
            <section className="panel question-panel">
              <div className="question-number">
                질문 {String(quiz.index + 1).padStart(2, "0")}{" "}
                <span className="fine-print">/ 20</span>
              </div>
              <h2
                className="question-title"
                ref={heading}
                tabIndex={-1}
                id="question-text"
              >
                {question.text}
              </h2>
              <fieldset
                className="answer-options"
                aria-labelledby="question-text"
              >
                <legend className="sr-only">1점에서 4점 사이의 응답</legend>
                {([1, 2, 3, 4] as Answer[]).map((value) => (
                  <label
                    key={value}
                    className={`answer-option ${quiz.answers[question.id] === value ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={value}
                      checked={quiz.answers[question.id] === value}
                      onChange={() =>
                        setQuiz((q) => ({
                          ...q,
                          answers: { ...q.answers, [question.id]: value },
                        }))
                      }
                      aria-label={`${value}점${value === 1 ? ", 매우 그렇지 않다" : value === 4 ? ", 매우 그렇다" : ""}`}
                    />
                    <span className="answer-number">{value}</span>
                    <small>
                      {value === 1
                        ? "매우 그렇지 않다"
                        : value === 4
                          ? "매우 그렇다"
                          : `${value}점`}
                    </small>
                  </label>
                ))}
              </fieldset>
              <p className="fine-print">
                1점에 가까울수록 ‘매우 그렇지 않다’, 4점에 가까울수록 ‘매우
                그렇다’예요.
              </p>
              <div className="quiz-controls">
                <button
                  className="button ghost"
                  disabled={quiz.index === 0}
                  onClick={() => move(-1)}
                >
                  <ArrowLeft size={16} />
                  이전 질문
                </button>
                {quiz.index < 19 ? (
                  <button
                    className="button primary"
                    disabled={!quiz.answers[question.id]}
                    onClick={() => move(1)}
                  >
                    다음 질문 <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    className="button primary"
                    disabled={answered !== 20}
                    onClick={finish}
                  >
                    응답 마치고 확인하기 <Check size={16} />
                  </button>
                )}
              </div>
            </section>
            <p className="quiz-bottom">
              잠시 돌아가도 괜찮아요. 이전 질문의 답은 유지돼요.
              <br />
              새로고침하거나 사이트를 닫으면 응답이 사라져요.
            </p>
            <button
              className="button ghost small"
              onClick={() => setConfirmRestart(true)}
            >
              <RotateCcw size={14} />
              처음부터 다시
            </button>
          </>
        )
      )}
      <Modal
        open={confirmRestart}
        onClose={() => setConfirmRestart(false)}
        title="새로운 마음으로 시작할까요?"
      >
        <p>지금까지 고른 응답을 지우고, 질문을 다시 섞어요.</p>
        <div className="button-row">
          <button
            className="button secondary"
            onClick={() => setConfirmRestart(false)}
          >
            계속 이어가기
          </button>
          <button className="button primary" onClick={start}>
            새로 시작하기
          </button>
        </div>
      </Modal>
    </div>
  );
}
