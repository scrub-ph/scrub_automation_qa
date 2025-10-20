import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('User Authentication - Login Scenarios for Clients and Cleaners', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test.describe('Client Login - Positive Scenarios', () => {
    test('Sarah should successfully log in as a client with valid credentials and access her dashboard', async ({ page }) => {
      // Test data for a typical client user
      const clientEmail = process.env.USERNAME || 'sarah.johnson@email.com';
      const clientPassword = process.env.PASSWORD || 'SecurePass123!';

      await test.step('Enter valid client email address', async () => {
        await loginPage.enterEmailAddress(clientEmail);
        await expect(loginPage.getEmailField()).toHaveValue(clientEmail);
      });

      await test.step('Enter valid password', async () => {
        await loginPage.enterPassword(clientPassword);
        await expect(loginPage.getPasswordField()).toHaveValue(clientPassword);
      });

      await test.step('Click sign in button and verify successful login', async () => {
        await loginPage.clickSignInButton();
        await loginPage.verifySuccessfulLoginRedirect();
      });

      await test.step('Verify client dashboard is accessible', async () => {
        await expect(page).toHaveURL(/dashboard|home|profile/);
        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 5000 });
      });
    });

    test('Maria should be able to log in as a returning client and see her booking history', async ({ page }) => {
      const returningClientEmail = 'maria.garcia@email.com';
      const returningClientPassword = 'MyPassword456!';

      await loginPage.performLogin(returningClientEmail, returningClientPassword);
      await loginPage.verifySuccessfulLoginRedirect();
      
      // Verify client-specific features are available
      await expect(page.locator('text=Book a Service, text=My Bookings')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Cleaner Login - Positive Scenarios', () => {
    test('James should successfully log in as a professional cleaner and access his work dashboard', async ({ page }) => {
      const cleanerEmail = 'james.wilson@cleanpro.com';
      const cleanerPassword = 'CleanerPass789!';

      await test.step('Enter valid cleaner email credentials', async () => {
        await loginPage.enterEmailAddress(cleanerEmail);
        await loginPage.enterPassword(cleanerPassword);
      });

      await test.step('Complete login process', async () => {
        await loginPage.clickSignInButton();
        await loginPage.verifySuccessfulLoginRedirect();
      });

      await test.step('Verify cleaner dashboard features are available', async () => {
        await expect(page).toHaveURL(/dashboard|cleaner|jobs/);
        // Verify cleaner-specific elements
        await expect(page.locator('text=Available Jobs, text=My Schedule, text=Earnings')).toBeVisible({ timeout: 5000 });
      });
    });

    test('Lisa should log in as an experienced cleaner and see her job assignments', async ({ page }) => {
      const experiencedCleanerEmail = 'lisa.chen@scrubteam.com';
      const experiencedCleanerPassword = 'ExpertCleaner2024!';

      await loginPage.performLogin(experiencedCleanerEmail, experiencedCleanerPassword);
      await loginPage.verifySuccessfulLoginRedirect();
      
      // Verify cleaner-specific navigation and features
      await expect(page.locator('text=Job Assignments, text=Performance Rating')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Client Login - Negative Scenarios', () => {
    test('Emma should see an error when attempting to log in with an incorrect password', async ({ page }) => {
      const validClientEmail = 'emma.davis@email.com';
      const incorrectPassword = 'WrongPassword123';

      await test.step('Enter valid email but incorrect password', async () => {
        await loginPage.enterEmailAddress(validClientEmail);
        await loginPage.enterPassword(incorrectPassword);
      });

      await test.step('Attempt login and verify error message appears', async () => {
        await loginPage.clickSignInButton();
        await loginPage.verifyErrorMessageIsDisplayed();
      });

      await test.step('Verify user remains on login page', async () => {
        await expect(page).toHaveURL(/sign-in|login/);
        await loginPage.verifyLoginPageIsDisplayed();
      });
    });

    test('Robert should receive an error when trying to log in with an unregistered email address', async ({ page }) => {
      const unregisteredEmail = 'robert.nonexistent@email.com';
      const anyPassword = 'SomePassword123!';

      await loginPage.performLogin(unregisteredEmail, anyPassword);
      await loginPage.verifyErrorMessageIsDisplayed();
      await expect(page).toHaveURL(/sign-in|login/);
    });

    test('Jennifer should see validation errors when submitting empty login credentials', async ({ page }) => {
      await test.step('Attempt to login with empty fields', async () => {
        await loginPage.clickSignInButton();
      });

      await test.step('Verify validation messages appear', async () => {
        // Check for field validation messages
        await expect(page.locator('text=Email is required, text=Password is required')).toBeVisible({ timeout: 3000 });
      });

      await test.step('Verify form fields are highlighted for errors', async () => {
        await expect(loginPage.getEmailField()).toHaveClass(/error|invalid/);
        await expect(loginPage.getPasswordField()).toHaveClass(/error|invalid/);
      });
    });

    test('Michael should be prevented from logging in with an invalid email format', async ({ page }) => {
      const invalidEmailFormat = 'michael.invalid-email-format';
      const validPassword = 'ValidPass123!';

      await loginPage.enterEmailAddress(invalidEmailFormat);
      await loginPage.enterPassword(validPassword);
      await loginPage.clickSignInButton();

      // Verify email format validation
      await expect(page.locator('text=Please enter a valid email address')).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Cleaner Login - Negative Scenarios', () => {
    test('David should encounter an error when using expired cleaner credentials', async ({ page }) => {
      const expiredCleanerEmail = 'david.expired@cleanservice.com';
      const expiredPassword = 'ExpiredPass456!';

      await loginPage.performLogin(expiredCleanerEmail, expiredPassword);
      await loginPage.verifyErrorMessageIsDisplayed();
      await expect(page.locator('text=Account expired, text=Contact administrator')).toBeVisible({ timeout: 5000 });
    });

    test('Amanda should be blocked from logging in with a suspended cleaner account', async ({ page }) => {
      const suspendedCleanerEmail = 'amanda.suspended@cleanteam.com';
      const validPassword = 'CleanerPass789!';

      await loginPage.performLogin(suspendedCleanerEmail, validPassword);
      await loginPage.verifyErrorMessageIsDisplayed();
      await expect(page.locator('text=Account suspended, text=Contact support')).toBeVisible({ timeout: 5000 });
    });

    test('Carlos should see an error when attempting login with case-sensitive password mismatch', async ({ page }) => {
      const cleanerEmail = 'carlos.martinez@scrubpro.com';
      const incorrectCasePassword = 'cleanerpass789!'; // lowercase instead of proper case

      await loginPage.performLogin(cleanerEmail, incorrectCasePassword);
      await loginPage.verifyErrorMessageIsDisplayed();
      await expect(page.locator('text=Invalid credentials, text=Login failed')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Security and Edge Cases', () => {
    test('Sophie should be protected against SQL injection attempts in login fields', async ({ page }) => {
      const sqlInjectionEmail = "admin'; DROP TABLE users; --";
      const sqlInjectionPassword = "' OR '1'='1";

      await loginPage.performLogin(sqlInjectionEmail, sqlInjectionPassword);
      await loginPage.verifyErrorMessageIsDisplayed();
      
      // Verify the application handles the injection attempt gracefully
      await expect(page).toHaveURL(/sign-in|login/);
    });

    test('Thomas should experience rate limiting after multiple failed login attempts', async ({ page }) => {
      const validEmail = 'thomas.ratelimit@email.com';
      const wrongPassword = 'WrongPassword123';

      // Attempt multiple failed logins
      for (let i = 0; i < 5; i++) {
        await loginPage.performLogin(validEmail, wrongPassword);
        await page.waitForTimeout(1000); // Brief pause between attempts
        await loginPage.navigateToLoginPage(); // Reset form
      }

      // Verify rate limiting message appears
      await expect(page.locator('text=Too many attempts, text=Please try again later')).toBeVisible({ timeout: 5000 });
    });

    test('Patricia should maintain session security when navigating with valid login', async ({ page }) => {
      const validEmail = process.env.USERNAME || 'patricia.security@email.com';
      const validPassword = process.env.PASSWORD || 'SecurePass123!';

      await loginPage.performLogin(validEmail, validPassword);
      await loginPage.verifySuccessfulLoginRedirect();

      // Verify session is maintained across page navigation
      await page.goto('/profile');
      await expect(page).not.toHaveURL(/sign-in|login/);
      await expect(page.locator('text=Profile, text=Settings')).toBeVisible({ timeout: 5000 });
    });
  });
});
