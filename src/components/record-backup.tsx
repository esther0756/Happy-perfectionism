"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Download, FolderOpen } from "lucide-react";
import {
  createBackup,
  MAX_BACKUP_BYTES,
  readBackup,
  type RecordBackup,
} from "@/lib/records";
import { localDate, useApp } from "@/lib/state";
import { Modal } from "./ui";

export function RecordBackupControls() {
  const { data, ready, persist, restore } = useApp();
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<
    (RecordBackup & { name: string }) | null
  >(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const download = () => {
    setError("");
    try {
      const blob = new Blob([createBackup(data)], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `행복한-완벽주의-기록-${localDate()}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(
        "백업 파일 다운로드를 시작했어요. 다운로드 폴더에서 확인해주세요.",
      );
    } catch {
      setError(
        "백업 파일을 만들지 못했어요. 브라우저의 다운로드 설정을 확인하고 다시 시도해주세요.",
      );
    }
  };
  const chooseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    setError("");
    setMessage("");
    setBusy(true);
    try {
      if (file.size > MAX_BACKUP_BYTES)
        throw new Error(
          "10MB 이하의 백업 파일을 선택해주세요. 현재 기록은 바뀌지 않았어요.",
        );
      const text = await file.text().catch(() => {
        throw new Error(
          "파일을 읽지 못했어요. 파일을 다시 선택해주세요. 현재 기록은 바뀌지 않았어요.",
        );
      });
      const backup = readBackup(text);
      setPending({ ...backup, name: file.name });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "파일을 읽지 못했어요. 현재 기록은 바뀌지 않았어요.",
      );
    } finally {
      setBusy(false);
    }
  };
  const taskCount = pending
    ? Object.values(pending.data.days).reduce(
        (sum, day) => sum + day.tasks.length,
        0,
      )
    : 0;

  return (
    <section className="panel mt-6" aria-labelledby="backup-heading">
      <h2 id="backup-heading">내 기록 백업·복원</h2>
      <p className="panel-description">
        기록을 파일로 내려받아 보관하거나, 다른 기기에서 같은 파일을 불러올 수
        있어요. 할 일·회고·가치·에너지·마음 연습 기록이 담기며, 검사 응답은
        포함되지 않아요.
      </p>
      <div className="button-row">
        <button className="button primary" disabled={!ready} onClick={download}>
          <Download size={16} />
          백업 파일 내려받기
        </button>
        <button
          className="button secondary"
          disabled={!ready || busy}
          onClick={() => input.current?.click()}
        >
          <FolderOpen size={16} />
          {busy ? "파일 확인 중" : "백업 파일 불러오기"}
        </button>
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          aria-label="백업 파일 선택"
          hidden
          onChange={chooseFile}
        />
      </div>
      <p className="fine-print mt-4">
        파일은 서버에 전송되지 않아요. 개인 기록이 담긴 백업은 나만 볼 수 있는
        곳에 보관해주세요.
      </p>
      {message && (
        <p role="status" className="fine-print mt-4">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="error-text mt-4">
          {error}
        </p>
      )}
      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title="백업 기록을 불러올까요?"
      >
        {pending && (
          <>
            <p className="backup-file-name">{pending.name}</p>
            <p>
              날짜별 기록 {Object.keys(pending.data.days).length}일 · 할 일{" "}
              {taskCount}개 · 선택한 가치 {pending.data.values.length}개
            </p>
            <p>
              현재 활동 기록이 이 파일의 내용으로 바뀌어요. 기존 기록도
              필요하다면 먼저 백업해주세요.
              {persist
                ? " 불러온 기록은 이 브라우저에 자동 저장돼요."
                : " 자동 저장이 꺼져 있어, 불러온 기록은 현재 화면에서만 유지돼요."}
            </p>
            <div className="button-row">
              <button
                className="button secondary"
                onClick={() => setPending(null)}
              >
                돌아가기
              </button>
              <button
                className="button primary"
                onClick={() => {
                  restore(pending.data);
                  setPending(null);
                  setMessage(
                    "백업 기록을 이 화면으로 불러왔어요. 위의 저장 상태를 확인해주세요.",
                  );
                }}
              >
                이 기록으로 불러오기
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
