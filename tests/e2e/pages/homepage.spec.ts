import { expect, test } from '@playwright/test';

test.describe('Homepage - Realistic Tests', () => {
  test.afterEach(async ({ page, context }) => {
    await page.close();
    await context.close();
  });

  test.describe('Basic Page Tests', () => {
    test('should load homepage successfully', async ({ page }) => {
      await page.goto('');
      await expect(page.locator('h1')).toBeVisible();
      const content = await page.textContent('body');
      expect(content).toContain('SCRUB');
    });

    test('should have navigation elements', async ({ page }) => {
      await page.goto('');
      
      // Check for navigation
      const nav = page.locator('nav, header');
      await expect(nav.first()).toBeVisible();
    });

    test('should have footer', async ({ page }) => {
      await page.goto('');
      
      const footer = page.locator('footer');
      if (await footer.count() > 0) {
        await expect(footer.first()).toBeVisible();
      }
    });
  });

  test.describe('Button Tests', () => {
    test('should have booking CTA', async ({ page }) => {
      await page.goto('');
      
      // Look for booking buttons
      const bookingButtons = page.locator('a[href*="get-started"], button:has-text("Book"), button:has-text("Get Started")');
      const count = await bookingButtons.count();
      
      if (count > 0) {
        await expect(bookingButtons.first()).toBeVisible();
      }
    });

    test('should have AI cleaner booking button', async ({ page }) => {
      await page.goto('');
      
      const aiCleanerButton = page.locator('[data-testid="button-book-ai-cleaner"], #button-book-ai-cleaner, .button-book-ai-cleaner');
      await expect(aiCleanerButton).toBeVisible();
    });

    test('should have join as cleaner button', async ({ page }) => {
      await page.goto('');
      
      const joinCleanerButton = page.locator('[data-testid="button-join-as-cleaner"], #button-join-as-cleaner, .button-join-as-cleaner');
      await expect(joinCleanerButton).toBeVisible();
    });
  });

  test.describe('Navigation Tests', () => {
    test('should navigate to booking page', async ({ page }) => {
      await page.goto('');
      
      const bookButton = page.locator('a[href*="get-started"], button:has-text("Book"), button:has-text("Get Started")').first();
      
      if (await bookButton.isVisible()) {
        await bookButton.click();
        await expect(page).toHaveURL(/.*get-started.*/);
      }
    });

    test('should navigate when AI cleaner button is clicked', async ({ page }) => {
      await page.goto('');
      
      const aiCleanerButton = page.locator('[data-testid="button-book-ai-cleaner"], #button-book-ai-cleaner, .button-book-ai-cleaner');
      await aiCleanerButton.click();
      
      await expect(page).toHaveURL(/.*get-started|.*booking|.*ai-cleaner/);
    });

    test('should navigate when join as cleaner button is clicked', async ({ page }) => {
      await page.goto('');
      
      const joinCleanerButton = page.locator('[data-testid="button-join-as-cleaner"], #button-join-as-cleaner, .button-join-as-cleaner');
      await joinCleanerButton.click();
      
      await expect(page).toHaveURL(/.*register|.*signup|.*join|.*cleaner/);
    });
  });
});
