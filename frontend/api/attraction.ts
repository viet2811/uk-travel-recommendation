import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from './axios';

export async function getRecommendations() {
  const geoFilter = (await AsyncStorage.getItem('geoFilter')) ?? '';
  const response = await axiosInstance.get(`/recommendations${geoFilter}`);
  return response.data;
}

export async function searchAttractions(name: string) {
  const response = await axiosInstance.get(`/recommendations/search?q=${name}`);
  return response.data;
}

export async function likeAttraction(id: string) {
  await axiosInstance.post(`/recommendations/like/${id}`);
}

export async function addVisitedAttractions(ids: string[]) {
  await axiosInstance.post('/recommendations/like/bulk/', { ids });
}

export async function dislikeAttraction(id: string) {
  await axiosInstance.post(`/recommendations/dislike/${id}`);
}

export async function getLikedAttraction() {
  const response = await axiosInstance.get('/recommendations/history/liked');
  return response.data;
}
