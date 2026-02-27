import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Capture the row count at the moment the client connects.
    // We poll every 3 seconds and emit "refresh" when the count changes.
    let lastCount: number | null = null;
    try {
        const rows = await sql`SELECT COUNT(*) AS count FROM expenses`;
        lastCount = Number(rows[0].count);
    } catch {
        // If the DB is unreachable on connect, we'll retry in the poll loop
    }

    const stream = new ReadableStream({
        start(controller) {
            const encode = (s: string) => new TextEncoder().encode(s);

            // Send initial connected event
            controller.enqueue(encode('data: connected\n\n'));

            // Poll the DB every 3 s; emit "refresh" if row count changed
            const pollInterval = setInterval(async () => {
                try {
                    const rows =
                        await sql`SELECT COUNT(*) AS count FROM expenses`;
                    const currentCount = Number(rows[0].count);
                    if (lastCount !== null && currentCount !== lastCount) {
                        controller.enqueue(encode('data: refresh\n\n'));
                    }
                    lastCount = currentCount;
                } catch {
                    // Swallow transient DB errors — client stays connected
                }
            }, 3000);

            // Heartbeat every 25s — keeps connection alive (Vercel 30s timeout)
            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encode(': heartbeat\n\n'));
                } catch {
                    clearInterval(heartbeat);
                }
            }, 25000);

            // Cleanup when the client disconnects
            return () => {
                clearInterval(pollInterval);
                clearInterval(heartbeat);
            };
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no', // disable Nginx buffering if behind a proxy
        },
    });
}
