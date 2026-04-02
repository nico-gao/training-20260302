import { expect, test } from "@playwright/test";

function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

test.describe("todo manager e2e", () => {
  test("user can sign up and then log in", async ({ page }) => {
    const email = uniqueEmail("signup-login");

    await page.goto("/");

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("secret123");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText("User created successfully")).toBeVisible();
    await expect(page.getByRole("button", { name: /^log in$/i })).toBeVisible();

    await page.getByRole("button", { name: /^log in$/i }).click();
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("secret123");
    await page.getByRole("button", { name: /^log in$/i }).click();

    await expect(page.getByText("Login successful")).toBeVisible();
    await expect(page.getByText("Your lists")).toBeVisible();
    await expect(page.getByText("No token yet")).not.toBeVisible();
  });

  test("logged-in user can create a list, add a todo, and log out", async ({
    page,
  }) => {
    const email = uniqueEmail("todo-flow");
    const listName = `Weekend ${Date.now()}`;
    const todoName = `Buy snacks ${Date.now()}`;

    await page.goto("/");

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("secret123");
    await page.getByRole("button", { name: "Create account" }).click();

    await page.getByRole("button", { name: /^log in$/i }).click();
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("secret123");
    await page.getByRole("button", { name: /^log in$/i }).click();

    await expect(page.getByText("Your lists")).toBeVisible();

    await page.getByPlaceholder("Create a new list").fill(listName);
    await page.getByRole("button", { name: "Add list" }).click();

    await expect(page.getByRole("heading", { name: listName })).toBeVisible();

    const listCard = page.locator("article", { hasText: listName });

    await listCard.getByPlaceholder(`Add a todo to ${listName}`).fill(todoName);
    await listCard.getByRole("button", { name: "Add todo" }).click();

    await expect(listCard.locator("li", { hasText: todoName })).toBeVisible();
    await expect(page.getByText(`Added todo "${todoName}".`)).toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click();

    await expect(page.getByText("Logged out successfully")).toBeVisible();
    await expect(page.getByText("Your lists")).not.toBeVisible();
    await expect(page.getByText("No token yet")).toBeVisible();
  });
});
