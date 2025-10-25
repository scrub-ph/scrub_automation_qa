# BUG-002: Service Offerings Not Detected on Landing Page

## Bug Information
- **Bug ID**: BUG-002
- **Date Created**: 2025-10-25
- **Severity**: Medium
- **Priority**: P2
- **Status**: Open
- **Reporter**: QA Automation
- **Component**: Landing Page Content

## Test Case
**Test File**: `tests/e2e/01-landing-page.spec.ts`
**Test Name**: `should display service offerings to inform users`
**Line**: 37-50

## Bug Description
The test is failing to detect service offerings on the landing page. The test looks for service names like "Regular Cleaning", "Deep Cleaning", "Office Cleaning" but cannot find any of them visible on the page.

## Expected Behavior
- Service offerings should be visible on landing page
- At least one of the following services should be displayed:
  - Regular Cleaning
  - Deep Cleaning  
  - Office Cleaning
- Services should help users understand available options

## Actual Behavior
- Test finds no visible service offerings
- `serviceFound` returns false instead of expected true
- Service information is not being detected by current selectors

## Root Cause Analysis
Based on SCRUB Landing.tsx code review:
- Services are defined in `SERVICES` constant from `@/lib/constants`
- Services may be rendered in a different section or with different text
- Service content might be loaded dynamically or in a different format
- Current test looks for exact text matches which may not exist

## Steps to Reproduce
1. Navigate to landing page (/)
2. Run test: `npx playwright test tests/e2e/01-landing-page.spec.ts -g "should display service offerings"`
3. Observe test failure with no services found

## Investigation Needed
1. Check actual service content rendering in Landing.tsx
2. Verify if services are in hero section, separate section, or footer
3. Determine correct selectors for service elements
4. Check if services use different naming convention

## Proposed Fix
1. Inspect actual landing page to identify service content location
2. Update test selectors to match actual service rendering
3. Consider using more flexible text matching or data-testid attributes
4. Add fallback checks for service-related content

## Impact
- **User Impact**: Low - Service information may be present but not detected
- **Business Impact**: Medium - Service visibility not being validated
- **Technical Impact**: Medium - Test coverage gap for service content

## Environment
- **Browser**: Chrome
- **Test Framework**: Playwright
- **Application**: SCRUB Landing Page
- **URL**: http://localhost:3000/

## Attachments
- Screenshot: `test-results/01-landing-page-01---Landi-d6215-e-offerings-to-inform-users-chrome/test-failed-1.png`
- Video: `test-results/01-landing-page-01---Landi-d6215-e-offerings-to-inform-users-chrome/video.webm`
