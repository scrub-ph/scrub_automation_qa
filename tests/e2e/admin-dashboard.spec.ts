import { expect, test } from '@playwright/test';

test.describe('Admin Dashboard End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock admin authentication
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'admin-789',
        email: 'admin@scrub.com',
        name: 'Admin User',
        role: 'admin',
        permissions: ['manage_users', 'manage_bookings', 'view_analytics', 'manage_payments']
      }));
    });
    
    await page.goto('/admin-dashboard');
  });

  test.describe('Positive Test Cases', () => {
    test('should display admin dashboard overview correctly', async ({ page }) => {
      // Verify dashboard loads
      await expect(page.locator('h1')).toContainText(/Admin Dashboard|Overview/);
      
      // Verify admin information
      await expect(page.locator('text=Admin User')).toBeVisible();
      
      // Verify dashboard sections
      await expect(page.locator('text=System Overview')).toBeVisible();
      await expect(page.locator('text=User Management')).toBeVisible();
      await expect(page.locator('text=Booking Management')).toBeVisible();
      await expect(page.locator('text=Analytics')).toBeVisible();
    });

    test('should display system metrics correctly', async ({ page }) => {
      // Mock system metrics
      await page.route('**/api/admin/metrics', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            totalUsers: 1250,
            activeCleaners: 89,
            todayBookings: 45,
            monthlyRevenue: 125000,
            systemHealth: 'good'
          })
        });
      });
      
      await page.reload();
      
      // Verify metrics display
      await expect(page.locator('text=1,250')).toBeVisible(); // Total users
      await expect(page.locator('text=89')).toBeVisible(); // Active cleaners
      await expect(page.locator('text=45')).toBeVisible(); // Today's bookings
      await expect(page.locator('text=₱125,000')).toBeVisible(); // Monthly revenue
      await expect(page.locator('text=System Health: Good')).toBeVisible();
    });

    test('should manage user accounts effectively', async ({ page }) => {
      // Navigate to user management
      await page.locator('text=User Management').click();
      
      // Mock users data
      await page.route('**/api/admin/users', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'user-123',
              name: 'John Doe',
              email: 'john@example.com',
              role: 'client',
              status: 'active',
              joinDate: '2024-01-15'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Verify user listing
      await expect(page.locator('text=John Doe')).toBeVisible();
      await expect(page.locator('text=john@example.com')).toBeVisible();
      await expect(page.locator('text=Client')).toBeVisible();
      await expect(page.locator('text=Active')).toBeVisible();
      
      // Test user actions
      await page.locator('button:has-text("Edit")').first().click();
      await expect(page.locator('text=Edit User')).toBeVisible();
    });

    test('should handle cleaner applications', async ({ page }) => {
      // Navigate to cleaner applications
      await page.locator('text=Cleaner Applications').click();
      
      // Mock applications data
      await page.route('**/api/admin/cleaner-applications', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'app-456',
              name: 'Maria Santos',
              email: 'maria@example.com',
              phone: '+63 912 345 6789',
              experience: '3 years',
              status: 'pending',
              submittedDate: '2024-10-15'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Verify application listing
      await expect(page.locator('text=Maria Santos')).toBeVisible();
      await expect(page.locator('text=3 years')).toBeVisible();
      await expect(page.locator('text=Pending')).toBeVisible();
      
      // Approve application
      await page.locator('button:has-text("Approve")').click();
      await page.locator('button:has-text("Confirm Approval")').click();
      
      // Verify success
      await expect(page.locator('text=Application approved')).toBeVisible();
    });

    test('should manage bookings and disputes', async ({ page }) => {
      // Navigate to booking management
      await page.locator('text=Booking Management').click();
      
      // Mock bookings data
      await page.route('**/api/admin/bookings', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'booking-789',
              client: 'Jane Smith',
              cleaner: 'Maria Santos',
              service: 'Deep Cleaning',
              date: '2024-10-20',
              status: 'disputed',
              amount: 2500
            }
          ])
        });
      });
      
      await page.reload();
      
      // Verify booking listing
      await expect(page.locator('text=Jane Smith')).toBeVisible();
      await expect(page.locator('text=Maria Santos')).toBeVisible();
      await expect(page.locator('text=Disputed')).toBeVisible();
      
      // Handle dispute
      await page.locator('button:has-text("Resolve Dispute")').click();
      await page.locator('textarea[placeholder*="resolution"]').fill('Refund issued to client');
      await page.locator('button:has-text("Resolve")').click();
      
      // Verify resolution
      await expect(page.locator('text=Dispute resolved')).toBeVisible();
    });

    test('should display analytics and reports', async ({ page }) => {
      // Navigate to analytics
      await page.locator('text=Analytics').click();
      
      // Mock analytics data
      await page.route('**/api/admin/analytics', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            bookingTrends: [
              { month: 'Oct', bookings: 450 },
              { month: 'Sep', bookings: 380 },
              { month: 'Aug', bookings: 420 }
            ],
            topServices: [
              { service: 'Regular Cleaning', count: 250 },
              { service: 'Deep Cleaning', count: 180 }
            ],
            revenueGrowth: 15.5
          })
        });
      });
      
      await page.reload();
      
      // Verify analytics display
      await expect(page.locator('text=Booking Trends')).toBeVisible();
      await expect(page.locator('text=Top Services')).toBeVisible();
      await expect(page.locator('text=15.5%')).toBeVisible(); // Revenue growth
      
      // Test report generation
      await page.locator('button:has-text("Generate Report")').click();
      await page.locator('select[name="reportType"]').selectOption('monthly');
      await page.locator('button:has-text("Download Report")').click();
      
      // Verify download initiated
      await expect(page.locator('text=Report generated')).toBeVisible();
    });

    test('should manage system settings', async ({ page }) => {
      // Navigate to settings
      await page.locator('text=Settings').click();
      
      // Update system settings
      await page.locator('input[name="serviceFee"]').fill('15');
      await page.locator('input[name="cancellationWindow"]').fill('24');
      await page.locator('textarea[name="termsOfService"]').fill('Updated terms and conditions');
      
      // Save settings
      await page.locator('button:has-text("Save Settings")').click();
      
      // Verify success
      await expect(page.locator('text=Settings updated successfully')).toBeVisible();
    });

    test('should handle payment management', async ({ page }) => {
      // Navigate to payments
      await page.locator('text=Payment Management').click();
      
      // Mock payment data
      await page.route('**/api/admin/payments', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'payment-123',
              booking: 'booking-789',
              client: 'Jane Smith',
              amount: 2500,
              status: 'pending',
              method: 'credit_card',
              date: '2024-10-20'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Verify payment listing
      await expect(page.locator('text=Jane Smith')).toBeVisible();
      await expect(page.locator('text=₱2,500')).toBeVisible();
      await expect(page.locator('text=Pending')).toBeVisible();
      
      // Process refund
      await page.locator('button:has-text("Process Refund")').click();
      await page.locator('input[name="refundAmount"]').fill('2500');
      await page.locator('textarea[name="refundReason"]').fill('Service not completed');
      await page.locator('button:has-text("Confirm Refund")').click();
      
      // Verify refund processed
      await expect(page.locator('text=Refund processed')).toBeVisible();
    });
  });

  test.describe('Negative Test Cases', () => {
    test('should handle unauthorized admin access', async ({ page }) => {
      // Clear authentication
      await page.evaluate(() => {
        localStorage.removeItem('user');
      });
      
      await page.reload();
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*sign-in/);
    });

    test('should handle insufficient permissions', async ({ page }) => {
      // Mock user with limited permissions
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({
          id: 'admin-limited',
          email: 'limited@scrub.com',
          name: 'Limited Admin',
          role: 'admin',
          permissions: ['view_analytics'] // Limited permissions
        }));
      });
      
      await page.reload();
      
      // Try to access user management
      await page.locator('text=User Management').click();
      
      // Should show permission error
      await expect(page.locator('text=Insufficient permissions')).toBeVisible();
    });

    test('should validate user management inputs', async ({ page }) => {
      await page.locator('text=User Management').click();
      await page.locator('button:has-text("Add User")').click();
      
      // Try to save with invalid email
      await page.locator('input[name="email"]').fill('invalid-email');
      await page.locator('button:has-text("Save User")').click();
      
      // Should show validation error
      await expect(page.locator('text=Please enter a valid email')).toBeVisible();
      
      // Try to save with empty required fields
      await page.locator('input[name="name"]').fill('');
      await page.locator('button:has-text("Save User")').click();
      
      await expect(page.locator('text=Name is required')).toBeVisible();
    });

    test('should handle system metric loading failures', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/admin/metrics', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Unable to load metrics' })
        });
      });
      
      await page.reload();
      
      // Should show error message
      await expect(page.locator('text=Unable to load system metrics')).toBeVisible();
      await expect(page.locator('button:has-text("Retry")').first()).toBeVisible();
    });

    test('should validate payment refund amounts', async ({ page }) => {
      await page.locator('text=Payment Management').click();
      
      // Mock payment data
      await page.route('**/api/admin/payments', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'payment-123',
              amount: 2500,
              status: 'completed'
            }
          ])
        });
      });
      
      await page.reload();
      
      // Try to refund more than paid amount
      await page.locator('button:has-text("Process Refund")').click();
      await page.locator('input[name="refundAmount"]').fill('3000');
      await page.locator('button:has-text("Confirm Refund")').click();
      
      // Should show validation error
      await expect(page.locator('text=Refund amount cannot exceed payment amount')).toBeVisible();
    });

    test('should handle concurrent admin actions', async ({ page }) => {
      await page.locator('text=User Management').click();
      
      // Mock conflict response
      await page.route('**/api/admin/users/123/update', route => {
        route.fulfill({
          status: 409,
          body: JSON.stringify({ error: 'User was modified by another admin' })
        });
      });
      
      await page.locator('button:has-text("Edit")').first().click();
      await page.locator('input[name="name"]').fill('Updated Name');
      await page.locator('button:has-text("Save User")').click();
      
      // Should show conflict message
      await expect(page.locator('text=User was modified by another admin')).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle large datasets with pagination', async ({ page }) => {
      await page.locator('text=User Management').click();
      
      // Mock large user dataset
      const users = Array.from({ length: 100 }, (_, i) => ({
        id: `user-${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        role: 'client',
        status: 'active'
      }));
      
      await page.route('**/api/admin/users', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(users.slice(0, 20)) // First page
        });
      });
      
      await page.reload();
      
      // Verify pagination controls
      await expect(page.locator('button:has-text("Next")').first()).toBeVisible();
      await expect(page.locator('text=Page 1 of')).toBeVisible();
      
      // Test search functionality
      await page.locator('input[placeholder*="Search users"]').fill('User 5');
      await page.locator('button:has-text("Search")').click();
      
      await expect(page.locator('text=User 5')).toBeVisible();
    });

    test('should handle system maintenance mode', async ({ page }) => {
      // Mock maintenance mode
      await page.route('**/api/admin/**', route => {
        route.fulfill({
          status: 503,
          body: JSON.stringify({ error: 'System under maintenance' })
        });
      });
      
      await page.reload();
      
      // Should show maintenance message
      await expect(page.locator('text=System under maintenance')).toBeVisible();
      await expect(page.locator('text=Limited functionality available')).toBeVisible();
    });

    test('should handle emergency system alerts', async ({ page }) => {
      // Mock emergency alert
      await page.route('**/api/admin/alerts', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'alert-critical',
              type: 'critical',
              message: 'Database connection issues detected',
              timestamp: '2024-10-20T10:00:00Z',
              resolved: false
            }
          ])
        });
      });
      
      await page.reload();
      
      // Should show critical alert
      await expect(page.locator('[data-testid="critical-alert"]')).toBeVisible();
      await expect(page.locator('text=Database connection issues')).toBeVisible();
      
      // Acknowledge alert
      await page.locator('button:has-text("Acknowledge")').click();
      await expect(page.locator('text=Alert acknowledged')).toBeVisible();
    });

    test('should handle bulk operations', async ({ page }) => {
      await page.locator('text=User Management').click();
      
      // Select multiple users
      await page.locator('input[type="checkbox"]').first().check();
      await page.locator('input[type="checkbox"]').nth(1).check();
      
      // Perform bulk action
      await page.locator('select[name="bulkAction"]').selectOption('suspend');
      await page.locator('button:has-text("Apply to Selected")').click();
      
      // Confirm bulk action
      await page.locator('button:has-text("Confirm Bulk Action")').click();
      
      // Verify success
      await expect(page.locator('text=Bulk action completed')).toBeVisible();
    });

    test('should handle data export operations', async ({ page }) => {
      await page.locator('text=Analytics').click();
      
      // Test large data export
      await page.locator('button:has-text("Export Data")').click();
      await page.locator('select[name="exportType"]').selectOption('all_bookings');
      await page.locator('select[name="format"]').selectOption('csv');
      
      // Mock long-running export
      await page.route('**/api/admin/export', route => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            body: JSON.stringify({ exportId: 'export-123', status: 'processing' })
          });
        }, 2000);
      });
      
      await page.locator('button:has-text("Start Export")').click();
      
      // Should show processing status
      await expect(page.locator('text=Export in progress')).toBeVisible();
    });
  });
});
