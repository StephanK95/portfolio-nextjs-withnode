'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            username,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError('Invalid username or password.');
        } else {
            router.push(callbackUrl);
            router.refresh();
        }
    };

    const inputStyle: React.CSSProperties = {
        background: 'rgba(10, 9, 26, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        color: '#e2e8f0',
        borderRadius: '0.5rem',
        padding: '0.625rem 0.875rem',
        width: '100%',
        outline: 'none',
        fontSize: '0.875rem',
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: '#0a091a' }}
        >
            {/* Ambient glow */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(179,152,255,0.06)' }}
            />

            <div
                className="relative w-full max-w-sm rounded-2xl p-8"
                style={{
                    background: 'rgba(20, 15, 45, 0.95)',
                    border: '1px solid rgba(179, 152, 255, 0.15)',
                    boxShadow: '0 0 40px rgba(179,152,255,0.08)',
                }}
            >
                {/* Logo / Title */}
                <div className="text-center mb-8">
                    <div className="text-3xl mb-3">💸</div>
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: '#e2e8f0' }}
                    >
                        Expense{' '}
                        <span style={{ color: '#b398ff' }}>Dashboard</span>
                    </h1>
                    <p
                        className="text-sm mt-1"
                        style={{ color: 'rgba(148,163,184,0.6)' }}
                    >
                        Sign in to manage your expenses
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Username */}
                    <div>
                        <label
                            className="block text-xs font-medium mb-1"
                            style={{ color: 'rgba(148,163,184,0.7)' }}
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            autoComplete="username"
                            placeholder="e.g. alice"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            className="block text-xs font-medium mb-1"
                            style={{ color: 'rgba(148,163,184,0.7)' }}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p
                            className="text-sm text-center px-3 py-2 rounded-lg"
                            style={{
                                background: 'rgba(248,113,113,0.1)',
                                border: '1px solid rgba(248,113,113,0.2)',
                                color: '#fca5a5',
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold mt-1"
                        style={{
                            background: loading
                                ? 'rgba(179,152,255,0.1)'
                                : 'rgba(179,152,255,0.18)',
                            color: '#b398ff',
                            border: '1px solid rgba(179,152,255,0.3)',
                            boxShadow: loading
                                ? 'none'
                                : '0 0 12px rgba(179,152,255,0.15)',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                {/* Dev hint */}
                <div
                    className="mt-6 p-3 rounded-lg text-xs"
                    style={{
                        background: 'rgba(148,163,184,0.04)',
                        border: '1px solid rgba(148,163,184,0.08)',
                        color: 'rgba(148,163,184,0.5)',
                    }}
                >
                    <p
                        className="font-medium mb-1"
                        style={{ color: 'rgba(148,163,184,0.6)' }}
                    >
                        Dev credentials
                    </p>
                    <p>
                        User: <code>alice</code> / <code>alice123</code>
                    </p>
                    <p>
                        Admin: <code>admin</code> / <code>admin123</code>
                    </p>
                </div>
            </div>
        </div>
    );
}
