import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Heart, Sprout } from "lucide-react";
import { profiles } from "@/lib/content";
import { TypeSymbol } from "@/components/illustrations";

export function generateStaticParams() {
  return profiles.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = profiles.find((p) => p.slug === slug);
  return { title: p ? `${p.name} 완벽주의` : "유형 안내" };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = profiles.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <div className="narrow-page">
      <Link href="/types" className="back-link">
        <ArrowLeft size={14} />네 가지 유형으로 돌아가기
      </Link>
      <section className={`profile-hero ${p.color}`}>
        <TypeSymbol symbol={p.symbol} />
        <div>
          <span className="eyebrow">
            유형 알아보기 · 나를 이해하는 하나의 관점
          </span>
          <h1>{p.name} 완벽주의</h1>
          <p>“{p.quote}”</p>
        </div>
      </section>
      <p className="profile-description">{p.description}</p>
      <div className="profile-body">
        <section className="panel">
          <h2>
            <Sprout size={20} className="inline mr-2" />내 안의 강점
          </h2>
          <p>{p.strength}</p>
        </section>
        <section className="panel">
          <h2>
            <Heart size={20} className="inline mr-2" />
            마음이 힘들어질 때
          </h2>
          <p>{p.difficulty}</p>
        </section>
      </div>
      <section className="panel">
        <span className="eyebrow">오늘 할 수 있는 작은 연습</span>
        <h2>{p.action}</h2>
        <p className="panel-description">{p.actionDetail}</p>
        <Link href={`/practice?type=${p.slug}`} className="button primary">
          이 마음을 위한 연습하기 <ArrowRight size={16} />
        </Link>
      </section>
      <div className="practice-quote">
        <small>나에게 건네는 한 문장</small>
        <p>“{p.reframe}”</p>
      </div>
      <section className="spaced-section">
        <div className="section-heading">
          <h2>다른 모습도 살펴볼까요?</h2>
        </div>
        <div className="practice-selector">
          {profiles
            .filter((other) => other.slug !== p.slug)
            .map((other) => (
              <Link
                className="chip"
                key={other.slug}
                href={`/types/${other.slug}`}
              >
                {other.name} 완벽주의 <ArrowRight size={13} />
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
