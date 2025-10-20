# Failed Test Cases Documentation

## Overview
This document tracks test failures encountered during SCRUB application testing and their resolutions.

## Failed Test Cases

### 1. Pricing Information Display Test
**Test File:** `users-can-book-cleaning-services.spec.ts`  
**Test Name:** `should display pricing information`  
**Date:** October 18, 2025

#### Error Details
```
Error: locator.count: SyntaxError: Invalid flags supplied to RegExp constructor ', .price, [data-testid*="price"]'
```

#### Root Cause
Invalid selector syntax - mixed text regex with CSS selectors in single locator call.

#### Original Code
```typescript
const priceElements = page.locator('text=/\\$\\d+/, .price, [data-testid*="price"]');
```

#### Fix Applied
```typescript
const priceElements = page.locator('.price, [data-testid*="price"]');
const dollarText = page.locator('text=/\\$\\d+/');
```

#### Resolution
Separated regex text selector from CSS selectors into different locator calls.

---

### 2. Cleaner Profiles and Ratings Test
**Test File:** `users-can-book-cleaning-services.spec.ts`  
**Test Name:** `should show cleaner profiles or ratings`  
**Date:** October 18, 2025

#### Error Details
```
Error: locator.count: Unexpected token "=" while parsing css selector '.rating, .stars, [data-testid*="rating"], text=/★|⭐/'
```

#### Root Cause
Invalid selector syntax - mixed CSS selectors with text regex in single locator call.

#### Original Code
```typescript
const ratingElements = page.locator('.rating, .stars, [data-testid*="rating"], text=/★|⭐/');
```

#### Fix Applied
```typescript
const ratingElements = page.locator('.rating, .stars, [data-testid*="rating"]');
const starElements = page.locator('text=/★|⭐/');
```

#### Resolution
Separated text regex selector from CSS selectors into different locator calls.

## Common Patterns and Best Practices

### ❌ Don't Mix Selector Types
```typescript
// WRONG - mixing CSS and text regex
page.locator('text=/pattern/, .class, #id')
```

### ✅ Use Separate Locators
```typescript
// CORRECT - separate locators for different selector types
const textElements = page.locator('text=/pattern/');
const cssElements = page.locator('.class, #id');
```

### ✅ Handle Multiple Locator Types
```typescript
if (await cssElements.count() > 0) {
  await expect(cssElements.first()).toBeVisible();
} else if (await textElements.count() > 0) {
  await expect(textElements.first()).toBeVisible();
}
```

## Prevention Guidelines

1. **Separate Concerns**: Use different locators for CSS selectors vs text/regex patterns
2. **Test Selectors**: Validate selector syntax before running tests
3. **Use OR Logic**: Handle multiple element types with conditional checks
4. **Debug Screenshots**: Always capture screenshots on failure for visual debugging

## Test Status After Fixes
- ✅ All 12 tests now passing
- ✅ No syntax errors in selectors
- ✅ Proper error handling implemented

## Related Files
- `users-can-book-cleaning-services.spec.ts` - Fixed selector syntax
- `test-results/` - Contains failure screenshots and videos for debugging
