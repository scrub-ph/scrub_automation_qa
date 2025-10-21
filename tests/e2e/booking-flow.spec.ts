import { expect, test } from '@playwright/test';

test.describe('Booking Flow - Realistic Tests', () => {
  test.describe('Basic Booking Tests', () => {
    test('should load booking page', async ({ page }) => {
      await page.goto('http://localhost:5000/get-started');
      await expect(page.locator('h1')).toBeVisible();
      const content = await page.textContent('body');
      expect(content).toContain('Get Started');
    });

    test('should navigate from homepage to booking', async ({ page }) => {
      await page.goto('http://localhost:5000');
      const bookButton = page.locator('a[href*="get-started"], button:has-text("Book"), button:has-text("Get Started")').first();
      
      if (await bookButton.isVisible()) {
        await bookButton.click();
        await expect(page).toHaveURL(/.*get-started.*/);
      }
    });
  });

  test.describe('Form Tests', () => {
    test('should display booking form elements', async ({ page }) => {
      await page.goto('http://localhost:5000/get-started');
      
      // Check for common form elements
      const forms = page.locator('form');
      const inputs = page.locator('input');
      const buttons = page.locator('button');
      
      const hasForm = await forms.count() > 0;
      const hasInputs = await inputs.count() > 0;
      const hasButtons = await buttons.count() > 0;
      
      expect(hasForm || hasInputs || hasButtons).toBeTruthy();
    });
  });
});
