import { expect, Page, Locator } from '@playwright/test';

export class DashBoardPage {
  private readonly page: Page;
  private readonly welcomeMessage: Locator;
  private readonly profileSection: Locator;
  private readonly bookingsSection: Locator;
  private readonly notificationsSection: Locator;
  private readonly settingsButton: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('[data-testid="welcome-message"], .welcome-message');
    this.profileSection = page.locator('[data-testid="profile-section"], .profile-section');
    this.bookingsSection = page.locator('[data-testid="bookings-section"], .bookings-section');
    this.notificationsSection = page.locator('[data-testid="notifications-section"], .notifications-section');
    this.settingsButton = page.locator('[data-testid="settings-button"], button:has-text("Settings")');
    this.logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout")');
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.waitForPageLoad();
  }

  private async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.welcomeMessage).toBeVisible();
  }

  public async getWelcomeMessage(): Promise<string | null> {
    return await this.welcomeMessage.textContent();
  }

  public async getUserRole(): Promise<string> {
    const url = this.page.url();
    if (url.includes('admin')) return 'admin';
    if (url.includes('cleaner')) return 'cleaner';
    return 'client';
  }

  public async getUpcomingBookings(): Promise<Locator> {
    return this.bookingsSection;
  }

  public async getNotifications(): Promise<Locator> {
    return this.notificationsSection;
  }

  public async openSettings(): Promise<void> {
    await this.settingsButton.click();
  }

  public async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForURL(/.*sign-in|.*login/);
  }

  public async verifyDashboardLoaded(): Promise<void> {
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.profileSection).toBeVisible();
    await expect(this.bookingsSection).toBeVisible();
  }

  public async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/dashboard-${name}-${Date.now()}.png`,
      fullPage: true
    });
  }
}
