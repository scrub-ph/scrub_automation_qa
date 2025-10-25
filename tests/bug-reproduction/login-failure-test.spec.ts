import { test, expect } from '@playwright/test';

test.describe('Bug Reproduction - Login Failure', () => {
  test('should reproduce login failure after registration', async ({ page }) => {
    await page.goto('/');
    
    // Test login with cleaner credentials
    await page.fill('input[type="email"]', 'cleaner@gmail.com');
    await page.fill('input[type="password"]', 'P@ssword1919');
    await page.click('button[type="submit"]');
    
    // Check for login failure
    const errorMessage = page.locator('text=Login failed');
    await expect(errorMessage).toBeVisible();
    
    // Document the bug
    console.log('BUG CONFIRMED: Login failed with credentials cleaner@gmail.com');
  });
});
