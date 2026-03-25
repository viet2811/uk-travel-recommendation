from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer
from rest_framework.permissions import AllowAny
from .models import UserProfile
from sentence_transformers import SentenceTransformer
import numpy as np
import json

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
              "message": "User registered successfully"
            }, status=status.HTTP_201_CREATED)
        # Username already exists
        return Response({"username": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)


embedModel = SentenceTransformer("all-MiniLM-L12-v2")

def embedLabels(labels):
    embeddings = embedModel.encode(labels)
    return np.mean(embeddings, axis=0)

class SetUserReferencesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        mhe = request.data.get('preferences')
        labels = request.data.get('labels')
        # Extra caution if front-end go wrong
        if mhe is None or labels is None:
            return Response({"error": "Missing preferences/labels in request body"}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(mhe, list) or len(mhe) != 9:
            return Response({"error": "preferences need to be a list with the length of 9"}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(labels, list):
            return Response({"error": "labels need to be a list"}, status=status.HTTP_400_BAD_REQUEST)

        update_fields = {'labelMHE': mhe}
        if labels: 
            embed = embedLabels(labels) 
            update_fields['labelEmbed'] = embed
            update_fields['summaryEmbed'] = embed

        ## ** unpack dict into keyword arg, damn
        UserProfile.objects.filter(user=request.user).update(**update_fields)
        return Response(status=status.HTTP_200_OK)
    
class ResetUserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        UserProfile.objects.update_or_create(
            user=request.user,
            defaults={
                'labelMHE': [0.0] * 9, 
                'labelEmbed': [0.0] * 384,
                'summaryEmbed': [0.0] * 384
            }
        )
        return Response({"message": "user profile is reset."},status=status.HTTP_200_OK)