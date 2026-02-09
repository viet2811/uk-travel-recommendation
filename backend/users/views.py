from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer
from rest_framework.permissions import AllowAny
from .models import UserProfile
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
    
class SetUserReferencesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        mhe = request.data.get('preferences')
        # Extra caution if front-end go wrong
        if not mhe:
            return Response({"error": "Missing preferences in request body"}, status=status.HTTP_400_BAD_REQUEST)
        # Convert into an actual list
        mhe = json.loads(mhe)
        UserProfile.objects.filter(user=request.user).update(labelMHE=mhe)
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