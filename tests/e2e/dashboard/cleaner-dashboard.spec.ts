import { test, expect, Page, Route } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { DashBoardPage } from '../../../src/pages/DashBoardPage';
import { credentials } from '../../fixtures/testData';

test.describe('Cleaner Dashboard', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashBoardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashBoardPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.performLogin(credentials.cleaner.email, credentials.cleaner.password);
  });

  test('should display cleaner dashboard after login', async ({ page }) => {
    await expect(page).toHaveURL(/.*dashboard/);
    await dashboardPage.verifyDashboardLoaded();
    expect(await dashboardPage.getUserRole()).toBe('cleaner');
  });

  test('should show assigned bookings', async ({ page }) => {
    const bookingsSection = await dashboardPage.getUpcomingBookings();
    await expect(bookingsSection).toBeVisible();
  });

  test('should have welcome message', async ({ page }) => {
    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toBeTruthy();
  });

  test('Cleaner Dashboard - view and manage jobs (stubs backend)', async ({ page }: { page: Page }) => {
    // Mock the auth state for a cleaner
    await page.route('**/api/auth/session', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'cleaner-123',
            email: 'test.cleaner@example.com',
            role: 'cleaner',
            verificationStatus: 'verified',
            profile: {
              fullName: 'Test Cleaner',
              rating: '4.8',
              totalJobs: 50
            }
          }
        })
      });
    });

    // Mock upcoming jobs
    await page.route('**/api/bookings/cleaner', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'booking-1',
            status: 'confirmed',
            scheduledDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
            scheduledTime: '10:00 AM',
            address: 'Test Address 1',
            city: 'Makati',
            serviceName: 'Regular Cleaning',
            propertyType: 'Condominium',
            propertySize: '2 bedrooms',
            totalAmount: '1500.00',
            client: {
              fullName: 'Test Client 1',
              rating: '4.9'
            }
          },
          {
            id: 'booking-2',
            status: 'pending',
            scheduledDate: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
            scheduledTime: '2:00 PM',
            address: 'Test Address 2',
            city: 'Manila',
            serviceName: 'Deep Cleaning',
            propertyType: 'House',
            propertySize: '3 bedrooms',
            totalAmount: '2500.00',
            client: {
              fullName: 'Test Client 2',
              rating: '4.7'
            }
          }
        ])
      });
    });

    // Mock earnings data
    await page.route('**/api/cleaners/earnings', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          currentBalance: '5000.00',
          totalEarnings: '25000.00',
          weeklyEarnings: '3500.00',
          completedJobs: 50,
          averageRating: 4.8
        })
      });
    });

    // Go to the cleaner dashboard
    await page.goto('/cleaner/dashboard');

    // Verify cleaner profile information is displayed
    await expect(page.locator('text=Test Cleaner')).toBeVisible();
    await expect(page.locator('text=4.8')).toBeVisible();
    await expect(page.locator('text=50 completed jobs')).toBeVisible();

    // Check earnings section
    await expect(page.locator('text=₱5,000.00')).toBeVisible(); // Current balance
    await expect(page.locator('text=₱25,000.00')).toBeVisible(); // Total earnings
    await expect(page.locator('text=₱3,500.00')).toBeVisible(); // Weekly earnings

    // Verify upcoming jobs are listed
    await expect(page.locator('text=Test Address 1')).toBeVisible();
    await expect(page.locator('text=10:00 AM')).toBeVisible();
    await expect(page.locator('text=Regular Cleaning')).toBeVisible();

    // Test job action buttons
    await page.route('**/api/bookings/*/start', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Click "Start Job" on the first job
    await page.click('[data-testid="button-start-job-booking-1"]');
    
    // Verify start job confirmation modal appears
    await expect(page.locator('text=Start Job Confirmation')).toBeVisible();
    
    // Confirm start job
    await Promise.all([
      page.waitForResponse('**/api/bookings/*/start'),
      page.click('[data-testid="button-confirm-start-job"]')
    ]);

    // Test job navigation
    await page.click('[data-testid="tab-completed-jobs"]');
    
    // Verify completed jobs section
    await expect(page.locator('text=Completed Jobs')).toBeVisible();

    // Test schedule management
    await page.click('[data-testid="button-manage-schedule"]');
    
    // Verify schedule editor is shown
    await expect(page.locator('text=Manage Schedule')).toBeVisible();
    
    // Toggle availability for a time slot
    await page.click('[data-testid="checkbox-monday-slot0"]');
    
    // Save schedule changes
    await page.route('**/api/cleaners/schedule', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await Promise.all([
      page.waitForResponse('**/api/cleaners/schedule'),
      page.click('[data-testid="button-save-schedule"]')
    ]);

    // Verify schedule was saved
    await expect(page.locator('text=Schedule updated successfully')).toBeVisible();
  });
});
