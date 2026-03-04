---
description: How to build and verify the WyshKit project before a PR
---

# Build & Verify

## Quick Reference

// turbo-all

### 1. Lint
```bash
npm run lint
```

### 2. Test
```bash
npm test
```
80% coverage gate. All commerce intent functions must have error branch tests.

### 3. Build
```bash
npm run build
```
Must succeed with zero warnings in production build.

### 4. Type Check
```bash
npx tsc --noEmit
```

### 5. Regenerate Types (after any DB schema change)
```bash
npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/lib/supabase/database.types.ts
```

## Pre-PR Checklist

- [ ] `npm run lint` passes
- [ ] `npm test` passes (80% coverage)
- [ ] `npm run build` succeeds
- [ ] No `console.log` in production code (use structured logger)
- [ ] No hardcoded colours or magic numbers (use CSS variables)
- [ ] No forbidden nomenclature (Partner, Item, Merchant, Customisation for personal input)
- [ ] All interactive elements ≥44×44px tap target
- [ ] All customer-facing URLs use slugs, not UUIDs
- [ ] All new RPCs have `SECURITY DEFINER` + `SET search_path = public, extensions`
- [ ] Mobile-first: tested at 375px viewport
