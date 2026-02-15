import { axiosInstance } from 'api/axios';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post('/user/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;

      await SecureStore.setItemAsync('accessToken', access);
      await SecureStore.setItemAsync('refreshToken', refresh);

      setIsAuthenticated(true);

      // Return success status for UI
      return { success: true };
    } catch (error: any) {
      let message = 'Something went wrong';

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          message = 'Invalid username or password';
        } else if (error.response?.data?.detail) {
          message = error.response.data.detail;
        }
      }

      return { success: false, message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    setIsAuthenticated(false);
  };

  // Restore on app open
  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      token ?? setIsAuthenticated(true);
      setIsLoading(false);
    };

    loadUser();
  }, []);

  useEffect(() => {
    // Embed the bearer token before making a request
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
      // (error) => {
      //   return Promise.reject(error);
      // }
    );
    // If request got error - 401 Unauthorized
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // First time getting 401 message, attempt to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = await SecureStore.getItemAsync('refreshToken');
          if (!refreshToken) {
            await logout();
            return Promise.reject(error);
          }
          try {
            const response = await axiosInstance.post('user/token/refresh', {
              refresh: refreshToken,
            });
            const newAccessToken = response.data.access;
            await SecureStore.setItemAsync('accessToken', newAccessToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            setIsAuthenticated(true);

            // Retry original request
            return axiosInstance.request(originalRequest);
          } catch (error) {
            // Refresh token expires
            await logout();
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up function
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
