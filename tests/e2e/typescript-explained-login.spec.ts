import { test, expect, Page } from '@playwright/test';
import { EnhancedLoginPage } from '../../src/pages/EnhancedLoginPage';
import { LoginCredentials, User } from '../../src/types/user.types';
import { DatabaseHelper } from '../../src/utils/database-helper';

/**
 * PLAYWRIGHT WITH TYPESCRIPT - COMPREHENSIVE EXPLANATION
 * 
 * This test file demonstrates:
 * 1. TypeScript interfaces and types
 * 2. Async/await patterns
 * 3. Page Object Model implementation
 * 4. Error handling
 * 5. Test organization and structure
 * 6. Database integration
 */

// Test suite - groups related tests together
test.describe('🎭 Playwright TypeScript Implementation - Login Tests', () => {
  
  // Variables with TypeScript types
  let loginPage: EnhancedLoginPage;
  let dbHelper: DatabaseHelper;
  
  // Test data with TypeScript interfaces
  const validCredentials: LoginCredentials = {
    email: 'john.doe@example.com',
    password: 'SecurePassword123!'
  };

  const invalidCredentials: LoginCredentials = {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  };

  // Array of test users with TypeScript interface
  const testUsers: User[] = [
    {
      id: 'client-001',
      email: 'sarah.client@test.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'client'
    },
    {
      id: 'cleaner-001', 
      email: 'mike.cleaner@test.com',
      firstName: 'Mike',
      lastName: 'Wilson',
      role: 'cleaner'
    }
  ];

  /**
   * SETUP - Runs before all tests in this describe block
   * 
   * Purpose: Initialize database connection and shared resources
   */
  test.beforeAll(async (): Promise<void> => {
    console.log('🔧 Setting up test environment...');
    
    // Initialize database helper with TypeScript
    dbHelper = new DatabaseHelper();
    
    console.log('✅ Test environment ready');
  });

  /**
   * SETUP - Runs before each individual test
   * 
   * Purpose: Create fresh page instance and navigate to login
   * @param page - Playwright Page object (automatically injected)
   */
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    console.log('🚀 Starting new test...');
    
    // Create new page object instance with TypeScript
    loginPage = new EnhancedLoginPage(page);
    
    // Navigate to login page
    await loginPage.navigateToLoginPage();
    
    console.log('📄 Login page loaded');
  });

  /**
   * CLEANUP - Runs after all tests complete
   * 
   * Purpose: Clean up database connections and test data
   */
  test.afterAll(async (): Promise<void> => {
    console.log('🧹 Cleaning up test environment...');
    
    if (dbHelper) {
      await dbHelper.cleanupTestUsers();
      await dbHelper.close();
    }
    
    console.log('✅ Cleanup complete');
  });

  /**
   * TEST 1: Successful Login - Positive Test Case
   * 
   * This test demonstrates:
   * - TypeScript interface usage
   * - Async/await patterns
   * - Page Object Model methods
   * - Assertions with expect()
   */
  test('✅ Sarah should successfully login as a client with valid credentials', async ({ page }: { page: Page }): Promise<void> => {
    
    // Step 1: Create test user in database
    await test.step('Create test user in database', async (): Promise<void> => {
      const testUser: User = testUsers[0]; // Sarah (client)
      
      await dbHelper.createTestUser({
        email: testUser.email,
        password: '$2b$10$hashedPassword', // In real app, this would be properly hashed
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: testUser.role
      });
      
      console.log(`👤 Created test user: ${testUser.firstName} ${testUser.lastName}`);
    });

    // Step 2: Perform login using Page Object Model
    await test.step('Enter login credentials', async (): Promise<void> => {
      const credentials: LoginCredentials = {
        email: testUsers[0].email,
        password: 'password123' // Plain text for login
      };
      
      // Use TypeScript method with proper typing
      await loginPage.performLogin(credentials);
      
      console.log('🔐 Login credentials entered');
    });

    // Step 3: Verify successful login
    await test.step('Verify successful login', async (): Promise<void> => {
      // This method handles all success verification logic
      await loginPage.verifySuccessfulLogin();
      
      // Additional TypeScript-based assertions
      const currentUrl: string = await loginPage.getCurrentUrl();
      const pageTitle: string = await loginPage.getPageTitle();
      
      console.log(`📍 Current URL: ${currentUrl}`);
      console.log(`📄 Page title: ${pageTitle}`);
      
      // TypeScript ensures we're comparing strings
      expect(currentUrl).toMatch(/dashboard|home|profile/);
    });

    // Step 4: Cleanup test user
    await test.step('Cleanup test data', async (): Promise<void> => {
      await dbHelper.deleteTestUser(testUsers[0].email);
      console.log('🗑️ Test user cleaned up');
    });
  });

  /**
   * TEST 2: Failed Login - Negative Test Case
   * 
   * This test demonstrates:
   * - Error handling
   * - Negative test scenarios
   * - TypeScript error types
   */
  test('❌ Emma should see error message with invalid credentials', async ({ page }: { page: Page }): Promise<void> => {
    
    await test.step('Attempt login with invalid credentials', async (): Promise<void> => {
      // TypeScript ensures correct interface structure
      const badCredentials: LoginCredentials = {
        email: 'emma.invalid@test.com',
        password: 'wrongpassword123'
      };
      
      await loginPage.performLogin(badCredentials);
      console.log('🚫 Invalid credentials entered');
    });

    await test.step('Verify login failure', async (): Promise<void> => {
      // Method with optional parameter (TypeScript feature)
      await loginPage.verifyLoginFailed('Invalid credentials');
      
      // TypeScript boolean return type
      const isStillOnLoginPage: boolean = (await loginPage.getCurrentUrl()).includes('sign-in');
      expect(isStillOnLoginPage).toBe(true);
      
      console.log('✅ Login failed as expected');
    });
  });

  /**
   * TEST 3: Database Integration Test
   * 
   * This test demonstrates:
   * - Database operations with TypeScript
   * - Type-safe database queries
   * - Integration testing
   */
  test('🗄️ Database should properly store and retrieve user data with TypeScript types', async (): Promise<void> => {
    
    await test.step('Create multiple test users with different roles', async (): Promise<void> => {
      // Use TypeScript array methods with proper typing
      for (const user of testUsers) {
        await dbHelper.createTestUser({
          email: user.email,
          password: '$2b$10$hashedPassword',
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        });
        
        console.log(`👤 Created ${user.role}: ${user.firstName} ${user.lastName}`);
      }
    });

    await test.step('Verify users exist in database with correct types', async (): Promise<void> => {
      // TypeScript ensures proper return types
      for (const user of testUsers) {
        const dbUser = await dbHelper.getUserByEmail(user.email);
        
        // TypeScript null checking
        expect(dbUser).not.toBeNull();
        
        if (dbUser) {
          // TypeScript property access with type safety
          expect(dbUser.first_name).toBe(user.firstName);
          expect(dbUser.last_name).toBe(user.lastName);
          expect(dbUser.role).toBe(user.role);
          expect(dbUser.email).toBe(user.email);
          
          console.log(`✅ Verified ${user.role} data in database`);
        }
      }
    });

    await test.step('Cleanup all test users', async (): Promise<void> => {
      // TypeScript array method with proper typing
      const emailsToDelete: string[] = testUsers.map((user: User) => user.email);
      
      for (const email of emailsToDelete) {
        await dbHelper.deleteTestUser(email);
      }
      
      console.log('🗑️ All test users cleaned up');
    });
  });

  /**
   * TEST 4: Advanced TypeScript Features
   * 
   * This test demonstrates:
   * - Generic types
   * - Union types
   * - Optional parameters
   * - Type guards
   */
  test('🔧 Advanced TypeScript features in Playwright testing', async ({ page }: { page: Page }): Promise<void> => {
    
    await test.step('Demonstrate TypeScript type features', async (): Promise<void> => {
      // Union types - variable can be multiple types
      let userRole: 'client' | 'cleaner' | 'admin' = 'client';
      
      // Optional parameters with default values
      const takeScreenshotWithOptions = async (name: string, fullPage: boolean = true): Promise<void> => {
        await page.screenshot({ 
          path: `test-results/${name}.png`,
          fullPage 
        });
      };
      
      // Type guard function
      const isValidEmail = (email: string): boolean => {
        return email.includes('@') && email.includes('.');
      };
      
      // Generic function
      const logTestData = <T>(data: T, label: string): T => {
        console.log(`${label}:`, data);
        return data;
      };
      
      // Using the TypeScript features
      userRole = 'cleaner'; // TypeScript ensures only valid values
      await takeScreenshotWithOptions('advanced-test');
      
      const emailValid: boolean = isValidEmail('test@example.com');
      expect(emailValid).toBe(true);
      
      const userData = logTestData<User>(testUsers[0], 'Test User');
      expect(userData.role).toBe('client');
      
      console.log('🎯 Advanced TypeScript features demonstrated');
    });
  });

  /**
   * TEST 5: Error Handling and Debugging
   * 
   * This test demonstrates:
   * - Try/catch blocks
   * - Error types
   * - Debugging techniques
   */
  test('🐛 Error handling and debugging with TypeScript', async ({ page }: { page: Page }): Promise<void> => {
    
    await test.step('Demonstrate error handling', async (): Promise<void> => {
      try {
        // Intentionally cause an error for demonstration
        await page.goto('http://invalid-url-that-does-not-exist.com');
        
      } catch (error: unknown) {
        // TypeScript error handling with type checking
        if (error instanceof Error) {
          console.log(`❌ Caught error: ${error.message}`);
          expect(error.message).toContain('net::ERR_NAME_NOT_RESOLVED');
        } else {
          console.log('❌ Unknown error type:', error);
        }
      }
      
      // Navigate to correct page after error
      await loginPage.navigateToLoginPage();
      
      console.log('✅ Error handled gracefully');
    });

    await test.step('Debugging techniques', async (): Promise<void> => {
      // Take screenshot for debugging
      await loginPage.takeScreenshot('debug-screenshot');
      
      // Log page information
      const url: string = await loginPage.getCurrentUrl();
      const title: string = await loginPage.getPageTitle();
      
      console.log(`🔍 Debug info - URL: ${url}, Title: ${title}`);
      
      // Check element visibility for debugging
      const emailVisible: boolean = await loginPage.isElementVisible(loginPage.emailField);
      const passwordVisible: boolean = await loginPage.isElementVisible(loginPage.passwordField);
      
      expect(emailVisible).toBe(true);
      expect(passwordVisible).toBe(true);
      
      console.log('🔍 Element visibility check passed');
    });
  });
});
