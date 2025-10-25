# Bug Report - Routes Issue After Login

**Bug ID**: SCRUB-002
**Title**: Login does not redirect to correct user dashboard route
**Severity**: High
**Priority**: P1
**Date**: 2025-10-25
**Reporter**: QA Team

## Steps to Reproduce
1. Navigate to login page (/sign-in)
2. Enter cleaner credentials: cleaner-e2e@test.local / CleanerPass!234
3. Click login button
4. Observe URL after login attempt

## Expected Result
User should be redirected to appropriate dashboard route:
- Cleaner users: `/cleaner-dashboard`
- Client users: `/client-dashboard` 
- Admin users: `/admin-dashboard`

## Actual Result
User remains on homepage (/) instead of being redirected to role-specific dashboard

## Environment
- Application: SCRUB Cleaning App
- URL: https://scrub-sync-mickymac19.replit.app
- Test Case: cleaner-auth.spec.ts
- Date/Time: 2025-10-25 01:16

## Test Evidence
```
Expected pattern: /.*cleaner-dashboard/
Received string: "https://scrub-sync-mickymac19.replit.app/"
```

## Additional Information
- Login process completes without error messages
- User stays on homepage instead of dashboard redirect
- Affects role-based routing functionality
- Related to authentication flow and user role detection

## Impact
- Users cannot access their role-specific dashboards
- Breaks user experience flow after login
- Affects all user types (cleaner, client, admin)

## Status
Open - Needs Investigation
