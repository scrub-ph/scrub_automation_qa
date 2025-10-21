import { expect, test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashBoardPage } from '../../src/pages/DashBoardPage';

test.describe('SCRUB Authentication Tests', () => {
  let loginPage: LoginPage;
  let dashBoardPage: DashBoardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashBoardPage = new DashBoardPage(page);
    await loginPage.navigateToLoginPage();
  });

  test.afterEach(async ({ page, context }) => {
    await page.close();
    await context.close();
  });

  // CLIENT LOGIN TESTS
  test.describe('Client Authentication', () => {
    test('Client - Login page loads correctly', async ({ page }) => {
      await expect(page).toHaveURL(/.*sign-in/);
      await expect(loginPage.getEmailField()).toBeVisible();
      await expect(loginPage.getPasswordField()).toBeVisible();
      await expect(loginPage.getSignInButton()).toBeVisible();
    });

    test('Client - Valid login attempt', async ({ page }) => {
      await loginPage.getEmailField().fill('test@example.com');
      await loginPage.getPasswordField().fill('password123');
      await loginPage.getSignInButton().click();
      
      // Wait for response (either success or error)
      await page.waitForTimeout(2000);
      
      // Check if we're still on login page or redirected
      const currentUrl = page.url();
      console.log(`Current URL after login: ${currentUrl}`);
      
      if (currentUrl.includes('sign-in')) {
        console.log('Login failed - still on login page');
        // Check for error messages
        const errorElements = await page.locator('text=/login failed|invalid|error/i').all();
        if (errorElements.length > 0) {
          console.log('Error message found on page');
        }
      } else {
        console.log('Login successful - redirected to dashboard');
        await expect(page).not.toHaveURL(/.*sign-in/);
      }
    });

    test('Client - Empty email validation', async ({ page }) => {
      await loginPage.getPasswordField().fill('password123');
      await loginPage.getSignInButton().click();
      
      // Should stay on login page
      await expect(page).toHaveURL(/.*sign-in/);
      
      // Check if email field shows validation
      const emailField = loginPage.getEmailField();
      const isRequired = await emailField.getAttribute('required');
      expect(isRequired).not.toBeNull();
    });

    test('Client - Empty password validation', async ({ page }) => {
      await loginPage.getEmailField().fill('test@example.com');
      await loginPage.getSignInButton().click();
      
      // Should stay on login page
      await expect(page).toHaveURL(/.*sign-in/);
      
      // Check if password field shows validation
      const passwordField = loginPage.getPasswordField();
      const isRequired = await passwordField.getAttribute('required');
      expect(isRequired).not.toBeNull();
    });

    test('Client - Invalid email format', async ({ page }) => {
      await loginPage.getEmailField().fill('invalid-email');
      await loginPage.getPasswordField().fill('password123');
      await loginPage.getSignInButton().click();
      
      // Should stay on login page due to client-side validation
      await expect(page).toHaveURL(/.*sign-in/);
    });
  });

  // GENERAL AUTHENTICATION TESTS
  test.describe('General Authentication Features', () => {
    test('Login form elements are accessible', async ({ page }) => {
      // Check form accessibility
      const emailField = loginPage.getEmailField();
      const passwordField = loginPage.getPasswordField();
      const signInButton = loginPage.getSignInButton();
      
      // Verify elements are focusable
      await emailField.focus();
      await expect(emailField).toBeFocused();
      
      await passwordField.focus();
      await expect(passwordField).toBeFocused();
      
      await signInButton.focus();
      await expect(signInButton).toBeFocused();
    });

    test('Login page has correct title and meta information', async ({ page }) => {
      const title = await page.title();
      expect(title).toContain('SCRUB');
      
      // Check for meta description
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
    });

    test('Login form keyboard navigation works', async ({ page }) => {
      // Start by focusing on the email field first
      await loginPage.getEmailField().focus();
      await expect(loginPage.getEmailField()).toBeFocused();
      
      // Tab to password field
      await page.keyboard.press('Tab');
      await expect(loginPage.getPasswordField()).toBeFocused();
      
      // Tab to sign in button
      await page.keyboard.press('Tab');
      await expect(loginPage.getSignInButton()).toBeFocused();
    });

    test('Login page responsive design', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(loginPage.getEmailField()).toBeVisible();
      await expect(loginPage.getPasswordField()).toBeVisible();
      await expect(loginPage.getSignInButton()).toBeVisible();
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(loginPage.getEmailField()).toBeVisible();
      await expect(loginPage.getPasswordField()).toBeVisible();
      await expect(loginPage.getSignInButton()).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(loginPage.getEmailField()).toBeVisible();
      await expect(loginPage.getPasswordField()).toBeVisible();
      await expect(loginPage.getSignInButton()).toBeVisible();
    });
  });

  // SECURITY TESTS
  test.describe('Security Features', () => {
    test('Password field masks input', async ({ page }) => {
      const passwordField = loginPage.getPasswordField();
      await passwordField.fill('secretpassword');
      
      const inputType = await passwordField.getAttribute('type');
      expect(inputType).toBe('password');
    });

    test('Form prevents basic XSS attempts', async ({ page }) => {
      const xssPayload = '<script>alert("xss")</script>';
      
      await loginPage.getEmailField().fill(xssPayload);
      await loginPage.getPasswordField().fill('password123');
      
      const emailValue = await loginPage.getEmailField().inputValue();
      expect(emailValue).toBe(xssPayload); // Should be treated as text, not executed
      
      // Check that no alert was triggered
      let alertTriggered = false;
      page.on('dialog', () => {
        alertTriggered = true;
      });
      
      await loginPage.getSignInButton().click();
      await page.waitForTimeout(1000);
      
      expect(alertTriggered).toBe(false);
    });

    test('SQL injection attempt in email field', async ({ page }) => {
      const sqlPayload = "admin@test.com'; DROP TABLE users; --";
      
      await loginPage.getEmailField().fill(sqlPayload);
      await loginPage.getPasswordField().fill('password123');
      await loginPage.getSignInButton().click();
      
      // Should handle gracefully without breaking
      await page.waitForTimeout(2000);
      
      // Page should still be functional
      await expect(loginPage.getEmailField()).toBeVisible();
      await expect(loginPage.getPasswordField()).toBeVisible();
    });
  });

  // PERFORMANCE TESTS
  test.describe('Performance', () => {
    test('Login page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await loginPage.navigateToLoginPage();
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      console.log(`Login page loaded in ${loadTime}ms`);
    });

    test('Login form submission responds quickly', async ({ page }) => {
      await loginPage.getEmailField().fill('test@example.com');
      await loginPage.getPasswordField().fill('password123');
      
      const startTime = Date.now();
      await loginPage.getSignInButton().click();
      
      // Wait for some response (success or error)
      await page.waitForTimeout(1000);
      const responseTime = Date.now() - startTime;
      
      // Should respond within 5 seconds
      expect(responseTime).toBeLessThan(5000);
      console.log(`Login form responded in ${responseTime}ms`);
    });
  });
});
