import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { credentials } from '../../fixtures/testData';

test.describe('Admin Dashboard Tests', () => {
  test('should require admin authentication', async ({ page }) => {
    await page.goto('/admin-dashboard');
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should load admin dashboard for admin user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.admin.email, credentials.admin.password);
    
    await page.goto('/admin-dashboard');
    await expect(page.locator('.dashboard, [data-testid="admin-dashboard"]')).toBeVisible();
  });
});
