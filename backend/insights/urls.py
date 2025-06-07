from django.urls import path
from .views import predict_goal_success

urlpatterns = [
    path('predict', predict_goal_success, name='predict-goal-success'),
]
