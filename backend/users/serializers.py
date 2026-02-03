from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile  # Import your new model

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        # 1. Create the standard Auth User (just like before)
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )

        # 2. AUTOMATICALLY create the Profile for them
        UserProfile.objects.create(
            user=user,
            label_mhe=[0.0] * 9, 
            label_embed=[0.0] * 384,
            summary_embed=[0.0] * 384
        )

        return user