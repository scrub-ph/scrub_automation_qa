import { expect, test } from '@playwright/test';

test.describe('Service Pages - Realistic Tests', () => {
  const services = [
    { name: 'Regular Cleaning', url: '/services/regular-cleaning' },
    { name: 'Deep Cleaning', url: '/services/deep-cleaning' }
  ];

  test.describe('Basic Page Tests', () => {
    services.forEach(service => {
      test(`should load ${service.name} page`, async ({ page }) => {
        await page.goto(`${service.url}`);
        await expect(page.locator('h1')).toBeVisible();
        const content = await page.textContent('body');
        expect(content).toContain('Cleaning');
      });

      test(`should navigate to booking from ${service.name}`, async ({ page }) => {
        await page.goto(`${service.url}`);
        const bookButton = page.locator('a[href*="get-started"], button:has-text("Book"), button:has-text("Get Started")').first();
        if (await bookButton.isVisible()) {
          await bookButton.click();
          await expect(page).toHaveURL(/.*get-started.*/);
        }
      });
    });
  });

  test.describe('Navigation Tests', () => {
    test('should handle invalid service URLs', async ({ page }) => {
      await page.goto('/services/non-existent');
      await expect(page.locator('h1')).toContainText(/404|Not Found|Services/);
    });

    test('should navigate from homepage to services', async ({ page }) => {
      await page.goto('');
      const serviceLinks = page.locator('a[href*="/services/"]');
      if (await serviceLinks.count() > 0) {
        await serviceLinks.first().click();
        await expect(page).toHaveURL(/.*\/services\/.*/);
      }
    });
  });
});
