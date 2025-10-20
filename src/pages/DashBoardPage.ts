import { expect, Page } from '@playwright/test';

export class DashBoardPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  public getWelcomeMessage() {
    return this.page.getByText('Welcome');
  }

}
