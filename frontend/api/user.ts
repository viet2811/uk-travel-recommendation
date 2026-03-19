import { axiosInstance } from './axios';

export async function setUserPreferences({
  preferences,
  labels,
}: {
  preferences: (0 | 1)[];
  labels: string[];
}) {
  await axiosInstance.post('user/preferences/', { preferences, labels });
}

export async function registerUser({ username, password }: { username: string; password: string }) {
  await axiosInstance.post('user/register/', { username, password });
}
