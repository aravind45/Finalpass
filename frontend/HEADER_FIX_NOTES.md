# Quick Fix Script for Authorization Headers

The Vercel build is failing because many files have the same `Authorization` header type issue.

## Problem
TypeScript's strict mode doesn't allow `headers: { 'Authorization': ... }` syntax in fetch calls.

## Solution
Use the `apiRequest` helper from `lib/api.ts` which properly handles headers.

## Files to Update (12 total)
1. ✅ Dashboard.tsx - Already fixed
2. ✅ FollowUpWidget.tsx - Already fixed  
3. ⏳ Intake.tsx
4. ⏳ Family.tsx
5. ⏳ Documents.tsx
6. ⏳ Assets.tsx
7. ⏳ AssetDetail.tsx (3 instances)
8. ⏳ SendFaxModal.tsx
9. ⏳ CommunicationLog.tsx (2 instances)
10. ⏳ AssetChecklist.tsx

## Alternative Quick Fix
Change all instances from:
```typescript
headers: { 'Authorization': `Bearer ${token}` }
```

To:
```typescript
headers: new Headers({ 'Authorization': `Bearer ${token}` })
```

This uses the Headers constructor which TypeScript accepts.
