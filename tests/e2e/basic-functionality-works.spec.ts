import { test, expect } from '@playwright/test';

test.describe('SCRUB Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main navigation elements', async ({ page }) => {
    // Check for common navigation elements
    await expect(page.locator('nav, header, [role="navigation"]')).toBeVisible();
    
    // Look for login/signup buttons
    const loginButton = page.locator('button, a').filter({ hasText: /login|sign in/i });
    const signupButton = page.locator('button, a').filter({ hasText: /sign up|register/i });
    
    // At least one should be visible
    await expect(loginButton.or(signupButton)).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.screenshot({ path: 'test-results/desktop-view.png' });
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'test-results/mobile-view.png' });
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Allow some common non-critical errors but fail on serious ones
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('tracking')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check for essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toBeAttached();
  });
});
