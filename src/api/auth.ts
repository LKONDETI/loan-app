import apiClient, { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './client';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user?: User; // Depending on if your login returns user info
}

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
        const { access_token, refresh_token } = response.data;

        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access_token);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);

        return response.data;
    },

    async register(name: string, email: string, password: string): Promise<any> {
        const response = await apiClient.post('/auth/register', {
            name,
            email,
            password,
        });
        return response.data;
    },

    async logout(): Promise<void> {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await apiClient.get<User>('/auth/me');
            return response.data;
        } catch (error) {
            console.log("Failed to fetch current user", error);
            return null;
        }
    },

    async isAuthenticated(): Promise<boolean> {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        if (!token) return false;

        try {
            // Optional: Check if token is expired locally before making request
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                // Token expired, could try refresh here or let interceptor handle it
                // For simple check, assume not authenticated if expired
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }
};
