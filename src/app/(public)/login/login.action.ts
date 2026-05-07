'use server';

import { cookies } from 'next/headers';

import { loginService } from './services/login.service';

interface LoginResponse {
    access_token: string;
}

export default async function loginAction(email: string, password: string): Promise<LoginResponse> {
    try {
        const result = await loginService.login(email, password);

        const cookieStore = await cookies();
        cookieStore.set('token', result.access_token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });
        return result;
    } catch (error: any) {
        console.error('Error logging in:', error);
        if (error.response?.status === 401) {
            throw new Error('Usuario o contraseña incorrectos');
        }
        throw error;
    }
}
