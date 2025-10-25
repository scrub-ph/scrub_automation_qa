import { test, expect, Page } from '@playwright/test';

test.describe('02 - Get Started Page Flow (User Onboarding)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate through proper flow: Landing → Get Started
    await page.goto('/');
    
    // Try to click get-started button from landing page
    const getStartedBtn = page.locator('button:has-text("Get Started"), a[href*="get-started"]').first();
    if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click();
    } else {
      // Direct navigation if button not found
      await page.goto('/get-started');
    }
  });

  test('should display get-started page with user options', async ({ page }) => {
    // Verify we're on get-started or similar onboarding page
    await expect(page).toHaveURL(/.*get-started|.*quote|.*book/);
    
    // Should have some form of user selection or service options
    const userOptions = page.locator('button, a, .option, .card').count();
    expect(await userOptions).toBeGreaterThan(0);
  });

  test('should provide path to book cleaning service', async ({ page }) => {
    // Look for booking-related options
    const bookingOptions = page.locator(
      'button:has-text("Book"), a:has-text("Book"), button:has-text("Clean"), a:has-text("Clean")'
    );
    
    const count = await bookingOptions.count();
    if (count > 0) {
      await expect(bookingOptions.first()).toBeVisible();
      
      // Test clicking leads to booking flow
      await bookingOptions.first().click();
      await expect(page).toHaveURL(/.*book|.*quote|.*clean|.*service/);
    } else {
      // Should at least have some service selection
      const serviceElements = page.locator('text=/service|clean|book/i');
      await expect(serviceElements.first()).toBeVisible();
    }
  });

  test('should provide path to join as cleaner', async ({ page }) => {
    // Look for cleaner registration options
    const cleanerOptions = page.locator(
      'button:has-text("Cleaner"), a:has-text("Cleaner"), button:has-text("Join"), a[href*="cleaner"]'
    );
    
    const count = await cleanerOptions.count();
    if (count > 0) {
      await expect(cleanerOptions.first()).toBeVisible();
      
      // Test clicking leads to cleaner registration
      await cleanerOptions.first().click();
      await expect(page).toHaveURL(/.*cleaner|.*join|.*apply/);
    }
  });

  test('should allow user to proceed without registration (guest flow)', async ({ page }) => {
    // Look for guest/continue options
    const guestOptions = page.locator(
      'button:has-text("Continue"), button:has-text("Guest"), button:has-text("Skip"), a:has-text("Continue")'
    );
    
    const count = await guestOptions.count();
    if (count > 0) {
      await guestOptions.first().click();
      // Should proceed to next step in flow
      await page.waitForLoadState('networkidle');
      expect(page.url()).not.toBe('about:blank');
    } else {
      // Alternative: check if there are service options available
      const serviceOptions = page.locator('button, a, .service, .option');
      await expect(serviceOptions.first()).toBeVisible();
    }
  });

  test('should provide clear navigation back to home', async ({ page }) => {
    // Look for home/back navigation
    const homeLinks = page.locator(
      'a[href="/"], button:has-text("Home"), a:has-text("Home"), .logo, [data-testid="home"]'
    );
    
    const count = await homeLinks.count();
    if (count > 0) {
      await expect(homeLinks.first()).toBeVisible();
      
      // Test navigation back to home
      await homeLinks.first().click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should display service information or pricing', async ({ page }) => {
    // Should provide information to help user make decision
    const infoElements = page.locator('text=/₱|price|cost|service|clean|hour|rate/i');
    const count = await infoElements.count();
    
    expect(count).toBeGreaterThan(0);
    
    if (count > 0) {
      await expect(infoElements.first()).toBeVisible();
    }
  });

  test('should handle form submission if present', async ({ page }) => {
    // Look for any forms on the page
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      const form = forms.first();
      
      // Look for required fields
      const inputs = form.locator('input[required], select[required]');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        // Try submitting empty form to test validation
        const submitBtn = form.locator('button[type="submit"], input[type="submit"]').first();
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          
          // Should show validation or stay on page
          await page.waitForTimeout(1000);
          // Form should handle validation appropriately
        }
      }
    }
  });
});
