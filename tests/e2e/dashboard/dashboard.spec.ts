import { test, expect } from '@playwright/test';
import { DashBoardPage } from '../../../src/pages/DashBoardPage';
import { LoginPage } from '../../../src/pages/LoginPage';
import { credentials } from '../../fixtures/testData';

test.describe('Dashboard Tests', () => {
  let dashboardPage: DashBoardPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashBoardPage(page);
    loginPage = new LoginPage(page);
  });

  test('client should see appropriate dashboard content', async ({ page }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.performLogin(credentials.client.email, credentials.client.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toBeTruthy();
    
    await dashboardPage.verifyDashboardLoaded();
    expect(await dashboardPage.getUserRole()).toBe('client');
  });

  test('cleaner should see appropriate dashboard content', async ({ page }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.performLogin(credentials.cleaner.email, credentials.cleaner.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toBeTruthy();
    
    await dashboardPage.verifyDashboardLoaded();
    expect(await dashboardPage.getUserRole()).toBe('cleaner');
  });

  test('should be able to logout from dashboard', async ({ page }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.performLogin(credentials.client.email, credentials.client.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.logout();
    await expect(page).toHaveURL(/.*sign-in|.*login/);
  });

  test('should show upcoming bookings section', async ({ page }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.performLogin(credentials.client.email, credentials.client.password);
    
    const bookingsSection = await dashboardPage.getUpcomingBookings();
    await expect(bookingsSection).toBeVisible();
  });

  test('should show notifications section', async ({ page }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.performLogin(credentials.client.email, credentials.client.password);
    
    const notificationsSection = await dashboardPage.getNotifications();
    await expect(notificationsSection).toBeVisible();
  });
});