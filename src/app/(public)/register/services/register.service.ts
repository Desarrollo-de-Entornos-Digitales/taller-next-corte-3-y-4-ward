import axiosClient from '../../../../lib/axios/client';

interface RegisterResponse {
    access_token: string;
}

class RegisterService {
    async register(email: string, password: string): Promise<RegisterResponse> {
        const result = await axiosClient.post<RegisterResponse>('/auth/register', {
            email,
            username: email,
            password,
        });
        return result.data as RegisterResponse;
    }
}

export const registerService = new RegisterService();
