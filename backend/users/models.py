from django.db import models
from django.contrib.auth.models import User
from pgvector.django import VectorField
from recommendations.models import Attraction
# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    # Vector storage
    labelMHE = VectorField(dimensions=9)
    labelEmbed = VectorField(dimensions=384)
    summaryEmbed = VectorField(dimensions=384)
    
class UserInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="interactions")
    attraction = models.ForeignKey(Attraction, on_delete=models.CASCADE, related_name="interactions")
    liked = models.BooleanField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "attraction"],
                name="unique_user_attraction_interaction" # This ensures only 1 pair (user, attraction) exists
            )
        ]