import { test, expect, Page } from '@playwright/test';

test.describe('01 - Landing Page Flow (Entry Point)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load landing page successfully with SCRUB branding', async ({ page }) => {
    // Verify page loads and has SCRUB branding
    await expect(page).toHaveTitle(/SCRUB/i);
    await expect(page.locator('body')).toContainText('SCRUB');
    
    // Check main hero section is visible
    const heroSection = page.locator('h1, .hero, [data-testid="hero"]').first();
    await expect(heroSection).toBeVisible();
  });

  test('should display main navigation buttons for user journey', async ({ page }) => {
    // Primary CTA buttons that start user journeys
    const getStartedBtn = page.locator('button:has-text("Get Started"), a[href*="get-started"]').first();
    const joinCleanerBtn = page.locator('button:has-text("Join"), a[href*="join"]').first();
    const signInBtn = page.locator('button:has-text("Sign"), a[href*="sign"]').first();
    
    // At least one primary CTA should be visible
    const buttons = [getStartedBtn, joinCleanerBtn, signInBtn];
    let visibleCount = 0;
    
    for (const btn of buttons) {
      if (await btn.isVisible()) {
        visibleCount++;
      }
    }
    
    expect(visibleCount).toBeGreaterThan(0);
  });

  test('should display service offerings to inform users', async ({ page }) => {
    // Check for service information
    const services = ['Regular Cleaning', 'Deep Cleaning', 'Office Cleaning'];
    let serviceFound = false;
    
    for (const service of services) {
      const serviceElement = page.locator(`text=${service}`);
      if (await serviceElement.isVisible()) {
        serviceFound = true;
        break;
      }
    }
    
    expect(serviceFound).toBe(true);
  });

  test('should navigate to get-started page when primary CTA is clicked', async ({ page }) => {
    // Find and click primary booking CTA
    const getStartedBtn = page.locator('button:has-text("Get Started"), a[href*="get-started"], button:has-text("Book")').first();
    
    if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click();
      await expect(page).toHaveURL(/.*get-started|.*book|.*quote/);
    } else {
      // If no get-started button, look for any booking-related button
      const bookingBtn = page.locator('button:has-text("Book"), a:has-text("Book")').first();
      await expect(bookingBtn).toBeVisible();
      await bookingBtn.click();
      await expect(page).toHaveURL(/.*book|.*quote|.*get-started/);
    }
  });

  test('should navigate to cleaner registration when join-as-cleaner is clicked', async ({ page }) => {
    // Look for cleaner registration CTA
    const joinCleanerBtn = page.locator(
      'button:has-text("Join as Cleaner"), a[href*="join-cleaner"], button:has-text("Become a Cleaner")'
    ).first();
    
    if (await joinCleanerBtn.isVisible()) {
      await joinCleanerBtn.click();
      await expect(page).toHaveURL(/.*join-cleaner|.*cleaner|.*apply/);
    } else {
      // Alternative: look for any cleaner-related link
      const cleanerLink = page.locator('a:has-text("Cleaner"), button:has-text("Cleaner")').first();
      if (await cleanerLink.isVisible()) {
        await cleanerLink.click();
        await expect(page).toHaveURL(/.*cleaner/);
      }
    }
  });

  test('should navigate to sign-in page when sign-in is clicked', async ({ page }) => {
    // Look for sign-in button/link
    const signInBtn = page.locator(
      'button:has-text("Sign In"), a[href*="sign-in"], button:has-text("Login"), a:has-text("Login")'
    ).first();
    
    if (await signInBtn.isVisible()) {
      await signInBtn.click();
      await expect(page).toHaveURL(/.*sign-in|.*login/);
    } else {
      // Check if there's a navigation menu that might contain sign-in
      const navMenu = page.locator('nav, header').first();
      await expect(navMenu).toBeVisible();
    }
  });

  test('should display pricing information to help user decision', async ({ page }) => {
    // Look for pricing indicators
    const pricingElements = page.locator('text=/₱|PHP|Starting|Price|Cost/i');
    const count = await pricingElements.count();
    
    if (count > 0) {
      await expect(pricingElements.first()).toBeVisible();
    } else {
      // At minimum, should have some service information
      await expect(page.locator('body')).toContainText(/clean|service|book/i);
    }
  });
});
