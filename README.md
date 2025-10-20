# SCRUB Playwright Testing Framework

End-to-end testing framework for SCRUB cleaning services platform using Playwright and TypeScript.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests
npm run test

# Run tests with browser visible
npm run test:headed

# View test report
npm run test:report
```

## 📁 Project Structure

```
├── src/
│   ├── pages/          # Page Object Model classes
│   ├── utils/          # Helper utilities
│   └── types/          # TypeScript type definitions
├── tests/
│   ├── e2e/           # End-to-end test files
│   └── fixtures/      # Test data and fixtures
├── test-results/      # Test execution results
└── playwright-report/ # HTML test reports
```

## 🧪 Test Suites

- **Login Tests** - Client and cleaner authentication
- **Database Integration** - User management with PostgreSQL
- **TypeScript Examples** - Learning and demonstration tests

## 🔧 Configuration

- **Base URL**: `http://localhost:5000` (SCRUB app)
- **Browser**: Chrome
- **TypeScript**: Full type safety
- **Database**: PostgreSQL integration

## 📊 Features

- ✅ Page Object Model pattern
- ✅ TypeScript support
- ✅ Database integration
- ✅ Screenshot capture
- ✅ Video recording on failure
- ✅ HTML reporting
- ✅ Parallel test execution

## 🛠️ Environment Setup

Create `.env` file:
```bash
USERNAME=your-test-email@example.com
PASSWORD=your-test-password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scrub_db
DB_USER=scrub_user
DB_PASSWORD=scrub_password
```

## 📝 Writing Tests

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test('user login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.performLogin('user@example.com', 'password');
  await loginPage.verifySuccessfulLogin();
});
```

## 🏃‍♂️ Available Scripts

- `npm run test` - Run all tests
- `npm run test:headed` - Run tests with browser UI
- `npm run test:report` - Show HTML report
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔗 Related

- [SCRUB Application](https://github.com/scrub-ph/scrub)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
