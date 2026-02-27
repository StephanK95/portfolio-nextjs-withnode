'use client';

import { AgGridReact } from 'ag-grid-react';
import { useState, useMemo, useEffect } from 'react';
import {
    ColDef,
    ModuleRegistry,
    AllCommunityModule,
    themeQuartz,
    colorSchemeDark,
} from 'ag-grid-community';

// Register all community modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Portfolio-themed AG Grid theme
const portfolioTheme = themeQuartz.withPart(colorSchemeDark).withParams({
    backgroundColor: '#0d0b1e',
    foregroundColor: '#e2e8f0',
    borderColor: 'rgba(148, 163, 184, 0.12)',
    headerBackgroundColor: '#0a091a',
    headerTextColor: '#b398ff',
    headerFontWeight: 600,
    rowHoverColor: 'rgba(179, 152, 255, 0.07)',
    selectedRowBackgroundColor: 'rgba(179, 152, 255, 0.15)',
    oddRowBackgroundColor: 'rgba(20, 15, 45, 0.5)',
    cellTextColor: '#e2e8f0',
    fontFamily: 'DM Sans, ui-sans-serif, system-ui, sans-serif',
    fontSize: 14,
});

interface ExpenseData {
    id: number;
    date: string;
    category: string;
    description: string;
    amount: number;
    paymentMethod: string;
    status: string;
}

interface SummaryCardProps {
    label: string;
    value: string;
    color: string;
}

function SummaryCard({ label, value, color }: SummaryCardProps) {
    return (
        <div
            className="rounded-xl p-6"
            style={{
                background: 'rgba(20, 15, 45, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                boxShadow: '0 0 0 1px rgba(179,152,255,0.06)',
            }}
        >
            <h3
                className="text-sm font-medium mb-1"
                style={{ color: 'rgba(148, 163, 184, 0.7)' }}
            >
                {label}
            </h3>
            <p className="text-3xl font-bold" style={{ color }}>
                {value}
            </p>
        </div>
    );
}

export default function DashboardPage() {
    const [rowData, setRowData] = useState<ExpenseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/expenses')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch expenses');
                return res.json();
            })
            .then((data: ExpenseData[]) => {
                setRowData(data);
            })
            .catch((err: Error) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Column definitions with various AG Grid features
    const columnDefs = useMemo<ColDef<ExpenseData>[]>(
        () => [
            {
                field: 'id',
                headerName: 'ID',
                width: 80,
                checkboxSelection: true,
                headerCheckboxSelection: true,
            },
            {
                field: 'date',
                headerName: 'Date',
                width: 130,
                sortable: true,
                filter: 'agDateColumnFilter',
            },
            {
                field: 'category',
                headerName: 'Category',
                width: 170,
                sortable: true,
                filter: true,
                cellStyle: (
                    params,
                ): {
                    backgroundColor?: string;
                    color?: string;
                    fontWeight?: number;
                } => {
                    // Dark purple-tinted category colors
                    const colors: {
                        [key: string]: { bg: string; color: string };
                    } = {
                        'Food & Dining': {
                            bg: 'rgba(179, 152, 255, 0.14)',
                            color: '#c4b0ff',
                        },
                        Transportation: {
                            bg: 'rgba(96,  165, 250, 0.14)',
                            color: '#93c5fd',
                        },
                        Shopping: {
                            bg: 'rgba(244, 114, 182, 0.14)',
                            color: '#f9a8d4',
                        },
                        'Bills & Utilities': {
                            bg: 'rgba(52,  211, 153, 0.14)',
                            color: '#6ee7b7',
                        },
                        Entertainment: {
                            bg: 'rgba(251, 191,  36, 0.14)',
                            color: '#fcd34d',
                        },
                        Healthcare: {
                            bg: 'rgba(248, 113, 113, 0.14)',
                            color: '#fca5a5',
                        },
                    };
                    const style = colors[params.value];
                    return style
                        ? {
                              backgroundColor: style.bg,
                              color: style.color,
                              fontWeight: 500,
                          }
                        : { color: '#e2e8f0' };
                },
            },
            {
                field: 'description',
                headerName: 'Description',
                width: 250,
                sortable: true,
                filter: true,
            },
            {
                field: 'amount',
                headerName: 'Amount',
                width: 130,
                sortable: true,
                filter: 'agNumberColumnFilter',
                valueFormatter: (params) => `$${params.value.toFixed(2)}`,
                cellStyle: { fontWeight: 'bold', color: '#b398ff' },
            },
            {
                field: 'paymentMethod',
                headerName: 'Payment Method',
                width: 160,
                sortable: true,
                filter: true,
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 120,
                sortable: true,
                filter: true,
                cellStyle: (params) => {
                    return {
                        backgroundColor:
                            params.value === 'Paid'
                                ? 'rgba(52, 211, 153, 0.18)'
                                : 'rgba(251, 191, 36, 0.18)',
                        color: params.value === 'Paid' ? '#34d399' : '#fbbf24',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    };
                },
            },
        ],
        [],
    );

    // Default column properties
    const defaultColDef = useMemo(
        () => ({
            resizable: true,
            sortable: true,
            filter: true,
        }),
        [],
    );

    // Calculate total expenses
    const totalExpenses = rowData.reduce((sum, row) => sum + row.amount, 0);

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: '#0a091a' }}
            >
                <p style={{ color: '#b398ff' }}>Loading expenses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: '#0a091a' }}
            >
                <p style={{ color: '#fca5a5' }}>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8" style={{ background: '#0a091a' }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{ color: '#e2e8f0' }}
                    >
                        Personal Expense{' '}
                        <span
                            style={{
                                color: '#b398ff',
                                textShadow: '0 0 24px rgba(179,152,255,0.35)',
                            }}
                        >
                            Dashboard
                        </span>
                    </h1>
                    <p style={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                        Track and manage your expenses with AG Grid
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <SummaryCard
                        label="Total Expenses"
                        value={`$${totalExpenses.toFixed(2)}`}
                        color="#b398ff"
                    />
                    <SummaryCard
                        label="Total Transactions"
                        value={String(rowData.length)}
                        color="#93c5fd"
                    />
                    <SummaryCard
                        label="Average per Transaction"
                        value={`$${(totalExpenses / rowData.length).toFixed(2)}`}
                        color="#6ee7b7"
                    />
                </div>

                {/* AG Grid Container */}
                <div
                    className="rounded-xl p-6"
                    style={{
                        background: 'rgba(20, 15, 45, 0.8)',
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        boxShadow: '0 0 0 1px rgba(179,152,255,0.06)',
                    }}
                >
                    <div className="mb-4">
                        <h2
                            className="text-xl font-semibold"
                            style={{ color: '#e2e8f0' }}
                        >
                            Expense Details
                        </h2>
                        <p
                            className="text-sm mt-1"
                            style={{ color: 'rgba(148, 163, 184, 0.6)' }}
                        >
                            Click on headers to sort, use filters, select rows,
                            and resize columns
                        </p>
                    </div>

                    <div style={{ height: '600px', width: '100%' }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            theme={portfolioTheme}
                            rowSelection="multiple"
                            animateRows={true}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            enableCellTextSelection={true}
                            ensureDomOrder={true}
                        />
                    </div>
                </div>

                {/* Grid Features Info */}
                <div
                    className="mt-6 rounded-xl p-4"
                    style={{
                        background: 'rgba(20, 15, 45, 0.6)',
                        border: '1px solid rgba(179, 152, 255, 0.2)',
                        boxShadow: '0 0 0 1px rgba(179,152,255,0.06)',
                    }}
                >
                    <h3
                        className="font-semibold mb-2"
                        style={{ color: '#b398ff' }}
                    >
                        🎓 AG Grid Features to Explore:
                    </h3>
                    <ul
                        className="text-sm space-y-1"
                        style={{ color: 'rgba(148, 163, 184, 0.85)' }}
                    >
                        <li>
                            • <strong>Sorting:</strong> Click column headers to
                            sort data
                        </li>
                        <li>
                            • <strong>Filtering:</strong> Use the filter icon in
                            column headers
                        </li>
                        <li>
                            • <strong>Row Selection:</strong> Click checkboxes
                            to select rows
                        </li>
                        <li>
                            • <strong>Column Resizing:</strong> Drag column
                            borders to resize
                        </li>
                        <li>
                            • <strong>Pagination:</strong> Navigate through
                            pages at the bottom
                        </li>
                        <li>
                            • <strong>Text Selection:</strong> Click and drag to
                            select cell text
                        </li>
                        <li>
                            • <strong>Custom Styling:</strong> Notice colored
                            categories and status badges
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
