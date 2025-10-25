# Booking Tests

## Test Files

### 📁 **booking-with-stubs.spec.ts** (✅ Working)
- Demonstrates API stubbing setup for booking flow
- Tests that booking page loads (even if empty)
- Shows how to mock backend services for testing
- **Status**: Ready and working

### 📁 **complete-booking-flow.spec.ts** (⏳ Ready for Implementation)
- Complete end-to-end booking test with all steps
- Currently skipped until booking page is implemented
- **Status**: Test framework ready, waiting for booking UI

### 📁 **booking-flow.spec.ts** (⚠️ Legacy)
- Original booking flow test
- **Status**: Needs updating

### 📁 **client-booking.spec.ts** (⚠️ Partial)
- Client-specific booking tests
- **Status**: Basic navigation only

### 📁 **check-book-now.spec.ts** (✅ Working)
- Validates booking page accessibility
- **Status**: Working validation test

## API Stubs Configured

The booking tests include comprehensive API mocking for:

- **`/api/services`** - Service listings and features
- **`/api/geocode`** - Address validation and location services
- **`/api/match-cleaners`** - Cleaner matching algorithm
- **`/api/bookings`** - Booking creation and management

## Running Tests

```bash
# Run all booking tests
npx playwright test tests/e2e/booking/

# Run only working booking tests
npx playwright test tests/e2e/booking/booking-with-stubs.spec.ts

# Run complete flow (when implemented)
npx playwright test tests/e2e/booking/complete-booking-flow.spec.ts
```

## Implementation Status

- ✅ **API Stubbing**: Complete and tested
- ✅ **Test Framework**: Ready for booking implementation
- ⚠️ **Booking UI**: Pages exist but are empty
- ❌ **Authentication**: Required for booking flow

Once the booking pages are implemented and authentication is fixed, remove `test.skip()` from `complete-booking-flow.spec.ts` to enable full E2E booking tests.
