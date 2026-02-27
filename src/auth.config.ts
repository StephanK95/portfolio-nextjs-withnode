import type { NextAuthConfig } from 'next-auth';

// Edge-compatible config — no Node.js APIs (no fs, path, bcrypt, etc.)
// Used by middleware.ts which runs on the Edge Runtime.
// The full config (with CredentialsProvider) lives in auth.ts.
export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as unknown as { role: string }).role =
                    token.role as string;
            }
            return session;
        },
    },
    providers: [],
    session: { strategy: 'jwt' },
};
