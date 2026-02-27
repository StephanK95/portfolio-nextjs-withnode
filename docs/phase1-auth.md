# Phase 1 — Username/Password Auth + Roles

## Overview

Phase 1 adds authentication to the Expense Dashboard using **Auth.js v5** (NextAuth).  
Users log in with a username and password. Each user has a role (`user` or `admin`)  
that will be used in Phase 2 to scope what data they can see.

---

## Tech Stack Added

| Package | Purpose |
|---|---|
| `next-auth@beta` | Authentication framework for Next.js App Router |
| `bcryptjs` | Hashing and verifying passwords securely |
| `@types/bcryptjs` | TypeScript types for bcryptjs |

---

## File Structure

```
src/
├── auth.ts                                 ← Auth.js core config
├── middleware.ts                           ← Route protection
├── data/
│   └── users.json                          ← User store (Phase 1 only)
├── app/
│   ├── providers.tsx                       ← SessionProvider wrapper
│   ├── layout.tsx                          ← Updated to wrap app in Providers
│   ├── login/
│   │   └── page.tsx                        ← Login form UI
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts                ← Auth.js API handler
│   └── dashboard/
│       └── page.tsx                        ← Updated with session + role UI
└── .env.local                              ← Secrets (never committed to Git)
```

---

## File by File Explanation

### `.env.local`

```bash
AUTH_SECRET=your-random-secret-here
AUTH_URL=http://localhost:3000
```

- `AUTH_SECRET` — a random string Auth.js uses to **sign and encrypt** the JWT session token.  
  If this leaks, someone could forge session tokens. Never commit it.
- `AUTH_URL` — the base URL Auth.js uses to build callback URLs.  
  On Vercel this becomes your production URL set via the Vercel dashboard.

---

### `src/data/users.json`

```json
[
  { "id": "1", "username": "alice", "passwordHash": "...", "role": "user" },
  { "id": "2", "username": "admin", "passwordHash": "...", "role": "admin" }
]
```

- A simple flat-file user store — same pattern as `expenses.json`.
- Passwords are stored as **bcrypt hashes**, never plaintext.
- `role` is either `"user"` or `"admin"` — used to control access in Phase 2.
- **This file is replaced by a real database or Entra in Phase 3.**

> To generate a bcrypt hash manually:
> ```ts
> import bcrypt from 'bcryptjs';
> const hash = await bcrypt.hash('yourpassword', 12);
> ```

---

### `src/auth.ts`

The heart of the auth setup. This is where Auth.js is configured.

```ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
```

#### What it does:

1. **`CredentialsProvider`** — tells Auth.js to accept a username + password form.
2. **`authorize()`** — called on every login attempt:
   - Reads `users.json`
   - Finds the user by username
   - Runs `bcrypt.compare(password, user.passwordHash)`
   - If match → returns user object (id, name, role)
   - If no match → returns `null` (login fails)
3. **`jwt` callback** — runs when the JWT is created/updated:
   - Attaches `role` and `id` to the token so they persist in the session
4. **`session` callback** — runs when a session is read:
   - Copies `role` and `id` from the token onto `session.user`
   - This is how `useSession()` exposes the role in the UI

#### Why JWT and not database sessions?
JWT sessions are **stateless** — no database needed to validate a session.  
The token is stored in a cookie, signed with `AUTH_SECRET`.  
This is fine for Phase 1. In Phase 3 with Entra, the same pattern continues.

---

### `src/app/api/auth/[...nextauth]/route.ts`

```ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

- This is a **catch-all API route** that Auth.js needs to handle:
  - `POST /api/auth/signin` — processes login form
  - `GET /api/auth/session` — returns current session
  - `GET /api/auth/signout` — signs the user out
  - `GET /api/auth/csrf` — returns CSRF token
- You never call these manually — Auth.js and `useSession()` handle it internally.

---

### `src/middleware.ts`

```ts
export default auth((req) => { ... });

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
```

- Runs on **every request** to `/dashboard/*` and `/login`
- If the user is **not logged in** and tries to visit `/dashboard` → redirected to `/login`
- If the user **is logged in** and visits `/login` → redirected to `/dashboard`
- This is enforced at the **Edge** (before the page even renders) — not client-side

#### Why middleware and not just checking in the component?
Client-side checks (`useSession()` in a component) can flash the page before redirecting.  
Middleware runs **before** the response is sent — no flash, no unauthorized data exposure.

---

### `src/app/providers.tsx`

```tsx
'use client';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }) {
    return <SessionProvider>{children}</SessionProvider>;
}
```

- `SessionProvider` makes the session available everywhere via `useSession()`
- It must be a **client component** (`'use client'`) because it uses React context
- `layout.tsx` is a **server component** — so we can't put `SessionProvider` there directly
- This wrapper pattern is the standard Next.js App Router solution

---

### `src/app/layout.tsx`

```tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
```

- Wraps the entire app in `<Providers>` so every page has access to the session
- No other changes needed here

---

### `src/app/login/page.tsx`

The login UI — a styled form that calls Auth.js.

#### Key parts:

```ts
import { signIn } from 'next-auth/react';

const result = await signIn('credentials', {
    username,
    password,
    redirect: false,  // handle redirect manually
});

if (result?.error) setError('Invalid username or password');
else router.push('/dashboard');
```

- `signIn('credentials', ...)` — sends the form data to `authorize()` in `auth.ts`
- `redirect: false` — prevents Auth.js from doing a hard redirect so we can show an error message
- On success → `router.push('/dashboard')` navigates to the dashboard
- Styled to match the portfolio dark theme (`#0a091a` background, `#b398ff` purple accents)

---

### `src/app/dashboard/page.tsx` — Changes

```tsx
const { data: session } = useSession();
const role = (session?.user as { role?: string })?.role ?? 'user';
const username = session?.user?.name ?? '';
```

- `useSession()` reads the current session from the `SessionProvider` context
- `role` defaults to `'user'` if somehow undefined
- The type cast `as { role?: string }` is needed because Auth.js's default `User` type  
  doesn't include `role` — we added it ourselves in the `session` callback

#### Role badge:
```tsx
<span style={{
    background: role === 'admin' ? 'rgba(251,191,36,0.15)' : 'rgba(179,152,255,0.15)',
    color: role === 'admin' ? '#fbbf24' : '#b398ff',
}}>
    {role === 'admin' ? '⭐ Admin' : '👤 User'}
</span>
```
- Gold badge for admins, purple for regular users

#### Sign out:
```tsx
<button onClick={() => signOut({ callbackUrl: '/login' })}>
    Sign out
</button>
```
- `signOut()` clears the session cookie and redirects to `/login`

---

## Auth Flow Diagram

```
User visits /dashboard
        ↓
middleware.ts checks session
        ↓
No session? ──→ redirect to /login
        ↓
User submits login form
        ↓
signIn('credentials', { username, password })
        ↓
authorize() in auth.ts
  → find user in users.json
  → bcrypt.compare(password, hash)
        ↓
Match? ──→ return { id, name, role }
        ↓
jwt callback → attach role + id to token
        ↓
session callback → expose role + id via useSession()
        ↓
redirect to /dashboard ✅
```

---

## Test Credentials

| Username | Password | Role |
|---|---|---|
| `alice` | `alice123` | 👤 User |
| `admin` | `admin123` | ⭐ Admin |

---

## What Phase 1 Does NOT Do Yet

| Feature | Phase |
|---|---|
| Filter expenses by logged-in user | Phase 2 |
| Admin sees all users' expenses | Phase 2 |
| Microsoft Entra SSO | Phase 3 |
| Real database for users | Phase 3 |

---

## Next Steps → Phase 2

1. Add `userId` field to every record in `expenses.json`
2. Stamp `userId` from session onto new expenses in `POST /api/expenses`
3. In `GET /api/expenses` — if `role === 'admin'` return all; else filter by `userId`
4. In `DELETE /api/expenses` — users can only delete their own records
5. Show admin indicator in the grid header
