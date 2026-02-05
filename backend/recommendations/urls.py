from django.urls import path
from . import views

urlpatterns = [
    path('', views.RecommendationsListView.as_view(), name='recommendations'),
]