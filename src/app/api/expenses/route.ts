import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'expenses.json');

export async function GET() {
    try {
        const file = await readFile(DATA_PATH, 'utf-8');
        const expenses = JSON.parse(file);
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
    try {
        const body = await request.json();
        const file = await readFile(DATA_PATH, 'utf-8');
        const expenses = JSON.parse(file);

        const newExpense = {
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
