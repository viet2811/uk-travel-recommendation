import { axiosInstance } from './axios';

export async function setUserPreferences(preferences: (1 | 0)[]) {
  await axiosInstance.post('user/preferences/', { preferences });
}

export async function registerUser({ username, password }: { username: string; password: string }) {
  await axiosInstance.post('user/register/', { username, password });
}
