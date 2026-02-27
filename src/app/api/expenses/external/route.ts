import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'expenses.json');

type Expense = {
    id: number;
    userId: string;
    [key: string]: unknown;
};

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
        const file = await readFile(DATA_PATH, 'utf-8');
        const expenses: Expense[] = JSON.parse(file);

        const newExpense: Expense = {
            id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
            ...body,
        };

        expenses.push(newExpense);
        await writeFile(DATA_PATH, JSON.stringify(expenses, null, 4), 'utf-8');

        return NextResponse.json(newExpense, { status: 201 });
    } catch (error) {
        console.error('Failed to create expense:', error);
        return NextResponse.json(
            { error: 'Failed to create expense' },
            { status: 500 },
        );
    }
}
