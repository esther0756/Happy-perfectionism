"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { profiles } from "@/lib/content";
import { useApp } from "@/lib/state";
import { PageIntro, StorageNotice } from "@/components/ui";
import { TypeSymbol } from "@/components/illustrations";

function PracticeContent() {
  const search = useSearchParams();
  const requested = search.get("type");
  const [selected, setSelected] = useState(
    profiles.find((p) => p.slug === requested)?.slug ?? "avoidant",
  );
  const { data, update, ready } = useApp();
  const profile = profiles.find((p) => p.slug === selected)!;
  const setNote = (key: string, value: string) =>
    update((d) => ({
      ...d,
      practice: { ...d.practice, [`${selected}:${key}`]: value },
    }));
  return (
    <>
      <PageIntro
        eyebrow="안정형 완벽주의로 한 걸음"
        title="잘하고 싶은 마음에, 여유를 더해요."
      >
        <p>
          지금 내 마음과 가까운 모습을 골라보세요.
          <br />
          오늘은 딱 하나만 해봐도 충분해요. 우리가 함께할게요.
        </p>
      </PageIntro>
      <div className="practice-selector" aria-label="실천 유형 선택">
        {profiles.map((p) => (
          <button
            key={p.slug}
            className="chip"
            aria-pressed={p.slug === selected}
            onClick={() => setSelected(p.slug)}
          >
            {p.name}의 마음
          </button>
        ))}
      </div>
      <div className="practice-grid">
        <section className="panel">
          <h2>
            <span className="step-marker">1</span>내 마음부터 돌아보기
          </h2>
          <p className="panel-description">
            불편했던 순간을 판단하지 않고 떠올려봐요.
          </p>
          <div className="form-stack">
            <label className="field">
              <span>{profile.question}</span>
              <textarea
                className="input"
                disabled={!ready}
                maxLength={3000}
                placeholder="그때의 상황과 마음을 편하게 적어주세요."
                value={data.practice[`${selected}:experience`] ?? ""}
                onChange={(e) => setNote("experience", e.target.value)}
              />
            </label>
            <label className="field">
              <span>그때 나에게 어떤 ‘완벽한 기준’을 요구했나요?</span>
              <textarea
                className="input"
                disabled={!ready}
                maxLength={3000}
                placeholder="꼭 그래야만 한다고 생각했던 것이 있나요?"
                value={data.practice[`${selected}:thought`] ?? ""}
                onChange={(e) => setNote("thought", e.target.value)}
              />
            </label>
            <label className="field">
              <span>조금 더 유연한 기준으로 바꿔본다면?</span>
              <textarea
                className="input"
                disabled={!ready}
                maxLength={3000}
                placeholder="지금의 나에게 가능한 정도는 어디까지일까요?"
                value={data.practice[`${selected}:alternative`] ?? ""}
                onChange={(e) => setNote("alternative", e.target.value)}
              />
            </label>
          </div>
        </section>
        <section className={`panel practice-activity ${profile.color}`}>
          <h2>
            <span className="step-marker">2</span>작은 행동으로 옮기기
          </h2>
          <div className="mt-7">
            <TypeSymbol symbol={profile.symbol} />
          </div>
          <h3 className="activity-title">{profile.action}</h3>
          <p>{profile.actionDetail}</p>
          <div className="gentle-note mb-7">
            <HeartHandshake size={19} />
            <span>
              결과가 기대와 달라도 괜찮아요. 시도한 것 자체가 오늘의 성장이에요.
            </span>
          </div>
          <Link
            className="button primary"
            href={`/journal?practice=${profile.slug}`}
          >
            오늘의 할 일에 담기 <ArrowRight size={17} />
          </Link>
        </section>
      </div>
      <div className="practice-quote">
        <small>오늘, 나에게 건네는 한 문장</small>
        <p>“{profile.reframe}”</p>
      </div>
      <StorageNotice />
    </>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={<p className="loading">마음 연습을 준비하고 있어요.</p>}
    >
      <PracticeContent />
    </Suspense>
  );
}
