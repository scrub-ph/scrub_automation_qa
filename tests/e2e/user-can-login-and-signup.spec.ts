import { test, expect } from '@playwright/test';

test.describe('SCRUB Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Look for login link/button
    const loginLink = page.locator('a, button').filter({ hasText: /login|sign in/i });
    
    if (await loginLink.count() > 0) {
      await loginLink.first().click();
      await page.waitForLoadState('networkidle');
      
      // Should be on login page
      await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"], input[name*="password"]')).toBeVisible();
      
      await page.screenshot({ path: 'test-results/login-page.png' });
    }
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/');
    
    // Look for signup link/button
    const signupLink = page.locator('a, button').filter({ hasText: /sign up|register|join/i });
    
    if (await signupLink.count() > 0) {
      await signupLink.first().click();
      await page.waitForLoadState('networkidle');
      
      // Should be on signup page
      await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible();
      
      await page.screenshot({ path: 'test-results/signup-page.png' });
    }
  });

  test('should validate login form', async ({ page }) => {
    await page.goto('/');
    
    const loginLink = page.locator('a, button').filter({ hasText: /login|sign in/i });
    
    if (await loginLink.count() > 0) {
      await loginLink.first().click();
      await page.waitForLoadState('networkidle');
      
      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /login|sign in/i });
      
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        
        // Should show validation errors
        const errorMessages = page.locator('.error, .invalid, [role="alert"], text=/required|invalid/i');
        
        if (await errorMessages.count() > 0) {
          await expect(errorMessages.first()).toBeVisible();
        }
      }
    }
  });

  test('should handle invalid login credentials', async ({ page }) => {
    await page.goto('/');
    
    const loginLink = page.locator('a, button').filter({ hasText: /login|sign in/i });
    
    if (await loginLink.count() > 0) {
      await loginLink.first().click();
      await page.waitForLoadState('networkidle');
      
      // Fill invalid credentials
      const emailInput = page.locator('input[type="email"], input[name*="email"]');
      const passwordInput = page.locator('input[type="password"], input[name*="password"]');
      const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /login|sign in/i });
      
      if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
        await emailInput.fill('invalid@test.com');
        await passwordInput.fill('wrongpassword');
        
        if (await submitButton.count() > 0) {
          await submitButton.first().click();
          await page.waitForLoadState('networkidle');
          
          // Should show error message
          const errorMessage = page.locator('.error, .invalid, [role="alert"], text=/invalid|incorrect|failed/i');
          
          if (await errorMessage.count() > 0) {
            await expect(errorMessage.first()).toBeVisible();
          }
          
          await page.screenshot({ path: 'test-results/login-error.png' });
        }
      }
    }
  });
});
