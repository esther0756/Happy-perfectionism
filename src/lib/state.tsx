"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Answers } from "@/config/assessment";
import {
  dataSchema,
  disabledRecords,
  emptyData,
  readStoredRecords,
  serializeRecords,
  STORAGE_KEY,
  type AppData,
} from "@/lib/records";

export { emptyDay } from "@/lib/records";
export type { AppData, Day, Task } from "@/lib/records";

type Quiz = {
  order: number[];
  answers: Answers;
  index: number;
  completed: boolean;
};
const initialQuiz: Quiz = {
  order: [],
  answers: {},
  index: 0,
  completed: false,
};
type RecordState = {
  data: AppData;
  ready: boolean;
  persist: boolean;
  savedAt: string | null;
  storageError: string;
};
type AppContextValue = RecordState & {
  update: (fn: (data: AppData) => AppData) => void;
  setPersist: (on: boolean) => boolean;
  clear: () => boolean;
  restore: (data: AppData) => void;
  quiz: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
};
const AppContext = createContext<AppContextValue | null>(null);
const unreadableMessage =
  "이전 기록의 형식을 읽을 수 없어요. 원본은 덮어쓰지 않았으며, 새 기록은 이 화면에서 사용할 수 있어요. 백업 파일을 불러오거나 아래에서 기록을 지운 뒤 다시 시작할 수 있어요.";
const unavailableMessage =
  "브라우저 저장소를 사용할 수 없어요. 작성한 내용은 현재 화면에 있어요. 파일로 백업하거나 브라우저 설정을 확인해주세요.";
const saveFailedMessage =
  "최신 기록을 저장하지 못했어요. 작성한 내용은 현재 화면에 있고, 이전 저장본은 남아 있을 수 있어요. 파일로 백업하거나 저장 공간을 확인한 뒤 다시 저장해주세요.";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RecordState>({
    data: emptyData(),
    ready: false,
    persist: false,
    savedAt: null,
    storageError: "",
  });
  const current = useRef(state);
  const lastRaw = useRef<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz);

  const publish = (next: RecordState) => {
    current.current = next;
    setState(next);
  };

  useEffect(() => {
    const load = (initial: boolean) => {
      let raw: string | null;
      try {
        raw = localStorage.getItem(STORAGE_KEY);
      } catch {
        const next = {
          ...current.current,
          ready: true,
          storageError: unavailableMessage,
        };
        current.current = next;
        setState(next);
        return;
      }
      if (!initial && raw === lastRaw.current) return;
      lastRaw.current = raw;
      try {
        const saved = readStoredRecords(raw);
        const next = {
          ...saved,
          persist: !initial && raw === null ? false : saved.persist,
          ready: true,
          storageError: "",
        };
        current.current = next;
        setState(next);
      } catch {
        const next = {
          ...current.current,
          ready: true,
          persist: false,
          storageError: unreadableMessage,
        };
        current.current = next;
        setState(next);
      }
    };
    load(true);
    const changed = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) load(false);
    };
    const focus = () => load(false);
    window.addEventListener("storage", changed);
    window.addEventListener("focus", focus);
    return () => {
      window.removeEventListener("storage", changed);
      window.removeEventListener("focus", focus);
    };
  }, []);

  const save = (next: RecordState): boolean => {
    try {
      const savedAt = new Date().toISOString();
      const raw = serializeRecords(next.data, savedAt);
      localStorage.setItem(STORAGE_KEY, raw);
      lastRaw.current = raw;
      publish({ ...next, persist: true, savedAt, storageError: "" });
      return true;
    } catch {
      publish({ ...next, storageError: saveFailedMessage });
      return false;
    }
  };

  const update = (fn: (data: AppData) => AppData) => {
    if (!current.current.ready) return;
    let next = current.current;
    let readable = true;
    // Merge a field edit with the latest records, even before a storage event arrives.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== lastRaw.current) {
        lastRaw.current = raw;
        try {
          const saved = readStoredRecords(raw);
          next = {
            ...saved,
            persist: raw === null ? false : saved.persist,
            ready: true,
            storageError: "",
          };
        } catch {
          next = { ...next, persist: false, storageError: unreadableMessage };
        }
      }
    } catch {
      readable = false;
      next = { ...next, storageError: unavailableMessage };
    }
    const edited = dataSchema.safeParse(fn(next.data));
    if (!edited.success) {
      publish({
        ...next,
        storageError:
          "선택 개수나 입력 범위를 벗어난 변경은 저장하지 않았어요. 기존 기록은 보존했으니 내용을 확인하고 다시 입력해주세요.",
      });
      return;
    }
    next = { ...next, data: edited.data };
    // Persist with the edit so closing the page needs no delayed flush.
    if (next.persist && readable) save(next);
    else publish(next);
  };

  const setPersist = (on: boolean) => {
    if (!current.current.ready) return false;
    if (on) return save(current.current);
    try {
      // One atomic write removes personal records and remembers the opt-out.
      const raw = disabledRecords();
      localStorage.setItem(STORAGE_KEY, raw);
      lastRaw.current = raw;
      publish({
        ...current.current,
        persist: false,
        savedAt: null,
        storageError: "",
      });
      return true;
    } catch {
      publish({
        ...current.current,
        storageError:
          "저장 설정을 바꾸지 못했어요. 기존 보관 기록은 남아 있을 수 있으니 브라우저 설정을 확인해주세요.",
      });
      return false;
    }
  };
  const clear = () => {
    if (!current.current.ready) return false;
    try {
      const raw = disabledRecords();
      localStorage.setItem(STORAGE_KEY, raw);
      lastRaw.current = raw;
      publish({
        data: emptyData(),
        ready: true,
        persist: false,
        savedAt: null,
        storageError: "",
      });
      setQuiz(initialQuiz);
      return true;
    } catch {
      publish({
        ...current.current,
        storageError:
          "보관된 기록을 삭제하지 못했어요. 브라우저 설정에서 이 사이트의 데이터를 삭제해주세요.",
      });
      return false;
    }
  };
  const restore = (data: AppData) => {
    if (!current.current.ready) return;
    const next = { ...current.current, data: dataSchema.parse(data) };
    if (next.persist) save(next);
    else publish(next);
  };

  return (
    <AppContext.Provider
      value={{ ...state, update, setPersist, clear, restore, quiz, setQuiz }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppProvider가 필요합니다.");
  return context;
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
