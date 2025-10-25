# Bug Report Template

## Bug ID: BUG-2025-001
Date: October 18, 2025  
Reporter: Joshua Vince Boco (QA Engineer)  
Assignee: Development Team  
Priority: Medium  
Severity: Low  

## Summary
Pricing information not displaying correctly on cleaning services page

## Environment
- Application: SCRUB Cleaning Services
- URL: https://scrub-sync-mickymac19.replit.app
- Browser: Chrome 118.0
- OS: Linux Ubuntu
- Test Environment: Staging

## Steps to Reproduce
1. Navigate to homepage
2. Click on "Browse Services" or similar
3. Look for pricing information on service listings
4. Observe pricing display

## Expected Result
- Pricing should be clearly visible with $ symbol
- Price format should be consistent (e.g., $25.00)
- Prices should be displayed for all services

## Actual Result
- No pricing information found on the page
- Services displayed without cost information
- Users cannot see service costs before booking

## Test Evidence
- Screenshot: `test-results/services-page.png`
- Test Case: `users-can-book-cleaning-services.spec.ts`
- Test Method: `should display pricing information`

## Impact
- User Experience: Users cannot make informed decisions without pricing
- Business Impact: May reduce conversion rates
- Workaround: None available

## Additional Notes
- This may be a design issue rather than a bug
- Consider if pricing is shown later in the booking flow
- Verify with product requirements

---

## Bug ID: BUG-2025-002
Date: October 18, 2025  
Reporter: Joshua Vince Boco (QA Engineer)  
Priority: Low  
Severity: Low  

## Summary
No cleaner ratings or reviews visible on service listings

## Steps to Reproduce
1. Go to cleaning services page
2. Look for cleaner profiles
3. Check for star ratings or review indicators
4. Verify cleaner credibility information

## Expected Result
- Cleaner profiles should show ratings (1-5 stars)
- Reviews or testimonials should be visible
- Trust indicators should be present

## Actual Result
- No rating system found
- No cleaner reviews displayed
- Limited trust indicators for users

## Impact
Users cannot assess cleaner quality before booking

## Status
INVESTIGATING - May be feature not yet implemented
