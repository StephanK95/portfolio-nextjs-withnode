# Phase 3 — Real-Time Grid Updates via Server-Sent Events (SSE)

## What was built

Two new capabilities were added:

1. **External API endpoint** — `POST /api/expenses/external`  
   Allows any external system (scripts, other services, Postman) to create expenses without a browser session. Secured with an API key instead.

2. **SSE stream endpoint** — `GET /api/expenses/stream`  
   Keeps a persistent HTTP connection open to each logged-in browser tab. The moment any new expense is written to the JSON file (regardless of who created it), the server instantly notifies all connected clients and the AG Grid refreshes automatically.

---

## How Server-Sent Events work

SSE is a **one-way push channel** from server to browser over a normal HTTP connection. Unlike WebSockets (which are bidirectional), SSE is read-only from the browser's perspective — the server sends, the browser listens.

```
Browser                          Server
   |                                |
   |-- GET /api/expenses/stream --> |
   |                                |  (connection stays open)
   |                                |
   |          data: connected  <--- |  (immediately on connect)
   |                                |
   |          : heartbeat      <--- |  (every 25 seconds)
   |                                |
   |          data: refresh    <--- |  (whenever expenses.json changes)
   |                                |
   |-- GET /api/expenses -------->  |  (browser refetches data)
   |<--------- expense rows ------- |
   |                                |
   |  AG Grid updates ✅            |
```

The browser's built-in `EventSource` API handles reconnection automatically if the connection drops.

---

## File walkthrough

### `src/app/api/expenses/stream/route.ts`

```ts
export const dynamic = 'force-dynamic'; // never cache this route
```

This tells Next.js to always run this route as a dynamic serverless function, never statically generate it.

```ts
const stream = new ReadableStream({
    start(controller) { ... }
});
```

A `ReadableStream` is the standard Web API for streaming data. The `controller` object lets us push chunks into the stream at any time — not just once like a normal response.

```ts
const watcher = fs.watch(DATA_PATH, () => {
    controller.enqueue(encode('data: refresh\n\n'));
});
```

`fs.watch()` registers an OS-level file system watcher on `expenses.json`. Every time the file is written (by either the session-based POST or the external POST), the OS notifies Node.js, which calls this callback, which pushes the SSE message `data: refresh` down the open HTTP connection to every connected browser tab.

The SSE message format is defined by the spec — each message must end with `\n\n`. The `data:` prefix tells the browser this is a message payload.

```ts
const heartbeat = setInterval(() => {
    controller.enqueue(encode(': heartbeat\n\n'));
}, 25000);
```

Lines starting with `:` are SSE comments — the browser ignores them, but they prevent the connection from being closed by proxies and load balancers (including Vercel) that terminate idle connections after 30 seconds.

```ts
return () => {
    watcher.close();
    clearInterval(heartbeat);
};
```

The cleanup function returned from `start()` is called when the client disconnects (tab closed, navigation, etc.). It stops the file watcher and heartbeat so we don't leak resources.

```ts
return new Response(stream, {
    headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
    },
});
```

- `text/event-stream` — tells the browser this is an SSE response, activating the `EventSource` protocol
- `no-transform` — prevents any intermediary (CDN, proxy) from buffering or compressing the stream, which would delay delivery
- `X-Accel-Buffering: no` — specifically disables Nginx's response buffering, which is used by some Vercel deployments

---

### `src/hooks/useExpenses.ts`

```ts
const fetchExpenses = useCallback(() => { ... }, []);
```

`fetchExpenses` is extracted from the `useEffect` into a `useCallback` so it can be called from two places: once on initial mount, and again every time an SSE `refresh` event arrives. Without `useCallback`, a new function reference would be created on every render, causing the `useEffect` to re-run in an infinite loop.

```ts
const eventSource = new EventSource('/api/expenses/stream');
```

`EventSource` is a browser-native API. It opens a persistent GET request to the given URL and fires `onmessage` whenever a `data:` line arrives. It automatically reconnects if the connection drops.

```ts
eventSource.onmessage = (e) => {
    if (e.data === 'refresh') {
        fetchExpenses();
    }
};
```

We check for `'refresh'` explicitly so that heartbeat comments (which the browser strips anyway) and any future event types don't trigger unnecessary refetches.

```ts
eventSource.onerror = () => {
    eventSource.close();
};
```

On error the browser would attempt to reconnect every 3 seconds by default, which could flood the server. We close manually and let React's cleanup/remount cycle handle reconnection instead.

```ts
return () => eventSource.close();
```

The `useEffect` cleanup closes the SSE connection when the component unmounts (user navigates away, signs out, etc.).

---

### `src/app/api/expenses/external/route.ts`

```ts
const apiKey = request.headers.get('x-api-key');
if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

Instead of reading a session cookie, this endpoint reads the `x-api-key` request header and compares it to the value stored in the environment variable `API_SECRET_KEY`. If it doesn't match, the request is rejected immediately before any file I/O happens.

Because this endpoint writes to `expenses.json` using the same `writeFile` call as the session-based POST, `fs.watch()` in the SSE stream fires automatically — no extra wiring needed.

---

## End-to-end flow

```
External system
    POST /api/expenses/external
    Header: x-api-key: <secret>
    Body: { userId, date, category, description, amount, paymentMethod, status }
         ↓
    API validates key → writes to expenses.json
         ↓
    OS notifies fs.watch() in stream/route.ts
         ↓
    SSE pushes  "data: refresh"  to all open browser connections
         ↓
    EventSource.onmessage fires in useExpenses hook
         ↓
    fetchExpenses() → GET /api/expenses (with session cookie)
         ↓
    AG Grid re-renders with new row ✅
```

---

## Limitations to be aware of

| Limitation                     | Why                                             | Mitigation                                                                                |
| ------------------------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Vercel Hobby: 30s max response | Serverless functions time out                   | Heartbeat at 25s keeps connection alive; client reconnects if it drops                    |
| `fs.watch` is Node.js only     | Can't run on Edge Runtime                       | Stream route uses `export const dynamic = 'force-dynamic'` to force Node.js runtime       |
| One file watcher per request   | 100 connected users = 100 watchers              | Acceptable for a portfolio project; production would use a pub/sub system (Redis, Pusher) |
| JSON file as database          | Not atomic — concurrent writes can corrupt data | Fine for demo; replace with a real database for production                                |

---

## Environment variables

| Variable         | Where used            | Purpose                                                           |
| ---------------- | --------------------- | ----------------------------------------------------------------- |
| `API_SECRET_KEY` | `external/route.ts`   | Guards the external POST endpoint                                 |
| `AUTH_SECRET`    | `auth.ts`, middleware | Signs/verifies JWT session tokens                                 |
| `AUTH_URL`       | Auth.js               | Base URL for OAuth callbacks — set to production domain on Vercel |
