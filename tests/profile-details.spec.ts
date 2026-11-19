import { expect, test } from "@playwright/test";

const cases = [
  { slug: "controlling", name: "감독형", insight: "자신의 기준과 타인의 기준이 다를 수 있다는 사실", exercise: "반드시 필요한 기준과 개인적인 선호를 구분해 보세요." },
  { slug: "self-critical", name: "자책형", insight: "자신의 가치를 끊임없이 증명해야 한다는 부담", exercise: "사실과 자기비판을 구분해 보세요." },
  { slug: "balanced", name: "안정형", insight: "경험을 바탕으로 다음 행동을 조정할 수 있다는 점", exercise: "결과뿐 아니라 과정에서 얻은 것도 기록해 보세요." },
] as const;

for (const example of cases) {
  test(`${example.name} 상세 설명, 유형 보관, 맞춤 실천 연동`, async ({ page }) => {
    await page.goto(`/types/${example.slug}/`);
    await expect(page.getByRole("heading", { name: `${example.name} 완벽주의` })).toBeVisible();
    await expect(page.getByText(example.insight, { exact: false })).toBeVisible();
    await expect(page.getByRole("heading", { name: "일상에서는 어떻게 나타날까요?" })).toBeVisible();
    await expect(page.locator(".detail-situation")).toHaveCount(3);
    await expect(page.locator(".detail-question-list li")).toHaveCount(4);
    await page.getByRole("button", { name: `${example.name} 유형을 기록에 저장하기` }).click();
    await page.goto("/journal/");
    await expect(page.getByLabel("기록용 완벽주의 유형 선택")).toHaveValue(example.slug);
    await expect(page.locator(".journal-exercise")).toHaveCount(3);
    await expect(page.locator(".journal-exercise").first()).toContainText(example.exercise);
    await page.locator(".journal-exercise").first().getByRole("button", { name: "오늘 할 일에 담기" }).click();
    await expect(page.getByLabel("어떤 일을 해볼까요?")).not.toHaveValue("");
    await page.getByRole("button", { name: "오늘에 담기", exact: true }).click();
    await expect(page.locator(".task-row")).toHaveCount(1);
    await page.reload();
    await expect(page.getByLabel("기록용 완벽주의 유형 선택")).toHaveValue(example.slug);
    await expect(page.locator(".journal-exercise")).toHaveCount(3);
  });
}
