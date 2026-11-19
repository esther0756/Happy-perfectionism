import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Heart,
  Leaf,
  LockKeyhole,
  NotebookPen,
} from "lucide-react";
import { GrowingIllustration, TypeSymbol } from "@/components/illustrations";
import { profiles } from "@/lib/content";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span />
            <span>행복한 완벽주의</span>
          </div>
          <h1>
            나를 이해하는 것부터,
            <br />
            <span>나에게 맞는 하루를 만드는 것까지.</span>
          </h1>
          <p>
            나의 완벽주의 성향을 알아보고,
            <br />
            오늘의 에너지와 우선순위에 맞춰 하루를 계획해보세요.
          </p>
          <Link className="button primary hero-cta" href="/test">
            나의 완벽주의 유형 알아보기 <ArrowRight size={18} />
          </Link>
          <div className="hero-details">
            <span>
              <Clock3 size={14} />약 5분
            </span>
            <span>
              <Check size={14} />
              20개의 질문
            </span>
            <span>
              <LockKeyhole size={13} />
              로그인 없이
            </span>
          </div>
        </div>
        <div className="hero-art">
          <GrowingIllustration />
          <span className="art-caption">성장은, 나의 속도로.</span>
        </div>
      </section>
      <section className="journey-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">알아가고, 연습하고, 기록해요</span>
            <h2>나를 돌보는 세 가지 시간</h2>
          </div>
          <p>지금 마음이 가는 곳부터 시작해도 괜찮아요.</p>
        </div>
        <div className="journey-grid">
          <Link href="/about-me" className="journey-card">
            <div className="journey-card-top">
              <span className="round-icon sage">
                <Heart size={23} strokeWidth={1.5} />
              </span>
              <span className="card-step">01</span>
            </div>
            <h3>나를 알아가는 시간</h3>
            <p>
              내가 소중하게 여기는 것,
              <br />
              나를 채우고 소모하는 것들을 알아봐요.
            </p>
            <span className="card-link">
              나의 가치와 에너지 살펴보기 <ArrowUpRight size={18} />
            </span>
          </Link>
          <Link href="/practice" className="journey-card">
            <div className="journey-card-top">
              <span className="round-icon peach">
                <Leaf size={23} strokeWidth={1.5} />
              </span>
              <span className="card-step">02</span>
            </div>
            <h3>안정형으로 한 걸음</h3>
            <p>
              높은 기준에 지친 마음에
              <br />
              조금 더 유연한 생각을 선물해요.
            </p>
            <span className="card-link">
              나에게 맞는 마음 연습 <ArrowUpRight size={18} />
            </span>
          </Link>
          <Link href="/journal" className="journey-card featured">
            <div className="journey-card-top">
              <span className="round-icon cream">
                <NotebookPen size={23} strokeWidth={1.5} />
              </span>
              <span className="tiny-badge">매일 조금씩</span>
            </div>
            <h3>기록하며 실천하기</h3>
            <p>
              할 일도, 쉬는 시간도, 오늘의 마음도.
              <br />
              나를 위한 하루를 차근차근 만들어가요.
            </p>
            <span className="card-link">
              오늘의 기록 시작하기 <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>
      </section>
      <section className="types-preview">
        <div className="section-heading">
          <div>
            <span className="eyebrow">서로 다른 네 가지 마음</span>
            <h2>나의 완벽주의는 어떤 모습일까요?</h2>
          </div>
          <Link className="text-link" href="/types">
            유형 모두 살펴보기 <ArrowRight size={16} />
          </Link>
        </div>
        <div className="type-preview-grid">
          {profiles.map((profile) => (
            <Link
              key={profile.slug}
              href={`/types/${profile.slug}`}
              className={`type-preview ${profile.color}`}
            >
              <TypeSymbol symbol={profile.symbol} />
              <div>
                <h3>{profile.name} 완벽주의</h3>
                <p>{profile.subtitle}</p>
              </div>
              <ArrowUpRight className="type-arrow" size={17} />
            </Link>
          ))}
        </div>
        <p className="section-footnote">
          유형은 나를 이해하는 하나의 관점이에요. 한 가지 모습으로 나를 단정하지
          않아도 괜찮아요.
        </p>
      </section>
      <section className="home-bottom">
        <div className="small-sprout">
          <Leaf size={25} />
        </div>
        <div>
          <h3>행복한 완벽주의를 향하여, 함께 걸어요.</h3>
        </div>
        <Link href="/journal" className="text-link">
          나의 작은 실천 <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
