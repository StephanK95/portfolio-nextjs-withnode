import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'expenses.json');

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stream = new ReadableStream({
        start(controller) {
            const encode = (s: string) => new TextEncoder().encode(s);

            // Send initial connected event
            controller.enqueue(encode('data: connected\n\n'));

            // Push "refresh" to all connected clients whenever the file changes
            const watcher = fs.watch(DATA_PATH, () => {
                try {
                    controller.enqueue(encode('data: refresh\n\n'));
                } catch {
                    // controller may already be closed
                }
            });

            // Heartbeat every 25s — keeps connection alive on Vercel (30s timeout)
            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encode(': heartbeat\n\n'));
                } catch {
                    clearInterval(heartbeat);
                }
            }, 25000);

            // Cleanup when the client disconnects
            return () => {
                watcher.close();
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
