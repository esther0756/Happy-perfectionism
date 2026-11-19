import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { profiles } from "@/lib/content";
import { TypeSymbol } from "@/components/illustrations";
import { AvoidantDetail } from "@/components/avoidant-detail";
import { ExpandedProfileDetail } from "@/components/expanded-profile-detail";

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
      {p.slug === "avoidant" ? (
        <AvoidantDetail />
      ) : (
        <ExpandedProfileDetail slug={p.slug} />
      )}
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
