import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
