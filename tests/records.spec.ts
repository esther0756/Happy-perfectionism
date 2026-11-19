import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import {
  createBackup,
  emptyData,
  readBackup,
  readStoredRecords,
  STORAGE_KEY,
} from "../src/lib/records";

const toggle = "이 브라우저에 활동 기록 보관하기";
async function stored(page: Page) {
  return JSON.parse(
    (await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY))!,
  );
}
async function downloadBackup(page: Page) {
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "백업 파일 내려받기" }).click();
  const download = await downloading;
  const text = await readFile((await download.path())!, "utf8");
  return { text, backup: readBackup(text) };
}

test("기본 자동 저장은 새로고침·새 탭에서도 유지되고 다른 브라우저와 분리된다", async ({
  page,
  browser,
}) => {
  await page.goto("/about-me/");
  await expect(page.getByLabel(toggle)).toBeChecked();
  await page.getByRole("button", { name: "건강", exact: true }).click();
  await page.getByLabel("비교적 편하게 하는 일").fill("조용히 자료 읽기");
  await page.goto("/practice/?type=avoidant");
  await page
    .getByPlaceholder("그때의 상황과 마음을 편하게 적어주세요.")
    .fill("시작 전에 오래 망설였어요");
  await page.goto("/journal/");
  await page.getByRole("button", { name: "할 일 추가" }).click();
  await page.getByLabel("어떤 일을 해볼까요?").fill("파일 열고 제목 쓰기");
  await page.getByRole("button", { name: "오늘에 담기", exact: true }).click();
  await page
    .getByLabel("오늘의 나에게 남기고 싶은 말")
    .fill("작게라도 시작한 하루");
  await expect(page.locator(".save-status")).toContainText("자동 저장됨");
  await page.reload();
  await expect(page.getByLabel("오늘의 나에게 남기고 싶은 말")).toHaveValue(
    "작게라도 시작한 하루",
  );
  await expect(page.getByLabel("파일 열고 제목 쓰기 완료")).toBeVisible();
  const saved = await stored(page);
  expect(saved.data.values).toEqual(["건강"]);
  expect(saved.data.energy.easy).toBe("조용히 자료 읽기");
  expect(saved.data.practice["avoidant:experience"]).toBe(
    "시작 전에 오래 망설였어요",
  );
  expect(saved.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  const anotherTab = await page.context().newPage();
  await anotherTab.goto("/about-me/");
  await expect(anotherTab.getByLabel("비교적 편하게 하는 일")).toHaveValue(
    "조용히 자료 읽기",
  );
  await anotherTab.close();
  const separate = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  try {
    const otherUser = await separate.newPage();
    await otherUser.goto("/about-me/");
    await expect(otherUser.getByLabel("비교적 편하게 하는 일")).toHaveValue("");
    await expect(
      otherUser.getByRole("button", { name: "건강", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
  } finally {
    await separate.close();
  }
});

test("실제 백업 다운로드·확인 후 복원·취소·잘못된 파일 보호", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (
      !["GET", "HEAD"].includes(request.method()) ||
      decodeURI(request.url()).includes("백업기록")
    )
      requests.push(request.url());
  });
  await page.goto("/about-me/");
  await page.getByLabel("비교적 편하게 하는 일").fill("백업기록 원래 메모");
  await page.locator(".save-status").click();
  const { text, backup } = await downloadBackup(page);
  expect(backup.data.energy.easy).toBe("백업기록 원래 메모");
  expect(text).not.toContain("answers");
  expect(text).not.toContain("scores");
  await page.goto("/about-me/");
  await page.getByLabel("비교적 편하게 하는 일").fill("복원 전 현재 메모");
  await page.locator(".save-status").click();
  const file = {
    name: "내-기록.json",
    mimeType: "application/json",
    buffer: Buffer.from(text),
  };
  await page.locator('input[type="file"]').setInputFiles(file);
  const modal = page.getByRole("dialog", { name: "백업 기록을 불러올까요?" });
  await expect(modal).toBeVisible();
  expect((await stored(page)).data.energy.easy).toBe("복원 전 현재 메모");
  await modal.getByRole("button", { name: "돌아가기" }).click();
  expect((await stored(page)).data.energy.easy).toBe("복원 전 현재 메모");
  await page.locator('input[type="file"]').setInputFiles(file);
  await modal.getByRole("button", { name: "이 기록으로 불러오기" }).click();
  expect((await stored(page)).data.energy.easy).toBe("백업기록 원래 메모");
  const before = await page.evaluate(
    (key) => localStorage.getItem(key),
    STORAGE_KEY,
  );
  for (const buffer of [
    Buffer.from("깨진 파일"),
    Buffer.from(JSON.stringify({ ...backup, version: 99 })),
    Buffer.alloc(10 * 1024 * 1024 + 1),
  ]) {
    await page.locator('input[type="file"]').setInputFiles({ ...file, buffer });
    await expect(
      page
        .getByRole("region", { name: "내 기록 백업·복원" })
        .getByRole("alert"),
    ).toContainText("현재 기록은 바뀌지 않았어요");
    expect(
      await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY),
    ).toBe(before);
    await expect(modal).not.toBeVisible();
  }
  await page.goto("/about-me/");
  await expect(page.getByLabel("비교적 편하게 하는 일")).toHaveValue(
    "백업기록 원래 메모",
  );
  expect(requests).toEqual([]);
});

test("기존 v1 기록을 보존하고 다음 편집부터 새 저장 형식으로 옮긴다", async ({
  page,
}) => {
  const legacy = emptyData();
  legacy.values = ["성장"];
  legacy.energy.easy = "예전에 남긴 메모";
  await page.addInitScript(
    ({ key, value }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, value);
    },
    { key: STORAGE_KEY, value: JSON.stringify(legacy) },
  );
  await page.goto("/about-me/");
  await expect(page.getByLabel(toggle)).toBeChecked();
  await expect(page.getByLabel("비교적 편하게 하는 일")).toHaveValue(
    "예전에 남긴 메모",
  );
  await page.getByLabel("에너지가 많이 드는 일").fill("새로운 메모");
  expect(await stored(page)).toMatchObject({
    storageVersion: 2,
    enabled: true,
    data: {
      values: ["성장"],
      energy: { easy: "예전에 남긴 메모", demanding: "새로운 메모" },
    },
  });
  await page.reload();
  await expect(page.getByLabel("에너지가 많이 드는 일")).toHaveValue(
    "새로운 메모",
  );
});

test("저장 용량 오류에서도 최신 메모를 백업하고 재시도할 수 있다", async ({
  page,
}) => {
  await page.goto("/about-me/");
  await page.getByLabel("비교적 편하게 하는 일").fill("이전 저장본");
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    (window as unknown as { restoreStorage: () => void }).restoreStorage =
      () => {
        Storage.prototype.setItem = original;
      };
    Storage.prototype.setItem = () => {
      throw new DOMException("full", "QuotaExceededError");
    };
  });
  await page
    .getByLabel("비교적 편하게 하는 일")
    .fill("아직 저장되지 않은 최신 메모");
  await expect(page.locator(".save-status")).toContainText("저장 확인 필요");
  await expect(page.locator(".storage-notice [role='alert']")).toContainText(
    "최신 기록을 저장하지 못했어요",
  );
  expect((await stored(page)).data.energy.easy).toBe("이전 저장본");
  await page.locator(".save-status").click();
  const { backup } = await downloadBackup(page);
  expect(backup.data.energy.easy).toBe("아직 저장되지 않은 최신 메모");
  await page.evaluate(() =>
    (window as unknown as { restoreStorage: () => void }).restoreStorage(),
  );
  await page.getByRole("button", { name: "다시 저장하기" }).click();
  await expect(page.locator(".save-status")).toContainText("자동 저장됨");
  await page.goto("/about-me/");
  await expect(page.getByLabel("비교적 편하게 하는 일")).toHaveValue(
    "아직 저장되지 않은 최신 메모",
  );
});

test("다른 탭의 편집·보관 해제·삭제를 반영하고 삭제한 기록을 되살리지 않는다", async ({
  page,
}) => {
  await page.goto("/about-me/");
  const other = await page.context().newPage();
  await other.goto("/about-me/");
  await page.getByLabel("비교적 편하게 하는 일").fill("첫 탭의 메모");
  await expect(other.getByLabel("비교적 편하게 하는 일")).toHaveValue(
    "첫 탭의 메모",
  );
  await other.getByLabel("에너지가 많이 드는 일").fill("두 번째 탭의 메모");
  await expect(page.getByLabel("에너지가 많이 드는 일")).toHaveValue(
    "두 번째 탭의 메모",
  );
  await expect(page.getByLabel("비교적 편하게 하는 일")).toHaveValue(
    "첫 탭의 메모",
  );
  await page.getByLabel(toggle).uncheck();
  await expect(other.getByLabel(toggle)).not.toBeChecked();
  await expect(other.getByLabel("비교적 편하게 하는 일")).toHaveValue("");
  await other
    .getByLabel("비교적 편하게 하는 일")
    .fill("저장하지 않은 다른 탭의 메모");
  await page.locator(".save-status").click();
  await page.getByRole("button", { name: "내 기록 모두 지우기" }).click();
  await page.getByRole("button", { name: "모두 지우기", exact: true }).click();
  await expect(other.getByLabel("비교적 편하게 하는 일")).toHaveValue("");
  await other.getByLabel("비교적 편하게 하는 일").fill("삭제 후 임시 메모");
  expect(await stored(other)).not.toHaveProperty("data");
  await other.reload();
  await expect(other.getByLabel("비교적 편하게 하는 일")).toHaveValue("");
  await expect(other.getByLabel(toggle)).not.toBeChecked();
  await other.close();
});

test("삭제 실패를 성공으로 표시하지 않고 기존 기록을 보존한다", async ({
  page,
}) => {
  await page.goto("/about-me/");
  await page.getByLabel("비교적 편하게 하는 일").fill("보존할 기록");
  await page.locator(".save-status").click();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await page.getByRole("button", { name: "내 기록 모두 지우기" }).click();
  await page.getByRole("button", { name: "모두 지우기", exact: true }).click();
  await expect(page.locator(".storage-notice [role='alert']")).toContainText(
    "삭제하지 못했어요",
  );
  await expect(
    page.getByText("이 브라우저의 보관 기록과 현재 응답을 모두 지웠어요."),
  ).not.toBeVisible();
  expect((await stored(page)).data.energy.easy).toBe("보존할 기록");
});

test("화면보다 최신인 기록에 편집 제한을 적용해 저장본이 손상되지 않는다", async ({
  page,
}) => {
  await page.goto("/about-me/");
  for (const value of ["건강", "관계"])
    await page.getByRole("button", { name: value, exact: true }).click();
  await page.evaluate((key) => {
    const latest = JSON.parse(localStorage.getItem(key)!);
    latest.data.values.push("성장");
    localStorage.setItem(key, JSON.stringify(latest));
  }, STORAGE_KEY);
  await page.getByRole("button", { name: "안정", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "안정", exact: true }),
  ).toBeDisabled();
  expect((await stored(page)).data.values).toEqual(["건강", "관계", "성장"]);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "성장", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".storage-notice [role='alert']")).toHaveCount(0);
});

test("잘못된 백업과 미래 저장 버전을 거부하고 검사 정보는 백업에서 제외한다", () => {
  const original = emptyData();
  const valid = JSON.parse(createBackup(original));
  expect(readBackup(JSON.stringify(valid)).data).toEqual(original);
  const invalid = [
    { ...original, values: ["성장", "성장"] },
    { ...original, energy: { ...original.energy, level: 99 } },
    {
      ...original,
      days: { "2026-02-31": { tasks: [], mood: "", reflection: "" } },
    },
    { ...original, practice: { "avoidant:experience": "x".repeat(3001) } },
  ];
  for (const data of invalid)
    expect(() => readBackup(JSON.stringify({ ...valid, data }))).toThrow(
      "현재 기록은 바뀌지 않았어요",
    );
  expect(() =>
    readStoredRecords(JSON.stringify({ storageVersion: 99, ...original })),
  ).toThrow();
  expect(
    createBackup({
      ...original,
      answers: { 1: 4 },
      scores: [20],
    } as typeof original),
  ).not.toContain("answers");
});
