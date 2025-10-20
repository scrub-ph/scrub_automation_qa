import { test, expect } from '@playwright/test';

test('🔍 Inspect SCRUB login page elements', async ({ page }) => {
  // Navigate to SCRUB login page
  await page.goto('http://localhost:5000/sign-in');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot to see the page
  await page.screenshot({ path: 'test-results/scrub-login-page.png', fullPage: true });
  
  // Try to find login elements
  console.log('🔍 Looking for login elements...');
  
  // Check for email field
  const emailSelectors = [
    'input[type="email"]',
    'input[name="email"]', 
    '[placeholder*="email" i]',
    'input[id*="email" i]'
  ];
  
  for (const selector of emailSelectors) {
    const element = page.locator(selector);
    const count = await element.count();
    if (count > 0) {
      console.log(`✅ Found email field: ${selector}`);
      await element.first().screenshot({ path: `test-results/email-field-${Date.now()}.png` });
    }
  }
  
  // Check for password field
  const passwordSelectors = [
    'input[type="password"]',
    'input[name="password"]',
    '[placeholder*="password" i]'
  ];
  
  for (const selector of passwordSelectors) {
    const element = page.locator(selector);
    const count = await element.count();
    if (count > 0) {
      console.log(`✅ Found password field: ${selector}`);
    }
  }
  
  // Check for submit button
  const buttonSelectors = [
    'button[type="submit"]',
    'button:has-text("Sign in")',
    'button:has-text("Login")',
    'input[type="submit"]'
  ];
  
  for (const selector of buttonSelectors) {
    const element = page.locator(selector);
    const count = await element.count();
    if (count > 0) {
      console.log(`✅ Found submit button: ${selector}`);
    }
  }
  
  // Try invalid login to see error message
  console.log('🚫 Testing invalid login to find error elements...');
  
  await page.fill('input[type="email"]', 'invalid@test.com');
  await page.fill('input[type="password"]', 'wrongpassword');
  await page.click('button[type="submit"]');
  
  // Wait a bit for error to appear
  await page.waitForTimeout(3000);
  
  // Take screenshot after error
  await page.screenshot({ path: 'test-results/after-invalid-login.png', fullPage: true });
  
  // Look for error messages
  const errorSelectors = [
    '.error',
    '.alert',
    '.message',
    '[role="alert"]',
    '.text-red-500',
    '.text-danger',
    '*:has-text("Invalid")',
    '*:has-text("Error")',
    '*:has-text("Failed")'
  ];
  
  for (const selector of errorSelectors) {
    const element = page.locator(selector);
    const count = await element.count();
    if (count > 0) {
      const text = await element.first().textContent();
      console.log(`❌ Found error element: ${selector} - Text: "${text}"`);
    }
  }
  
  // Get page HTML for inspection
  const html = await page.content();
  console.log('📄 Page title:', await page.title());
  console.log('📍 Current URL:', page.url());
});
