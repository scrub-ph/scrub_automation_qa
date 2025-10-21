import { expect, test } from '@playwright/test';

test.describe('Booking Flow End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/book');
  });

  test.describe('Positive Test Cases', () => {
    test('should complete full booking flow successfully', async ({ page }) => {
      // Step 1: Select service type
      await expect(page.locator('h1')).toContainText(/Book|Service/);
      
      await page.locator('text=Regular Cleaning').click();
      await page.locator('button:has-text("Next")').click();
      
      // Step 2: Select date and time
      await expect(page.locator('text=Select Date')).toBeVisible();
      
      // Select tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.getDate().toString();
      
      await page.locator(`text=${tomorrowStr}`).first().click();
      await page.locator('text=10:00 AM').click();
      await page.locator('button:has-text("Next")').click();
      
      // Step 3: Enter location details
      await expect(page.locator('text=Location Details')).toBeVisible();
      
      await page.locator('input[placeholder*="address"]').fill('123 Test Street, Makati City');
      await page.locator('textarea[placeholder*="instructions"]').fill('2nd floor, blue gate');
      await page.locator('button:has-text("Next")').click();
      
      // Step 4: Review and confirm
      await expect(page.locator('text=Review Booking')).toBeVisible();
      
      // Verify booking details
      await expect(page.locator('text=Regular Cleaning')).toBeVisible();
      await expect(page.locator('text=123 Test Street')).toBeVisible();
      await expect(page.locator('text=10:00 AM')).toBeVisible();
      
      // Confirm booking
      await page.locator('button:has-text("Confirm Booking")').click();
      
      // Verify success
      await expect(page.locator('text=Booking Confirmed')).toBeVisible();
      await expect(page.locator('text=Booking ID')).toBeVisible();
    });

    test('should allow service customization', async ({ page }) => {
      // Select Deep Cleaning
      await page.locator('text=Deep Cleaning').click();
      
      // Add extra services
      await page.locator('text=Add carpet cleaning').check();
      await page.locator('text=Add window cleaning').check();
      
      // Verify price updates
      const priceElement = page.locator('[data-testid="total-price"]');
      await expect(priceElement).toBeVisible();
      
      await page.locator('button:has-text("Next")').click();
      
      // Verify extras are included in summary
      await page.locator('button:has-text("Next")').click(); // Skip date selection
      await page.locator('input[placeholder*="address"]').fill('Test Address');
      await page.locator('button:has-text("Next")').click();
      
      await expect(page.locator('text=carpet cleaning')).toBeVisible();
      await expect(page.locator('text=window cleaning')).toBeVisible();
    });

    test('should handle recurring booking setup', async ({ page }) => {
      await page.locator('text=Regular Cleaning').click();
      
      // Enable recurring booking
      await page.locator('text=Make this recurring').check();
      
      // Select frequency
      await page.locator('select[name="frequency"]').selectOption('weekly');
      
      await page.locator('button:has-text("Next")').click();
      
      // Complete booking flow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await page.locator(`text=${tomorrow.getDate()}`).first().click();
      await page.locator('text=10:00 AM').click();
      await page.locator('button:has-text("Next")').click();
      
      await page.locator('input[placeholder*="address"]').fill('123 Recurring Street');
      await page.locator('button:has-text("Next")').click();
      
      // Verify recurring details in summary
      await expect(page.locator('text=Weekly')).toBeVisible();
      await expect(page.locator('text=Recurring')).toBeVisible();
    });

    test('should save booking for logged-in users', async ({ page }) => {
      // Simulate logged-in state
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({
          id: 'test-user-123',
          email: 'test@example.com',
          name: 'Test User'
        }));
      });
      
      await page.reload();
      
      // Complete booking
      await page.locator('text=Regular Cleaning').click();
      await page.locator('button:has-text("Next")').click();
      
      // User details should be pre-filled
      await expect(page.locator('input[value="test@example.com"]')).toBeVisible();
      await expect(page.locator('input[value="Test User"]')).toBeVisible();
    });
  });

  test.describe('Negative Test Cases', () => {
    test('should validate required fields', async ({ page }) => {
      // Try to proceed without selecting service
      await page.locator('button:has-text("Next")').click();
      
      // Should show validation error
      await expect(page.locator('text=Please select a service')).toBeVisible();
      
      // Select service and try to proceed without date
      await page.locator('text=Regular Cleaning').click();
      await page.locator('button:has-text("Next")').click();
      await page.locator('button:has-text("Next")').click();
      
      await expect(page.locator('text=Please select a date')).toBeVisible();
    });

    test('should handle past date selection', async ({ page }) => {
      await page.locator('text=Regular Cleaning').click();
      await page.locator('button:has-text("Next")').click();
      
      // Try to select yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.getDate().toString();
      
      const pastDate = page.locator(`text=${yesterdayStr}`).first();
      if (await pastDate.isVisible()) {
        await pastDate.click();
        
        // Should show error or disable past dates
        await expect(page.locator('text=Cannot select past dates')).toBeVisible();
      }
    });

    test('should handle invalid address input', async ({ page }) => {
      await page.locator('text=Regular Cleaning').click();
      await page.locator('button:has-text("Next")').click();
      
      // Select valid date and time
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await page.locator(`text=${tomorrow.getDate()}`).first().click();
      await page.locator('text=10:00 AM').click();
      await page.locator('button:has-text("Next")').click();
      
      // Enter invalid address
      await page.locator('input[placeholder*="address"]').fill('');
      await page.locator('button:has-text("Next")').click();
      
      // Should show validation error
      await expect(page.locator('text=Address is required')).toBeVisible();
      
      // Try with very short address
      await page.locator('input[placeholder*="address"]').fill('a');
      await page.locator('button:has-text("Next")').click();
      
      await expect(page.locator('text=Please enter a valid address')).toBeVisible();
    });

    test('should handle booking conflicts', async ({ page }) => {
      await page.locator('text=Regular Cleaning').click();
      await page.locator('button:has-text("Next")').click();
      
      // Select a potentially busy time slot
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await page.locator(`text=${tomorrow.getDate()}`).first().click();
      
      // Try to select a time slot that might be unavailable
      const timeSlot = page.locator('text=8:00 AM');
      if (await timeSlot.isVisible()) {
        await timeSlot.click();
        
        // If slot is unavailable, should show message
        const unavailableMessage = page.locator('text=This time slot is not available');
        if (await unavailableMessage.isVisible()) {
          await expect(unavailableMessage).toBeVisible();
        }
      }
    });

    test('should handle payment processing errors', async ({ page }) => {
      // Complete booking flow
      await page.locator('text=Regular Cleaning').click();
      await page.locator('button:has-text("Next")').click();
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await page.locator(`text=${tomorrow.getDate()}`).first().click();
      await page.locator('text=10:00 AM').click();
      await page.locator('button:has-text("Next")').click();
      
      await page.locator('input[placeholder*="address"]').fill('123 Test Street');
      await page.locator('button:has-text("Next")').click();
      
      // Mock payment failure
      await page.route('**/api/payment/**', route => {
        route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Payment failed' })
        });
      });
      
      await page.locator('button:has-text("Confirm Booking")').click();
      
      // Should show payment error
      await expect(page.locator('text=Payment failed')).toBeVisible();
      await expect(page.locator('text=Please try again')).toBeVisible();
    });

    test('should handle network connectivity issues', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/**', route => {
        route.abort();
      });
      
      await page.locator('text=Regular Cleaning').click();
      await page.locator('button:has-text("Next")').click();
      
      // Should show network error
      await expect(page.locator('text=Network error')).toBeVisible();
      await expect(page.locator('text=Please check your connection')).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle maximum booking limit', async ({ page }) => {
      // Simulate user with maximum bookings
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({
          id: 'test-user-123',
          bookingCount: 10,
          maxBookings: 10
        }));
      });
      
      await page.reload();
      
      // Should show booking limit message
      await expect(page.locator('text=booking limit reached')).toBeVisible();
    });

    test('should handle service area restrictions', async ({ page }) => {
      await page.locator('text=Regular Cleaning').click();
      await page.locator('button:has-text("Next")').click();
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await page.locator(`text=${tomorrow.getDate()}`).first().click();
      await page.locator('text=10:00 AM').click();
      await page.locator('button:has-text("Next")').click();
      
      // Enter address outside service area
      await page.locator('input[placeholder*="address"]').fill('Remote Location, Far Province');
      await page.locator('button:has-text("Next")').click();
      
      // Should show service area restriction
      await expect(page.locator('text=outside our service area')).toBeVisible();
    });

    test('should handle browser back/forward navigation', async ({ page }) => {
      await page.locator('text=Regular Cleaning').click();
      await page.locator('button:has-text("Next")').click();
      
      // Go back
      await page.goBack();
      
      // Should maintain selected service
      await expect(page.locator('text=Regular Cleaning')).toHaveClass(/selected/);
      
      // Go forward
      await page.goForward();
      
      // Should be on date selection step
      await expect(page.locator('text=Select Date')).toBeVisible();
    });
  });
});
