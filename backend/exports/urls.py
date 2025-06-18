from django.urls import path
from .views import download_csv

urlpatterns = [
    path('download_csv/', download_csv, name='download_csv'),
]