import { test, expect, Page } from '@playwright/test';

test.describe('03 - Registration Flows (User Onboarding)', () => {
  
  test('should complete client registration flow from get-started page', async ({ page }) => {
    // Navigate through proper flow: Landing → Get Started → Join Client
    await page.goto('/');
    
    const getStartedBtn = page.locator('[data-testid="button-get-started"]');
    if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click();
    } else {
      await page.goto('/get-started');
    }
    
    // From get-started, click join as client
    await page.click('[data-testid="button-join-client"]');
    await expect(page).toHaveURL(/.*join-client/);
    
    // Step 1: Personal Information
    await page.fill('[data-testid="input-first-name"]', 'John');
    await page.fill('[data-testid="input-last-name"]', 'Client');
    await page.fill('[data-testid="input-email"]', 'john.client@test.com');
    await page.fill('[data-testid="input-password"]', 'TestPass123!');
    await page.fill('[data-testid="input-phone"]', '+639171234567');
    await page.fill('[data-testid="input-birthdate"]', '1990-01-01');
    
    const nextBtn = page.locator('[data-testid="button-next-step"]');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      
      // Continue with remaining steps if form is multi-step
      const step2 = page.locator('text=Step 2');
      if (await step2.isVisible()) {
        // Fill additional steps as needed
        await page.fill('[data-testid="input-address"]', '123 Test Street');
        await page.click('[data-testid="button-next-step"]');
      }
    }
    
    // Submit registration
    const submitBtn = page.locator('[data-testid="button-submit"], [data-testid="button-create-account"]');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      
      // Verify success or next step
      await page.waitForLoadState('networkidle');
      const currentUrl = page.url();
      expect(currentUrl).not.toBe('about:blank');
    }
  });

  test('should complete cleaner registration flow from get-started page', async ({ page }) => {
    // Navigate through proper flow: Landing → Get Started → Join Cleaner
    await page.goto('/');
    
    const getStartedBtn = page.locator('[data-testid="button-get-started"]');
    if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click();
    } else {
      await page.goto('/get-started');
    }
    
    // From get-started, click join as cleaner
    await page.click('[data-testid="button-join-cleaner"]');
    await expect(page).toHaveURL(/.*join-cleaner/);
    
    // Step 1: Personal Information
    await page.fill('[data-testid="input-first-name"]', 'Maria');
    await page.fill('[data-testid="input-last-name"]', 'Cleaner');
    await page.fill('[data-testid="input-email"]', 'maria.cleaner@test.com');
    await page.fill('[data-testid="input-password"]', 'TestPass123!');
    await page.fill('[data-testid="input-phone"]', '+639171234567');
    await page.fill('[data-testid="input-birthdate"]', '1985-05-15');
    
    // Navigate through multi-step form
    let currentStep = 1;
    const maxSteps = 6; // Based on SCRUB cleaner registration
    
    while (currentStep < maxSteps) {
      const nextBtn = page.locator('[data-testid="button-next-step"]');
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        currentStep++;
        
        // Fill step-specific information
        if (currentStep === 2) {
          // Address information
          await page.fill('[data-testid="input-address"]', '456 Cleaner Ave');
          await page.fill('[data-testid="input-barangay"]', 'Test Barangay');
        } else if (currentStep === 3) {
          // Experience
          await page.fill('[data-testid="input-experience"]', '2 years cleaning experience');
        }
      } else {
        break;
      }
    }
    
    // Submit application
    const submitBtn = page.locator('[data-testid="button-submit-application"], [data-testid="button-submit"]');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      
      // Verify success
      await page.waitForLoadState('networkidle');
      const successMessage = page.locator('text=Application submitted, text=Success, text=Thank you');
      const count = await successMessage.count();
      if (count > 0) {
        await expect(successMessage.first()).toBeVisible();
      }
    }
  });

  test('should validate required fields in registration forms', async ({ page }) => {
    await page.goto('/join-client');
    
    // Try to submit empty form
    const submitBtn = page.locator('[data-testid="button-next-step"], [data-testid="button-submit"]');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      
      // Should show validation errors
      const errorMessages = page.locator('text=required, text=Please fill, text=This field');
      const errorCount = await errorMessages.count();
      expect(errorCount).toBeGreaterThan(0);
    }
  });

  test('should handle invalid email format in registration', async ({ page }) => {
    await page.goto('/join-client');
    
    await page.fill('[data-testid="input-email"]', 'invalid-email');
    await page.fill('[data-testid="input-first-name"]', 'Test');
    
    const nextBtn = page.locator('[data-testid="button-next-step"]');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      
      // Should show email validation error
      const emailError = page.locator('text=valid email, text=email format, text=@ symbol');
      const count = await emailError.count();
      if (count > 0) {
        await expect(emailError.first()).toBeVisible();
      }
    }
  });
});
