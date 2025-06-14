from django.urls import path
from .views import goal_advice_view

urlpatterns = [
    path('advice/<uuid:goal_id>', goal_advice_view, name='goal_advice'),
]
