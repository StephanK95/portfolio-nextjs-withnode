import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Session } from 'next-auth';
import { sql } from '@/lib/db';

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
        const rows =
            user.role === 'admin'
                ? await sql`SELECT * FROM expenses ORDER BY id ASC`
                : await sql`SELECT * FROM expenses WHERE user_id = ${user.id} ORDER BY id ASC`;

        // Map snake_case DB columns back to camelCase for the frontend
        const expenses = rows.map((r) => ({
            id: r.id,
            userId: r.user_id,
            date: r.date,
            category: r.category,
            description: r.description,
            amount: Number(r.amount),
            paymentMethod: r.payment_method,
            status: r.status,
        }));

        return NextResponse.json(expenses);
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
        const { date, category, description, amount, paymentMethod, status } =
            body;

        const rows = await sql`
            INSERT INTO expenses (user_id, date, category, description, amount, payment_method, status)
            VALUES (${user.id}, ${date}, ${category}, ${description}, ${amount}, ${paymentMethod}, ${status})
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

export async function DELETE(request: Request) {
    const session = await auth();
    const user = getSessionUser(session);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await request.json();

        // Fetch the row to check ownership before deleting
        const existing =
            await sql`SELECT user_id FROM expenses WHERE id = ${id}`;

        if (existing.length === 0) {
            return NextResponse.json(
                { error: 'Expense not found' },
                { status: 404 },
            );
        }

        // Regular users can only delete their own records
        if (user.role !== 'admin' && existing[0].user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await sql`DELETE FROM expenses WHERE id = ${id}`;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete expense:', error);
        return NextResponse.json(
            { error: 'Failed to delete expense' },
            { status: 500 },
        );
    }
}
