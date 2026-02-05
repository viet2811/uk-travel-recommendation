from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('preferences/', views.SetUserReferencesView.as_view(), name='set-references')
]