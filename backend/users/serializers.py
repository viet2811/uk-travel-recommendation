from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile  # Import your new model

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )

        UserProfile.objects.create(
            user=user,
            labelMHE=[0.0] * 9, 
            labelEmbed=[0.0] * 384,
            summaryEmbed=[0.0] * 384
        )

        return user