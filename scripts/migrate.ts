import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
    console.log('Creating expenses table...');

    await sql`
    CREATE TABLE IF NOT EXISTS expenses (
      id            SERIAL PRIMARY KEY,
      user_id       TEXT        NOT NULL,
      date          TEXT        NOT NULL,
      category      TEXT        NOT NULL,
      description   TEXT        NOT NULL,
      amount        NUMERIC     NOT NULL,
      payment_method TEXT       NOT NULL,
      status        TEXT        NOT NULL
    )
  `;

    console.log('Table created (or already exists).');

    // Seed data from the original expenses.json
    const rows = [
        {
            id: 1,
            userId: '1',
            date: '2026-02-01',
            category: 'Food & Dining',
            description: 'Lunch at Italian Restaurant',
            amount: 45.5,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
        {
            id: 3,
            userId: '1',
            date: '2026-02-05',
            category: 'Shopping',
            description: 'Electronics Store - Headphones',
            amount: 129.99,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
        {
            id: 4,
            userId: '1',
            date: '2026-02-07',
            category: 'Bills & Utilities',
            description: 'Internet Bill',
            amount: 79.99,
            paymentMethod: 'Bank Transfer',
            status: 'Paid',
        },
        {
            id: 5,
            userId: '1',
            date: '2026-02-10',
            category: 'Food & Dining',
            description: 'Grocery Shopping',
            amount: 156.75,
            paymentMethod: 'Debit Card',
            status: 'Paid',
        },
        {
            id: 6,
            userId: '1',
            date: '2026-02-12',
            category: 'Entertainment',
            description: 'Movie Tickets',
            amount: 32.0,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
        {
            id: 7,
            userId: '1',
            date: '2026-02-15',
            category: 'Healthcare',
            description: 'Pharmacy - Medication',
            amount: 24.5,
            paymentMethod: 'Cash',
            status: 'Paid',
        },
        {
            id: 8,
            userId: '1',
            date: '2026-02-17',
            category: 'Transportation',
            description: 'Uber Ride',
            amount: 18.75,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
        {
            id: 9,
            userId: '1',
            date: '2026-02-20',
            category: 'Shopping',
            description: 'Clothing Store',
            amount: 89.99,
            paymentMethod: 'Credit Card',
            status: 'Pending',
        },
        {
            id: 10,
            userId: '1',
            date: '2026-02-22',
            category: 'Food & Dining',
            description: 'Coffee Shop',
            amount: 12.5,
            paymentMethod: 'Debit Card',
            status: 'Paid',
        },
        {
            id: 11,
            userId: '1',
            date: '2026-02-23',
            category: 'Bills & Utilities',
            description: 'Electricity Bill',
            amount: 145.3,
            paymentMethod: 'Bank Transfer',
            status: 'Paid',
        },
        {
            id: 12,
            userId: '2',
            date: '2026-02-25',
            category: 'Entertainment',
            description: 'Streaming Subscription',
            amount: 14.99,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
        {
            id: 13,
            userId: '2',
            date: '2026-02-26',
            category: 'Food & Dining',
            description: 'Restaurant Dinner',
            amount: 78.0,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
        {
            id: 14,
            userId: '2',
            date: '2026-02-27',
            category: 'Transportation',
            description: 'Parking Fee',
            amount: 15.0,
            paymentMethod: 'Cash',
            status: 'Paid',
        },
        {
            id: 15,
            userId: '2',
            date: '2026-02-27',
            category: 'Shopping',
            description: 'Bookstore',
            amount: 42.0,
            paymentMethod: 'Debit Card',
            status: 'Pending',
        },
        {
            id: 16,
            userId: '2',
            date: '2026-02-27',
            category: 'Food & Dining',
            description: 'McDonalds',
            amount: 23.0,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
        {
            id: 17,
            userId: '1',
            date: '2026-02-27',
            category: 'Food',
            description: 'Lunch',
            amount: 24.5,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
        {
            id: 18,
            userId: '1',
            date: '2026-02-27',
            category: 'Food',
            description: 'Lunch3',
            amount: 24.5,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
        {
            id: 19,
            userId: '1',
            date: '2026-02-27',
            category: 'Food',
            description: 'Lunch3',
            amount: 24.5,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
        {
            id: 20,
            userId: '1',
            date: '2026-02-27',
            category: 'Food',
            description: 'Lunch3',
            amount: 24.5,
            paymentMethod: 'Credit Card',
            status: 'Paid',
        },
    ];

    console.log('Checking for existing rows...');
    const existing = await sql`SELECT COUNT(*) AS count FROM expenses`;
    const count = Number(existing[0].count);

    if (count > 0) {
        console.log(`Table already has ${count} rows — skipping seed.`);
    } else {
        console.log('Seeding expenses...');
        for (const row of rows) {
            await sql`
        INSERT INTO expenses (id, user_id, date, category, description, amount, payment_method, status)
        VALUES (
          ${row.id},
          ${row.userId},
          ${row.date},
          ${row.category},
          ${row.description},
          ${row.amount},
          ${row.paymentMethod},
          ${row.status}
        )
      `;
        }
        // Advance the SERIAL sequence past the highest seeded id so new inserts don't collide
        await sql`SELECT setval('expenses_id_seq', (SELECT MAX(id) FROM expenses))`;
        console.log(
            `Seeded ${rows.length} rows. Sequence advanced to ${Math.max(...rows.map((r) => r.id))}.`,
        );
    }

    console.log('Migration complete.');
}

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
