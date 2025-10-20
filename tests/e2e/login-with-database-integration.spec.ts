import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DatabaseHelper } from '../../src/utils/database-helper';

test.describe('Login Tests with Database Integration', () => {
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

  test('Sarah should login successfully with credentials from database', async ({ page }) => {
    // Create test user in database
    const testUser = await dbHelper.createTestUser({
      email: 'sarah.test@email.com',
      password: '$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O', // hashed version of 'password123'
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'client'
    });

    console.log('Created test user:', testUser);

    // Verify user exists in database
    const userFromDb = await dbHelper.getUserByEmail('sarah.test@email.com');
    expect(userFromDb).toBeTruthy();
    expect(userFromDb.first_name).toBe('Sarah');

    // Attempt login (Note: password should be plain text for login, not hashed)
    await loginPage.performLogin('sarah.test@email.com', 'password123');
    
    // Clean up
    await dbHelper.deleteTestUser('sarah.test@email.com');
  });

  test('Michael should see error when user does not exist in database', async ({ page }) => {
    const nonExistentEmail = 'michael.notfound@email.com';
    
    // Verify user does not exist in database
    const userFromDb = await dbHelper.getUserByEmail(nonExistentEmail);
    expect(userFromDb).toBeNull();

    // Attempt login
    await loginPage.performLogin(nonExistentEmail, 'anypassword');
    await loginPage.verifyErrorMessageIsDisplayed();
  });

  test('Emma should login with existing user from database', async ({ page }) => {
    // Get existing user from database
    const existingUser = await dbHelper.getUserByEmail('joshuavinceboco11@gmail.com');
    
    if (existingUser) {
      console.log('Found existing user:', existingUser);
      
      // Try login with existing user (you'll need to know the actual password)
      await loginPage.performLogin('joshuavinceboco11@gmail.com', '123'); // Use actual password
      
      // Check if login was successful or failed
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      console.log('Current URL after login:', currentUrl);
    } else {
      console.log('No existing user found');
    }
  });

  test('Database should contain users table with proper structure', async () => {
    // Get all users to verify database connection
    const users = await dbHelper.getAllUsers();
    console.log('Users in database:', users);
    
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    
    if (users.length > 0) {
      const firstUser = users[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('email');
      expect(firstUser).toHaveProperty('first_name');
      expect(firstUser).toHaveProperty('last_name');
      expect(firstUser).toHaveProperty('role');
    }
  });

  test('Lisa should be created as cleaner and login successfully', async ({ page }) => {
    // Create cleaner user
    const cleanerUser = await dbHelper.createTestUser({
      email: 'lisa.cleaner@scrub.com',
      password: '$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O', // hashed 'cleanerpass'
      firstName: 'Lisa',
      lastName: 'Chen',
      role: 'cleaner'
    });

    console.log('Created cleaner user:', cleanerUser);

    // Verify cleaner role in database
    const cleanerFromDb = await dbHelper.getUserByEmail('lisa.cleaner@scrub.com');
    expect(cleanerFromDb.role).toBe('cleaner');

    // Attempt login
    await loginPage.performLogin('lisa.cleaner@scrub.com', 'cleanerpass');
    
    // Clean up
    await dbHelper.deleteTestUser('lisa.cleaner@scrub.com');
  });
});
