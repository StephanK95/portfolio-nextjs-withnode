import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { auth } from '@/auth';
import { Session } from 'next-auth';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'expenses.json');

type Expense = {
    id: number;
    userId: string;
    [key: string]: unknown;
};

type SessionUser = { id: string; role: string };

function getSessionUser(session: Session | null): SessionUser | null {
    return (session?.user as SessionUser | undefined) ?? null;
}

export async function GET() {
    const session = await auth();
    const user = getSessionUser(session);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const file = await readFile(DATA_PATH, 'utf-8');
        const expenses: Expense[] = JSON.parse(file);

        const result =
            user.role === 'admin'
                ? expenses
                : expenses.filter((e) => e.userId === user.id);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to read expenses:', error);
        return NextResponse.json(
            { error: 'Failed to load expenses' },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    const session = await auth();
    const user = getSessionUser(session);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const file = await readFile(DATA_PATH, 'utf-8');
        const expenses: Expense[] = JSON.parse(file);

        const newExpense: Expense = {
            id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
            userId: user.id,
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

export async function DELETE(request: Request) {
    const session = await auth();
    const user = getSessionUser(session);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await request.json();
        const file = await readFile(DATA_PATH, 'utf-8');
        const expenses: Expense[] = JSON.parse(file);

        const target = expenses.find((e) => e.id === id);

        if (!target) {
            return NextResponse.json(
                { error: 'Expense not found' },
                { status: 404 },
            );
        }

        // Regular users can only delete their own records
        if (user.role !== 'admin' && target.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const filtered = expenses.filter((e) => e.id !== id);
        await writeFile(DATA_PATH, JSON.stringify(filtered, null, 4), 'utf-8');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete expense:', error);
        return NextResponse.json(
            { error: 'Failed to delete expense' },
            { status: 500 },
        );
    }
}
