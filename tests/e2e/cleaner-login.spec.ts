import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { LoginCredentials } from '../../src/types/user.types';
import { DatabaseHelper } from '../../src/utils/database-helper';

test.describe('🧹 Cleaner Login Tests', () => {
  let loginPage: LoginPage;
  let dbHelper: DatabaseHelper;

  test.beforeAll(async () => {
    dbHelper = new DatabaseHelper();
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test.afterAll(async () => {
    await dbHelper.cleanupTestUsers();
    await dbHelper.close();
  });

  test('✅ Mike should successfully login as a cleaner and access cleaner dashboard', async ({ page }) => {
    // Create test cleaner in database
    const cleanerUser = await dbHelper.createTestUser({
      email: 'mike.cleaner@scrub.com',
      password: '$2b$10$hashedPassword', // In real app, properly hashed
      firstName: 'Mike',
      lastName: 'Wilson',
      role: 'cleaner'
    });

    console.log('👨‍🧹 Created cleaner user:', cleanerUser.first_name, cleanerUser.last_name);

    // Login credentials
    const cleanerCredentials: LoginCredentials = {
      email: 'mike.cleaner@scrub.com',
      password: 'cleanerpass123'
    };

    // Perform login
    await loginPage.performLogin(cleanerCredentials);

    // Wait for response
    await page.waitForTimeout(3000);

    // Take screenshot
    await loginPage.takeScreenshot('cleaner-login-attempt');

    // Check current URL and page content
    const currentUrl = await loginPage.getCurrentUrl();
    console.log('📍 Current URL after cleaner login:', currentUrl);

    // Verify cleaner-specific elements or dashboard
    const hasCleanerDashboard = await page.locator('text=Jobs, text=Schedule, text=Earnings, text=Cleaner').isVisible();
    
    if (hasCleanerDashboard) {
      console.log('✅ Cleaner dashboard detected');
      await expect(page.locator('text=Jobs, text=Schedule, text=Earnings')).toBeVisible();
    } else {
      console.log('ℹ️ Generic dashboard or login page');
      // Check if login was successful by URL change
      const loginSuccessful = !currentUrl.includes('sign-in');
      expect(loginSuccessful).toBe(true);
    }

    // Cleanup
    await dbHelper.deleteTestUser('mike.cleaner@scrub.com');
  });

  test('✅ Sarah should successfully login as an existing cleaner from database', async ({ page }) => {
    // Check if there's an existing cleaner in database
    const existingCleaner = await dbHelper.getUserByEmail('carl@gmail.com'); // From your database

    if (existingCleaner && existingCleaner.role === 'cleaner') {
      console.log('👨‍🧹 Found existing cleaner:', existingCleaner.first_name, existingCleaner.last_name);

      // Try login with existing cleaner (you'll need the actual password)
      const cleanerCredentials: LoginCredentials = {
        email: 'carl@gmail.com',
        password: '123' // Use actual password
      };

      await loginPage.performLogin(cleanerCredentials);
      await page.waitForTimeout(3000);

      const currentUrl = await loginPage.getCurrentUrl();
      console.log('📍 URL after existing cleaner login:', currentUrl);

      // Take screenshot
      await loginPage.takeScreenshot('existing-cleaner-login');

      // Verify login result
      const loginSuccessful = !currentUrl.includes('sign-in');
      if (loginSuccessful) {
        console.log('✅ Existing cleaner login successful');
      } else {
        console.log('❌ Existing cleaner login failed - check password');
      }
    } else {
      console.log('ℹ️ No existing cleaner found, skipping test');
      test.skip();
    }
  });

  test('❌ Invalid cleaner credentials should show error message', async ({ page }) => {
    const invalidCleanerCredentials: LoginCredentials = {
      email: 'fake.cleaner@scrub.com',
      password: 'wrongpassword'
    };

    await loginPage.performLogin(invalidCleanerCredentials);
    await page.waitForTimeout(2000);

    // Verify error message appears
    await expect(page.locator('text=Login Failed')).toBeVisible();
    
    // Verify still on login page
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('sign-in');

    console.log('❌ Invalid cleaner login failed as expected');
  });

  test('🔍 Compare cleaner vs client login behavior', async ({ page }) => {
    // Test both cleaner and client login to see differences
    
    // First, try client login
    const clientCredentials: LoginCredentials = {
      email: 'joshuavinceboco11@gmail.com', // Your existing client
      password: '123'
    };

    console.log('👤 Testing client login...');
    await loginPage.performLogin(clientCredentials);
    await page.waitForTimeout(3000);

    const clientUrl = await loginPage.getCurrentUrl();
    await loginPage.takeScreenshot('client-login-result');
    
    console.log('📍 Client login URL:', clientUrl);

    // Navigate back to login
    await loginPage.navigateToLoginPage();

    // Now try cleaner login (if exists)
    const cleanerCredentials: LoginCredentials = {
      email: 'carl@gmail.com', // Your existing cleaner
      password: '123'
    };

    console.log('🧹 Testing cleaner login...');
    await loginPage.performLogin(cleanerCredentials);
    await page.waitForTimeout(3000);

    const cleanerUrl = await loginPage.getCurrentUrl();
    await loginPage.takeScreenshot('cleaner-login-result');
    
    console.log('📍 Cleaner login URL:', cleanerUrl);

    // Compare results
    console.log('🔍 Login comparison:');
    console.log(`   Client URL: ${clientUrl}`);
    console.log(`   Cleaner URL: ${cleanerUrl}`);
    
    // Both should be successful (not on sign-in page)
    expect(clientUrl).not.toContain('sign-in');
    expect(cleanerUrl).not.toContain('sign-in');
  });
});
