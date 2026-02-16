import { axiosInstance } from './axios';

type RecommendationParams = {
  county?: string;
  region?: string;
  country?: string;
};

export async function getRecommendations(params?: RecommendationParams) {
  // Pick only one param
  let queryParam: Record<string, string> = {};

  if (params) {
    if (params.county) queryParam = { county: params.county };
    else if (params.region) queryParam = { region: params.region };
    else if (params.country) queryParam = { country: params.country };
  }

  const response = await axiosInstance.get('/recommendations', {
    params: queryParam,
  });

  return response.data;
}

export async function likeAttraction(id: string) {
  await axiosInstance.post(`/recommendations/like/${id}`);
}

export async function dislikeAttraction(id: string) {
  await axiosInstance.post(`/recommendations/dislike/${id}`);
}

export async function getLikedAttraction() {
  const response = await axiosInstance.get('/recommendations/history/liked');
  return response.data;
}
