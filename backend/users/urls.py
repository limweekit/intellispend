from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register_user, name='register_user'),
    path('login', views.login_user, name='login_user'),
    path('update', views.update_user, name='update_user'),
    path('delete', views.delete_user, name='delete_user'),
    path('', views.get_all_users, name='get_all_users'),
    path('<str:username>', views.get_user, name='get_user'),
]
