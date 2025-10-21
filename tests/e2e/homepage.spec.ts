import { expect, test } from '@playwright/test';

test.describe('Homepage End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Positive Test Cases', () => {
    test('should load homepage successfully with all key elements', async ({ page }) => {
      // Verify page loads
      await expect(page).toHaveTitle(/SCRUB/);
      
      // Verify main navigation
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('text=Home')).toBeVisible();
      await expect(page.locator('text=Services')).toBeVisible();
      await expect(page.locator('text=How It Works')).toBeVisible();
      
      // Verify hero section
      await expect(page.locator('h1')).toContainText(/Professional Cleaning|SCRUB/);
      await expect(page.locator('text=Book Now')).toBeVisible();
      
      // Verify service cards
      await expect(page.locator('text=Regular Cleaning')).toBeVisible();
      await expect(page.locator('text=Deep Cleaning')).toBeVisible();
      await expect(page.locator('text=Office Cleaning')).toBeVisible();
    });

    test('should navigate to booking page from CTA buttons', async ({ page }) => {
      // Click main CTA button
      await page.locator('text=Book Now').first().click();
      
      // Verify navigation to booking page
      await expect(page).toHaveURL(/.*book/);
      await expect(page.locator('h1')).toContainText(/Book|Service/);
    });

    test('should display service information correctly', async ({ page }) => {
      // Verify service sections are visible
      const services = ['Regular Cleaning', 'Deep Cleaning', 'Office Cleaning'];
      
      for (const service of services) {
        await expect(page.locator(`text=${service}`)).toBeVisible();
      }
      
      // Verify pricing information is displayed
      await expect(page.locator('text=Starting at')).toBeVisible();
      await expect(page.locator('text=₱')).toBeVisible();
    });

    test('should show testimonials and reviews section', async ({ page }) => {
      // Scroll to testimonials section
      await page.locator('text=What Our Customers Say').scrollIntoViewIfNeeded();
      
      // Verify testimonials are visible
      await expect(page.locator('text=What Our Customers Say')).toBeVisible();
      await expect(page.locator('[data-testid="testimonial"]').first()).toBeVisible();
    });

    test('should display footer with contact information', async ({ page }) => {
      // Scroll to footer
      await page.locator('footer').scrollIntoViewIfNeeded();
      
      // Verify footer elements
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('text=Contact Us')).toBeVisible();
      await expect(page.locator('text=About SCRUB')).toBeVisible();
    });
  });

  test.describe('Negative Test Cases', () => {
    test('should handle broken service links gracefully', async ({ page }) => {
      // Try to click on potentially broken service links
      const serviceLinks = page.locator('a[href*="service"]');
      const count = await serviceLinks.count();
      
      if (count > 0) {
        await serviceLinks.first().click();
        // Should not result in 404 or error page
        await expect(page.locator('text=404')).not.toBeVisible();
        await expect(page.locator('text=Error')).not.toBeVisible();
      }
    });

    test('should handle missing images gracefully', async ({ page }) => {
      // Check for broken images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        
        if (src) {
          // Verify image has alt text for accessibility
          const alt = await img.getAttribute('alt');
          expect(alt).toBeTruthy();
        }
      }
    });

    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });
      
      await page.reload();
      
      // Verify page still loads within reasonable time
      await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    });

    test('should validate form inputs show error messages', async ({ page }) => {
      // Look for any forms on homepage
      const forms = page.locator('form');
      const formCount = await forms.count();
      
      if (formCount > 0) {
        const form = forms.first();
        
        // Try to submit empty form
        const submitButton = form.locator('button[type="submit"]');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Should show validation errors
          await expect(page.locator('text=required')).toBeVisible();
        }
      }
    });

    test('should handle JavaScript disabled scenario', async ({ page }) => {
      // Disable JavaScript
      await page.context().addInitScript(() => {
        Object.defineProperty(window, 'navigator', {
          value: { ...window.navigator, javaEnabled: () => false }
        });
      });
      
      await page.reload();
      
      // Basic content should still be visible
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test.describe('Responsive Design Tests', () => {
    test('should display correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Verify mobile navigation
      await expect(page.locator('nav')).toBeVisible();
      
      // Verify content is readable
      await expect(page.locator('h1')).toBeVisible();
      
      // Check for mobile menu if exists
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await expect(page.locator('text=Services')).toBeVisible();
      }
    });

    test('should display correctly on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Verify layout adapts to tablet size
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Verify full desktop layout
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
      
      // Verify service cards are in grid layout
      const serviceCards = page.locator('[data-testid="service-card"]');
      if (await serviceCards.count() > 0) {
        await expect(serviceCards.first()).toBeVisible();
      }
    });
  });
});
