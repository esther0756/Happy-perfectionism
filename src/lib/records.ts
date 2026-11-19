import { z } from "zod";
import { values } from "@/lib/content";

const taskSchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().max(200),
  priority: z.enum(["high", "medium", "low"]),
  minutes: z.number().int().min(5).max(720),
  delegate: z.string().max(100),
  time: z.string().regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/),
  done: z.boolean(),
});
const daySchema = z.object({
  tasks: z
    .array(taskSchema)
    .max(100)
    .refine(
      (tasks) => new Set(tasks.map((task) => task.id)).size === tasks.length,
    ),
  mood: z.string().max(30),
  reflection: z.string().max(3000),
});
export const dataSchema = z.object({
  version: z.literal(1),
  // Optional on older saved records and backups: existing data remains readable.
  selectedProfile: z.enum(["avoidant", "controlling", "self-critical", "balanced"]).nullable().default(null),
  values: z
    .array(z.string().refine((value) => values.includes(value)))
    .max(3)
    .refine((selected) => new Set(selected).size === selected.length),
  energy: z.object({
    easy: z.string().max(2000),
    demanding: z.string().max(2000),
    restoring: z.string().max(2000),
    level: z.number().int().min(1).max(5),
  }),
  practice: z.record(z.string().max(100), z.string().max(3000)),
  days: z.record(
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((value) => {
        const date = new Date(`${value}T00:00:00Z`);
        return (
          Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value &&
          value >= "2000-01-01" &&
          value <= "2100-12-31"
        );
      }),
    daySchema,
  ),
});

export type Task = z.infer<typeof taskSchema>;
export type Day = z.infer<typeof daySchema>;
export type AppData = z.infer<typeof dataSchema>;
export const emptyDay: Day = { tasks: [], mood: "", reflection: "" };
export function emptyData(): AppData {
  return {
    version: 1,
    selectedProfile: null,
    values: [],
    energy: { easy: "", demanding: "", restoring: "", level: 3 },
    practice: {},
    days: {},
  };
}

// Keep the original key so previously opted-in records can be migrated in place.
export const STORAGE_KEY = "happy-perfectionism:v1";
const storedSchema = z.discriminatedUnion("enabled", [
  z.object({
    storageVersion: z.literal(2),
    enabled: z.literal(true),
    savedAt: z.string().datetime(),
    data: dataSchema,
  }),
  z.object({ storageVersion: z.literal(2), enabled: z.literal(false) }),
]);
export function disabledRecords() {
  return JSON.stringify({
    storageVersion: 2,
    enabled: false,
    revision: crypto.randomUUID(),
  });
}
export function readStoredRecords(raw: string | null) {
  if (raw === null) return { data: emptyData(), persist: true, savedAt: null };
  const value: unknown = JSON.parse(raw);
  const stored = storedSchema.safeParse(value);
  if (stored.success) {
    return stored.data.enabled
      ? { data: stored.data.data, persist: true, savedAt: stored.data.savedAt }
      : { data: emptyData(), persist: false, savedAt: null };
  }
  if (typeof value === "object" && value !== null && "storageVersion" in value)
    throw new Error("지원하지 않는 보관 형식입니다.");
  return { data: dataSchema.parse(value), persist: true, savedAt: null };
}
export function serializeRecords(data: AppData, savedAt: string) {
  return JSON.stringify({ storageVersion: 2, enabled: true, savedAt, data });
}

export const MAX_BACKUP_BYTES = 10 * 1024 * 1024;
const backupSchema = z.object({
  format: z.literal("happy-perfectionism-records"),
  version: z.literal(1),
  exportedAt: z.string().datetime(),
  data: dataSchema,
});
export type RecordBackup = z.infer<typeof backupSchema>;
export function createBackup(data: AppData) {
  return JSON.stringify(
    {
      format: "happy-perfectionism-records",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: dataSchema.parse(data),
    },
    null,
    2,
  );
}
export function readBackup(text: string): RecordBackup {
  try {
    return backupSchema.parse(JSON.parse(text));
  } catch {
    throw new Error(
      "이 사이트에서 만든 올바른 백업 파일인지 확인해주세요. 현재 기록은 바뀌지 않았어요.",
    );
  }
}
