# BUG-007: Strict Mode Violation - Multiple Headings Found

## Bug Information
- **Bug ID**: BUG-007
- **Date Created**: 2025-10-25
- **Severity**: Medium
- **Priority**: P2
- **Status**: Open
- **Reporter**: QA Automation
- **Component**: Test Framework / Page Structure

## Test Case
**Test File**: `tests/e2e/booking/booking-flow.spec.ts`
**Test Name**: `should load get started page`
**Line**: 15-17

## Bug Description
Playwright test is failing due to strict mode violation when trying to locate headings on the get-started page. The page contains multiple h1 and h2 elements, causing the locator to be ambiguous.

## Expected Behavior
- Test should be able to uniquely identify page elements
- Page structure should allow for unambiguous element selection
- Tests should use specific selectors to avoid strict mode violations

## Actual Behavior
- Test fails with strict mode violation
- Locator `page.locator('h1, h2')` resolves to 2 elements:
  1. `<h1 class="text-3xl font-bold text-primary">SCRUB</h1>`
  2. `<h2 class="text-3xl font-bold text-foreground mb-4">Get Started</h2>`

## Error Details
```
Error: strict mode violation: locator('h1, h2') resolved to 2 elements:
    1) <h1 class="text-3xl font-bold text-primary">SCRUB</h1>
    2) <h2 class="text-3xl font-bold text-foreground mb-4">Get Started</h2>
```

## Root Cause Analysis
1. **Test Design Issue**: Using overly broad selector `'h1, h2'`
2. **Page Structure**: Get-started page legitimately has both h1 and h2 elements
3. **Missing Specificity**: Test should target specific heading, not all headings

## Impact Assessment
- **User Impact**: None - This is a test framework issue
- **Technical Impact**: Medium - Test reliability compromised
- **Development Impact**: Medium - Blocks automated testing of get-started page

## Proposed Solutions
1. **Use Specific Selectors**: Target specific heading text or data-testid
2. **Update Test Logic**: Use `.first()` or `.nth()` for multiple elements
3. **Add Data Attributes**: Add unique data-testid to headings for testing

## Recommended Fix
Replace the ambiguous selector with specific ones:
```typescript
// Instead of:
await expect(page.locator('h1, h2')).toBeVisible();

// Use:
await expect(page.locator('h1:has-text("SCRUB")')).toBeVisible();
await expect(page.locator('h2:has-text("Get Started")')).toBeVisible();
```

## Environment
- **Browser**: Chrome
- **Test Framework**: Playwright
- **Page**: /get-started

## Steps to Reproduce
1. Navigate to /get-started page
2. Run test: `npx playwright test tests/e2e/booking/booking-flow.spec.ts -g "should load get started page"`
3. Observe strict mode violation error

## Attachments
- Screenshot: `test-results/booking-booking-flow-Booki-00776-hould-load-get-started-page-chrome/test-failed-1.png`
- Video: `test-results/booking-booking-flow-Booki-00776-hould-load-get-started-page-chrome/video.webm`
