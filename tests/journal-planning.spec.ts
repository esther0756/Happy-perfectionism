import { test, expect } from "@playwright/test";
import { dataSchema, emptyData, createBackup, readBackup } from "../src/lib/records";

test("이전 할 일은 에너지 없이 복원되고 1분·에너지 기록도 백업된다", () => {
  const old = { ...emptyData(), days: { "2026-11-25": { tasks: [{ id: "old", title: "이전 기록", priority: "high", minutes: 25, time: "", delegate: "", done: false }], mood: "", reflection: "" } } };
  const data = dataSchema.parse(old);
  expect(data.days["2026-11-25"].tasks[0].energy).toBeNull();
  data.days["2026-11-25"].tasks[0].minutes = 1;
  data.days["2026-11-25"].tasks[0].energy = "high";
  const restored = readBackup(createBackup(data));
  expect(restored.data.days["2026-11-25"].tasks[0]).toMatchObject({ minutes: 1, energy: "high" });
  data.days["2026-11-25"].tasks[0].minutes = 0;
  expect(dataSchema.safeParse(data).success).toBe(false);
});

test("우선순위 안에서 시각 정렬, 1분 입력, 에너지 편집과 자동 저장", async ({ page }) => {
  await page.goto("/journal/");
  async function add(title: string, priority: string, time: string, minutes: string) {
    await page.getByRole("button", { name: "할 일 추가" }).click();
    await page.getByLabel("어떤 일을 해볼까요?").fill(title);
    await page.getByLabel("나에게 맞는 우선순위").selectOption(priority);
    await page.getByLabel("예상 시간 (분)").fill(minutes);
    await page.getByLabel("언제 시작하면 좋을까요?").fill(time);
    await page.getByLabel("필요한 에너지").selectOption("low");
    await page.getByRole("button", { name: "오늘에 담기", exact: true }).click();
  }
  await add("오후 먼저", "high", "14:35", "60");
  await add("시각 미정", "high", "", "1");
  await add("아침 그다음", "medium", "07:05", "2");
  await add("오전 먼저", "high", "09:15", "3");
  await expect(page.locator(".task-title")).toHaveText(["오전 먼저", "오후 먼저", "시각 미정", "아침 그다음"]);
  await expect(page.locator(".planned-duration")).toHaveText("1시간6분");
  await page.getByRole("button", { name: "오후 먼저 수정", exact: true }).click();
  await page.getByLabel("언제 시작하면 좋을까요?").fill("08:25");
  await page.getByLabel("필요한 에너지").selectOption("high");
  await page.getByRole("button", { name: "수정하기", exact: true }).click();
  await page.reload();
  await expect(page.locator(".task-title")).toHaveText(["오후 먼저", "오전 먼저", "시각 미정", "아침 그다음"]);
  await expect(page.locator(".task-row").first()).toContainText("에너지 많이");
  await page.getByLabel("오후 먼저 완료", { exact: true }).check();
  await expect(page.locator(".task-title").first()).toHaveText("오후 먼저");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
