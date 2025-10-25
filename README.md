# SCRUB Automation QA

Comprehensive E2E test suite for the SCRUB cleaning service application.

## 🏗️ Test Organization

### 📁 **tests/e2e/pages/** - Public Pages (✅ Working)
- Homepage functionality and navigation
- Service information pages
- Button interactions and routing

### 📁 **tests/e2e/registration/** - Account Creation (✅ Working)
- Client registration (complete 5-step flow)
- Cleaner registration (complete 6-step flow)
- Form validation and success verification

### 📁 **tests/e2e/auth/** - Authentication (⚠️ Partial)
- Login functionality (has known issues)
- User authentication flows

### 📁 **tests/e2e/booking/** - Service Booking (⚠️ Partial)
- Booking flow navigation
- Service selection and pricing

### 📁 **tests/e2e/dashboard/** - User Dashboards (❌ Blocked)
- Role-based dashboard functionality
- Requires working authentication

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run working tests only
./run-tests.sh working

# Run specific test suite
./run-tests.sh pages
./run-tests.sh registration

# Run all tests
./run-tests.sh
```

## 📊 Test Status

### ✅ **Fully Working (18 tests)**
- **Homepage Tests**: 9 tests - Navigation, buttons, page elements
- **Service Pages**: 6 tests - Page loading and navigation
- **Account Creation**: 3 tests - Client & cleaner registration

### ⚠️ **Partially Working**
- **Authentication**: Login fails due to routing issues (SCRUB-001, SCRUB-002)
- **Booking Flow**: Pages exist but may require authentication

### ❌ **Known Issues**
- **SCRUB-001**: Login failure after registration
- **SCRUB-002**: No redirect to role-specific dashboards
- Dashboard tests blocked by authentication issues

## 🛠️ Configuration

- **Base URL**: `https://scrub-sync-mickymac19.replit.app`
- **Browser**: Chrome (headless)
- **Test Framework**: Playwright with TypeScript
- **Page Objects**: Located in `src/pages/`

## 📝 Bug Reports

Bug reports are automatically generated in `bug-reports/` directory:
- `login-failure-bug-001.md` - Authentication issues
- `routes-issue-bug-002.md` - Dashboard routing problems

## 🎯 Test Coverage

- ✅ User registration flows
- ✅ Public page navigation
- ✅ Form validation
- ⚠️ Authentication (partial)
- ⚠️ Booking flows (partial)
- ❌ Dashboard functionality (blocked)

Run `./run-tests.sh working` to execute only the fully functional test suites.
