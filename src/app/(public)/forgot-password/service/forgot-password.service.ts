import axiosClient from '../../../../lib/axios/client';

interface ForgotPasswordResponse {
    reset_token: string;
    message: string;
}

interface ResetPasswordResponse {
    message: string;
}

class ForgotPasswordService {
    async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
        const result = await axiosClient.post<ForgotPasswordResponse>('/auth/forgot-password', {
            email,
        });
        return result.data;
    }

    async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
        const result = await axiosClient.post<ResetPasswordResponse>('/auth/reset-password', {
            token,
            newPassword,
        });
        return result.data;
    }
}

export const forgotPasswordService = new ForgotPasswordService();
