import { test, expect } from "@playwright/test";

test.describe("サインイン", () => {
  test("サインインページが表示される", async ({ page }) => {
    await page.goto("/signin");
    await expect(page.getByRole("heading", { name: "Study Sprint Board" })).toBeVisible();
  });
});
