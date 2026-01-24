# Varity Developer Portal - MVP Launch Plan

> **Goal**: Get every aspect to 10/10 for MVP Launch
> **Created**: January 24, 2026
> **Status**: IN PROGRESS - Phase 3 Starting
> **Estimated Effort**: 6-8 working days with parallelization
> **Phase 1 Completed**: January 24, 2026 (commits 231fda6, 763c889)
> **Phase 2 Completed**: January 24, 2026 (commit 393e3ef)

---

## Executive Summary

Based on comprehensive analysis by specialist agents, the recommended execution order is:

1. **BACKEND FIRST** - Fix foundation before building on it
2. **FRONTEND SECOND** - Refactor and polish UI components
3. **SEO LAST** - Depends on final content/structure

### Why Backend First?
- Frontend pages depend on backend hooks (useContract is imported by 7 pages)
- Fixing hooks first means frontend work can rely on stable APIs
- Breaking changes in backend would require rework of frontend fixes

---

## Current Audit Scores (Pre-MVP)

### Frontend Pages

| Page | Current | Target | Gap | Priority |
|------|---------|--------|-----|----------|
| Homepage (`/src/app/page.tsx`) | 9/10 | 10/10 | -1 | HIGH |
| Submit Page (`/src/app/submit/page.tsx`) | 9/10 | 10/10 | -1 | HIGH |
| Dashboard (`/src/app/dashboard/page.tsx`) | 8.5/10 | 10/10 | -1.5 | HIGH |
| Edit App (`/src/app/dashboard/edit/[id]/page.tsx`) | 8/10 | 10/10 | -2 | MEDIUM |
| App Detail (`/src/app/app/[id]/page.tsx`) | 9/10 | 10/10 | -1 | HIGH |
| Admin (`/src/app/admin/page.tsx`) | 8.5/10 | 10/10 | -1.5 | MEDIUM |
| Admin Initialize (`/src/app/admin/initialize/page.tsx`) | 7.5/10 | 10/10 | -2.5 | LOW |

### Frontend Components

| Component | Current | Target | Gap | Priority |
|-----------|---------|--------|-----|----------|
| Header (`/src/components/Header.tsx`) | 9/10 | 10/10 | -1 | MEDIUM |
| Footer (`/src/components/Footer.tsx`) | 9/10 | 10/10 | -1 | LOW |
| Providers (`/src/components/Providers.tsx`) | 8.5/10 | 10/10 | -1.5 | HIGH |
| Badge (`/src/components/Badge.tsx`) | 9/10 | 10/10 | -1 | LOW |
| AppCard (`/src/components/AppCard.tsx`) | 9/10 | 10/10 | -1 | MEDIUM |
| AppGrid (`/src/components/AppGrid.tsx`) | 8.5/10 | 10/10 | -1.5 | MEDIUM |
| SearchBar (`/src/components/SearchBar.tsx`) | 9/10 | 10/10 | -1 | LOW |
| CategoryFilter (`/src/components/CategoryFilter.tsx`) | 8/10 | 10/10 | -2 | LOW |
| ChainFilter (`/src/components/ChainFilter.tsx`) | 8/10 | 10/10 | -2 | LOW |
| Toast (`/src/components/Toast.tsx`) | 9/10 | 10/10 | -1 | LOW |
| StructuredData (`/src/components/StructuredData.tsx`) | 9.5/10 | 10/10 | -0.5 | HIGH |
| Layout (`/src/app/layout.tsx`) | 9/10 | 10/10 | -1 | HIGH |

### Backend/Contract Integration

| Area | File(s) | Current | Target | Gap | Priority |
|------|---------|---------|--------|-----|----------|
| Contract Integration | `/src/lib/contracts.ts` | 9/10 | 10/10 | -1 | MEDIUM (✅ Phase 1: ABI consolidated) |
| Thirdweb Setup | `/src/lib/thirdweb.ts` | 9/10 | 10/10 | -1 | MEDIUM |
| Transaction Handling | `/src/lib/transactions.ts` | 10/10 | 10/10 | 0 | ✅ DONE (Phase 1+2) |
| useContract Hook | `/src/hooks/useContract.ts` | 10/10 | 10/10 | 0 | ✅ DONE (Phase 1+2: React Query) |
| Privy Authentication | `/src/components/Providers.tsx` | 10/10 | 10/10 | 0 | ✅ DONE (Phase 2: ErrorBoundary+Caching) |
| useAuth Hook | `/src/hooks/useAuth.ts` | 9/10 | 10/10 | -1 | MEDIUM (✅ Phase 1) |
| GitHub OAuth Context | `/src/contexts/GithubContext.tsx` | 10/10 | 10/10 | 0 | ✅ DONE (Phase 2: rate limit+orgs) |
| useGithub Hook | ~~`/src/hooks/useGithub.ts`~~ | ~~6/10~~ | N/A | N/A | ✅ DELETED (Phase 1) |
| Web3Forms Email | In submit page | 7/10 | 10/10 | -3 | MEDIUM |
| Form Handling | Various pages | 8/10 | 10/10 | -2 | HIGH |
| Error Handling | `/src/lib/transactions.ts` | 10/10 | 10/10 | 0 | ✅ DONE (Phase 2) |
| Loading States | Various | 9/10 | 10/10 | -1 | LOW |
| React Query | `/src/components/Providers.tsx` | 10/10 | 10/10 | 0 | ✅ DONE (Phase 2) |
| Data Flow | Various | 9/10 | 10/10 | -1 | MEDIUM (improved via React Query) |
| Security | Various | 8/10 | 10/10 | -2 | MEDIUM |

### SEO Scores

| Page/File | Metadata | Structured Data | Semantic HTML | Technical SEO | Overall | Target |
|-----------|----------|-----------------|---------------|---------------|---------|--------|
| Root Layout | 10/10 | 9/10 | 9/10 | 10/10 | 9.5/10 | 10/10 |
| Homepage | 8/10 | 8/10 | 8/10 | 8/10 | 8/10 | 10/10 |
| Submit Page | 10/10 | 10/10 | 8/10 | 9/10 | 9.25/10 | 10/10 |
| Dashboard | 9/10 | 9/10 | 9/10 | 9/10 | 9/10 | 10/10 |
| Edit App | 8/10 | 6/10 | 7/10 | 8/10 | 7.25/10 | 10/10 |
| App Detail | 8/10 | 10/10 | 10/10 | 8/10 | 9/10 | 10/10 |
| Admin | 9/10 | 6/10 | 8/10 | 10/10 | 8.25/10 | 10/10 |
| Admin Initialize | 7/10 | 5/10 | 8/10 | 9/10 | 7.25/10 | 10/10 |
| Sitemap | - | - | - | 8/10 | 8/10 | 10/10 |
| robots.txt | - | - | - | 10/10 | 10/10 | ✅ DONE |
| llms.txt | - | - | - | 10/10 | 10/10 | ✅ DONE |
| ai.txt | - | - | - | 10/10 | 10/10 | ✅ DONE |
| StructuredData | - | 10/10 | - | - | 10/10 | ✅ DONE |

---

## Parallelization Strategy

```
Week 1 (Days 1-2):
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ TRACK A:         │ │ TRACK B:         │ │ TRACK C:         │
│ Backend Critical │ │ UI Components    │ │ SEO Infra        │
│ (useGithub, ABI, │ │ (CategoryFilter, │ │ (Sitemap, PNG    │
│ transactions)    │ │ ChainFilter,     │ │ OG images,       │
│                  │ │ Badge, etc.)     │ │ manifest.json)   │
└────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
         │                    │                    │
         ▼                    ▼                    ▼
Week 1-2 (Days 3-5):
┌─────────────────────────────────────────────────────────────┐
│ SEQUENTIAL: Backend Improvements                            │
│ (React Query integration, caching, error handling)          │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
Week 2 (Days 6-8):
┌─────────────────────────────────────────────────────────────┐
│ SEQUENTIAL: Frontend Refactoring + Polish + SEO             │
│ (Split large files, accessibility, dynamic metadata)        │
└─────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: Backend Critical Fixes ✅ COMPLETED

**Duration**: Day 1 (~1 day)
**Complexity**: Low-Medium
**Status**: ✅ COMPLETED (January 24, 2026)
**Commits**: 231fda6, 763c889

### Task 1.1: Delete Broken useGithub Hook ✅

**File**: `/src/hooks/useGithub.ts`
**Action**: DELETE ENTIRELY
**Reason**: Uses invalid dynamic import inside useEffect (violates React hooks rules)

**Steps**:
1. Create `/src/lib/github.ts` with extracted types and utilities:
   - `GitHubRepo` interface
   - `formatRelativeTime()` function
   - `languageColors` object
   - `getLanguageColor()` function
2. Delete `/src/hooks/useGithub.ts`
3. Update imports in `/src/app/submit/page.tsx`
4. Add GithubProvider to `/src/components/Providers.tsx`

**Lines**: -213 (delete) / +50 (new file) / +5 (Providers)

### Task 1.2: Consolidate ABI Definitions ✅

**Files**: `/src/lib/contracts.ts`, `/src/hooks/useContract.ts`
**Action**: Remove duplicate ABI from useContract.ts

**Steps**:
1. In `contracts.ts`: Add `export const REGISTRY_ABI = [...] as const`
2. In `useContract.ts`: Remove lines 14-166 (duplicate ABI)
3. In `useContract.ts`: Import ABI from contracts.ts
4. Verify function names match (snake_case vs camelCase issue)

**Lines**: -160 (delete duplicate)

### Task 1.3: Add Transaction Confirmation ✅

**Files**: `/src/lib/transactions.ts`, `/src/hooks/useContract.ts`
**Action**: Use `waitForTransaction` after all `sendTransaction` calls

**Steps**:
1. Fix typing in `transactions.ts` (replace `any` with proper types)
2. Add retry mechanism to `waitForTransaction`
3. Update all write functions in `useContract.ts` to wait for receipt
4. Add gas estimation before transactions

**Lines**: +80 (transactions.ts) / +40 (useContract.ts)

### Task 1.4: Fix useAuth Hook ✅

**File**: `/src/hooks/useAuth.ts`
**Action**: Remove try-catch around hook, add proper typing

**Steps**:
1. Remove try-catch block (lines 21-44)
2. Add explicit TypeScript return type
3. Create AuthGuard component for protected routes
4. Delete `isPrivyConfigured` export

**Lines**: -30 (delete) / +40 (add)

---

## PHASE 2: Backend Improvements ✅ COMPLETED

**Duration**: Days 2-4 (~2-3 days)
**Complexity**: Medium-High
**Status**: ✅ COMPLETED (January 24, 2026)
**Commit**: 393e3ef

### Task 2.1: Implement React Query for Contract Reads ✅

**File**: `/src/hooks/useContract.ts`
**Action**: Wrap all contract reads in useQuery

**Steps**:
1. Create `useApp(appId)` with useQuery
2. Create `useAllApps(maxResults)` with useQuery
3. Create `useAppsByDeveloper(address)` with useQuery
4. Add query invalidation after mutations
5. Configure staleTime per query type

**Lines**: +200

### Task 2.2: Add Caching Layer ✅

**File**: `/src/components/Providers.tsx`
**Action**: Enhance QueryClient configuration

**Steps**:
1. Add `gcTime` (garbage collection time)
2. Differentiate `staleTime` by query type
3. Add `retry` configuration
4. Add React Query DevTools in development

**Lines**: +25

### Task 2.3: Improve Error Handling ✅

**File**: `/src/lib/transactions.ts`
**Action**: Add comprehensive error handling

**Steps**:
1. Add transaction status tracking hook
2. Add transaction state machine helpers
3. Add user-friendly error messages for all scenarios

**Lines**: +60

### Task 2.4: Enhance GithubContext ✅

**File**: `/src/contexts/GithubContext.tsx`
**Action**: Add rate limiting and org repos

**Steps**:
1. Add rate limit header checking
2. Add org repository fetching
3. Improve error messages

**Lines**: +40

---

## PHASE 3: Frontend Refactoring

**Duration**: Days 4-6 (~3-4 days)
**Complexity**: High

### Task 3.1: Split Submit Page (909 lines → ~400 lines)

**File**: `/src/app/submit/page.tsx`
**New Components**:
- `/src/components/submit/GitHubIntegration.tsx` (~100 lines)
- `/src/components/submit/CompanyInfoFields.tsx` (~50 lines)
- `/src/components/submit/SocialLinksFields.tsx` (~55 lines)
- `/src/components/submit/LegalDocsFields.tsx` (~70 lines)
- `/src/components/submit/ScreenshotsField.tsx` (~60 lines)

**Additional Fixes**:
- Add `<fieldset>` and `<legend>` for accessibility
- Move Web3Forms API key to env variable
- Add localStorage form persistence

### Task 3.2: Split Admin Page (1077 lines → ~400 lines)

**File**: `/src/app/admin/page.tsx`
**New Components**:
- `/src/components/admin/AdminStats.tsx` (~40 lines)
- `/src/components/admin/AdminFilters.tsx` (~150 lines)
- `/src/components/admin/AppReviewCard.tsx` (~130 lines)
- `/src/components/admin/RejectModal.tsx` (~100 lines)

### Task 3.3: Split Dashboard Page

**File**: `/src/app/dashboard/page.tsx`
**New Components**:
- `/src/components/dashboard/AppRow.tsx` (~230 lines)

**Additional Fixes**:
- Replace `window.location.reload()` with state refresh
- Add dynamic date for revenue section

### Task 3.4: App Detail Page Improvements

**File**: `/src/app/app/[id]/page.tsx`
**New Components**:
- `/src/components/SocialShareButtons.tsx` (~60 lines)

### Task 3.5: Edit App Page Improvements

**File**: `/src/app/dashboard/edit/[id]/page.tsx`
**Fixes**:
- Add more editable fields (category, logoUrl)
- Add undo/revert changes feature
- Add structured data

---

## PHASE 4: Frontend Polish

**Duration**: Days 6-7 (~1-2 days)
**Complexity**: Medium

### Task 4.1: Header Improvements
- Add skip-to-content link
- Add focus trap to mobile menu
- Memoize admin check

### Task 4.2: Footer Improvements
- Add `role="contentinfo"`
- Add sr-only heading for social links

### Task 4.3: Providers Improvements
- Add ErrorBoundary wrapper
- Add GithubProvider integration

### Task 4.4: Component Improvements
- Badge: Add size variants
- AppCard: Add image loading placeholder, microdata
- AppGrid: Replace reload with callback, add roles
- SearchBar: Add loading state
- CategoryFilter: Add ARIA roles, optional counts
- ChainFilter: Add aria-label
- Toast: Add pause-on-hover

### Task 4.5: Layout Improvements
- Add id="main-content" for skip link
- Add manifest.json link
- Replace Google verification placeholder

---

## PHASE 5: SEO (Do Last)

**Duration**: Day 8 (~1 day)
**Complexity**: Low-Medium

### Task 5.1: Global SEO Fixes
- [ ] Replace Google verification placeholder (actual code needed)
- [ ] Create `/public/manifest.json` for PWA
- [ ] Create PNG OG images (1200x630):
  - `/public/og-image.png` (main)
  - `/public/og/submit.png`
  - `/public/og/dashboard.png`
  - `/public/og/app-default.png`

### Task 5.2: Homepage SEO
- [ ] Add page-specific metadata export
- [ ] Add FAQPage schema using `createFAQSchema(developerFAQData)`
- [ ] Add FAQ microdata (itemscope/itemtype)

### Task 5.3: Submit Page SEO
- [ ] Add `<fieldset>` and `<legend>` for accessibility

### Task 5.4: Dashboard SEO
- [ ] Add OpenGraph images to layout
- [ ] Add Twitter images

### Task 5.5: Edit App SEO
- [ ] Create `editAppPageSchema` in StructuredData.tsx
- [ ] Add complete metadata with keywords
- [ ] Add OpenGraph and Twitter images

### Task 5.6: App Detail SEO (CRITICAL)
- [ ] Implement `generateMetadata` for dynamic SEO per app
- [ ] Add dynamic canonical URLs
- [ ] Create API route `/api/app/[id]` for server-side data fetching

### Task 5.7: Admin Pages SEO
- [ ] Add Twitter card to admin layout
- [ ] Add keywords and OpenGraph to initialize layout

### Task 5.8: Sitemap Enhancement
- [ ] Add dynamic `/app/[id]` pages (first 100 IDs matching generateStaticParams)

---

## Files to Create Summary

| File Path | Purpose | Est. Lines |
|-----------|---------|------------|
| `/src/lib/github.ts` | GitHub types & utilities | 50 |
| `/src/components/submit/GitHubIntegration.tsx` | GitHub repo picker | 100 |
| `/src/components/submit/CompanyInfoFields.tsx` | Company form fields | 50 |
| `/src/components/submit/SocialLinksFields.tsx` | Social links fields | 55 |
| `/src/components/submit/LegalDocsFields.tsx` | Legal docs fields | 70 |
| `/src/components/submit/ScreenshotsField.tsx` | Screenshots input | 60 |
| `/src/components/dashboard/AppRow.tsx` | App row with actions | 230 |
| `/src/components/admin/AdminStats.tsx` | Stats cards | 40 |
| `/src/components/admin/AdminFilters.tsx` | Search and filter bar | 150 |
| `/src/components/admin/AppReviewCard.tsx` | Review card | 130 |
| `/src/components/admin/RejectModal.tsx` | Rejection modal | 100 |
| `/src/components/SocialShareButtons.tsx` | Social sharing | 60 |
| `/src/components/patterns/GridPattern.tsx` | SVG grid background | 20 |
| `/public/manifest.json` | PWA manifest | 18 |
| **Total New Files** | | **~1,133** |

---

## Files to Delete

| File Path | Reason | Status |
|-----------|--------|--------|
| `/src/hooks/useGithub.ts` | Broken architecture - violates React hooks rules | ✅ DELETED (Phase 1) |

---

## Effort Summary

| Phase | Days | Lines Changed |
|-------|------|---------------|
| Phase 1: Backend Critical | 1 | ~400 |
| Phase 2: Backend Improvements | 2-3 | ~500 |
| Phase 3: Frontend Refactoring | 3-4 | ~1,500 |
| Phase 4: Frontend Polish | 1-2 | ~300 |
| Phase 5: SEO | 1 | ~200 |
| **TOTAL** | **6-8 days** | **~2,900 lines** |

---

## Success Criteria

- [ ] All Frontend Pages: 10/10
- [ ] All Frontend Components: 10/10
- [ ] All Backend Areas: 10/10
- [ ] All SEO Scores: 10/10
- [ ] Build passes with no errors
- [ ] All features functional
- [ ] Performance optimized
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] No duplicate code (ABI, utilities)
- [ ] All environment variables properly configured

---

## Quick Reference: What to Fix First

### CRITICAL (Blocks Other Work)
1. ~~Delete `/src/hooks/useGithub.ts` - BROKEN~~ ✅ DONE
2. ~~Remove duplicate ABI from `/src/hooks/useContract.ts`~~ ✅ DONE
3. ~~Add transaction confirmation to all write operations~~ ✅ DONE

### HIGH (Major Impact)
4. Implement React Query for contract reads
5. ~~Fix `/src/hooks/useAuth.ts` try-catch pattern~~ ✅ DONE
6. Split Submit page (909 lines)
7. Split Admin page (1077 lines)

### MEDIUM (Polish)
8. Add all SEO metadata
9. Component accessibility improvements
10. Form persistence and validation

### LOW (Nice to Have)
11. Size variants for Badge
12. Pause-on-hover for Toast
13. Category counts in filter

---

## Notes for Specialist Agents

- This file is the source of truth for MVP work
- Update scores as improvements are made
- Check off items as they are completed
- Reference this file when context is compacted
- Final audit required before MVP launch approval
- All changes should maintain existing functionality
- Test after each major change
