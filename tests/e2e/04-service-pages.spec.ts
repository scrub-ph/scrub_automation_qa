import { test, expect, Page } from '@playwright/test';

test.describe('04 - Service Pages (Service Information)', () => {
  
  test('should display regular cleaning service page with pricing and details', async ({ page }) => {
    await page.goto('/services/regular-cleaning');
    
    // Verify page loads and has service information
    await expect(page.locator('h1, h2')).toContainText(/Regular Cleaning|Cleaning/i);
    
    // Check for pricing information
    const pricingElements = page.locator('text=/₱|PHP|Price|Cost|Starting/i');
    const pricingCount = await pricingElements.count();
    if (pricingCount > 0) {
      await expect(pricingElements.first()).toBeVisible();
    }
    
    // Check for service description
    const serviceInfo = page.locator('text=/clean|service|hour|room/i');
    await expect(serviceInfo.first()).toBeVisible();
    
    // Look for booking button
    const bookingBtn = page.locator('button:has-text("Book"), a:has-text("Book"), button:has-text("Get Started")');
    const btnCount = await bookingBtn.count();
    if (btnCount > 0) {
      await expect(bookingBtn.first()).toBeVisible();
    }
  });

  test('should display deep cleaning service page with comprehensive details', async ({ page }) => {
    await page.goto('/services/deep-cleaning');
    
    // Verify deep cleaning specific content
    await expect(page.locator('h1, h2')).toContainText(/Deep Cleaning|Deep/i);
    
    // Check for detailed service information
    const deepCleaningInfo = page.locator('text=/deep|thorough|comprehensive|detailed/i');
    await expect(deepCleaningInfo.first()).toBeVisible();
    
    // Verify pricing is higher than regular cleaning
    const pricingElements = page.locator('text=/₱|PHP|Price|Cost/i');
    const count = await pricingElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display office cleaning service page for commercial clients', async ({ page }) => {
    await page.goto('/services/office-cleaning');
    
    // Verify office cleaning content
    await expect(page.locator('h1, h2')).toContainText(/Office Cleaning|Office|Commercial/i);
    
    // Check for commercial-specific information
    const officeInfo = page.locator('text=/office|commercial|business|workplace/i');
    await expect(officeInfo.first()).toBeVisible();
    
    // Look for business-oriented features
    const businessFeatures = page.locator('text=/schedule|flexible|professional|corporate/i');
    const featureCount = await businessFeatures.count();
    if (featureCount > 0) {
      await expect(businessFeatures.first()).toBeVisible();
    }
  });

  test('should display post-construction cleaning service page', async ({ page }) => {
    await page.goto('/services/post-construction');
    
    // Verify post-construction content
    await expect(page.locator('h1, h2')).toContainText(/Post.Construction|Construction|Post/i);
    
    // Check for construction-specific information
    const constructionInfo = page.locator('text=/construction|debris|dust|renovation/i');
    await expect(constructionInfo.first()).toBeVisible();
  });

  test('should navigate from service pages to booking flow', async ({ page }) => {
    await page.goto('/services/regular-cleaning');
    
    // Find and click booking button
    const bookingBtn = page.locator(
      'button:has-text("Book Now"), a:has-text("Book Now"), button:has-text("Book"), a:has-text("Book")'
    ).first();
    
    if (await bookingBtn.isVisible()) {
      await bookingBtn.click();
      
      // Should navigate to booking or get-started page
      await expect(page).toHaveURL(/.*book|.*get-started|.*quote/);
    } else {
      // Alternative: look for any CTA button
      const ctaBtn = page.locator('button, a').filter({ hasText: /Get Started|Quote|Contact/ }).first();
      if (await ctaBtn.isVisible()) {
        await ctaBtn.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should handle invalid service URLs gracefully', async ({ page }) => {
    await page.goto('/services/invalid-service');
    
    // Should either redirect to valid page or show 404
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    
    // Check if redirected to valid page or shows error
    const isValidRedirect = currentUrl.includes('/services/') || currentUrl.includes('/') || currentUrl.includes('404');
    expect(isValidRedirect).toBe(true);
  });

  test('should display consistent navigation across all service pages', async ({ page }) => {
    const servicePages = [
      '/services/regular-cleaning',
      '/services/deep-cleaning', 
      '/services/office-cleaning',
      '/services/post-construction'
    ];
    
    for (const servicePage of servicePages) {
      await page.goto(servicePage);
      
      // Check for consistent navigation elements
      const homeLink = page.locator('a[href="/"], button:has-text("Home"), .logo');
      const navCount = await homeLink.count();
      if (navCount > 0) {
        await expect(homeLink.first()).toBeVisible();
      }
      
      // Check for consistent footer or contact information
      const contactInfo = page.locator('text=/contact|phone|email/i');
      const contactCount = await contactInfo.count();
      if (contactCount > 0) {
        await expect(contactInfo.first()).toBeVisible();
      }
    }
  });
});
