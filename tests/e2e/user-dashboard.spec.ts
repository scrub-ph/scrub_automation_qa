import { expect, test } from '@playwright/test';

test.describe('User Dashboard End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock user authentication
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user-123',
        email: 'client@test.com',
        name: 'Test Client',
        role: 'client',
        phone: '+63 912 345 6789'
      }));
    });
    
    await page.goto('/dashboard');
  });

  test.describe('Positive Test Cases', () => {
    test('should display dashboard overview correctly', async ({ page }) => {
      // Verify dashboard loads
      await expect(page.locator('h1')).toContainText(/Dashboard|Welcome/);
      
      // Verify user information
      await expect(page.locator('text=Test Client')).toBeVisible();
      await expect(page.locator('text=client@test.com')).toBeVisible();
      
      // Verify dashboard sections
      await expect(page.locator('text=Upcoming Bookings')).toBeVisible();
      await expect(page.locator('text=Recent Activity')).toBeVisible();
      await expect(page.locator('text=Quick Actions')).toBeVisible();
    });

    test('should display upcoming bookings correctly', async ({ page }) => {
      // Mock upcoming bookings
      await page.route('**/api/bookings/upcoming', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'booking-123',
              service: 'Regular Cleaning',
              date: '2024-12-25',
              time: '10:00 AM',
              status: 'confirmed',
              cleaner: 'Maria Santos'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Verify booking information
      await expect(page.locator('text=Regular Cleaning')).toBeVisible();
      await expect(page.locator('text=Dec 25, 2024')).toBeVisible();
      await expect(page.locator('text=10:00 AM')).toBeVisible();
      await expect(page.locator('text=Maria Santos')).toBeVisible();
      await expect(page.locator('text=Confirmed')).toBeVisible();
    });

    test('should allow booking management actions', async ({ page }) => {
      // Mock booking data
      await page.route('**/api/bookings/upcoming', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'booking-123',
              service: 'Regular Cleaning',
              date: '2024-12-25',
              time: '10:00 AM',
              status: 'confirmed'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Test reschedule booking
      await page.locator('button:has-text("Reschedule")').click();
      await expect(page.locator('text=Reschedule Booking')).toBeVisible();
      
      // Test cancel booking
      await page.locator('button:has-text("Cancel")').click();
      await expect(page.locator('text=Cancel Booking')).toBeVisible();
      await expect(page.locator('text=Are you sure')).toBeVisible();
    });

    test('should display booking history correctly', async ({ page }) => {
      // Navigate to booking history
      await page.locator('text=Booking History').click();
      
      // Mock booking history
      await page.route('**/api/bookings/history', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'booking-456',
              service: 'Deep Cleaning',
              date: '2024-10-15',
              status: 'completed',
              rating: 5,
              cost: 2500
            }
          ])
        });
      });
      
      await page.reload();
      
      // Verify history display
      await expect(page.locator('text=Deep Cleaning')).toBeVisible();
      await expect(page.locator('text=Oct 15, 2024')).toBeVisible();
      await expect(page.locator('text=Completed')).toBeVisible();
      await expect(page.locator('text=₱2,500')).toBeVisible();
    });

    test('should allow profile updates', async ({ page }) => {
      // Navigate to profile settings
      await page.locator('text=Profile Settings').click();
      
      // Update profile information
      await page.locator('input[name="name"]').fill('Updated Test Client');
      await page.locator('input[name="phone"]').fill('+63 987 654 3210');
      
      // Save changes
      await page.locator('button:has-text("Save Changes")').click();
      
      // Verify success message
      await expect(page.locator('text=Profile updated successfully')).toBeVisible();
    });

    test('should handle payment methods management', async ({ page }) => {
      // Navigate to payment methods
      await page.locator('text=Payment Methods').click();
      
      // Add new payment method
      await page.locator('button:has-text("Add Payment Method")').click();
      
      // Fill payment form
      await page.locator('input[name="cardNumber"]').fill('4111111111111111');
      await page.locator('input[name="expiryDate"]').fill('12/25');
      await page.locator('input[name="cvv"]').fill('123');
      await page.locator('input[name="cardholderName"]').fill('Test Client');
      
      // Save payment method
      await page.locator('button:has-text("Save Card")').click();
      
      // Verify success
      await expect(page.locator('text=Payment method added')).toBeVisible();
    });

    test('should display notifications correctly', async ({ page }) => {
      // Mock notifications
      await page.route('**/api/notifications', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'notif-123',
              type: 'booking_reminder',
              message: 'Your cleaning is scheduled for tomorrow at 10:00 AM',
              timestamp: '2024-10-20T10:00:00Z',
              read: false
            }
          ])
        });
      });
      
      // Click notifications
      await page.locator('[data-testid="notifications-bell"]').click();
      
      // Verify notification display
      await expect(page.locator('text=Your cleaning is scheduled')).toBeVisible();
      await expect(page.locator('[data-testid="unread-notification"]')).toBeVisible();
    });
  });

  test.describe('Negative Test Cases', () => {
    test('should handle unauthorized access', async ({ page }) => {
      // Clear authentication
      await page.evaluate(() => {
        localStorage.removeItem('user');
      });
      
      await page.reload();
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*sign-in/);
    });

    test('should handle API failures gracefully', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/bookings/**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal server error' })
        });
      });
      
      await page.reload();
      
      // Should show error message
      await expect(page.locator('text=Unable to load bookings')).toBeVisible();
      await expect(page.locator('button:has-text("Retry")').first()).toBeVisible();
    });

    test('should validate profile update inputs', async ({ page }) => {
      await page.locator('text=Profile Settings').click();
      
      // Try to save with invalid email
      await page.locator('input[name="email"]').fill('invalid-email');
      await page.locator('button:has-text("Save Changes")').click();
      
      // Should show validation error
      await expect(page.locator('text=Please enter a valid email')).toBeVisible();
      
      // Try to save with empty required fields
      await page.locator('input[name="name"]').fill('');
      await page.locator('button:has-text("Save Changes")').click();
      
      await expect(page.locator('text=Name is required')).toBeVisible();
    });

    test('should handle payment method validation', async ({ page }) => {
      await page.locator('text=Payment Methods').click();
      await page.locator('button:has-text("Add Payment Method")').click();
      
      // Try to save with invalid card number
      await page.locator('input[name="cardNumber"]').fill('1234');
      await page.locator('button:has-text("Save Card")').click();
      
      await expect(page.locator('text=Invalid card number')).toBeVisible();
      
      // Try with expired card
      await page.locator('input[name="cardNumber"]').fill('4111111111111111');
      await page.locator('input[name="expiryDate"]').fill('01/20');
      await page.locator('button:has-text("Save Card")').click();
      
      await expect(page.locator('text=Card has expired')).toBeVisible();
    });

    test('should handle booking cancellation restrictions', async ({ page }) => {
      // Mock booking with cancellation restrictions
      await page.route('**/api/bookings/upcoming', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'booking-123',
              service: 'Regular Cleaning',
              date: '2024-10-21', // Today
              time: '10:00 AM',
              status: 'confirmed',
              canCancel: false
            }
          ])
        });
      });
      
      await page.reload();
      
      // Try to cancel
      await page.locator('button:has-text("Cancel")').click();
      
      // Should show restriction message
      await expect(page.locator('text=Cannot cancel booking within 24 hours')).toBeVisible();
    });

    test('should handle network connectivity issues', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/**', route => {
        route.abort();
      });
      
      await page.reload();
      
      // Should show network error
      await expect(page.locator('text=Connection error')).toBeVisible();
      await expect(page.locator('text=Please check your internet connection')).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle empty booking history', async ({ page }) => {
      await page.locator('text=Booking History').click();
      
      // Mock empty history
      await page.route('**/api/bookings/history', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([])
        });
      });
      
      await page.reload();
      
      // Should show empty state
      await expect(page.locator('text=No bookings found')).toBeVisible();
      await expect(page.locator('button:has-text("Book Your First Service")').first()).toBeVisible();
    });

    test('should handle session expiration', async ({ page }) => {
      // Mock session expiration
      await page.route('**/api/**', route => {
        route.fulfill({
          status: 401,
          body: JSON.stringify({ error: 'Session expired' })
        });
      });
      
      // Try to perform an action
      await page.locator('text=Profile Settings').click();
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*sign-in/);
      await expect(page.locator('text=Session expired')).toBeVisible();
    });

    test('should handle concurrent booking modifications', async ({ page }) => {
      // Mock booking data
      await page.route('**/api/bookings/upcoming', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'booking-123',
              service: 'Regular Cleaning',
              date: '2024-12-25',
              time: '10:00 AM',
              status: 'confirmed'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Try to reschedule
      await page.locator('button:has-text("Reschedule")').click();
      
      // Mock conflict response
      await page.route('**/api/bookings/123/reschedule', route => {
        route.fulfill({
          status: 409,
          body: JSON.stringify({ error: 'Booking was modified by another session' })
        });
      });
      
      // Complete reschedule form
      await page.locator('input[type="date"]').fill('2024-12-26');
      await page.locator('button:has-text("Confirm Reschedule")').click();
      
      // Should show conflict message
      await expect(page.locator('text=Booking was modified')).toBeVisible();
    });

    test('should handle large booking history pagination', async ({ page }) => {
      await page.locator('text=Booking History').click();
      
      // Mock large dataset
      const bookings = Array.from({ length: 50 }, (_, i) => ({
        id: `booking-${i}`,
        service: 'Regular Cleaning',
        date: `2024-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
        status: 'completed'
      }));
      
      await page.route('**/api/bookings/history', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(bookings.slice(0, 10)) // First page
        });
      });
      
      await page.reload();
      
      // Verify pagination controls
      await expect(page.locator('button:has-text("Next")').first()).toBeVisible();
      await expect(page.locator('text=Page 1 of')).toBeVisible();
      
      // Test pagination
      await page.locator('button:has-text("Next")').first().click();
      await expect(page.locator('text=Page 2 of')).toBeVisible();
    });
  });
});
