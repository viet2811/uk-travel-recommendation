from django.urls import path
from . import views

urlpatterns = [
    path('', views.RecommendationsListView.as_view(), name='recommendations'),
    path('history/liked', views.LikedAttractionsListView.as_view(), name='liked-attractions-view'),
    path('like/<str:pk>', views.LikeAttractionView.as_view(), name='like-attractions'),
    path('dislike/<str:pk>', views.DislikeAttractionView.as_view(), name='dislike-attractions'),
]