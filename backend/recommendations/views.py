from rest_framework import generics, permissions, response
from pgvector.django import CosineDistance
from django.shortcuts import get_object_or_404
from .models import Attraction
from .serializers import AttractionSerializer
from users.models import UserProfile
from .utils import normalize
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def mmr_rerank(candidates, n=10, lambda_mult=0.3):
    selected = []
    remains = candidates[:]

    for _ in range(n):
        best_mmr = -np.inf
        best_idx = -1

        for i, item in enumerate(remains):
            max_redundancy = 0.0
            if selected:
                curVectors = np.array(item.finalVector).reshape(1, -1)
                selectedVectors = np.vstack([sel.finalVector for sel in selected])

                sims = cosine_similarity(curVectors, selectedVectors)
                max_redundancy = np.max(sims)

            mmr_score = lambda_mult * item.similarity - ((1-lambda_mult) * max_redundancy)
            if mmr_score > best_mmr:
                best_mmr = mmr_score
                best_idx = i
        if best_idx != -1:
            selected.append(remains.pop(best_idx))
    return selected

class RecommendationsListView(generics.ListAPIView):
    serializer_class = AttractionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user=self.request.user
        # get user profile
        profile = get_object_or_404(UserProfile, user=user)
        # normalize
        user_vector = normalize(profile.label_mhe, profile.label_embed, profile.summary_embed)
        # Geo_area filter?
        county_filter = self.request.query_params.get('county')
        region_filter = self.request.query_params.get('region')
        country_filter = self.request.query_params.get('country')
        queryset = Attraction.objects
        if county_filter:
            queryset = queryset.filter(county__iexact=county_filter)
        elif region_filter:
            queryset = queryset.filter(region__iexact=region_filter)
        elif country_filter:
            queryset = queryset.filter(country__iexact=country_filter)
            
        # knn cosine
        return queryset.annotate(similarity=1-CosineDistance(expression='finalVector',vector=user_vector)).order_by('-similarity')[:100]
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        candidates = list(queryset)
        final_recommendations = mmr_rerank(candidates)

        serializer = self.get_serializer(final_recommendations, many=True)
        return response.Response(serializer.data)