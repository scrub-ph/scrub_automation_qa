import { expect, test } from '@playwright/test';

test.describe('Service Pages End-to-End Tests', () => {
  const services = [
    { name: 'Regular Cleaning', url: '/services/regular-cleaning' },
    { name: 'Deep Cleaning', url: '/services/deep-cleaning' },
    { name: 'Office Cleaning', url: '/services/office-cleaning' },
    { name: 'Post Construction', url: '/services/post-construction' }
  ];

  test.describe('Positive Test Cases', () => {
    services.forEach(service => {
      test(`should display ${service.name} page correctly`, async ({ page }) => {
        await page.goto(service.url);
        
        // Verify page loads
        await expect(page.locator('h1')).toContainText(service.name);
        
        // Verify service information
        await expect(page.locator('text=What\'s Included')).toBeVisible();
        await expect(page.locator('text=Pricing')).toBeVisible();
        await expect(page.locator('text=How It Works')).toBeVisible();
        
        // Verify booking CTA
        await expect(page.locator('button:has-text("Book Now")')).toBeVisible();
        
        // Verify service features
        await expect(page.locator('[data-testid="service-features"]')).toBeVisible();
      });

      test(`should navigate to booking from ${service.name} page`, async ({ page }) => {
        await page.goto(service.url);
        
        // Click book now button
        await page.locator('button:has-text("Book Now")').first().click();
        
        // Verify navigation to booking page with service pre-selected
        await expect(page).toHaveURL(/.*book/);
        await expect(page.locator(`text=${service.name}`)).toHaveClass(/selected/);
      });
    });

    test('should display service comparison correctly', async ({ page }) => {
      await page.goto('/services/compare');
      
      // Verify comparison page loads
      await expect(page.locator('h1')).toContainText(/Compare|Services/);
      
      // Verify service comparison table
      await expect(page.locator('table')).toBeVisible();
      await expect(page.locator('text=Regular Cleaning')).toBeVisible();
      await expect(page.locator('text=Deep Cleaning')).toBeVisible();
      await expect(page.locator('text=Office Cleaning')).toBeVisible();
      
      // Verify feature comparisons
      await expect(page.locator('text=Duration')).toBeVisible();
      await expect(page.locator('text=Price Range')).toBeVisible();
      await expect(page.locator('text=Frequency')).toBeVisible();
    });

    test('should display service pricing calculator', async ({ page }) => {
      await page.goto('/services/regular-cleaning');
      
      // Use pricing calculator
      await page.locator('[data-testid="pricing-calculator"]').scrollIntoViewIfNeeded();
      
      // Select options
      await page.locator('select[name="homeSize"]').selectOption('3-bedroom');
      await page.locator('input[name="frequency"]').check();
      await page.locator('input[name="extraServices"]').first().check();
      
      // Verify price updates
      const priceElement = page.locator('[data-testid="calculated-price"]');
      await expect(priceElement).toBeVisible();
      await expect(priceElement).toContainText('₱');
    });

    test('should show service availability by area', async ({ page }) => {
      await page.goto('/services/regular-cleaning');
      
      // Check service availability
      await page.locator('input[placeholder*="Enter your location"]').fill('Makati City');
      await page.locator('button:has-text("Check Availability")').click();
      
      // Verify availability response
      await expect(page.locator('text=Available in your area')).toBeVisible();
      await expect(page.locator('text=Estimated arrival')).toBeVisible();
    });

    test('should display customer reviews for services', async ({ page }) => {
      await page.goto('/services/deep-cleaning');
      
      // Scroll to reviews section
      await page.locator('[data-testid="customer-reviews"]').scrollIntoViewIfNeeded();
      
      // Verify reviews display
      await expect(page.locator('text=Customer Reviews')).toBeVisible();
      await expect(page.locator('[data-testid="review-card"]').first()).toBeVisible();
      await expect(page.locator('[data-testid="star-rating"]').first()).toBeVisible();
      
      // Test review pagination
      const nextButton = page.locator('button:has-text("Next Reviews")');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await expect(page.locator('[data-testid="review-card"]').first()).toBeVisible();
      }
    });

    test('should show before/after gallery', async ({ page }) => {
      await page.goto('/services/deep-cleaning');
      
      // Navigate to gallery
      await page.locator('text=Before & After Gallery').click();
      
      // Verify gallery display
      await expect(page.locator('[data-testid="before-after-gallery"]')).toBeVisible();
      await expect(page.locator('img[alt*="before"]')).toBeVisible();
      await expect(page.locator('img[alt*="after"]')).toBeVisible();
      
      // Test gallery navigation
      await page.locator('button[aria-label="Next image"]').click();
      await expect(page.locator('[data-testid="gallery-counter"]')).toContainText('2 of');
    });

    test('should handle service customization options', async ({ page }) => {
      await page.goto('/services/office-cleaning');
      
      // Customize service
      await page.locator('text=Customize Service').click();
      
      // Select customization options
      await page.locator('input[name="afterHours"]').check();
      await page.locator('input[name="weekends"]').check();
      await page.locator('select[name="frequency"]').selectOption('weekly');
      
      // Verify price adjustment
      const customPrice = page.locator('[data-testid="custom-price"]');
      await expect(customPrice).toBeVisible();
      await expect(customPrice).toContainText('₱');
      
      // Proceed to booking
      await page.locator('button:has-text("Book Custom Service")').click();
      await expect(page).toHaveURL(/.*book/);
    });
  });

  test.describe('Negative Test Cases', () => {
    test('should handle invalid service URLs', async ({ page }) => {
      await page.goto('/services/non-existent-service');
      
      // Should show 404 or redirect to services page
      const is404 = await page.locator('text=404').isVisible();
      const isRedirect = page.url().includes('/services');
      
      expect(is404 || isRedirect).toBeTruthy();
    });

    test('should validate location input for availability check', async ({ page }) => {
      await page.goto('/services/regular-cleaning');
      
      // Try to check availability with empty location
      await page.locator('button:has-text("Check Availability")').click();
      
      // Should show validation error
      await expect(page.locator('text=Please enter your location')).toBeVisible();
      
      // Try with invalid location
      await page.locator('input[placeholder*="Enter your location"]').fill('Invalid Location XYZ');
      await page.locator('button:has-text("Check Availability")').click();
      
      await expect(page.locator('text=Location not found')).toBeVisible();
    });

    test('should handle service unavailability', async ({ page }) => {
      await page.goto('/services/regular-cleaning');
      
      // Mock service unavailable response
      await page.route('**/api/services/availability', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            available: false,
            reason: 'Service not available in this area',
            alternatives: ['Deep Cleaning']
          })
        });
      });
      
      await page.locator('input[placeholder*="Enter your location"]').fill('Remote Area');
      await page.locator('button:has-text("Check Availability")').click();
      
      // Should show unavailability message
      await expect(page.locator('text=Service not available in this area')).toBeVisible();
      await expect(page.locator('text=Alternative services')).toBeVisible();
    });

    test('should handle pricing calculator errors', async ({ page }) => {
      await page.goto('/services/regular-cleaning');
      
      // Mock pricing API error
      await page.route('**/api/services/calculate-price', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Unable to calculate price' })
        });
      });
      
      // Use calculator
      await page.locator('select[name="homeSize"]').selectOption('3-bedroom');
      
      // Should show error message
      await expect(page.locator('text=Unable to calculate price')).toBeVisible();
      await expect(page.locator('button:has-text("Try Again")').first()).toBeVisible();
    });

    test('should handle broken service images', async ({ page }) => {
      await page.goto('/services/deep-cleaning');
      
      // Mock broken images
      await page.route('**/images/services/**', route => {
        route.fulfill({ status: 404 });
      });
      
      await page.reload();
      
      // Verify fallback images or alt text
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy(); // Should have alt text for accessibility
      }
    });

    test('should validate service booking prerequisites', async ({ page }) => {
      await page.goto('/services/post-construction');
      
      // Try to book without meeting prerequisites
      await page.locator('button:has-text("Book Now")').click();
      
      // Should show prerequisite check
      await expect(page.locator('text=Special Requirements')).toBeVisible();
      await expect(page.locator('text=Construction completion certificate required')).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle service page with no reviews', async ({ page }) => {
      // Mock service with no reviews
      await page.route('**/api/services/*/reviews', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([])
        });
      });
      
      await page.goto('/services/office-cleaning');
      
      // Should show empty reviews state
      await expect(page.locator('text=No reviews yet')).toBeVisible();
      await expect(page.locator('text=Be the first to review')).toBeVisible();
    });

    test('should handle seasonal service variations', async ({ page }) => {
      await page.goto('/services/regular-cleaning');
      
      // Mock seasonal pricing
      await page.route('**/api/services/regular-cleaning/pricing', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            basePrice: 1500,
            seasonalAdjustment: 200,
            season: 'holiday',
            message: 'Holiday season pricing in effect'
          })
        });
      });
      
      await page.reload();
      
      // Should show seasonal notice
      await expect(page.locator('text=Holiday season pricing')).toBeVisible();
      await expect(page.locator('text=₱1,700')).toBeVisible(); // Adjusted price
    });

    test('should handle service capacity limitations', async ({ page }) => {
      await page.goto('/services/deep-cleaning');
      
      // Mock high demand response
      await page.route('**/api/services/availability', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            available: true,
            highDemand: true,
            nextAvailable: '2024-12-01',
            message: 'High demand - limited slots available'
          })
        });
      });
      
      await page.locator('input[placeholder*="Enter your location"]').fill('Makati City');
      await page.locator('button:has-text("Check Availability")').click();
      
      // Should show demand notice
      await expect(page.locator('text=High demand')).toBeVisible();
      await expect(page.locator('text=Next available: Dec 1')).toBeVisible();
    });

    test('should handle mobile-specific service features', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/services/regular-cleaning');
      
      // Verify mobile-optimized layout
      await expect(page.locator('[data-testid="mobile-service-header"]')).toBeVisible();
      
      // Test mobile-specific interactions
      const mobileBookButton = page.locator('[data-testid="mobile-book-button"]');
      if (await mobileBookButton.isVisible()) {
        await mobileBookButton.click();
        await expect(page).toHaveURL(/.*book/);
      }
    });

    test('should handle service bundling options', async ({ page }) => {
      await page.goto('/services/regular-cleaning');
      
      // Look for bundle options
      const bundleSection = page.locator('[data-testid="service-bundles"]');
      if (await bundleSection.isVisible()) {
        // Select bundle
        await page.locator('input[name="bundle-deep-regular"]').check();
        
        // Verify bundle pricing
        await expect(page.locator('text=Bundle Discount')).toBeVisible();
        await expect(page.locator('[data-testid="bundle-savings"]')).toBeVisible();
        
        // Book bundle
        await page.locator('button:has-text("Book Bundle")').click();
        await expect(page).toHaveURL(/.*book/);
      }
    });

    test('should handle service area restrictions', async ({ page }) => {
      await page.goto('/services/regular-cleaning');
      
      // Test area outside service zone
      await page.locator('input[placeholder*="Enter your location"]').fill('Baguio City');
      await page.locator('button:has-text("Check Availability")').click();
      
      // Should show area restriction
      await expect(page.locator('text=Currently not available in this area')).toBeVisible();
      await expect(page.locator('text=We plan to expand')).toBeVisible();
      
      // Should offer notification signup
      await expect(page.locator('button:has-text("Notify When Available")').first()).toBeVisible();
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/services/regular-cleaning');
      
      // Check heading structure
      const h1 = await page.locator('h1').count();
      const h2 = await page.locator('h2').count();
      
      expect(h1).toBe(1); // Should have exactly one h1
      expect(h2).toBeGreaterThan(0); // Should have h2 elements
    });

    test('should have proper alt text for images', async ({ page }) => {
      await page.goto('/services/deep-cleaning');
      
      // Check all images have alt text
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt.length).toBeGreaterThan(0);
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/services/regular-cleaning');
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
      
      // Continue tabbing through interactive elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        if (await focused.isVisible()) {
          const tagName = await focused.evaluate(el => el.tagName.toLowerCase());
          expect(['a', 'button', 'input', 'select', 'textarea']).toContain(tagName);
        }
      }
    });
  });
});
