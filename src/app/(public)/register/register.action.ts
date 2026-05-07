'use server';

import { cookies } from 'next/headers';

import { registerService } from './services/register.service';

interface RegisterResponse {
    access_token: string;
}

export default async function registerAction(email: string, password: string): Promise<RegisterResponse> {
    try {
        const result = await registerService.register(email, password);

        const cookieStore = await cookies();
        cookieStore.set('token', result.access_token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return result;
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
}
