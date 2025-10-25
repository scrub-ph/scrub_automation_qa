import { test, expect } from '@playwright/test';

test('check join-cleaner page content', async ({ page }) => {
  await page.goto('/join-cleaner');
  
  // Take screenshot to see what's on the page
  await page.screenshot({ path: 'join-cleaner-page.png', fullPage: true });
  
  // Check if page loads
  await expect(page.locator('body')).toBeVisible();
  
  // Log page content
  const content = await page.textContent('body');
  console.log('Page content:', content);
  
  // Check for form elements
  const inputs = await page.locator('input').count();
  const buttons = await page.locator('button').count();
  
  console.log(`Found ${inputs} input fields and ${buttons} buttons`);
});
