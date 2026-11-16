"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X, LockKeyhole } from "lucide-react";
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
  const { ready, persist, setPersist, storageError } = useApp();
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
            ? "이 기기에만 보관돼요. 공유 기기에서는 사용 후 기록을 지워주세요."
            : "현재는 새로고침하면 활동 기록이 사라져요. 보관은 원할 때만 켜주세요."}{" "}
          검사 응답은 보관하지 않아요.
        </p>
        {storageError && (
          <p role="alert" className="error-text">
            {storageError}
          </p>
        )}
      </div>
    </div>
  );
}
