# Phase 2 — Data Scoping by Role

## Overview

Phase 2 connects the authenticated identity from Phase 1 to the data layer.  
Each expense is now **owned by a user**. What you see in the dashboard depends on who you are:

| Role                | What they see               |
| ------------------- | --------------------------- |
| `user` (e.g. alice) | Only their own expenses     |
| `admin`             | All expenses from all users |

Enforcement happens **server-side** in the API — the client never receives data it shouldn't see.

---

## Changes Summary

| File                                       | What changed                                             |
| ------------------------------------------ | -------------------------------------------------------- |
| `src/types/expense.ts`                     | Added `userId: string` field                             |
| `src/data/expenses.json`                   | Stamped `userId` on all existing records                 |
| `src/app/api/expenses/route.ts`            | All 3 handlers now read session + apply role-based logic |
| `src/components/dashboard/ExpenseGrid.tsx` | Added `role` prop + context banner                       |
| `src/app/dashboard/page.tsx`               | Passes `role` down to `ExpenseGrid`                      |

---

## File by File

### `src/types/expense.ts`

```ts
export interface ExpenseData {
    id: number;
    userId: string;   // ← NEW: who owns this record
    date: string;
    ...
}
```

`userId` matches the `id` field in `users.json`. This is the link between a user and their data.

---

### `src/data/expenses.json`

Every record now has a `userId`:

```json
{
    "id": 1,
    "userId": "1",      ← alice owns this
    "date": "2026-02-01",
    ...
}
```

Existing records were split:

- IDs 1–10 → `userId: "1"` (alice)
- IDs 11–15 → `userId: "2"` (admin)

This gives both accounts meaningful data to view.

---

### `src/app/api/expenses/route.ts`

#### How session is read server-side

In API routes (server-side), you can't use `useSession()` — that's client-only.  
Instead, Auth.js provides `auth()` which reads the session from the request cookie:

```ts
import { auth } from '@/auth';

const session = await auth();
const user = session?.user as { id: string; role: string } | null;
```

This is safe because it runs **on the server** — the client never touches it.

---

#### GET — filter by role

```ts
export async function GET() {
    const session = await auth();
    const user = getSessionUser(session);

    if (!user) return 401 Unauthorized;

    const expenses = readExpenses();

    return user.role === 'admin'
        ? expenses              // admin sees everything
        : expenses.filter(e => e.userId === user.id);  // user sees only theirs
}
```

- No session → `401 Unauthorized` (API is now protected, not just the UI)
- Admin → all records returned
- User → only records where `expense.userId === session.user.id`

---

#### POST — stamp userId automatically

```ts
const newExpense = {
    id: ...,
    userId: user.id,   // ← stamped from session, not from the request body
    ...body,
};
```

The client **cannot** set `userId` — it's always overwritten by the server with the session value.  
This prevents a user from adding expenses and assigning them to someone else.

---

#### DELETE — ownership check

```ts
const target = expenses.find(e => e.id === id);

if (user.role !== 'admin' && target.userId !== user.id) {
    return 403 Forbidden;
}
```

- Admin can delete any record
- Regular user can only delete their own — attempting to delete someone else's returns `403`
- The client-side delete button can only be clicked by the person who sees the row,  
  but the server enforces this independently (never trust the client)

---

### `src/components/dashboard/ExpenseGrid.tsx`

Added a `role` prop and a context banner below the grid title:

```tsx
<span style={{ color: role === 'admin' ? '#fbbf24' : '#b398ff' }}>
    {role === 'admin'
        ? "⭐ Viewing all users' expenses"
        : '👤 Viewing your expenses'}
</span>
```

- Admin sees a **gold** "Viewing all users' expenses" badge
- Regular user sees a **purple** "Viewing your expenses" badge
- Makes it immediately clear what scope the data is in

---

## Security Model

```
                    CLIENT                          SERVER
                      │                               │
   User visits        │  GET /api/expenses            │
   /dashboard    ──── │ ─────────────────────────────▶│
                      │                               │  auth() reads session cookie
                      │                               │  role === 'admin'? → all
                      │                               │  role === 'user'?  → filter by userId
                      │◀─────────────────────────────│
                      │  Only authorised data         │
```

Two layers of protection:

1. **Middleware** (`middleware.ts`) — unauthenticated users can't even reach `/dashboard`
2. **API route** (`route.ts`) — even if someone calls the API directly, no session = `401`

---

## How to Test

### As alice (regular user)

1. Log in with `alice` / `alice123`
2. Dashboard shows **10 expenses** (IDs 1–10, owned by alice)
3. Badge shows: **👤 Viewing your expenses**
4. Add a new expense → it's stamped with alice's `userId`
5. Try to delete an expense (all visible ones are hers — works fine)

### As admin

1. Log in with `admin` / `admin123`
2. Dashboard shows **all expenses** from all users
3. Badge shows: **⭐ Viewing all users' expenses**
4. Can delete any record regardless of owner

---

## What Phase 2 Does NOT Do Yet

| Feature                                    | Phase   |
| ------------------------------------------ | ------- |
| Microsoft Entra SSO                        | Phase 3 |
| Real database (PostgreSQL / Cosmos DB)     | Phase 3 |
| User registration / self-service           | Phase 3 |
| Per-user expense summary (admin analytics) | Future  |
