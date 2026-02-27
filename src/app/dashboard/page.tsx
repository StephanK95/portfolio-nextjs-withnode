'use client';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { useSession, signOut } from 'next-auth/react';
import { useExpenses } from '@/hooks/useExpenses';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { AddExpenseModal } from '@/components/dashboard/AddExpenseModal';
import { ExpenseGrid } from '@/components/dashboard/ExpenseGrid';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DashboardPage() {
    const { data: session } = useSession();
    const role = (session?.user as { role?: string })?.role ?? 'user';
    const username = session?.user?.name ?? '';

    const {
        rowData,
        loading,
        error,
        showModal,
        setShowModal,
        submitting,
        handleDelete,
        handleAdd,
    } = useExpenses();

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: '#0a091a' }}
            >
                <div className="text-center">
                    <div
                        className="text-4xl mb-4 animate-pulse"
                        style={{ color: '#b398ff' }}
                    >
                        ⊙
                    </div>
                    <p style={{ color: 'rgba(148,163,184,0.7)' }}>
                        Loading expenses…
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: '#0a091a' }}
            >
                <div
                    className="text-center p-8 rounded-xl"
                    style={{
                        background: 'rgba(248,113,113,0.08)',
                        border: '1px solid rgba(248,113,113,0.2)',
                    }}
                >
                    <p
                        className="text-lg font-semibold mb-2"
                        style={{ color: '#fca5a5' }}
                    >
                        Error loading data
                    </p>
                    <p style={{ color: 'rgba(148,163,184,0.7)' }}>{error}</p>
                </div>
            </div>
        );
    }

    const totalExpenses = rowData.reduce((sum, row) => sum + row.amount, 0);
    const avgExpense = rowData.length ? totalExpenses / rowData.length : 0;

    return (
        <div className="min-h-screen" style={{ background: '#0a091a' }}>
            <div className="max-w-7xl mx-auto px-6 py-10">
                {showModal && (
                    <AddExpenseModal
                        onClose={() => setShowModal(false)}
                        onSubmit={handleAdd}
                        submitting={submitting}
                    />
                )}

                {/* Page Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1
                            className="text-3xl font-bold"
                            style={{ color: '#e2e8f0' }}
                        >
                            Expense{' '}
                            <span style={{ color: '#b398ff' }}>Dashboard</span>
                        </h1>
                        <p
                            className="mt-1 text-sm"
                            style={{ color: 'rgba(148, 163, 184, 0.6)' }}
                        >
                            Track and manage your personal finances
                        </p>
                    </div>

                    {/* User bar */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2">
                            <p
                                className="text-sm font-medium"
                                style={{ color: '#e2e8f0' }}
                            >
                                {username}
                            </p>
                            <span
                                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                    background:
                                        role === 'admin'
                                            ? 'rgba(251,191,36,0.15)'
                                            : 'rgba(179,152,255,0.15)',
                                    color:
                                        role === 'admin'
                                            ? '#fbbf24'
                                            : '#b398ff',
                                    border: `1px solid ${
                                        role === 'admin'
                                            ? 'rgba(251,191,36,0.3)'
                                            : 'rgba(179,152,255,0.3)'
                                    }`,
                                }}
                            >
                                {role === 'admin' ? '⭐ Admin' : '👤 User'}
                            </span>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg"
                            style={{
                                background: 'rgba(148,163,184,0.08)',
                                color: 'rgba(148,163,184,0.7)',
                                border: '1px solid rgba(148,163,184,0.12)',
                            }}
                        >
                            Sign out
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <SummaryCard
                        label="Total Spent"
                        value={`$${totalExpenses.toFixed(2)}`}
                        color="#b398ff"
                    />
                    <SummaryCard
                        label="Transactions"
                        value={rowData.length.toString()}
                        color="#93c5fd"
                    />
                    <SummaryCard
                        label="Average Expense"
                        value={`$${avgExpense.toFixed(2)}`}
                        color="#6ee7b7"
                    />
                </div>

                {/* Grid */}
                <ExpenseGrid
                    rowData={rowData}
                    onDelete={handleDelete}
                    onAddClick={() => setShowModal(true)}
                    role={role}
                />
            </div>
        </div>
    );
}
