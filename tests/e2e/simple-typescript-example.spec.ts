import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { LoginCredentials } from '../../src/types/user.types';

/**
 * SIMPLE TYPESCRIPT EXAMPLE - START HERE!
 * 
 * This is a basic example to understand Playwright + TypeScript
 * Run this test first to see how everything works together
 */

test.describe('🎯 Simple TypeScript Example - Easy to Understand', () => {

  test('🚀 Basic login test with TypeScript explanations', async ({ page }) => {
    
    // 1. CREATE PAGE OBJECT (TypeScript class)
    console.log('📄 Step 1: Creating LoginPage object...');
    const loginPage = new LoginPage(page);
    
    // 2. NAVIGATE TO PAGE
    console.log('🔄 Step 2: Navigating to login page...');
    await loginPage.navigateToLoginPage();
    
    // 3. CREATE TYPED DATA (TypeScript interface)
    console.log('📝 Step 3: Creating login credentials...');
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    // 4. PERFORM ACTIONS (TypeScript methods)
    console.log('🔐 Step 4: Entering login credentials...');
    await loginPage.enterEmailAddress(credentials.email);
    await loginPage.enterPassword(credentials.password);
    
    // 5. VERIFY ELEMENTS (TypeScript assertions)
    console.log('✅ Step 5: Verifying elements are visible...');
    await expect(loginPage.emailField).toHaveValue(credentials.email);
    await expect(loginPage.passwordField).toHaveValue(credentials.password);
    await expect(loginPage.signInBtn).toBeVisible();
    
    // 6. TAKE SCREENSHOT (TypeScript method)
    console.log('📸 Step 6: Taking screenshot...');
    await loginPage.takeScreenshot('simple-example');
    
    // 7. GET PAGE INFO (TypeScript return types)
    console.log('ℹ️ Step 7: Getting page information...');
    const currentUrl: string = await loginPage.getCurrentUrl();
    const pageTitle: string = await loginPage.getPageTitle();
    
    console.log(`📍 Current URL: ${currentUrl}`);
    console.log(`📄 Page Title: ${pageTitle}`);
    
    // 8. VERIFY WITH TYPESCRIPT
    console.log('🎯 Step 8: TypeScript type checking...');
    expect(typeof currentUrl).toBe('string');
    expect(typeof pageTitle).toBe('string');
    expect(currentUrl).toContain('sign-in');
    
    console.log('🎉 Test completed successfully!');
  });

  test('📊 Understanding TypeScript types in action', async ({ page }) => {
    
    // Different TypeScript types demonstrated
    const stringValue: string = 'Hello TypeScript';
    const numberValue: number = 42;
    const booleanValue: boolean = true;
    const arrayValue: string[] = ['item1', 'item2', 'item3'];
    
    // Object with interface
    const userInfo: LoginCredentials = {
      email: 'demo@test.com',
      password: 'demo123'
    };
    
    // Function with typed parameters and return
    const addNumbers = (a: number, b: number): number => {
      return a + b;
    };
    
    // Using the types
    console.log('🔤 String:', stringValue);
    console.log('🔢 Number:', numberValue);
    console.log('✅ Boolean:', booleanValue);
    console.log('📋 Array:', arrayValue);
    console.log('👤 User:', userInfo);
    console.log('➕ Addition:', addNumbers(5, 3));
    
    // TypeScript ensures type safety
    expect(typeof stringValue).toBe('string');
    expect(typeof numberValue).toBe('number');
    expect(typeof booleanValue).toBe('boolean');
    expect(Array.isArray(arrayValue)).toBe(true);
    expect(addNumbers(10, 20)).toBe(30);
    
    console.log('🎯 All TypeScript types working correctly!');
  });
});
