'use client';

import { useMemo } from 'react';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { ExpenseData } from '@/types/expense';
import { portfolioTheme } from '@/lib/agGridTheme';
import { DeleteCellRenderer } from './DeleteCellRenderer';

interface ExpenseGridProps {
    rowData: ExpenseData[];
    onDelete: (id: number) => void;
    onAddClick: () => void;
    role: string;
}

const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
};

export function ExpenseGrid({
    rowData,
    onDelete,
    onAddClick,
    role,
}: ExpenseGridProps) {
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
                filter: 'agDateColumnFilter',
            },
            {
                field: 'category',
                headerName: 'Category',
                width: 170,
                cellStyle: (
                    params,
                ): {
                    backgroundColor?: string;
                    color?: string;
                    fontWeight?: number;
                } => {
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
            },
            {
                field: 'amount',
                headerName: 'Amount',
                width: 130,
                filter: 'agNumberColumnFilter',
                valueFormatter: (params) => `$${params.value.toFixed(2)}`,
                cellStyle: { fontWeight: 'bold', color: '#b398ff' },
            },
            {
                field: 'paymentMethod',
                headerName: 'Payment Method',
                width: 160,
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 120,
                cellStyle: (params) => ({
                    backgroundColor:
                        params.value === 'Paid'
                            ? 'rgba(52, 211, 153, 0.18)'
                            : 'rgba(251, 191, 36, 0.18)',
                    color: params.value === 'Paid' ? '#34d399' : '#fbbf24',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }),
            },
            {
                headerName: 'Actions',
                width: 120,
                sortable: false,
                filter: false,
                cellRenderer: (params: CustomCellRendererProps) =>
                    DeleteCellRenderer({ ...params, onDelete }),
            },
        ],
        [onDelete],
    );

    return (
        <div
            className="rounded-xl p-6"
            style={{
                background: 'rgba(20, 15, 45, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                boxShadow: '0 0 0 1px rgba(179,152,255,0.06)',
            }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
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
                        Click on headers to sort, use filters, select rows, and
                        resize columns
                    </p>
                    {/* Context badge */}
                    <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mt-2"
                        style={{
                            background:
                                role === 'admin'
                                    ? 'rgba(251,191,36,0.1)'
                                    : 'rgba(179,152,255,0.1)',
                            color: role === 'admin' ? '#fbbf24' : '#b398ff',
                            border: `1px solid ${
                                role === 'admin'
                                    ? 'rgba(251,191,36,0.25)'
                                    : 'rgba(179,152,255,0.25)'
                            }`,
                        }}
                    >
                        {role === 'admin'
                            ? "⭐ Viewing all users' expenses"
                            : '👤 Viewing your expenses'}
                    </span>
                </div>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shrink-0"
                    style={{
                        background: 'rgba(179,152,255,0.18)',
                        color: '#b398ff',
                        border: '1px solid rgba(179,152,255,0.3)',
                        boxShadow: '0 0 12px rgba(179,152,255,0.15)',
                    }}
                    onMouseEnter={(e) => {
                        (
                            e.currentTarget as HTMLButtonElement
                        ).style.background = 'rgba(179,152,255,0.28)';
                    }}
                    onMouseLeave={(e) => {
                        (
                            e.currentTarget as HTMLButtonElement
                        ).style.background = 'rgba(179,152,255,0.18)';
                    }}
                >
                    + Add Expense
                </button>
            </div>

            {/* Grid */}
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
    );
}
