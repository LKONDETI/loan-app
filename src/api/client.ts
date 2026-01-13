import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For Android emulator use 10.0.2.2, for iOS simulator use localhost
// For physical device, use your machine's LAN IP
const API_URL = Platform.select({
    ios: 'http://localhost:8000',
    android: 'http://10.0.2.2:8000',
    default: 'http://localhost:8000',
});

// Storage keys
export const ACCESS_TOKEN_KEY = 'loan_app_access_token';
export const REFRESH_TOKEN_KEY = 'loan_app_refresh_token';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to add token
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error reading token:', error);
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
            (originalRequest as any)._retry = true;

            try {
                const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

                if (refreshToken) {
                    // Call refresh endpoint directly to avoid infinite loops
                    const response = await axios.post(`${API_URL}/auth/refresh`, {
                        refresh_token: refreshToken,
                    });

                    const { access_token, refresh_token } = response.data;

                    // Save new tokens
                    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access_token);
                    if (refresh_token) {
                        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);
                    }

                    // Update header and retry original request
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    }
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, user needs to login again
                console.error('Token refresh failed:', refreshError);
                // We can't navigate here easily (outside React context), 
                // so we reject, and let the UI handle the 401 or dispatch a logout action

                // Clear tokens
                await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
                await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
