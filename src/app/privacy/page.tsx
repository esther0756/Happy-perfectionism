"use client";

import { useState } from "react";
import { LockKeyhole, Trash2 } from "lucide-react";
import { useApp } from "@/lib/state";
import { Modal, PageIntro, StorageNotice } from "@/components/ui";

export default function PrivacyPage() {
  const { clear, ready, storageError } = useApp();
  const [confirm, setConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);
  return (
    <div className="narrow-page">
      <PageIntro
        eyebrow="안심하고 나를 돌아볼 수 있도록"
        title="내 기록은 나의 공간에."
      >
        <p>이 사이트는 로그인 없이 이용할 수 있어요.</p>
      </PageIntro>
      <div className="privacy-content">
        <section className="panel">
          <h2>
            <LockKeyhole size={20} className="inline mr-2" />
            응답과 활동 기록을 다루는 방법
          </h2>
          <p>
            검사 응답과 작성한 내용을 서버에 보내거나 저장하지 않습니다. 검사
            응답은 현재 열린 화면의 메모리에만 있고, 새로고침하거나 사이트를
            닫으면 사라집니다.
          </p>
          <p>
            가치 선택, 에너지 메모, 마음 연습, 날짜별 할 일과 회고도 기본적으로
            화면을 열어둔 동안만 유지됩니다. ‘이 브라우저에 활동 기록
            보관하기’를 직접 켜면 해당 기록만 이 기기의 브라우저 저장소에
            보관됩니다. 검사 응답은 이 옵션을 켜도 보관하지 않습니다.
          </p>
        </section>
        <section className="panel">
          <h2>보관을 선택했다면</h2>
          <p>
            같은 브라우저를 사용하는 사람이 기록을 볼 수 있습니다. 공유
            기기에서는 보관을 끄거나 사용 후 아래에서 지워주세요. 보관을 끄면
            저장소의 기록은 지워지고 현재 화면에서만 이어서 사용할 수 있습니다.
            브라우저 데이터를 삭제하면 보관한 기록도 사라지며, 다른 기기와
            동기화되지 않습니다.
          </p>
        </section>
        <section className="panel">
          <h2>사이트 접속과 외부 링크</h2>
          <p>
            광고, 행동 분석 도구나 추적 쿠키를 사용하지 않습니다. 글꼴과 화면
            자료는 사이트에 포함되어 있습니다. 서비스 제공을 위해 배포 서비스가
            IP 주소 등의 일반적인 접속 기록을 처리할 수 있지만, 입력한
            응답·메모를 이 기록에 포함해 전송하지 않습니다.
          </p>
          <p>
            학교 기관의 링크를 누르면 새 탭에서 외부 사이트가 열립니다. 방문한
            사이트에는 그 기관의 개인정보 처리방침이 적용됩니다.
          </p>
        </section>
      </div>
      <StorageNotice />
      <section className="panel mt-6">
        <h2>새롭게 시작하고 싶을 때</h2>
        <p className="panel-description">
          이 사이트에 작성한 모든 활동 기록과 현재 검사 응답을 지울 수 있어요.
        </p>
        <button
          className="button danger-button"
          disabled={!ready}
          onClick={() => setConfirm(true)}
        >
          <Trash2 size={16} />내 기록 모두 지우기
        </button>
        {cleared && !storageError && (
          <p role="status" className="fine-print mt-4">
            이 브라우저의 보관 기록과 현재 응답을 모두 지웠어요.
          </p>
        )}
      </section>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="모든 기록을 지울까요?"
      >
        <p>
          할 일, 회고, 자기이해와 마음 연습 기록, 검사 응답이 모두 지워져요. 이
          작업은 되돌릴 수 없어요.
        </p>
        <div className="button-row">
          <button
            className="button secondary"
            onClick={() => setConfirm(false)}
          >
            돌아가기
          </button>
          <button
            className="button danger-button"
            onClick={() => {
              clear();
              setCleared(true);
              setConfirm(false);
            }}
          >
            모두 지우기
          </button>
        </div>
      </Modal>
    </div>
  );
}
