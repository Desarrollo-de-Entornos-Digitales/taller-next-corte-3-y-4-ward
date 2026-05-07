'use server';

import { cookies } from 'next/headers';

import { registerService } from './services/register.service';

interface RegisterResponse {
    access_token: string;
}

type RegisterResult = { success: true; data: RegisterResponse } | { success: false; error: string };

export default async function registerAction(email: string, password: string): Promise<RegisterResult> {
    try {
        const result = await registerService.register(email, password);

        const cookieStore = await cookies();
        cookieStore.set('token', result.access_token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return { success: true, data: result };
    } catch (error: any) {
        const backendMessage = error?.response?.data?.message || error?.message || 'An error occurred during registration';

        if (error.response?.status === 409) {
            return { success: false, error: backendMessage };
        }

        console.error('Error registering:', error);
        return { success: false, error: backendMessage };
    }
}
