"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { X, LockKeyhole, Check, AlertCircle } from "lucide-react";
import { useApp } from "@/lib/state";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    if (!open && ref.current?.open) ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-inner">
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="닫기"
        >
          <X size={20} />
        </button>
        <h2>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <div className="intro-description">{children}</div>
    </div>
  );
}

export function StorageNotice() {
  const { ready, persist, setPersist, storageError, savedAt } = useApp();
  return (
    <div className="storage-notice">
      <LockKeyhole size={18} />
      <div>
        <label className="storage-label">
          <input
            type="checkbox"
            checked={persist}
            disabled={!ready}
            onChange={(e) => setPersist(e.target.checked)}
          />
          이 브라우저에 활동 기록 보관하기
        </label>
        <p>
          {persist
            ? "입력한 활동 기록은 이 기기·브라우저에 자동 저장돼요. 공유 기기에서는 보관을 끄거나 사용 후 기록을 지워주세요."
            : "자동 저장이 꺼져 있어요. 현재 화면의 기록은 새로고침하면 사라져요. 끈 설정은 다음 방문에도 유지돼요."}{" "}
          검사 응답은 보관하지 않아요.
        </p>
        {ready && persist && savedAt && !storageError && (
          <p className="save-time">
            마지막 저장: {new Date(savedAt).toLocaleString("ko-KR")}
          </p>
        )}
        <Link href="/privacy" className="text-link mt-2">
          기록 백업·복원 및 저장 설정
        </Link>
        {storageError && (
          <>
            <p role="alert" className="error-text">
              {storageError}
            </p>
            <button
              className="button secondary small mt-2"
              onClick={() => setPersist(true)}
            >
              다시 저장하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function SaveStatus() {
  const { ready, persist, savedAt, storageError } = useApp();
  const label = !ready
    ? "불러오는 중"
    : storageError
      ? "저장 확인 필요"
      : !persist
        ? "자동 저장 꺼짐"
        : savedAt
          ? "자동 저장됨"
          : "자동 저장 켜짐";
  return (
    <Link
      href="/privacy"
      className={`save-status ${storageError ? "error-text" : ""}`}
      aria-label={`${label} · 저장 및 백업 설정`}
    >
      {storageError ? (
        <AlertCircle size={15} />
      ) : persist ? (
        <Check size={15} />
      ) : (
        <LockKeyhole size={15} />
      )}
      <span role="status">{label}</span>
    </Link>
  );
}
