'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExpenseData } from '@/types/expense';

export function useExpenses() {
    const [rowData, setRowData] = useState<ExpenseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchExpenses = useCallback(() => {
        fetch('/api/expenses')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch expenses');
                return res.json();
            })
            .then((data: ExpenseData[]) => setRowData(data))
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        // Initial load
        fetchExpenses();

        // Open SSE stream — refetch whenever the server signals a change
        const eventSource = new EventSource('/api/expenses/stream');

        eventSource.onmessage = (e) => {
            if (e.data === 'refresh') {
                fetchExpenses();
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
        };

        return () => eventSource.close();
    }, [fetchExpenses]);

    const handleDelete = useCallback((id: number) => {
        fetch('/api/expenses', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to delete');
                setRowData((prev) => prev.filter((row) => row.id !== id));
            })
            .catch((err: Error) => console.error(err.message));
    }, []);

    const handleAdd = useCallback(
        (data: Omit<ExpenseData, 'id' | 'userId'>) => {
            setSubmitting(true);
            fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to add expense');
                    return res.json();
                })
                .then((newExpense: ExpenseData) => {
                    setRowData((prev) => [...prev, newExpense]);
                    setShowModal(false);
                })
                .catch((err: Error) => console.error(err.message))
                .finally(() => setSubmitting(false));
        },
        [],
    );

    return {
        rowData,
        loading,
        error,
        showModal,
        setShowModal,
        submitting,
        handleDelete,
        handleAdd,
    };
}
