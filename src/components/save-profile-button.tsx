"use client";

import { useApp } from "@/lib/state";
import { profiles, type ProfileSlug } from "@/lib/content";
import { Check } from "lucide-react";

export function SaveProfileButton({ slug }: { slug: ProfileSlug }) {
  const { data, update, ready, persist, storageError } = useApp();
  const selected = data.selectedProfile === slug;
  const name = profiles.find((profile) => profile.slug === slug)?.name ?? "";
  return (
    <div className="save-profile-control">
      <button
        type="button"
        className={`button ${selected ? "secondary" : "primary"}`}
        disabled={!ready}
        aria-pressed={selected}
        onClick={() => update((current) => ({ ...current, selectedProfile: slug }))}
      >
        {selected ? <Check size={16} aria-hidden="true" /> : null}
        {selected ? `${name} 유형 선택됨` : `${name} 유형을 기록에 저장하기`}
      </button>
      <span className="fine-print" role="status" aria-live="polite">
        {selected
          ? storageError
            ? "유형은 현재 화면에 반영되었지만 저장 오류가 있습니다. 보관 설정을 확인해 주세요."
            : persist
              ? "이 브라우저에 선택한 유형을 보관하고, 기록 화면에서 맞춤 연습을 보여줍니다."
              : "현재 방문 동안만 유형을 기억합니다. 다음 방문에도 보려면 보관 설정을 켜 주세요."
          : "원할 때만 선택할 수 있습니다. 검사 응답과 점수는 보관하지 않습니다."}
      </span>
    </div>
  );
}
