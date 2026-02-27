'use client';

import { signOut } from 'next-auth/react';

interface SignOutButtonProps {
    callbackUrl?: string;
}

export function SignOutButton({ callbackUrl = '/login' }: SignOutButtonProps) {
    return (
        <button
            onClick={() => signOut({ callbackUrl })}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
            style={{
                background: 'rgba(179,152,255,0.08)',
                color: '#b398ff',
                border: '1px solid rgba(179,152,255,0.25)',
                boxShadow: '0 0 0 0 rgba(179,152,255,0)',
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(179,152,255,0.18)';
                el.style.borderColor = 'rgba(179,152,255,0.6)';
                el.style.boxShadow = '0 0 12px rgba(179,152,255,0.25)';
                el.style.color = '#cbb8ff';
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(179,152,255,0.08)';
                el.style.borderColor = 'rgba(179,152,255,0.25)';
                el.style.boxShadow = '0 0 0 0 rgba(179,152,255,0)';
                el.style.color = '#b398ff';
            }}
            onMouseDown={(e) => {
                e.currentTarget.style.background = 'rgba(179,152,255,0.3)';
                e.currentTarget.style.boxShadow =
                    '0 0 18px rgba(179,152,255,0.4)';
            }}
            onMouseUp={(e) => {
                e.currentTarget.style.background = 'rgba(179,152,255,0.18)';
                e.currentTarget.style.boxShadow =
                    '0 0 12px rgba(179,152,255,0.25)';
            }}
        >
            <span className="flex items-center gap-1.5">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
            </span>
        </button>
    );
}
