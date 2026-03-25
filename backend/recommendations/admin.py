from users.models import UserInteraction, UserRecommendationBatch
from .models import Attraction
from django.contrib import admin

from import_export.admin import ExportActionModelAdmin
from import_export import resources

class UserInteractionResource(resources.ModelResource):
    class Meta:
        model = UserInteraction

class RecommendationBatchResource(resources.ModelResource):
    class Meta:
        model = UserRecommendationBatch

@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'parentTypeLabel', 'county', 'region', 'country']
    search_fields = ['name', 'county', 'region']
    list_filter = ['country', 'region']


@admin.register(UserInteraction)
class UserInteractionAdmin(ExportActionModelAdmin):
    resource_class = UserInteractionResource
    list_display = ['user', 'attraction', 'liked', 'profile_delta', 'timestamp']
    list_filter = ['user', 'liked']

@admin.register(UserRecommendationBatch)
class RecommendationBatchAdmin(ExportActionModelAdmin):
    resource_class = RecommendationBatchResource
    list_display = ['user', 'ild_score', 'timestamp']
    list_filter = ['user']