import { test, expect } from '@playwright/test';

test('check book-now page content', async ({ page }) => {
  await page.goto('/book-now');
  
  // Take screenshot to see what's on the page
  await page.screenshot({ path: 'book-now-page.png', fullPage: true });
  
  // Check if page loads
  await expect(page.locator('body')).toBeVisible();
  
  // Log page content
  const content = await page.textContent('body');
  console.log('Page content:', content?.substring(0, 500));
  
  // Check for form elements
  const inputs = await page.locator('input').count();
  const buttons = await page.locator('button').count();
  const selects = await page.locator('[data-testid*="select"]').count();
  
  console.log(`Found ${inputs} input fields, ${buttons} buttons, and ${selects} select elements`);
  
  // Check for specific booking elements
  const serviceSelector = await page.locator('[data-testid="select-service-type"]').count();
  console.log(`Service type selector found: ${serviceSelector > 0}`);
});
