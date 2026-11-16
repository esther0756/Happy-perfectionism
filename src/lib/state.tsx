"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { z } from "zod";
import type { Answers } from "@/config/assessment";
import { values } from "@/lib/content";

const taskSchema = z.object({
  id: z.string().max(100),
  title: z.string().max(200),
  priority: z.enum(["high", "medium", "low"]),
  minutes: z.number().int().min(5).max(720),
  delegate: z.string().max(100),
  time: z.string().regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/),
  done: z.boolean(),
});
const daySchema = z.object({
  tasks: z.array(taskSchema).max(100),
  mood: z.string().max(30),
  reflection: z.string().max(3000),
});
const dataSchema = z.object({
  version: z.literal(1),
  values: z.array(z.string().refine((value) => values.includes(value))).max(3),
  energy: z.object({
    easy: z.string().max(2000),
    demanding: z.string().max(2000),
    restoring: z.string().max(2000),
    level: z.number().int().min(1).max(5),
  }),
  practice: z.record(z.string(), z.string().max(3000)),
  days: z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), daySchema),
});

export type Task = z.infer<typeof taskSchema>;
export type Day = z.infer<typeof daySchema>;
export type AppData = z.infer<typeof dataSchema>;
export const emptyDay: Day = { tasks: [], mood: "", reflection: "" };
const initialData: AppData = {
  version: 1,
  values: [],
  energy: { easy: "", demanding: "", restoring: "", level: 3 },
  practice: {},
  days: {},
};
const STORAGE_KEY = "happy-perfectionism:v1";

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
type AppContextValue = {
  data: AppData;
  update: (fn: (data: AppData) => AppData) => void;
  ready: boolean;
  persist: boolean;
  setPersist: (on: boolean) => void;
  storageError: string;
  clear: () => void;
  quiz: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
};
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [ready, setReady] = useState(false);
  const [persist, setPersistence] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // Browser-only hydration is intentional; no user data enters server rendering.
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = dataSchema.safeParse(JSON.parse(saved));
        if (parsed.success) {
          setData(parsed.data); // eslint-disable-line react-hooks/set-state-in-effect
          setPersistence(true);
        } else {
          setStorageError(
            "이전 기록의 형식을 읽을 수 없어요. 새 기록은 이 화면에서 사용할 수 있어요.",
          );
        }
      }
    } catch {
      setStorageError(
        "브라우저 저장소를 사용할 수 없어요. 기록은 이 화면을 열어둔 동안만 유지돼요.",
      );
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !persist) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStorageError(""); // eslint-disable-line react-hooks/set-state-in-effect
    } catch {
      setStorageError(
        "최신 기록을 보관하지 못했어요. 이전에 저장한 기록은 남아 있을 수 있어요. 저장 공간이나 브라우저 설정을 확인해주세요.",
      );
    }
  }, [data, persist, ready]);

  const setPersist = (on: boolean) => {
    try {
      if (on) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      else localStorage.removeItem(STORAGE_KEY);
      setPersistence(on);
      setStorageError("");
    } catch {
      setStorageError(
        "브라우저 저장 설정을 바꾸지 못했어요. 브라우저의 사이트 데이터 설정을 확인해주세요.",
      );
    }
  };
  const clear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setPersistence(false);
      setData(initialData);
      setQuiz(initialQuiz);
      setStorageError("");
    } catch {
      setStorageError(
        "보관된 기록을 삭제하지 못했어요. 브라우저 설정에서 이 사이트의 데이터를 삭제해주세요.",
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        data,
        update: setData,
        ready,
        persist,
        setPersist,
        storageError,
        clear,
        quiz,
        setQuiz,
      }}
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
