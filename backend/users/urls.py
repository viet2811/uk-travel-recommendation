from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('preferences/', views.SetUserReferencesView.as_view(), name='set-references'),
    path('reset/', views.ResetUserProfileView.as_view(), name='reset-profile'),
    path('token/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh', TokenRefreshView().as_view(), name='refresh-token'),
]