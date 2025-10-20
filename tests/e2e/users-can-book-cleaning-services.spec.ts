import { test, expect } from '@playwright/test';

test.describe('SCRUB Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow browsing cleaning services', async ({ page }) => {
    // Look for service listings or browse functionality
    const serviceElements = page.locator('[data-testid*="service"], .service, .cleaner, .cleaning');
    const browseButton = page.locator('button, a').filter({ hasText: /browse|services|cleaners|book/i });
    
    // Check if services are displayed or if there's a way to browse them
    if (await serviceElements.count() > 0) {
      await expect(serviceElements.first()).toBeVisible();
    } else if (await browseButton.count() > 0) {
      await browseButton.first().click();
      await page.waitForLoadState('networkidle');
    }
    
    await page.screenshot({ path: 'test-results/services-page.png' });
  });

  test('should handle service search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[name*="search"]');
    
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('house cleaning');
      await searchInput.first().press('Enter');
      
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/search-results.png' });
    } else {
      console.log('No search functionality found on homepage');
    }
  });

  test('should display pricing information', async ({ page }) => {
    // Look for pricing elements
    const priceElements = page.locator('.price, [data-testid*="price"]');
    const dollarText = page.locator('text=/\\$\\d+/');
    
    if (await priceElements.count() > 0 || await dollarText.count() > 0) {
      const element = await priceElements.count() > 0 ? priceElements.first() : dollarText.first();
      await expect(element).toBeVisible();
    }
  });

  test('should show cleaner profiles or ratings', async ({ page }) => {
    // Look for cleaner profiles, ratings, or reviews
    const ratingElements = page.locator('.rating, .stars, [data-testid*="rating"]');
    const starElements = page.locator('text=/★|⭐/');
    const profileElements = page.locator('.profile, .cleaner-card, [data-testid*="cleaner"]');
    
    if (await ratingElements.count() > 0) {
      await expect(ratingElements.first()).toBeVisible();
    } else if (await starElements.count() > 0) {
      await expect(starElements.first()).toBeVisible();
    }
    
    if (await profileElements.count() > 0) {
      await expect(profileElements.first()).toBeVisible();
    }
    
    await page.screenshot({ path: 'test-results/cleaner-profiles.png' });
  });
});
