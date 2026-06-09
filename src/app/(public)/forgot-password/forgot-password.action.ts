'use server';

import { forgotPasswordService } from './service/forgot-password.service';

function isAxiosError(error: unknown): error is { response?: { status?: number } } {
    return typeof error === 'object' && error !== null && 'response' in error;
}

export async function forgotPasswordAction(email: string): Promise<{ reset_token: string; message: string }> {
    try {
        return await forgotPasswordService.forgotPassword(email);
    } catch (error: unknown) {
        console.error('Error in forgotPassword:', error);
        if (isAxiosError(error) && error.response?.status === 404) {
            throw new Error('There is no account with that email address.');
        }
        throw new Error('Error processing request');
    }
}

export async function resetPasswordAction(token: string, newPassword: string): Promise<void> {
    try {
        await forgotPasswordService.resetPassword(token, newPassword);
    } catch (error: unknown) {
        console.error('Error in resetPassword:', error);
        if (isAxiosError(error) && error.response?.status === 401) {
            throw new Error('The link has expired or is not valid');
        }
        throw new Error('Error updating password');
    }
}
