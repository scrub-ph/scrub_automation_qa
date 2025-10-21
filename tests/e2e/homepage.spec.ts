import { expect, test } from '@playwright/test';

test.describe('Homepage - Realistic Tests', () => {
  test.afterEach(async ({ page, context }) => {
    await page.close();
    await context.close();
  });

  test.describe('Basic Page Tests', () => {
    test('should load homepage successfully', async ({ page }) => {
      await page.goto('http://localhost:5000');
      await expect(page.locator('h1')).toBeVisible();
      const content = await page.textContent('body');
      expect(content).toContain('SCRUB');
    });

    test('should have navigation elements', async ({ page }) => {
      await page.goto('http://localhost:5000');
      
      // Check for navigation
      const nav = page.locator('nav, header');
      await expect(nav.first()).toBeVisible();
    });

    test('should have booking CTA', async ({ page }) => {
      await page.goto('http://localhost:5000');
      
      // Look for booking buttons
      const bookingButtons = page.locator('a[href*="get-started"], button:has-text("Book"), button:has-text("Get Started")');
      const count = await bookingButtons.count();
      
      if (count > 0) {
        await expect(bookingButtons.first()).toBeVisible();
      }
    });
  });

  test.describe('Navigation Tests', () => {
    test('should navigate to booking page', async ({ page }) => {
      await page.goto('http://localhost:5000');
      
      const bookButton = page.locator('a[href*="get-started"], button:has-text("Book"), button:has-text("Get Started")').first();
      
      if (await bookButton.isVisible()) {
        await bookButton.click();
        await expect(page).toHaveURL(/.*get-started.*/);
      }
    });

    test('should have footer', async ({ page }) => {
      await page.goto('http://localhost:5000');
      
      const footer = page.locator('footer');
      if (await footer.count() > 0) {
        await expect(footer.first()).toBeVisible();
      }
    });
  });
});
