# BUG-001: Navigation Buttons Not Detected on Landing Page

## Bug Information
- **Bug ID**: BUG-001
- **Date Created**: 2025-10-25
- **Severity**: High
- **Priority**: P1
- **Status**: Open
- **Reporter**: QA Automation
- **Component**: Landing Page Navigation

## Test Case
**Test File**: `tests/e2e/01-landing-page.spec.ts`
**Test Name**: `should display main navigation buttons for user journey`
**Line**: 18-34

## Bug Description
The test is failing to detect main navigation buttons on the landing page. The test expects to find buttons with text like "Get Started", "Join", or "Sign" but is finding 0 visible buttons.

## Expected Behavior
- Navigation buttons should be visible and detectable
- At least one primary CTA button should be found
- Buttons should have proper text content or data-testid attributes

## Actual Behavior
- Test finds 0 visible navigation buttons
- `visibleCount` returns 0 instead of expected > 0
- Navigation elements are not being detected by current selectors

## Root Cause Analysis
Based on SCRUB Landing.tsx code review:
- Buttons exist with proper data-testid attributes: `data-testid="button-sign-in"`, `data-testid="button-get-started"`, `data-testid="button-join-as-cleaner"`
- Test selectors are using text-based matching instead of data-testid attributes
- Current selectors: `'button:has-text("Get Started"), a[href*="get-started"]'` may not match actual button structure

## Steps to Reproduce
1. Navigate to landing page (/)
2. Run test: `npx playwright test tests/e2e/01-landing-page.spec.ts -g "should display main navigation buttons"`
3. Observe test failure with 0 buttons found

## Proposed Fix
Update test selectors to use proper data-testid attributes:
```typescript
const getStartedBtn = page.locator('[data-testid="button-get-started"]');
const joinCleanerBtn = page.locator('[data-testid="button-join-as-cleaner"]');
const signInBtn = page.locator('[data-testid="button-sign-in"]');
```

## Impact
- **User Impact**: Medium - Navigation functionality works but tests fail
- **Business Impact**: High - Critical user journey not being tested properly
- **Technical Impact**: High - Test suite reliability compromised

## Environment
- **Browser**: Chrome
- **Test Framework**: Playwright
- **Application**: SCRUB Landing Page
- **URL**: http://localhost:3000/

## Attachments
- Screenshot: `test-results/01-landing-page-01---Landi-700f0-on-buttons-for-user-journey-chrome/test-failed-1.png`
- Video: `test-results/01-landing-page-01---Landi-700f0-on-buttons-for-user-journey-chrome/video.webm`
