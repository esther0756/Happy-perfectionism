import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { profiles } from "@/lib/content";
import { TypeSymbol } from "@/components/illustrations";
import { PageIntro } from "@/components/ui";
import { assessmentConfig } from "@/config/assessment";

export const metadata = { title: "네 가지 완벽주의" };

export default function TypesPage() {
  return (
    <>
      <PageIntro
        eyebrow="서로 다른 네 가지 마음"
        title="완벽주의에는 여러 모습이 있어요."
      >
        <p>
          어떤 모습은 익숙하고, 어떤 모습은 낯설 수 있어요.
          <br />
          이는 검사 결과가 아닌 유형 안내예요. 마음이 가는 유형부터 읽어보세요.
        </p>
      </PageIntro>
      <div className="profile-grid">
        {profiles.map((p) => (
          <Link
            key={p.slug}
            href={`/types/${p.slug}`}
            className={`profile-card ${p.color}`}
          >
            <TypeSymbol symbol={p.symbol} />
            <h2>{p.name} 완벽주의</h2>
            <blockquote>“{p.quote}”</blockquote>
            <p>{p.description}</p>
            <span className="card-link">
              이 마음 더 알아보기 <ArrowRight size={17} />
            </span>
          </Link>
        ))}
      </div>
      <div className="profile-source">
        <p className="fine-print">
          유형의 기본 틀: {assessmentConfig.source}
          <br />
          강점과 실천 제안은 자기이해를 돕기 위한 편집 내용입니다. 유형은 고정된
          성격이나 임상 진단이 아니며, 상황에 따라 여러 모습이 함께 나타날 수
          있어요.
        </p>
      </div>
    </>
  );
}
