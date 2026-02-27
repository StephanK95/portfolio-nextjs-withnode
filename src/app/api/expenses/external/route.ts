import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type ExpenseBody = {
    userId: string;
    date: string;
    category: string;
    description: string;
    amount: number;
    paymentMethod: string;
    status: 'Paid' | 'Pending';
};

function isValidBody(body: unknown): body is ExpenseBody {
    if (!body || typeof body !== 'object') return false;
    const b = body as Record<string, unknown>;
    return (
        typeof b.userId === 'string' &&
        typeof b.date === 'string' &&
        typeof b.category === 'string' &&
        typeof b.description === 'string' &&
        typeof b.amount === 'number' &&
        typeof b.paymentMethod === 'string' &&
        (b.status === 'Paid' || b.status === 'Pending')
    );
}

export async function POST(request: Request) {
    // ── API key check ──────────────────────────────────────────────
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse & validate body ──────────────────────────────────────
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!isValidBody(body)) {
        return NextResponse.json(
            {
                error: 'Invalid request body',
                required: {
                    userId: 'string',
                    date: 'string (YYYY-MM-DD)',
                    category: 'string',
                    description: 'string',
                    amount: 'number',
                    paymentMethod: 'string',
                    status: '"Paid" | "Pending"',
                },
            },
            { status: 400 },
        );
    }

    // ── Persist ───────────────────────────────────────────────────
    try {
        const rows = await sql`
            INSERT INTO expenses (user_id, date, category, description, amount, payment_method, status)
            VALUES (${body.userId}, ${body.date}, ${body.category}, ${body.description}, ${body.amount}, ${body.paymentMethod}, ${body.status})
            RETURNING *
        `;

        const r = rows[0];
        const newExpense = {
            id: r.id,
            userId: r.user_id,
            date: r.date,
            category: r.category,
            description: r.description,
            amount: Number(r.amount),
            paymentMethod: r.payment_method,
            status: r.status,
        };

        return NextResponse.json(newExpense, { status: 201 });
    } catch (error) {
        console.error('Failed to create expense:', error);
        return NextResponse.json(
            { error: 'Failed to create expense' },
            { status: 500 },
        );
    }
}
