# E2E Test Suite Organization

## Test Structure

### 📁 **auth/** - Authentication Tests
- `authentication.spec.ts` - Login/logout functionality
- Tests login with different user types
- Verifies authentication flows

### 📁 **registration/** - Account Creation Tests  
- `account-creation.spec.ts` - Client & cleaner registration
- `check-join-client.spec.ts` - Client registration page validation
- `check-join-cleaner.spec.ts` - Cleaner registration page validation
- Tests complete registration flows for all user types

### 📁 **booking/** - Booking & Service Tests
- `booking-flow.spec.ts` - General booking flow tests
- `client-booking.spec.ts` - Client-specific booking tests
- `check-book-now.spec.ts` - Booking page validation
- Tests service booking and payment flows

### 📁 **dashboard/** - Dashboard Tests
- `dashboard.spec.ts` - General dashboard functionality
- `admin-dashboard.spec.ts` - Admin-specific dashboard tests
- `cleaner-dashboard.spec.ts` - Cleaner-specific dashboard tests
- Tests role-based dashboard features

### 📁 **pages/** - Public Page Tests
- `homepage.spec.ts` - Landing page functionality
- `service-pages.spec.ts` - Service information pages
- Tests public-facing pages and navigation

## Test Status

### ✅ Working Tests
- Client registration (complete 5-step flow)
- Cleaner registration (complete 6-step flow)
- Homepage functionality and navigation
- Service pages navigation

### ⚠️ Partially Working
- Authentication (login fails due to routing issues)
- Dashboard tests (blocked by authentication)
- Booking flow (pages exist but may require authentication)

### ❌ Known Issues
- **SCRUB-001**: Login failure after registration
- **SCRUB-002**: No redirect to role-specific dashboards
- Booking pages appear empty (may require authentication)

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific category
npx playwright test tests/e2e/auth/
npx playwright test tests/e2e/registration/
npx playwright test tests/e2e/booking/
npx playwright test tests/e2e/dashboard/
npx playwright test tests/e2e/pages/

# Run specific test file
npx playwright test tests/e2e/registration/account-creation.spec.ts
```
