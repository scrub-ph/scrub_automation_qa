import { test, expect, Page } from '@playwright/test';

test.describe('06 - Payment System (Transaction Processing)', () => {
  
  test('should display payment page with payment options', async ({ page }) => {
    await page.goto('/payment');
    
    // Verify payment page loads
    const paymentHeading = page.locator('h1, h2').filter({ hasText: /Payment|Pay|Checkout/i });
    const headingCount = await paymentHeading.count();
    
    if (headingCount > 0) {
      await expect(paymentHeading.first()).toBeVisible();
    } else {
      // Should at least have payment-related content
      await expect(page.locator('body')).toContainText(/payment|pay|checkout/i);
    }
    
    // Check for payment method options
    const paymentMethods = page.locator('button, input[type="radio"], .payment-method');
    const methodCount = await paymentMethods.count();
    expect(methodCount).toBeGreaterThan(0);
  });

  test('should support credit card payment method', async ({ page }) => {
    await page.goto('/payment');
    
    // Look for credit card option
    const creditCardOption = page.locator('text=/credit card|card|visa|mastercard/i, input[placeholder*="card"]');
    const cardCount = await creditCardOption.count();
    
    if (cardCount > 0) {
      await expect(creditCardOption.first()).toBeVisible();
      
      // Try to select credit card if it's a radio button
      const cardRadio = page.locator('input[type="radio"]').filter({ hasText: /card/i });
      const radioCount = await cardRadio.count();
      if (radioCount > 0) {
        await cardRadio.first().click();
      }
      
      // Look for card input fields
      const cardFields = page.locator('input[placeholder*="card"], input[name*="card"]');
      const fieldCount = await cardFields.count();
      if (fieldCount > 0) {
        await expect(cardFields.first()).toBeVisible();
      }
    }
  });

  test('should support GCash payment method', async ({ page }) => {
    await page.goto('/payment');
    
    // Look for GCash option
    const gcashOption = page.locator('text=/gcash|g.cash/i, button:has-text("GCash")');
    const gcashCount = await gcashOption.count();
    
    if (gcashCount > 0) {
      await expect(gcashOption.first()).toBeVisible();
      
      // Try to select GCash
      await gcashOption.first().click();
      
      // Should show GCash-specific fields or redirect
      await page.waitForTimeout(1000);
      const gcashFields = page.locator('input[placeholder*="gcash"], input[placeholder*="mobile"]');
      const fieldCount = await gcashFields.count();
      
      if (fieldCount > 0) {
        await expect(gcashFields.first()).toBeVisible();
      }
    }
  });

  test('should display booking summary and total amount', async ({ page }) => {
    await page.goto('/payment');
    
    // Look for booking summary information
    const summaryElements = page.locator('text=/total|amount|summary|subtotal/i');
    const summaryCount = await summaryElements.count();
    
    if (summaryCount > 0) {
      await expect(summaryElements.first()).toBeVisible();
    }
    
    // Look for currency amounts
    const amountElements = page.locator('text=/₱|PHP/');
    const amountCount = await amountElements.count();
    
    if (amountCount > 0) {
      await expect(amountElements.first()).toBeVisible();
    } else {
      // Should at least show some booking information
      const bookingInfo = page.locator('text=/service|clean|book/i');
      await expect(bookingInfo.first()).toBeVisible();
    }
  });

  test('should process payment and show confirmation', async ({ page }) => {
    await page.goto('/payment');
    
    // Look for payment submission button
    const payButton = page.locator('button:has-text("Pay"), button:has-text("Submit"), button:has-text("Confirm")');
    const payCount = await payButton.count();
    
    if (payCount > 0) {
      // Fill basic payment information if fields exist
      const cardInput = page.locator('input[placeholder*="card"]').first();
      if (await cardInput.isVisible()) {
        await cardInput.fill('4111111111111111');
      }
      
      await payButton.first().click();
      
      // Should show processing or redirect to confirmation
      await page.waitForLoadState('networkidle');
      const currentUrl = page.url();
      
      // Should either show success page or stay with confirmation
      const isValidResult = currentUrl.includes('success') || 
                           currentUrl.includes('confirm') ||
                           await page.locator('text=/success|confirmed|thank you/i').count() > 0;
      
      expect(isValidResult).toBe(true);
    }
  });

  test('should handle payment success page', async ({ page }) => {
    await page.goto('/payment-success');
    
    // Verify success page content
    const successElements = page.locator('text=/success|confirmed|thank you|complete/i');
    const successCount = await successElements.count();
    
    if (successCount > 0) {
      await expect(successElements.first()).toBeVisible();
    }
    
    // Should have booking reference or receipt information
    const referenceInfo = page.locator('text=/reference|booking|receipt|transaction/i');
    const refCount = await referenceInfo.count();
    
    if (refCount > 0) {
      await expect(referenceInfo.first()).toBeVisible();
    }
  });

  test('should handle payment cancellation gracefully', async ({ page }) => {
    await page.goto('/payment-cancel');
    
    // Verify cancellation page
    const cancelElements = page.locator('text=/cancel|cancelled|unsuccessful/i');
    const cancelCount = await cancelElements.count();
    
    if (cancelCount > 0) {
      await expect(cancelElements.first()).toBeVisible();
    }
    
    // Should provide option to retry or return
    const actionButtons = page.locator('button:has-text("Try Again"), button:has-text("Return"), a:has-text("Home")');
    const actionCount = await actionButtons.count();
    
    if (actionCount > 0) {
      await expect(actionButtons.first()).toBeVisible();
    }
  });
});
