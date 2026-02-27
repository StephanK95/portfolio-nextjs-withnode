'use client';

import { useState } from 'react';
import { ExpenseData } from '@/types/expense';
import { CATEGORIES, PAYMENT_METHODS } from '@/constants/expenses';

interface AddExpenseModalProps {
    onClose: () => void;
    onSubmit: (data: Omit<ExpenseData, 'id'>) => void;
    submitting: boolean;
}

const inputStyle = {
    background: 'rgba(10, 9, 26, 0.8)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    color: '#e2e8f0',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.875rem',
};

const labelStyle = {
    color: 'rgba(148, 163, 184, 0.7)',
    fontSize: '0.75rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
    display: 'block' as const,
};

export function AddExpenseModal({
    onClose,
    onSubmit,
    submitting,
}: AddExpenseModalProps) {
    const [form, setForm] = useState<{
        date: string;
        category: string;
        description: string;
        amount: string;
        paymentMethod: string;
        status: 'Paid' | 'Pending';
    }>({
        date: new Date().toISOString().split('T')[0],
        category: CATEGORIES[0],
        description: '',
        amount: '',
        paymentMethod: PAYMENT_METHODS[0],
        status: 'Paid',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...form, amount: parseFloat(form.amount) });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-md rounded-2xl p-6"
                style={{
                    background: 'rgba(20, 15, 45, 0.98)',
                    border: '1px solid rgba(179, 152, 255, 0.2)',
                    boxShadow: '0 0 40px rgba(179,152,255,0.1)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3
                        className="text-lg font-semibold"
                        style={{ color: '#e2e8f0' }}
                    >
                        Add <span style={{ color: '#b398ff' }}>Expense</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-xl leading-none"
                        style={{ color: 'rgba(148,163,184,0.5)' }}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Date + Amount */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label style={labelStyle}>Date</label>
                            <input
                                type="date"
                                required
                                value={form.date}
                                onChange={(e) =>
                                    setForm({ ...form, date: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                placeholder="0.00"
                                value={form.amount}
                                onChange={(e) =>
                                    setForm({ ...form, amount: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={labelStyle}>Description</label>
                        <input
                            type="text"
                            required
                            placeholder="What did you spend on?"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            style={inputStyle}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label style={labelStyle}>Category</label>
                        <select
                            value={form.category}
                            onChange={(e) =>
                                setForm({ ...form, category: e.target.value })
                            }
                            style={inputStyle}
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Method + Status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label style={labelStyle}>Payment Method</label>
                            <select
                                value={form.paymentMethod}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        paymentMethod: e.target.value,
                                    })
                                }
                                style={inputStyle}
                            >
                                {PAYMENT_METHODS.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Status</label>
                            <select
                                value={form.status}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        status: e.target.value as
                                            | 'Paid'
                                            | 'Pending',
                                    })
                                }
                                style={inputStyle}
                            >
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg text-sm font-medium"
                            style={{
                                background: 'rgba(148,163,184,0.08)',
                                color: 'rgba(148,163,184,0.7)',
                                border: '1px solid rgba(148,163,184,0.12)',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-2 rounded-lg text-sm font-semibold"
                            style={{
                                background: submitting
                                    ? 'rgba(179,152,255,0.2)'
                                    : 'rgba(179,152,255,0.18)',
                                color: '#b398ff',
                                border: '1px solid rgba(179,152,255,0.3)',
                                boxShadow: submitting
                                    ? 'none'
                                    : '0 0 12px rgba(179,152,255,0.15)',
                            }}
                        >
                            {submitting ? 'Saving…' : '+ Add Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
