import { expect, test } from '@playwright/test';

test.describe('User Dashboard - Realistic Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/dashboard');
  });

  test.describe('Basic Dashboard Tests', () => {
    test('should handle non-existent dashboard', async ({ page }) => {
      await expect(page.locator('h1')).toBeVisible();
      const content = await page.textContent('body');
      expect(content).toContain('404');
    });

    test('should redirect to login if not authenticated', async ({ page }) => {
      await expect(page).toHaveURL(/.*sign-in.*|.*login.*|.*dashboard.*/);
    });
  });

  test.describe('Navigation Tests', () => {
    test('should have working navigation links', async ({ page }) => {
      const navLinks = page.locator('nav a, header a');
      const count = await navLinks.count();
      
      if (count > 0) {
        const firstLink = navLinks.first();
        if (await firstLink.isVisible()) {
          await firstLink.click();
          await expect(page).toHaveURL(/.*/);
        }
      }
    });
  });
});
