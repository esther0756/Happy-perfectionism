import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { questions, type Answer } from "../src/config/assessment";

const storageKey = "happy-perfectionism:v1";
async function expectStorageDisabled(page: Page) {
  const saved = await page.evaluate(
    (key) => localStorage.getItem(key),
    storageKey,
  );
  expect(JSON.parse(saved!)).toEqual({
    storageVersion: 2,
    enabled: false,
    revision: expect.any(String),
  });
}
async function addTask(page: Page, title: string) {
  await page.getByRole("button", { name: "할 일 추가" }).click();
  await page.getByRole("textbox", { name: "어떤 일을 해볼까요?" }).fill(title);
  await page.getByLabel("예상 시간 (분)").fill("30");
  await page.getByLabel("나에게 맞는 우선순위").selectOption("high");
  await page.getByLabel("누구에게 부탁할 수 있나요?").fill("친구");
  await page.getByLabel("언제 시작하면 좋을까요?").fill("10:00");
  await page.getByRole("button", { name: "오늘에 담기", exact: true }).click();
}

test("섞인 문항의 정확한 결과, 2점 이내 둘째 유형, 응답 수정과 비보관", async ({
  page,
}, testInfo) => {
  test.setTimeout(60000);
  // Source IDs 1–5: 18, 6–10: 11, 11–15: 16, 16–20: 12.
  const responses: Answer[] = [
    4, 4, 4, 3, 3, 2, 2, 3, 2, 2, 3, 3, 4, 3, 3, 2, 2, 3, 3, 2,
  ];
  const answerCurrent = async () => {
    const text = await page.locator("#question-text").innerText();
    const question = questions.find((q) => q.text === text)!;
    await page
      .getByRole("radio", {
        name: new RegExp(`^${responses[question.id - 1]}점`),
      })
      .check();
    return text;
  };
  const errors: string[] = [];
  const transmissions: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      !["GET", "HEAD"].includes(request.method()) ||
      url.searchParams.has("type") ||
      /\/types\/(avoidant|controlling|self-critical|balanced)/.test(
        url.pathname,
      )
    )
      transmissions.push(request.url());
  });
  await page.goto("/privacy/");
  await page.getByLabel("이 브라우저에 활동 기록 보관하기").check();
  await page
    .getByRole("navigation", { name: "주요 메뉴" })
    .getByRole("link", { name: "나의 완벽주의 테스트" })
    .click();
  await page.getByRole("button", { name: "질문 시작하기" }).click();
  await expect(page.getByRole("button", { name: "다음 질문" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "이전 질문" })).toBeDisabled();
  const shown: string[] = [];
  shown.push(await page.locator("#question-text").innerText());
  await page
    .getByRole("radio", { name: "1점, 매우 그렇지 않다", exact: true })
    .check();
  await page.getByRole("button", { name: "다음 질문" }).click();
  await page.getByRole("button", { name: "이전 질문" }).click();
  await expect(
    page.getByRole("radio", { name: "1점, 매우 그렇지 않다", exact: true }),
  ).toBeChecked();
  await answerCurrent();
  await page.getByRole("button", { name: "다음 질문" }).click();
  for (let index = 1; index < 20; index++) {
    shown.push(await answerCurrent());
    if (index < 19)
      await page.getByRole("button", { name: "다음 질문" }).click();
  }
  expect(new Set(shown).size).toBe(20);
  expect(shown).not.toEqual(questions.map((q) => q.text));
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "20",
  );
  await page.getByRole("button", { name: "응답 마치고 확인하기" }).click();
  await expect(page.locator(".result-primary h3")).toHaveText(
    "회피형 완벽주의",
  );
  await expect(page.locator(".result-primary .result-total")).toContainText(
    "18",
  );
  await expect(page.locator(".result-secondary strong")).toHaveText(
    "자책형 완벽주의",
  );
  await expect(page.locator(".result-secondary-score")).toContainText("16");
  await expect(
    page.getByRole("listitem", { name: "감독형 11점", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem", { name: "안정형 12점", exact: true }),
  ).toBeVisible();
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    audit.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`result-${width}.png`),
      fullPage: true,
      animations: "disabled",
    });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const saved = await page.evaluate(
    (key) => localStorage.getItem(key),
    storageKey,
  );
  expect(saved ?? "").not.toContain("answers");
  expect(saved ?? "").not.toContain("order");
  expect(saved ?? "").not.toContain("scores");
  expect(saved ?? "").not.toContain("primary");
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  expect(new URL(page.url()).search).toBe("");
  expect(transmissions).toEqual([]);

  // Change source question 1 from 4 to 2; the previous winner now ties at 16.
  responses[0] = 2;
  await page.getByRole("button", { name: "응답 수정하기" }).click();
  for (let index = 0; index < 20; index++) {
    expect(await answerCurrent()).toBe(shown[index]);
    if (index < 19)
      await page.getByRole("button", { name: "다음 질문" }).click();
  }
  await page.getByRole("button", { name: "응답 마치고 확인하기" }).click();
  await expect(page.locator(".result-primary h3")).toHaveText([
    "회피형 완벽주의",
    "자책형 완벽주의",
  ]);
  await expect(page.locator(".result-secondary")).toHaveCount(0);
  await expect(
    page.getByText("2개 유형이 16점으로 같아요.", { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "질문 시작하기" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("할 일 수정·우선순위·일정·날짜별 회고·보관·전체 삭제", async ({
  page,
}) => {
  const transmissions: string[] = [];
  page.on("request", (request) => {
    const details = decodeURI(request.url()) + (request.postData() ?? "");
    if (
      !["GET", "HEAD"].includes(request.method()) ||
      details.includes("개인기록") ||
      !request.url().startsWith("http://127.0.0.1:3000/")
    )
      transmissions.push(details);
  });
  await page.goto("/journal/");
  await page.getByLabel("이 브라우저에 활동 기록 보관하기").check();
  await addTask(page, "개인기록 첫 문단 쓰기");
  const date = await page.getByLabel("기록 날짜").inputValue();
  await expect(page.getByText("10:00 — 10:30")).toBeVisible();
  await page
    .getByRole("button", { name: "개인기록 첫 문단 쓰기 수정" })
    .click();
  await page.getByLabel("예상 시간 (분)").fill("45");
  await page.getByRole("button", { name: "수정하기", exact: true }).click();
  await expect(page.getByText("10:00 — 10:45")).toBeVisible();
  await page.getByLabel("개인기록 첫 문단 쓰기 완료").check();
  await page
    .getByRole("button", { name: "많이 힘들었어요", exact: true })
    .click();
  await page
    .getByLabel("오늘의 나에게 남기고 싶은 말")
    .fill("개인기록 오늘 애썼어");
  await expect(page.getByText(/내일은 할 일 하나를 줄이거나/)).toBeVisible();
  await page.getByLabel("기록 날짜").fill("2030-01-01");
  await expect(
    page.getByText("가장 작은 일 하나부터 적어볼까요?"),
  ).toBeVisible();
  await page.getByLabel("이전 기록 선택").selectOption(date);
  await expect(page.getByLabel("개인기록 첫 문단 쓰기 완료")).toBeChecked();
  await page.reload();
  await expect(page.getByLabel("오늘의 나에게 남기고 싶은 말")).toHaveValue(
    "개인기록 오늘 애썼어",
  );
  await page
    .getByRole("button", { name: "개인기록 첫 문단 쓰기 삭제" })
    .click();
  await page
    .getByRole("button", { name: "이 할 일 삭제", exact: true })
    .click();
  await expect(
    page.getByText("가장 작은 일 하나부터 적어볼까요?"),
  ).toBeVisible();
  await page.goto("/privacy/");
  await page.getByRole("button", { name: "내 기록 모두 지우기" }).click();
  await page.getByRole("button", { name: "모두 지우기", exact: true }).click();
  await expect(
    page.getByText("이 브라우저의 보관 기록과 현재 응답을 모두 지웠어요."),
  ).toBeVisible();
  await expectStorageDisabled(page);
  expect(transmissions).toEqual([]);
});

test("보관하지 않는 기록은 새로고침으로 초기화된다", async ({ page }) => {
  await page.goto("/journal/");
  await page.getByLabel("이 브라우저에 활동 기록 보관하기").uncheck();
  await addTask(page, "잠깐 남길 메모");
  await expectStorageDisabled(page);
  await page.reload();
  await expect(
    page.getByText("가장 작은 일 하나부터 적어볼까요?"),
  ).toBeVisible();
  await expect(
    page.getByLabel("이 브라우저에 활동 기록 보관하기"),
  ).not.toBeChecked();
});

test("가치 세 개 제한, 에너지 기록 보관 및 보관 해제", async ({ page }) => {
  await page.goto("/about-me/");
  for (const value of ["성장", "건강", "관계"])
    await page.getByRole("button", { name: value, exact: true }).click();
  await expect(
    page.getByRole("button", { name: "안정", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "성장", exact: true }).click();
  await page.getByRole("button", { name: "안정", exact: true }).click();
  await page.getByLabel("에너지가 많이 드는 일").fill("오래 이어지는 회의");
  await page.getByLabel("이 브라우저에 활동 기록 보관하기").check();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "안정", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("에너지가 많이 드는 일")).toHaveValue(
    "오래 이어지는 회의",
  );
  await page.getByLabel("이 브라우저에 활동 기록 보관하기").uncheck();
  await expectStorageDisabled(page);
  await expect(page.getByLabel("에너지가 많이 드는 일")).toHaveValue(
    "오래 이어지는 회의",
  );
  await page.reload();
  await expect(page.getByLabel("에너지가 많이 드는 일")).toHaveValue("");
});

test("유형별 맞춤 연습에서 기록장으로 활동 전달", async ({ page }) => {
  await page.goto("/types/self-critical/");
  await page.getByRole("link", { name: "이 마음을 위한 연습하기" }).click();
  await expect(
    page.getByRole("button", { name: "자책형의 마음" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: "오늘의 할 일에 담기" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "어떤 일을 해볼까요?" }),
  ).toHaveValue("나에게도 다정한 한 문장");
  await page.getByRole("button", { name: "오늘에 담기", exact: true }).click();
  await expect(
    page.getByText("나에게도 다정한 한 문장", { exact: true }),
  ).toBeVisible();
});

test("집중 시간 뒤 휴식 팝업과 즉시 쉬기", async ({ page }) => {
  await page.clock.install();
  await page.goto("/journal/");
  await page.getByRole("button", { name: /쉼도 계획의 일부예요/ }).click();
  await page.getByRole("button", { name: "휴식 알림 시작" }).click();
  await expect(page.getByText("25:00")).toBeVisible();
  await page.clock.fastForward(25 * 60 * 1000);
  await expect(
    page.getByRole("dialog", { name: "잠시 쉬어갈 시간이에요." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "좋아요, 잠깐 쉴게요" }).click();
  await page.getByRole("button", { name: /쉼도 계획의 일부예요/ }).click();
  await page.getByRole("button", { name: "휴식 알림 시작" }).click();
  await page.getByRole("button", { name: "지금 쉬어가기" }).click();
  await expect(
    page.getByRole("dialog", { name: "잠시 쉬어갈 시간이에요." }),
  ).toBeVisible();
});

test("손상된 보관 데이터에서도 활동을 계속하고 삭제할 수 있다", async ({
  page,
}) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, '{"version":1,"values":null}'),
    storageKey,
  );
  await page.goto("/privacy/");
  await expect(page.locator(".storage-notice [role='alert']")).toContainText(
    "이전 기록의 형식을 읽을 수 없어요",
  );
  await page.getByRole("button", { name: "내 기록 모두 지우기" }).click();
  await page.getByRole("button", { name: "모두 지우기", exact: true }).click();
  await expect(page.locator(".storage-notice [role='alert']")).toHaveCount(0);
  await expectStorageDisabled(page);
});

test("저장소를 사용할 수 없어도 메모리에서 기록할 수 있다", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("저장소 사용 불가");
    };
    Storage.prototype.setItem = () => {
      throw new Error("저장소 사용 불가");
    };
  });
  await page.goto("/journal/");
  await expect(page.locator(".storage-notice [role='alert']")).toContainText(
    "브라우저 저장소를 사용할 수 없어요",
  );
  await addTask(page, "현재 화면에서만 남길 기록");
  await expect(page.getByLabel("현재 화면에서만 남길 기록 완료")).toBeVisible();
});

test("모바일 메뉴를 닫아도 휴식 알림이 나타나고 키보드로 메뉴를 닫을 수 있다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.clock.install();
  await page.goto("/");
  await page.getByRole("button", { name: "메뉴 열기" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "메뉴 열기" })).toBeFocused();
  await page.getByRole("button", { name: "메뉴 열기" }).click();
  await page.getByRole("button", { name: /쉼도 계획의 일부예요/ }).click();
  await page.getByRole("button", { name: "휴식 알림 시작" }).click();
  await page.locator(".mobile-menu-close").click();
  await expect(page.getByText("25:00")).toBeVisible();
  await page.clock.fastForward(25 * 60 * 1000);
  await expect(
    page.getByRole("dialog", { name: "잠시 쉬어갈 시간이에요." }),
  ).toBeVisible();
});

test("기본 화면의 색상 대비·폼 이름·키보드 접근성 자동 검사", async ({
  page,
}) => {
  test.setTimeout(60000);
  for (const route of [
    "/",
    "/test/",
    "/types/",
    "/types/balanced/",
    "/practice/",
    "/about-me/",
    "/journal/",
    "/privacy/",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([]);
  }
});

for (const viewport of [
  { name: "휴대폰", width: 390, height: 844 },
  { name: "태블릿", width: 834, height: 1112 },
  { name: "PC", width: 1440, height: 1000 },
]) {
  test(`${viewport.name} 화면에서 페이지 탐색과 가로 넘침 확인`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    for (const route of [
      "/",
      "/test/",
      "/types/",
      "/types/balanced/",
      "/practice/",
      "/about-me/",
      "/journal/",
      "/privacy/",
    ]) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      if (route === "/" || route === "/journal/")
        await page.screenshot({
          path: testInfo.outputPath(
            `${route === "/" ? "home" : "journal"}.png`,
          ),
          fullPage: true,
        });
    }
    if (viewport.width < 720) {
      await page.getByRole("button", { name: "메뉴 열기" }).click();
      await page
        .getByRole("navigation", { name: "주요 메뉴" })
        .getByRole("link", { name: "기록하며 실천하기" })
        .click();
      await expect(
        page.getByRole("heading", { name: "오늘도 나의 속도로." }),
      ).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}
