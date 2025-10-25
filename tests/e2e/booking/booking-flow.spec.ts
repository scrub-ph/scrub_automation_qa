import { expect, test } from '@playwright/test';
import { BookingPage } from '../../../src/pages/BookingPage';
import { LoginPage } from '../../../src/pages/LoginPage';
import { credentials, bookingData } from '../../fixtures/testData';

test.describe('Booking Flow Tests', () => {
  let bookingPage: BookingPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
    loginPage = new LoginPage(page);
  });

  test('should load get started page', async ({ page }) => {
    await page.goto('/get-started');
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should navigate to client registration', async ({ page }) => {
    await page.goto('/get-started');
    await page.click('button:has-text("Join as Client"), a:has-text("Client")');
    await expect(page).toHaveURL(/.*client/);
  });

  test('should complete booking flow', async ({ page }) => {
    await page.goto('/sign-in');
    await loginPage.login(credentials.client.email, credentials.client.password);
    
    await page.goto('/booking');
    await bookingPage.fillBookingForm(bookingData.regularCleaning);
    await bookingPage.submitBooking();
    
    // Verify booking completion
    await expect(page.locator('.success, [data-testid="success"]')).toBeVisible();
  });
});
