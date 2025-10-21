import { expect, test } from '@playwright/test';

test.describe('Cleaner Dashboard End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock cleaner authentication
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'cleaner-456',
        email: 'cleaner@test.com',
        name: 'Maria Santos',
        role: 'cleaner',
        phone: '+63 912 345 6789',
        rating: 4.8,
        completedJobs: 127,
        status: 'active'
      }));
    });
    
    await page.goto('/cleaner-dashboard');
  });

  test.describe('Positive Test Cases', () => {
    test('should display cleaner dashboard overview correctly', async ({ page }) => {
      // Verify dashboard loads
      await expect(page.locator('h1')).toContainText(/Dashboard|Welcome/);
      
      // Verify cleaner information
      await expect(page.locator('text=Maria Santos')).toBeVisible();
      await expect(page.locator('text=cleaner@test.com')).toBeVisible();
      await expect(page.locator('text=4.8')).toBeVisible(); // Rating
      await expect(page.locator('text=127')).toBeVisible(); // Completed jobs
      
      // Verify dashboard sections
      await expect(page.locator('text=Today\'s Schedule')).toBeVisible();
      await expect(page.locator('text=Available Jobs')).toBeVisible();
      await expect(page.locator('text=Earnings')).toBeVisible();
    });

    test('should display today\'s schedule correctly', async ({ page }) => {
      // Mock today's jobs
      await page.route('**/api/cleaner/schedule/today', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'job-123',
              client: 'John Doe',
              service: 'Regular Cleaning',
              time: '10:00 AM',
              address: '123 Main St, Makati',
              status: 'confirmed',
              duration: '2 hours',
              payment: 1500
            }
          ])
        });
      });
      
      await page.reload();
      
      // Verify job information
      await expect(page.locator('text=John Doe')).toBeVisible();
      await expect(page.locator('text=Regular Cleaning')).toBeVisible();
      await expect(page.locator('text=10:00 AM')).toBeVisible();
      await expect(page.locator('text=123 Main St')).toBeVisible();
      await expect(page.locator('text=₱1,500')).toBeVisible();
    });

    test('should allow job status updates', async ({ page }) => {
      // Mock job data
      await page.route('**/api/cleaner/schedule/today', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'job-123',
              client: 'John Doe',
              service: 'Regular Cleaning',
              time: '10:00 AM',
              status: 'confirmed'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Start job
      await page.locator('button:has-text("Start Job")').click();
      await expect(page.locator('text=Job Started')).toBeVisible();
      
      // Complete job
      await page.locator('button:has-text("Complete Job")').click();
      
      // Fill completion form
      await page.locator('textarea[placeholder*="notes"]').fill('Cleaning completed successfully. All areas cleaned thoroughly.');
      await page.locator('button:has-text("Mark as Complete")').click();
      
      // Verify completion
      await expect(page.locator('text=Job completed successfully')).toBeVisible();
    });

    test('should display available jobs correctly', async ({ page }) => {
      // Navigate to available jobs
      await page.locator('text=Available Jobs').click();
      
      // Mock available jobs
      await page.route('**/api/cleaner/jobs/available', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'job-456',
              service: 'Deep Cleaning',
              date: '2024-12-25',
              time: '2:00 PM',
              address: '456 Oak Ave, BGC',
              payment: 3000,
              duration: '4 hours',
              distance: '2.5 km'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Verify job listing
      await expect(page.locator('text=Deep Cleaning')).toBeVisible();
      await expect(page.locator('text=Dec 25, 2024')).toBeVisible();
      await expect(page.locator('text=₱3,000')).toBeVisible();
      await expect(page.locator('text=2.5 km')).toBeVisible();
    });

    test('should allow job acceptance', async ({ page }) => {
      await page.locator('text=Available Jobs').click();
      
      // Mock available job
      await page.route('**/api/cleaner/jobs/available', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'job-456',
              service: 'Deep Cleaning',
              date: '2024-12-25',
              payment: 3000
            }
          ])
        });
      });
      
      await page.reload();
      
      // Accept job
      await page.locator('button:has-text("Accept Job")').click();
      
      // Confirm acceptance
      await page.locator('button:has-text("Confirm Accept")').click();
      
      // Verify success
      await expect(page.locator('text=Job accepted successfully')).toBeVisible();
    });

    test('should display earnings summary', async ({ page }) => {
      // Navigate to earnings
      await page.locator('text=Earnings').click();
      
      // Mock earnings data
      await page.route('**/api/cleaner/earnings', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            today: 1500,
            thisWeek: 8500,
            thisMonth: 32000,
            total: 127500,
            pending: 2500
          })
        });
      });
      
      await page.reload();
      
      // Verify earnings display
      await expect(page.locator('text=₱1,500')).toBeVisible(); // Today
      await expect(page.locator('text=₱8,500')).toBeVisible(); // This week
      await expect(page.locator('text=₱32,000')).toBeVisible(); // This month
      await expect(page.locator('text=₱2,500')).toBeVisible(); // Pending
    });

    test('should allow availability management', async ({ page }) => {
      // Navigate to availability settings
      await page.locator('text=Availability').click();
      
      // Set availability
      await page.locator('input[name="monday"]').check();
      await page.locator('input[name="tuesday"]').check();
      await page.locator('select[name="startTime"]').selectOption('08:00');
      await page.locator('select[name="endTime"]').selectOption('18:00');
      
      // Save availability
      await page.locator('button:has-text("Save Availability")').click();
      
      // Verify success
      await expect(page.locator('text=Availability updated')).toBeVisible();
    });

    test('should display client reviews and ratings', async ({ page }) => {
      // Navigate to reviews
      await page.locator('text=Reviews').click();
      
      // Mock reviews data
      await page.route('**/api/cleaner/reviews', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'review-123',
              client: 'Jane Smith',
              rating: 5,
              comment: 'Excellent service! Very thorough and professional.',
              date: '2024-10-15',
              service: 'Deep Cleaning'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Verify review display
      await expect(page.locator('text=Jane Smith')).toBeVisible();
      await expect(page.locator('text=Excellent service')).toBeVisible();
      await expect(page.locator('[data-testid="5-stars"]')).toBeVisible();
    });
  });

  test.describe('Negative Test Cases', () => {
    test('should handle unauthorized cleaner access', async ({ page }) => {
      // Clear authentication
      await page.evaluate(() => {
        localStorage.removeItem('user');
      });
      
      await page.reload();
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*sign-in/);
    });

    test('should handle suspended cleaner account', async ({ page }) => {
      // Mock suspended cleaner
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({
          id: 'cleaner-456',
          email: 'cleaner@test.com',
          name: 'Maria Santos',
          role: 'cleaner',
          status: 'suspended'
        }));
      });
      
      await page.reload();
      
      // Should show suspension message
      await expect(page.locator('text=Account suspended')).toBeVisible();
      await expect(page.locator('text=Contact support')).toBeVisible();
    });

    test('should validate job completion requirements', async ({ page }) => {
      // Mock active job
      await page.route('**/api/cleaner/schedule/today', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'job-123',
              status: 'in_progress'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Try to complete without notes
      await page.locator('button:has-text("Complete Job")').click();
      await page.locator('button:has-text("Mark as Complete")').click();
      
      // Should show validation error
      await expect(page.locator('text=Please add completion notes')).toBeVisible();
    });

    test('should handle job acceptance conflicts', async ({ page }) => {
      await page.locator('text=Available Jobs').click();
      
      // Mock job that becomes unavailable
      await page.route('**/api/cleaner/jobs/456/accept', route => {
        route.fulfill({
          status: 409,
          body: JSON.stringify({ error: 'Job no longer available' })
        });
      });
      
      await page.locator('button:has-text("Accept Job")').click();
      await page.locator('button:has-text("Confirm Accept")').click();
      
      // Should show conflict message
      await expect(page.locator('text=Job no longer available')).toBeVisible();
    });

    test('should handle earnings calculation errors', async ({ page }) => {
      await page.locator('text=Earnings').click();
      
      // Mock API error
      await page.route('**/api/cleaner/earnings', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Unable to calculate earnings' })
        });
      });
      
      await page.reload();
      
      // Should show error message
      await expect(page.locator('text=Unable to load earnings')).toBeVisible();
      await expect(page.locator('button:has-text("Retry")').first()).toBeVisible();
    });

    test('should validate availability time constraints', async ({ page }) => {
      await page.locator('text=Availability').click();
      
      // Set invalid time range (end before start)
      await page.locator('select[name="startTime"]').selectOption('18:00');
      await page.locator('select[name="endTime"]').selectOption('08:00');
      
      await page.locator('button:has-text("Save Availability")').click();
      
      // Should show validation error
      await expect(page.locator('text=End time must be after start time')).toBeVisible();
    });

    test('should handle location tracking failures', async ({ page }) => {
      // Mock geolocation failure
      await page.context().grantPermissions([]);
      
      // Try to start job that requires location
      await page.locator('button:has-text("Start Job")').click();
      
      // Should show location error
      await expect(page.locator('text=Location access required')).toBeVisible();
      await expect(page.locator('text=Please enable location services')).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle no jobs available', async ({ page }) => {
      await page.locator('text=Available Jobs').click();
      
      // Mock empty jobs
      await page.route('**/api/cleaner/jobs/available', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([])
        });
      });
      
      await page.reload();
      
      // Should show empty state
      await expect(page.locator('text=No jobs available')).toBeVisible();
      await expect(page.locator('text=Check back later')).toBeVisible();
    });

    test('should handle new cleaner onboarding', async ({ page }) => {
      // Mock new cleaner
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({
          id: 'cleaner-new',
          email: 'newcleaner@test.com',
          name: 'New Cleaner',
          role: 'cleaner',
          completedJobs: 0,
          status: 'pending_verification'
        }));
      });
      
      await page.reload();
      
      // Should show onboarding message
      await expect(page.locator('text=Welcome to SCRUB')).toBeVisible();
      await expect(page.locator('text=Complete your profile')).toBeVisible();
      await expect(page.locator('button:has-text("Complete Setup")').first()).toBeVisible();
    });

    test('should handle concurrent job updates', async ({ page }) => {
      // Mock job status conflict
      await page.route('**/api/cleaner/jobs/123/complete', route => {
        route.fulfill({
          status: 409,
          body: JSON.stringify({ error: 'Job status was updated by another session' })
        });
      });
      
      await page.locator('button:has-text("Complete Job")').click();
      await page.locator('textarea[placeholder*="notes"]').fill('Job completed');
      await page.locator('button:has-text("Mark as Complete")').click();
      
      // Should show conflict message
      await expect(page.locator('text=Job status was updated')).toBeVisible();
      await expect(page.locator('button:has-text("Refresh")').first()).toBeVisible();
    });

    test('should handle payment processing delays', async ({ page }) => {
      await page.locator('text=Earnings').click();
      
      // Mock payment processing status
      await page.route('**/api/cleaner/earnings', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            today: 1500,
            pending: 5000,
            processingDelay: true,
            nextPaymentDate: '2024-10-25'
          })
        });
      });
      
      await page.reload();
      
      // Should show payment delay notice
      await expect(page.locator('text=Payment processing delayed')).toBeVisible();
      await expect(page.locator('text=Next payment: Oct 25')).toBeVisible();
    });

    test('should handle emergency job cancellations', async ({ page }) => {
      // Mock emergency cancellation
      await page.route('**/api/cleaner/notifications', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'notif-emergency',
              type: 'job_cancelled',
              message: 'Job #123 has been cancelled due to emergency',
              urgent: true
            }
          ])
        });
      });
      
      // Should show emergency notification
      await expect(page.locator('[data-testid="urgent-notification"]')).toBeVisible();
      await expect(page.locator('text=Job #123 has been cancelled')).toBeVisible();
    });
  });
});
