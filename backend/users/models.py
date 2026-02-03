from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    # Vector storage
    label_mhe = models.JSONField(default=list)
    label_embed = models.JSONField(default=list)
    summary_embed = models.JSONField(default=list)

    visited_ids = models.JSONField(default=list)

    def __str__(self):
        return f"{self.user.username}'s Profile"