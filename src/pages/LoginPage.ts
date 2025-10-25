import { expect, Page, Locator } from '@playwright/test';
import { LoginCredentials } from '../types/user.types';

/**
 * Enhanced Login Page Object Model with TypeScript
 * 
 * This class demonstrates:
 * 1. TypeScript interfaces for type safety
 * 2. Private methods for internal logic
 * 3. Public methods for test interactions
 * 4. Proper error handling
 * 5. SCRUB app-specific selectors
 */
export class LoginPage {
  private readonly page: Page;
  
  // Locators for SCRUB app
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators with SCRUB app selectors
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('text=Login Failed, text=Invalid email or password');
    this.successMessage = page.locator('[data-testid="success-message"], .success-message');
    this.loadingSpinner = page.locator('.loading, .spinner');
  }

  // Navigation
  async navigateToLoginPage(): Promise<void> {
    console.log('Navigating to login page...');
    await this.page.goto('/sign-in');
    await this.waitForPageLoad();
  }

  private async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  // Actions
  async enterEmailAddress(email: string): Promise<void> {
    console.log(`Entering email: ${email}`);
    await this.emailInput.clear();
    await this.emailInput.fill(email);
    await expect(this.emailInput).toHaveValue(email);
  }

  async enterPassword(password: string): Promise<void> {
    console.log('Entering password...');
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
    await expect(this.passwordInput).toHaveValue(password);
  }

  async clickSignInButton(): Promise<void> {
    console.log('Clicking sign in button...');
    await this.signInButton.click();
    
    // Wait for either success redirect or error message
    await Promise.race([
      this.page.waitForURL(/dashboard|home|profile/, { timeout: 5000 }),
      this.errorMessage.waitFor({ state: 'visible', timeout: 5000 })
    ]).catch(() => {
      console.log('Login response timeout');
    });
  }

  async performLogin(email: string, password: string): Promise<void>;
  async performLogin(credentials: LoginCredentials): Promise<void>;
  async performLogin(emailOrCredentials: string | LoginCredentials, password?: string): Promise<void> {
    if (typeof emailOrCredentials === 'string') {
      console.log(`Performing login for: ${emailOrCredentials}`);
      await this.enterEmailAddress(emailOrCredentials);
      await this.enterPassword(password!);
    } else {
      console.log(`Performing login for: ${emailOrCredentials.email}`);
      await this.enterEmailAddress(emailOrCredentials.email);
      await this.enterPassword(emailOrCredentials.password);
    }
    await this.clickSignInButton();
  }

  // Validations
  async verifyLoginPageIsDisplayed(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async verifySuccessfulLoginRedirect(): Promise<void> {
    console.log('Verifying successful login...');
    await expect(this.page).toHaveURL(/dashboard|home|profile/);
    await expect(this.page).not.toHaveURL(/sign-in|login/);
    console.log('Login successful!');
  }

  async verifyErrorMessageIsDisplayed(expectedMessage?: string): Promise<void> {
    console.log('Verifying login failed...');
    await expect(this.errorMessage).toBeVisible();
    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
    await expect(this.page).toHaveURL(/sign-in|login/);
    console.log('Login failed as expected');
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.verifySuccessfulLoginRedirect();
  }

  async verifyLoginFailed(expectedMessage?: string): Promise<void> {
    await this.verifyErrorMessageIsDisplayed(expectedMessage);
  }

  // Utility methods
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await expect(locator).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  // Getter methods for backward compatibility
  public getEmailField(): Locator { return this.emailInput; }
  public getPasswordField(): Locator { return this.passwordInput; }
  public getSignInButton(): Locator { return this.signInButton; }
  public getErrorMessage(): Locator { return this.errorMessage; }
  public getSuccessMessage(): Locator { return this.successMessage; }

  // New getter methods
  get emailField(): Locator { return this.emailInput; }
  get passwordField(): Locator { return this.passwordInput; }
  get signInBtn(): Locator { return this.signInButton; }
  get errorMsg(): Locator { return this.errorMessage; }
}
