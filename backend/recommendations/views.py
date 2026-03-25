from rest_framework import generics, permissions, response, status
from pgvector.django import CosineDistance
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Attraction
from .serializers import AttractionSerializer, AttractionSearchSerializer
from users.models import UserProfile, UserInteraction, UserRecommendationBatch
from .utils import normalize
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from types import SimpleNamespace

def mmr_rerank(candidates, n=10, lambda_mult=0.5):
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
        profile = get_object_or_404(UserProfile, user=user)
        user_vector = normalize(profile.labelMHE, profile.labelEmbed, profile.summaryEmbed)
    
        queryset = Attraction.objects.exclude(interactions__user=user) # Exclude interacted/"visited" attraction
        k = 100 # For dynamic nearest neighbour

        # Geo_area filter
        county_filter = self.request.query_params.get('county')
        region_filter = self.request.query_params.get('region')
        country_filter = self.request.query_params.get('country')
        if county_filter:
            queryset = queryset.filter(county__iexact=county_filter)
            k = 25
        elif region_filter:
            queryset = queryset.filter(region__iexact=region_filter)
            k = 50
        elif country_filter:
            queryset = queryset.filter(country__iexact=country_filter)
            k = 75
        
        # knn cosine
        return queryset.annotate(
            similarity=1-CosineDistance(expression='finalVector',vector=user_vector)
        ).order_by('-similarity')[:k]
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        candidates = list(queryset)
        final_recommendations = mmr_rerank(candidates)

        serializer = self.get_serializer(final_recommendations, many=True)
        return response.Response(serializer.data)

class InteractionView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Attraction.objects.all()

    def _log_ild(self, user):
        count = UserInteraction.objects.filter(user=user).count()
        if count % 10 == 0:
            last_10 = UserInteraction.objects.filter(user=user).order_by('-id')[:10]
            attraction_ids = [i.attraction_id for i in last_10]
            vectors = np.array([
                a.finalVector for a in Attraction.objects.filter(id__in=attraction_ids)
            ])
            n = len(vectors)
            sims = cosine_similarity(vectors)
            ild = np.sum(1 - sims) / (n * (n - 1)) if n > 1 else 0.0
            UserRecommendationBatch.objects.create(user=user, ild_score=ild)   

class LikeAttractionView(InteractionView):
    # Constant learning rate
    MHE_ALPHA = 0.2
    LABEL_EMBED_ALPHA = 0.15
    SUMMARY_EMBED_ALPHA = 0.1

    def _update_profile(self, profile, item):
        profile.labelMHE += (item.labelMHE * self.MHE_ALPHA)
        profile.labelEmbed = ((1 - self.LABEL_EMBED_ALPHA) * profile.labelEmbed) + self.LABEL_EMBED_ALPHA * item.labelEmbed
        profile.summaryEmbed = ((1 - self.SUMMARY_EMBED_ALPHA) * profile.summaryEmbed) + self.SUMMARY_EMBED_ALPHA * item.summaryEmbed

    def post(self, request, *args, **kwargs):
        item = self.get_object()
        with transaction.atomic():
            profile = UserProfile.objects.select_for_update().get(user=request.user)
            old_vector = normalize(profile.labelMHE, profile.labelEmbed, profile.summaryEmbed)
            
            _, created = UserInteraction.objects.update_or_create(
                user=request.user,
                attraction=item,
                defaults={'liked': True, 'profile_delta': None}              
            )
            if not created: return response.Response({"error": "Already liked"}, status=status.HTTP_400_BAD_REQUEST)
            # For later: if user adjust from dislike->like
            self._update_profile(profile, item)

            new_vector = normalize(profile.labelMHE, profile.labelEmbed, profile.summaryEmbed)
            delta = 1 - float(cosine_similarity(old_vector.reshape(1,-1), new_vector.reshape(1,-1))[0][0])
            UserInteraction.objects.filter(user=request.user, attraction=item).update(profile_delta=delta)
            self._log_ild(request.user)
            profile.save()

        return response.Response(
            {"message": "Preference updated", "id": item.id}, 
            status=status.HTTP_200_OK
        )

class BulkLikeAttractionView(LikeAttractionView):
    def post(self, request, *arg, **kwargs):
        ids = request.data.get('ids', [])
        attractions = Attraction.objects.filter(id__in=ids)

        # User bulk import on onboarding stage
        with transaction.atomic():
            profile = UserProfile.objects.select_for_update().get(user=request.user)
            old_vector = normalize(profile.labelMHE, profile.labelEmbed, profile.summaryEmbed)
            
            mheList = []
            labelEmbedList = []
            summaryEmbedList = []

            for item in attractions:
                _, created = UserInteraction.objects.update_or_create(
                    user=request.user, attraction=item, liked=True
                )
                if created:
                    mheList.append(item.labelMHE)
                    labelEmbedList.append(item.labelEmbed)
                    summaryEmbedList.append(item.summaryEmbed)
            
            if not mheList:
                return response.Response({"message": "Attraction already added"}, status=status.HTTP_400_BAD_REQUEST)

            mheSums = np.sum(mheList, axis=0)
            avgLabelEmbed = np.mean(labelEmbedList, axis=0)
            avgSummaryEmbed = np.mean(summaryEmbedList, axis=0)

            avgVector = SimpleNamespace(
                labelMHE=mheSums,
                labelEmbed=avgLabelEmbed,
                summaryEmbed=avgSummaryEmbed
            )

            isInitialising = not UserInteraction.objects.filter(user=request.user).exists()
            emptyEmbedding = not np.any(profile.labelEmbed) and not np.any(profile.summaryEmbed)
            if isInitialising:
                profile.labelMHE += (avgVector.labelMHE * (1 - self.MHE_ALPHA))
                if emptyEmbedding: 
                    profile.labelEmbed = avgLabelEmbed
                    profile.summaryEmbed = avgSummaryEmbed
                else:
                    alphaEmbedding = 0.6
                    profile.labelEmbed = (alphaEmbedding * avgLabelEmbed) + (1-alphaEmbedding) * profile.labelEmbed
                    profile.summaryEmbed = (alphaEmbedding * avgSummaryEmbed) + (1-alphaEmbedding) * profile.summaryEmbed
            else:        
                self._update_profile(profile, avgVector)

            new_vector = normalize(profile.labelMHE, profile.labelEmbed, profile.summaryEmbed)
            delta = 1 - float(cosine_similarity(old_vector.reshape(1,-1), new_vector.reshape(1,-1))[0][0])

            # Same delta for last one
            UserInteraction.objects.filter(user=request.user, attraction=attractions.last()).update(profile_delta=delta)
            profile.save()

        return response.Response(
            {"message": "Preferences updated"}, 
            status=status.HTTP_200_OK
        )


def vectorProjection(a, b):
    return np.multiply((np.dot(a,b) / np.dot(b,b)), b)

class DislikeAttractionView(InteractionView):
    # Constant learning rate
    MHE_ALPHA = 0.1
    EMBED_REJECTION = 0.3

    def post(self, request, *args, **kwargs):
        item = self.get_object()
        with transaction.atomic():
            profile = UserProfile.objects.select_for_update().get(user=request.user)
            old_vector = normalize(profile.labelMHE, profile.labelEmbed, profile.summaryEmbed)

            _, created = UserInteraction.objects.update_or_create(
                user=request.user,
                attraction=item,
                defaults={'liked': False, 'profile_delta': None}              
            )
            if not created: return response.Response({"error": "Already disliked"}, status=status.HTTP_400_BAD_REQUEST)
            # For later: if user adjust from like->dislike

            # MHE:  ReLU, so field wont go negative if dislike a lot     
            profile.labelMHE = np.maximum(0, profile.labelMHE - (item.labelMHE * self.MHE_ALPHA)) 

            # Embeddings: Vector Rejection / Orthogonal
            profile.labelEmbed -= self.EMBED_REJECTION * vectorProjection(profile.labelEmbed, item.labelEmbed) 
            profile.summaryEmbed -= self.EMBED_REJECTION * vectorProjection(profile.summaryEmbed, item.summaryEmbed) 

            new_vector = normalize(profile.labelMHE, profile.labelEmbed, profile.summaryEmbed)
            delta = 1 - float(cosine_similarity(old_vector.reshape(1,-1), new_vector.reshape(1,-1))[0][0])
            UserInteraction.objects.filter(user=request.user, attraction=item).update(profile_delta=delta)
            self._log_ild(request.user)
            profile.save()

        return response.Response(
            {"message": "Preference updated", "id": item.id}, 
            status=status.HTTP_200_OK
        )
    
# Leave it as liked atm
class LikedAttractionsListView(generics.ListAPIView):
    serializer_class = AttractionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Attraction.objects.filter(
            interactions__user=self.request.user,
            interactions__liked=True
        )
    
class AttractionSearchView(generics.ListAPIView):
    serializer_class = AttractionSearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q')
        if not query:
            return Attraction.objects.none()
        return Attraction.objects.filter(name__icontains=query)[:20]