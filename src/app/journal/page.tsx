"use client";

import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Coffee,
  ListTodo,
  MessageCircleHeart,
  NotebookPen,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useApp, emptyDay, localDate, type Day, type Task } from "@/lib/state";
import { profiles } from "@/lib/content";
import { journalExercises } from "@/lib/expanded-profiles";
import { Modal, PageIntro, StorageNotice } from "@/components/ui";

const priorityLabels = {
  high: "먼저 할 일",
  medium: "그다음",
  low: "여유가 있으면",
};
const priorityOrder = { high: 0, medium: 1, low: 2 };
const blankTask = (): Task => ({
  id: "",
  title: "",
  priority: "medium",
  minutes: 25,
  delegate: "",
  time: "",
  done: false,
});
const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
function timeEnd(task: Task) {
  const end = toMinutes(task.time) + task.minutes;
  return `${String(Math.floor(end / 60) % 24).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}${end >= 1440 ? " (다음 날)" : ""}`;
}

function JournalContent() {
  const { data, update, ready } = useApp();
  const search = useSearchParams();
  const [date, setDate] = useState("");
  const [taskForm, setTaskForm] = useState<Task | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const initialized = useRef(false);
  const practiceSlug = search.get("practice");
  const pendingPractice = useRef<string | null>(null);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setDate(localDate());
    }
  }, []);
  useEffect(() => {
    if (!ready || !practiceSlug || pendingPractice.current === practiceSlug)
      return;
    const p = profiles.find((p) => p.slug === practiceSlug);
    if (p) {
      pendingPractice.current = practiceSlug;
      setTaskForm({ ...blankTask(), title: p.action, minutes: 5 }); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [ready, practiceSlug]);

  const savedProfile = profiles.find((profile) => profile.slug === data.selectedProfile);
  const selectedExercises = data.selectedProfile ? journalExercises[data.selectedProfile] : null;

  const day = data.days[date] ?? emptyDay;
  const updateDay = (fn: (day: Day) => Day) =>
    update((d) => ({
      ...d,
      days: { ...d.days, [date]: fn(d.days[date] ?? emptyDay) },
    }));
  const tasks = [...day.tasks].sort(
    (a, b) =>
      Number(a.done) - Number(b.done) ||
      priorityOrder[a.priority] - priorityOrder[b.priority],
  );
  const scheduled = day.tasks
    .filter((t) => t.time)
    .sort((a, b) => a.time.localeCompare(b.time));
  const overlaps = scheduled.filter((t, i) =>
    scheduled
      .slice(0, i)
      .some(
        (previous) =>
          toMinutes(previous.time) + previous.minutes > toMinutes(t.time),
      ),
  );
  const totalMinutes = day.tasks.reduce((sum, t) => sum + t.minutes, 0);
  const completed = day.tasks.filter((t) => t.done).length;
  const dates = Object.keys(data.days).sort().reverse();
  const saveTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !taskForm ||
      !taskForm.title.trim() ||
      taskForm.minutes < 5 ||
      taskForm.minutes > 720 ||
      !Number.isInteger(taskForm.minutes)
    )
      return;
    if (!taskForm.id && day.tasks.length >= 100) return;
    const task = {
      ...taskForm,
      id: taskForm.id || crypto.randomUUID(),
      title: taskForm.title.trim(),
      delegate: taskForm.delegate.trim(),
    };
    updateDay((d) => ({
      ...d,
      tasks: taskForm.id
        ? d.tasks.map((t) => (t.id === task.id ? task : t))
        : [...d.tasks, task],
    }));
    setFeedback(
      taskForm.id ? "할 일을 수정했어요." : "작은 한 걸음을 담았어요.",
    );
    setTaskForm(null);
  };
  if (!ready || !date)
    return <p className="loading">오늘의 기록장을 펼치고 있어요.</p>;

  return (
    <>
      <div className="journal-top">
        <PageIntro
          eyebrow="매일 조금씩, 나를 위한 실천"
          title="오늘도 나의 속도로."
        >
          <p>
            할 일을 덜어내고, 쉼을 넣고, 마음을 돌아봐요.
            <br />
            완벽한 하루보다 나를 돌보는 하루면 충분해요.
          </p>
        </PageIntro>
        <div className="date-picker">
          <CalendarDays size={17} />
          <label className="sr-only" htmlFor="journal-date">
            기록 날짜
          </label>
          <input
            id="journal-date"
            type="date"
            value={date}
            min="2000-01-01"
            max="2100-12-31"
            onChange={(e) => {
              if (e.target.value && e.target.validity.valid) {
                setDate(e.target.value);
                setFeedback("");
              }
            }}
          />
          <button
            className="button ghost small"
            onClick={() => {
              setDate(localDate());
              setFeedback("");
            }}
          >
            오늘
          </button>
        </div>
      </div>
      <div className="journal-summary">
        <div className="journal-stat">
          <span>오늘의 작은 걸음</span>
          <strong>
            {completed}
            <small>/ {day.tasks.length}개</small>
          </strong>
        </div>
        <div className="journal-stat">
          <span>계획한 시간</span>
          <strong>
            {totalMinutes >= 60
              ? `${Math.floor(totalMinutes / 60)}시간`
              : totalMinutes}
            <small>
              {totalMinutes >= 60 ? `${totalMinutes % 60}분` : "분"}
            </small>
          </strong>
        </div>
        <div className="journal-stat">
          <span>오늘 기억할 것</span>
          <p>
            쉬는 시간도
            <br />
            나를 위한 할 일이에요.
          </p>
        </div>
      </div>
      <section className="panel journal-personalized" aria-labelledby="personalized-title">
        <div className="panel-heading">
          <h2 id="personalized-title"><NotebookPen size={20} aria-hidden="true" /> 나에게 맞는 실천 연습</h2>
          {savedProfile && <span className="badge">{savedProfile.name} 완벽주의</span>}
        </div>
        <p className="panel-description">
          원하는 유형을 선택해 보관하면 일상을 기록할 때 해당 유형에 맞는 실천 방법을 다시 볼 수 있습니다.
          검사 응답과 점수는 저장하지 않습니다.
        </p>
        <label className="field journal-profile-picker">
          <span>기록에서 참고할 완벽주의 유형</span>
          <select
            className="input"
            aria-label="기록용 완벽주의 유형 선택"
            value={data.selectedProfile ?? ""}
            onChange={(event) =>
              update((d) => ({
                ...d,
                selectedProfile: event.target.value
                  ? (event.target.value as typeof d.selectedProfile)
                  : null,
              }))
            }
          >
            <option value="">선택하지 않음</option>
            {profiles.map((profile) => (
              <option key={profile.slug} value={profile.slug}>{profile.name} 완벽주의</option>
            ))}
          </select>
        </label>
        {selectedExercises ? (
          <div className="journal-exercise-list">
            {selectedExercises.map((exercise, index) => (
              <article className="journal-exercise" key={exercise.title}>
                <h3>{index + 1}. {exercise.title}</h3>
                {exercise.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                <p className="journal-exercise-action"><strong>오늘의 실천:</strong> {exercise.action}</p>
                <button
                  className="button secondary small"
                  type="button"
                  disabled={day.tasks.length >= 100}
                  onClick={() => setTaskForm({ ...blankTask(), title: exercise.action, minutes: 10 })}
                >
                  <Plus size={15} aria-hidden="true" /> 오늘 할 일에 담기
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="fine-print">유형을 선택하면 맞춤 실천 방법이 이곳에 표시됩니다.</p>
        )}
      </section>
      <div className="journal-grid">
        <div className="journal-main">
          <section className="panel">
            <div className="panel-heading">
              <h2>
                <ListTodo size={20} />
                지금 해야 할 일
              </h2>
              <button
                className="button primary small"
                disabled={day.tasks.length >= 100}
                onClick={() => setTaskForm(blankTask())}
              >
                <Plus size={16} />할 일 추가
              </button>
            </div>
            <p className="panel-description">
              내 가치, 오늘의 에너지와 현실을 생각하며 순서를 정해보세요.
            </p>
            {data.values.length > 0 && (
              <div className="gentle-note mb-5">
                내가 소중히 여기는 것: {data.values.join(" · ")}
              </div>
            )}
            {!tasks.length ? (
              <div className="empty-state">
                <NotebookPen size={37} strokeWidth={1.2} />
                <h3>가장 작은 일 하나부터 적어볼까요?</h3>
                <p>
                  ‘자료 한 쪽 읽기’도 좋은 시작이에요.
                  <br />
                  모두 해내야 한다는 마음은 잠시 내려놓아요.
                </p>
              </div>
            ) : (
              <ul className="task-list">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`task-row ${task.done ? "done" : ""}`}
                  >
                    <label className="task-check">
                      <input
                        type="checkbox"
                        checked={task.done}
                        aria-label={`${task.title} 완료`}
                        onChange={(e) =>
                          updateDay((d) => ({
                            ...d,
                            tasks: d.tasks.map((t) =>
                              t.id === task.id
                                ? { ...t, done: e.target.checked }
                                : t,
                            ),
                          }))
                        }
                      />
                    </label>
                    <div className="task-body">
                      <p className="task-title">{task.title}</p>
                      <div className="task-meta">
                        <span className={`priority ${task.priority}`}>
                          {priorityLabels[task.priority]}
                        </span>
                        <span>
                          <Clock3 size={11} />
                          {task.minutes}분
                        </span>
                        {task.time && <span>{task.time}</span>}
                        {task.delegate && (
                          <span>
                            <Users size={11} />
                            {task.delegate}에게 부탁
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="task-actions">
                      <button
                        className="icon-button"
                        aria-label={`${task.title} 수정`}
                        onClick={() => setTaskForm({ ...task })}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label={`${task.title} 삭제`}
                        onClick={() => setRemoveId(task.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="fine-print" aria-live="polite">
              {feedback}
            </p>
            {day.tasks.length >= 100 && (
              <p className="fine-print">
                하루에 100개까지 기록할 수 있어요. 필요 없는 일을 덜어내거나
                다른 날짜에 나눠주세요.
              </p>
            )}
          </section>
          <section className="panel reflection-panel">
            <div className="panel-heading">
              <h2>
                <MessageCircleHeart size={21} />
                하루 끝, 나에게 안부 묻기
              </h2>
              <span className="badge">결과보다 과정</span>
            </div>
            <p className="panel-description">오늘 하루의 나는 어땠나요?</p>
            <div className="reflection-moods" aria-label="오늘의 마음">
              {[
                "편안했어요",
                "뿌듯했어요",
                "그저 그랬어요",
                "조금 지쳤어요",
                "많이 힘들었어요",
              ].map((mood) => (
                <button
                  className="chip"
                  aria-pressed={day.mood === mood}
                  key={mood}
                  onClick={() =>
                    updateDay((d) => ({
                      ...d,
                      mood: d.mood === mood ? "" : mood,
                    }))
                  }
                >
                  {mood}
                </button>
              ))}
            </div>
            <label className="field">
              <span>오늘의 나에게 남기고 싶은 말</span>
              <textarea
                className="input"
                maxLength={3000}
                placeholder="작게 해낸 일, 힘들었던 순간, 내일의 나를 위해 덜어낼 일은 무엇인가요?"
                value={day.reflection}
                onChange={(e) =>
                  updateDay((d) => ({ ...d, reflection: e.target.value }))
                }
              />
            </label>
            <div className="gentle-note">
              {["조금 지쳤어요", "많이 힘들었어요"].includes(day.mood)
                ? "오늘 많이 애썼어요. 내일은 할 일 하나를 줄이거나, 믿을 만한 사람에게 도움을 부탁해보면 어떨까요? 혼자 다 하지 않아도 괜찮아요."
                : "오늘의 결과와 상관없이, 나를 돌아본 이 시간이 소중해요. 내일도 나의 속도로 이어가요."}
            </div>
            <p className="fine-print mt-4">
              날짜를 바꾸면 그날의 계획과 회고를 다시 볼 수 있어요.
            </p>
          </section>
        </div>
        <aside className="journal-aside">
          <section className="panel">
            <div className="panel-heading">
              <h2>
                <CalendarDays size={20} />
                하루에 배치하기
              </h2>
            </div>
            <p className="panel-description">
              할 일을 추가하거나 수정할 때 시작 시간을 정할 수 있어요.
            </p>
            {scheduled.length ? (
              <div className="schedule-list">
                {scheduled.map((task) => (
                  <div key={task.id} className="schedule-item">
                    <time>
                      {task.time} — {timeEnd(task)}
                    </time>
                    <p>
                      {task.done && <Check size={12} className="inline mr-1" />}
                      {task.title}
                    </p>
                    {task.delegate && (
                      <small>{task.delegate}에게 부탁할 일</small>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="fine-print py-4">
                아직 시간을 정한 일이 없어요.
                <br />
                수업과 약속 사이, 가능한 때를 골라봐요.
              </p>
            )}
            {overlaps.length > 0 && (
              <div className="gentle-note mb-4">
                시간이 겹치는 일이 있어요. 예상 시간을 줄이거나 시작 시간을
                옮겨보세요.
              </div>
            )}
            <div className="schedule-rest">
              <Coffee size={16} />
              일과 일 사이에 5~10분의 여유
            </div>
            <p className="fine-print mt-3">
              메뉴의 ‘쉼도 계획의 일부예요’에서 휴식 알림을 켤 수 있어요.
            </p>
          </section>
          <section className="panel">
            <span className="eyebrow">혼자 다 하지 않아도 괜찮아요</span>
            <h2 className="!text-base">누구와 나눌 수 있을까요?</h2>
            <p className="panel-description">
              도움을 요청하는 것도 나를 돌보는 능력이에요. 할 일에 부탁할 사람을
              적어보세요.
            </p>
            {day.tasks
              .filter((t) => t.delegate)
              .map((t) => (
                <div key={t.id} className="response-item">
                  <span>{t.title}</span>
                  <span>{t.delegate}</span>
                </div>
              ))}
            <Link href="/about-me" className="text-link">
              내 에너지 다시 살펴보기 <ArrowRight size={14} />
            </Link>
          </section>
          {dates.length > 0 && (
            <section className="panel">
              <label className="field">
                <span>다른 날의 기록 돌아보기</span>
                <select
                  className="input"
                  aria-label="이전 기록 선택"
                  value={data.days[date] ? date : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      setDate(e.target.value);
                      setFeedback("");
                    }
                  }}
                >
                  <option value="" disabled>
                    기록한 날짜 선택
                  </option>
                  {dates.map((d) => (
                    <option key={d} value={d}>
                      {d} · {data.days[d].tasks.length}개의 할 일
                    </option>
                  ))}
                </select>
              </label>
            </section>
          )}
        </aside>
      </div>
      <StorageNotice />
      <Modal
        open={taskForm !== null}
        onClose={() => setTaskForm(null)}
        title={
          taskForm?.id ? "내 계획을 조금 다듬어요." : "작은 할 일을 담아볼까요?"
        }
      >
        {taskForm && (
          <form className="task-form" onSubmit={saveTask}>
            <label className="field">
              <span>어떤 일을 해볼까요?</span>
              <input
                className="input"
                name="title"
                autoFocus
                required
                maxLength={200}
                value={taskForm.title}
                placeholder="예: 보고서 첫 문단 쓰기"
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
              />
            </label>
            <div className="form-grid">
              <label className="field">
                <span>나에게 맞는 우선순위</span>
                <select
                  className="input"
                  value={taskForm.priority}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      priority: e.target.value as Task["priority"],
                    })
                  }
                >
                  {Object.entries(priorityLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>예상 시간 (분)</span>
                <input
                  className="input"
                  type="number"
                  min={5}
                  max={720}
                  step={1}
                  required
                  value={taskForm.minutes || ""}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      minutes: Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <label className="field">
              <span>
                누구에게 부탁할 수 있나요?{" "}
                <small className="field-hint">선택</small>
              </span>
              <input
                className="input"
                maxLength={100}
                placeholder="예: 팀원, 친구 — 별명만 적어도 좋아요"
                value={taskForm.delegate}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, delegate: e.target.value })
                }
              />
            </label>
            <label className="field">
              <span>
                언제 시작하면 좋을까요?{" "}
                <small className="field-hint">선택</small>
              </span>
              <input
                className="input"
                type="time"
                value={taskForm.time}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, time: e.target.value })
                }
              />
            </label>
            <p className="fine-print">
              쉬는 시간과 이동 시간을 남겨두세요. 계획은 언제든 바꿀 수 있어요.
            </p>
            <div className="button-row">
              <button
                className="button secondary"
                type="button"
                onClick={() => setTaskForm(null)}
              >
                다음에 할게요
              </button>
              <button
                className="button primary"
                type="submit"
                disabled={!taskForm.title.trim()}
              >
                {taskForm.id ? "수정하기" : "오늘에 담기"}
                <Check size={16} />
              </button>
            </div>
          </form>
        )}
      </Modal>
      <Modal
        open={removeId !== null}
        onClose={() => setRemoveId(null)}
        title="이 일을 계획에서 덜어낼까요?"
      >
        <p>계획을 가볍게 바꾸어도 괜찮아요. 선택한 할 일만 지워집니다.</p>
        <div className="button-row">
          <button
            className="button secondary"
            onClick={() => setRemoveId(null)}
          >
            그대로 둘게요
          </button>
          <button
            className="button danger-button"
            onClick={() => {
              updateDay((d) => ({
                ...d,
                tasks: d.tasks.filter((t) => t.id !== removeId),
              }));
              setRemoveId(null);
              setFeedback("할 일을 덜어냈어요.");
            }}
          >
            이 할 일 삭제
          </button>
        </div>
      </Modal>
    </>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={<p className="loading">기록장을 준비하고 있어요.</p>}>
      <JournalContent />
    </Suspense>
  );
}
