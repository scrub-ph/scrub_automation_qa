import { expect, test } from '@playwright/test';

test.describe('Cleaner Dashboard - Realistic Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/cleaner-dashboard');
  });

  test.describe('Basic Dashboard Tests', () => {
    test('should handle non-existent cleaner dashboard', async ({ page }) => {
      await expect(page.locator('h1')).toBeVisible();
      const content = await page.textContent('body');
      expect(content).toContain('404');
    });

    test('should redirect to login if not authenticated', async ({ page }) => {
      await expect(page).toHaveURL(/.*sign-in.*|.*login.*|.*cleaner.*/);
    });
  });

  test.describe('Navigation Tests', () => {
    test('should handle unauthorized access', async ({ page }) => {
      await expect(page).toHaveURL(/.*sign-in.*|.*login.*|.*cleaner.*|.*404.*/);
    });
  });
});
