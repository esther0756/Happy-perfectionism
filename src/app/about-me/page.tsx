"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryMedium,
  Check,
  Compass,
  Heart,
  Landmark,
} from "lucide-react";
import { values } from "@/lib/content";
import { useApp } from "@/lib/state";
import { PageIntro, StorageNotice } from "@/components/ui";

const levels = [
  "충분히 쉬고 싶어요",
  "에너지가 조금 부족해요",
  "차분하게 해볼 만해요",
  "여유가 있는 편이에요",
  "에너지가 넉넉해요",
];

export default function AboutMePage() {
  const { data, update, ready } = useApp();
  const toggleValue = (value: string) =>
    update((d) => ({
      ...d,
      values: d.values.includes(value)
        ? d.values.filter((v) => v !== value)
        : d.values.length < 3
          ? [...d.values, value]
          : d.values,
    }));
  const setEnergy = (key: "easy" | "demanding" | "restoring", value: string) =>
    update((d) => ({ ...d, energy: { ...d.energy, [key]: value } }));
  return (
    <>
      <PageIntro
        eyebrow="먼저 나에 대해 잘 알아야 해요"
        title="나는 무엇으로 채워지는 사람일까요?"
      >
        <p>
          다른 사람의 기준을 잠시 내려놓고, 나의 기준을 찾아봐요.
          <br />
          좋아하는 것과 지치는 것을 알아가는 일부터 시작해요.
        </p>
      </PageIntro>
      <section className="panel">
        <div className="panel-heading">
          <h2>
            <Compass size={20} />
            나에게 중요한 가치 세 가지
          </h2>
          <span className="badge" aria-live="polite">
            {data.values.length} / 3 선택
          </span>
        </div>
        <p className="panel-description">
          지금의 나에게 가장 소중한 가치를 골라보세요. 언제든 바꿔도 괜찮아요.
        </p>
        <div className="value-grid">
          {values.map((v) => (
            <button
              key={v}
              className="value-card"
              aria-pressed={data.values.includes(v)}
              disabled={
                !ready || (data.values.length === 3 && !data.values.includes(v))
              }
              onClick={() => toggleValue(v)}
            >
              {data.values.includes(v) && <Check size={14} />} {v}
            </button>
          ))}
        </div>
        <p className="value-summary" aria-live="polite">
          {data.values.length === 3
            ? `${data.values.join(", ")} — 이 가치들을 오늘의 작은 선택에도 담아볼까요? 바꾸려면 고른 가치를 한 번 더 눌러주세요.`
            : "어떤 삶을 살고 싶은지 떠올리면 고르기가 조금 쉬워질 거예요."}
        </p>
      </section>
      <section className="panel energy-panel">
        <div className="panel-heading">
          <h2>
            <BatteryMedium size={21} />
            나의 에너지 총량 돌아보기
          </h2>
        </div>
        <p className="panel-description">
          매일 쓸 수 있는 에너지는 달라요. 오늘의 나에게 맞는 양을 살펴봐요.
        </p>
        <div className="energy-range">
          <label htmlFor="energy-level">
            <span>오늘 내가 느끼는 에너지는?</span>
            <strong>{data.energy.level} / 5</strong>
          </label>
          <input
            id="energy-level"
            type="range"
            min={1}
            max={5}
            value={data.energy.level}
            disabled={!ready}
            aria-valuetext={levels[data.energy.level - 1]}
            onChange={(e) =>
              update((d) => ({
                ...d,
                energy: { ...d.energy, level: Number(e.target.value) },
              }))
            }
          />
          <div className="range-labels">
            <span>충분히 쉬고 싶어요</span>
            <span>에너지가 넉넉해요</span>
          </div>
          <p className="fine-print mt-3" aria-live="polite">
            {levels[data.energy.level - 1]}
          </p>
        </div>
        <div className="energy-grid">
          {(
            [
              {
                key: "easy",
                title: "비교적 편하게 하는 일",
                placeholder: "예: 혼자 자료 읽기, 산책하며 생각하기",
              },
              {
                key: "demanding",
                title: "에너지가 많이 드는 일",
                placeholder: "예: 긴 팀 회의, 여러 사람 앞에서 발표하기",
              },
              {
                key: "restoring",
                title: "나를 다시 채워주는 일",
                placeholder: "예: 따뜻한 밥 먹기, 친구와 이야기하기",
              },
            ] as const
          ).map((field) => (
            <label key={field.key} className="field">
              <span>{field.title}</span>
              <textarea
                className="input"
                maxLength={2000}
                disabled={!ready}
                placeholder={field.placeholder}
                value={data.energy[field.key]}
                onChange={(e) => setEnergy(field.key, e.target.value)}
              />
            </label>
          ))}
        </div>
        <div className="button-row mt-6">
          <Link className="button secondary" href="/journal">
            내 가치와 에너지에 맞는 하루 계획하기 <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="spaced-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">조금 더 깊이 알아가고 싶다면</span>
            <h2>학교 안에서도 도움을 만날 수 있어요.</h2>
          </div>
        </div>
        <div className="resource-grid">
          <article className="resource-card">
            <Landmark size={25} strokeWidth={1.5} />
            <div>
              <h3>서울대학교 경력개발센터</h3>
              <p>MBTI 등 진로·자기이해 검사와 상담 안내를 확인해보세요.</p>
              <a
                href="https://career.snu.ac.kr/"
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="text-link"
              >
                경력개발센터 안내 보기 <ArrowUpRight size={15} />
                <span className="sr-only">(새 탭)</span>
              </a>
            </div>
          </article>
          <article className="resource-card">
            <Heart size={25} strokeWidth={1.5} />
            <div>
              <h3>서울대학교 대학생활문화원</h3>
              <p>심리검사와 개인 상담의 신청 절차를 확인해보세요.</p>
              <a
                href="https://snucounsel.snu.ac.kr/"
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="text-link"
              >
                심리검사 신청 안내 보기 <ArrowUpRight size={15} />
                <span className="sr-only">(새 탭)</span>
              </a>
            </div>
          </article>
        </div>
        <p className="source-note">
          기관의 공식 홈페이지로 이동합니다. 프로그램 운영 여부, 신청 자격과
          일정은 해당 기관에서 확인해주세요.
        </p>
      </section>
      <StorageNotice />
    </>
  );
}
