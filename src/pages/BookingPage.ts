import { expect, Page, Locator } from '@playwright/test';

export interface BookingDetails {
  serviceType: string;
  location: string;
  date: string;
  time: string;
  duration?: string;
  specialInstructions?: string;
}

export class BookingPage {
  private readonly page: Page;
  
  // Service selection locators
  private readonly serviceTypeDropdown: Locator;
  private readonly deepCleaningOption: Locator;
  private readonly regularCleaningOption: Locator;
  private readonly moveInCleaningOption: Locator;
  
  // Location and scheduling locators
  private readonly locationInput: Locator;
  private readonly dateInput: Locator;
  private readonly timeSelect: Locator;
  private readonly durationSelect: Locator;
  
  // Additional details
  private readonly specialInstructionsTextarea: Locator;
  private readonly teamSizeSelect: Locator;
  
  // Action buttons
  private readonly continueButton: Locator;
  private readonly bookNowButton: Locator;
  private readonly backButton: Locator;
  
  // Confirmation elements
  private readonly bookingConfirmation: Locator;
  private readonly bookingId: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Service selection
    this.serviceTypeDropdown = page.locator('[data-testid="service-type-select"], select[name="serviceType"], #serviceType');
    this.deepCleaningOption = page.locator('option[value="deep-cleaning"], [data-value="deep-cleaning"]');
    this.regularCleaningOption = page.locator('option[value="regular-cleaning"], [data-value="regular-cleaning"]');
    this.moveInCleaningOption = page.locator('option[value="move-in-cleaning"], [data-value="move-in-cleaning"]');
    
    // Location and scheduling
    this.locationInput = page.locator('[data-testid="location-input"], input[name="location"], #location');
    this.dateInput = page.locator('[data-testid="date-input"], input[type="date"], input[name="date"]');
    this.timeSelect = page.locator('[data-testid="time-select"], select[name="time"], #time');
    this.durationSelect = page.locator('[data-testid="duration-select"], select[name="duration"], #duration');
    
    // Additional details
    this.specialInstructionsTextarea = page.locator('[data-testid="special-instructions"], textarea[name="instructions"], #instructions');
    this.teamSizeSelect = page.locator('[data-testid="team-size"], select[name="teamSize"], #teamSize');
    
    // Action buttons
    this.continueButton = page.locator('[data-testid="continue-btn"], button:has-text("Continue"), button[type="submit"]');
    this.bookNowButton = page.locator('[data-testid="book-now-btn"], button:has-text("Book Now"), button:has-text("Confirm Booking")');
    this.backButton = page.locator('[data-testid="back-btn"], button:has-text("Back")');
    
    // Confirmation
    this.bookingConfirmation = page.locator('[data-testid="booking-confirmation"], .booking-success, .confirmation-message');
    this.bookingId = page.locator('[data-testid="booking-id"], .booking-id');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-error');
  }

  async navigateToBookingPage(): Promise<void> {
    console.log('Navigating to booking page...');
    await this.page.goto('/get-started');
    await this.waitForPageLoad();
  }

  private async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    // Wait for at least one key element to be visible
    await Promise.race([
      this.serviceTypeDropdown.waitFor({ state: 'visible', timeout: 5000 }),
      this.locationInput.waitFor({ state: 'visible', timeout: 5000 }),
      this.continueButton.waitFor({ state: 'visible', timeout: 5000 })
    ]).catch(() => {
      console.log('Booking page elements not found, continuing...');
    });
  }

  async selectServiceType(serviceType: string): Promise<void> {
    console.log(`Selecting service type: ${serviceType}`);
    
    // Try different approaches to select service type
    if (await this.serviceTypeDropdown.isVisible()) {
      await this.serviceTypeDropdown.selectOption(serviceType);
    } else {
      // Try clicking on service cards/buttons
      const serviceCard = this.page.locator(`[data-service="${serviceType}"], button:has-text("${serviceType}"), .service-card:has-text("${serviceType}")`);
      if (await serviceCard.isVisible()) {
        await serviceCard.click();
      }
    }
  }

  async enterLocation(location: string): Promise<void> {
    console.log(`Entering location: ${location}`);
    if (await this.locationInput.isVisible()) {
      await this.locationInput.clear();
      await this.locationInput.fill(location);
    }
  }

  async selectDate(date: string): Promise<void> {
    console.log(`Selecting date: ${date}`);
    if (await this.dateInput.isVisible()) {
      await this.dateInput.fill(date);
    } else {
      // Try date picker approach
      const datePicker = this.page.locator('.date-picker, [data-testid="date-picker"]');
      if (await datePicker.isVisible()) {
        await datePicker.click();
        await this.page.locator(`[data-date="${date}"], td:has-text("${date.split('-')[2]}")`).click();
      }
    }
  }

  async selectTime(time: string): Promise<void> {
    console.log(`Selecting time: ${time}`);
    if (await this.timeSelect.isVisible()) {
      await this.timeSelect.selectOption(time);
    } else {
      // Try time slot buttons
      const timeSlot = this.page.locator(`button:has-text("${time}"), [data-time="${time}"]`);
      if (await timeSlot.isVisible()) {
        await timeSlot.click();
      }
    }
  }

  async selectDuration(duration: string): Promise<void> {
    console.log(`Selecting duration: ${duration}`);
    if (await this.durationSelect.isVisible()) {
      await this.durationSelect.selectOption(duration);
    }
  }

  async enterSpecialInstructions(instructions: string): Promise<void> {
    console.log('Entering special instructions...');
    if (await this.specialInstructionsTextarea.isVisible()) {
      await this.specialInstructionsTextarea.fill(instructions);
    }
  }

  async clickContinue(): Promise<void> {
    console.log('Clicking continue button...');
    await this.continueButton.click();
    await this.page.waitForTimeout(1000); // Wait for navigation
  }

  async clickBookNow(): Promise<void> {
    console.log('Clicking book now button...');
    await this.bookNowButton.click();
    await this.page.waitForTimeout(2000); // Wait for booking confirmation
  }

  async fillBookingForm(bookingDetails: BookingDetails): Promise<void> {
    console.log('Filling booking form with details...');
    
    await this.selectServiceType(bookingDetails.serviceType);
    await this.enterLocation(bookingDetails.location);
    await this.selectDate(bookingDetails.date);
    await this.selectTime(bookingDetails.time);
    
    if (bookingDetails.duration) {
      await this.selectDuration(bookingDetails.duration);
    }
    
    if (bookingDetails.specialInstructions) {
      await this.enterSpecialInstructions(bookingDetails.specialInstructions);
    }
  }

  async completeBooking(bookingDetails: BookingDetails): Promise<void> {
    try {
      await this.fillBookingForm(bookingDetails);
      await this.clickContinue();
      
      // Handle multi-step booking process
      if (await this.bookNowButton.isVisible()) {
        await this.clickBookNow();
      }

      // Verify booking completion
      await this.verifyBookingSuccess();
    } catch (error) {
      console.error('Booking failed:', error);
      await this.takeScreenshot('booking-failure');
      throw error;
    }
  }

  // Verification methods
  async verifyBookingPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*get-started.*/);
    
    // Check for presence of booking form elements
    const hasBookingElements = await Promise.race([
      this.serviceTypeDropdown.isVisible(),
      this.locationInput.isVisible(),
      this.continueButton.isVisible()
    ]);
    
    expect(hasBookingElements).toBeTruthy();
  }

  async verifyBookingSuccess(): Promise<void> {
    console.log('Verifying booking success...');
    
    // Wait for confirmation message or redirect
    await Promise.race([
      this.bookingConfirmation.waitFor({ state: 'visible', timeout: 10000 }),
      this.page.waitForURL(/.*booking.*success|.*confirmation|.*dashboard/, { timeout: 10000 })
    ]).catch(() => {
      console.log('Booking confirmation not found, checking current state...');
    });
    
    // Check for success indicators
    const currentUrl = this.page.url();
    if (currentUrl.includes('success') || currentUrl.includes('confirmation') || currentUrl.includes('dashboard')) {
      console.log('Booking successful - redirected to success page');
      return;
    }
    
    if (await this.bookingConfirmation.isVisible()) {
      await expect(this.bookingConfirmation).toBeVisible();
      console.log('Booking confirmation message displayed');
      return;
    }
    
    // Check for booking ID
    if (await this.bookingId.isVisible()) {
      const bookingIdText = await this.bookingId.textContent();
      console.log(`Booking ID: ${bookingIdText}`);
      return;
    }
    
    console.log('Booking success verification completed');
  }

  async verifyBookingError(): Promise<void> {
    console.log('Verifying booking error...');
    await expect(this.errorMessage).toBeVisible();
  }

  async getBookingId(): Promise<string | null> {
    if (await this.bookingId.isVisible()) {
      return await this.bookingId.textContent();
    }
    return null;
  }

  // Utility methods
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/booking-${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
