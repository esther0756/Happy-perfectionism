"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Coffee, Pause, Play, X, Timer } from "lucide-react";
import { Modal } from "./ui";
import { useApp } from "@/lib/state";

export function RestTimer() {
  const { ready } = useApp();
  const [mode, setMode] = useState<"setup" | "rest" | null>(null);
  const [duration, setDuration] = useState(25);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (!deadline) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (!left) {
        setDeadline(null);
        setMode("rest");
      }
    };
    const id = window.setInterval(tick, 1000);
    const resume = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", resume);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [deadline]);
  return (
    <>
      <button className="rest-trigger" onClick={() => setMode("setup")}>
        <span className="rest-trigger-icon">
          <Coffee size={22} />
        </span>
        <span>
          <strong>쉼도 계획의 일부예요</strong>
          <small>
            나를 위한 휴식 알림 <span aria-hidden="true">↗</span>
          </small>
        </span>
      </button>
      {ready &&
        createPortal(
          <>
            {deadline && (
              <div className="timer-pill" role="status">
                <Timer size={17} />
                <span>
                  쉬어가기까지{" "}
                  <strong>
                    {Math.floor(remaining / 60)}:
                    {String(remaining % 60).padStart(2, "0")}
                  </strong>
                </span>
                <button
                  onClick={() => {
                    setDeadline(null);
                    setMode("rest");
                  }}
                  aria-label="지금 쉬어가기"
                >
                  <Pause size={16} />
                </button>
                <button
                  onClick={() => setDeadline(null)}
                  aria-label="타이머 종료"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <Modal
              open={mode === "setup"}
              onClose={() => setMode(null)}
              title="집중한 만큼, 쉬어가요."
            >
              <div className="modal-illustration">
                <Coffee size={42} strokeWidth={1.3} />
              </div>
              <p>
                작은 집중 뒤에 휴식을 챙겨드릴게요.
                <br />
                언제 쉬어가고 싶나요?
              </p>
              <fieldset className="timer-options">
                <legend className="sr-only">집중 시간</legend>
                {[25, 50].map((value) => (
                  <label
                    key={value}
                    className={duration === value ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={value}
                      checked={duration === value}
                      onChange={() => setDuration(value)}
                    />
                    {value}분 뒤
                  </label>
                ))}
              </fieldset>
              <button
                className="button primary full"
                onClick={() => {
                  setRemaining(duration * 60);
                  setDeadline(Date.now() + duration * 60000);
                  setMode(null);
                }}
              >
                <Play size={16} />
                휴식 알림 시작
              </button>
              <p className="fine-print">
                사이트가 열려 있는 동안 알림을 보여드려요. 다른 탭에 있다면
                돌아왔을 때 확인할 수 있어요. 새로고침하면 타이머는 종료돼요.
              </p>
            </Modal>
            <Modal
              open={mode === "rest"}
              onClose={() => setMode(null)}
              title="잠시 쉬어갈 시간이에요."
            >
              <div className="modal-illustration">
                <Coffee size={45} strokeWidth={1.3} />
              </div>
              <p>
                어깨를 내려놓고, 물 한 모금 마셔볼까요?
                <br />
                5분 정도 먼 곳을 바라보며 눈과 마음을 쉬게 해주세요.
              </p>
              <div className="gentle-note">
                잠깐 멈추어도, 지금까지의 노력은 사라지지 않아요.
              </div>
              <button
                className="button primary full"
                onClick={() => setMode(null)}
              >
                좋아요, 잠깐 쉴게요
              </button>
            </Modal>
          </>,
          document.body,
        )}
    </>
  );
}
