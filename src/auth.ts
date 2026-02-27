import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { readFile } from 'fs/promises';
import path from 'path';
import { authConfig } from './auth.config';

interface DbUser {
    id: string;
    username: string;
    passwordHash: string;
    role: 'user' | 'admin';
}

async function getUsers(): Promise<DbUser[]> {
    const filePath = path.join(process.cwd(), 'src', 'data', 'users.json');
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as DbUser[];
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                const users = await getUsers();
                const user = users.find(
                    (u) => u.username === (credentials.username as string),
                );
                if (!user) return null;

                const valid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash,
                );
                if (!valid) return null;

                return { id: user.id, name: user.username, role: user.role };
            },
        }),
    ],
});
