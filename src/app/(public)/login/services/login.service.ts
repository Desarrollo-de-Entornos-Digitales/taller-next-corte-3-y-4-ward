import axiosClient from '../../../../lib/axios/client';

interface LoginResponse {
    access_token: string;
}

class LoginService {
    async login(email: string, password: string): Promise<LoginResponse> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const result = await axiosClient.post<LoginResponse>('/auth/login', {
            email,
            password,
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return result.data as LoginResponse;
    }
}

export const loginService = new LoginService();
