from django.urls import path
from categories import views

urlpatterns = [
    path('create', views.create_category, name='create_category'),
    path('update/<uuid:categoryId>', views.update_category, name='update_category'),
    path('delete/<uuid:categoryId>', views.delete_category, name='delete_category'),
    path('', views.get_all_categories, name='get_all_categories'),
    path('type/<str:category_type>/', views.get_all_categories, name='get_categories_by_type'),
    path('<uuid:categoryId>', views.get_category, name='get_category'),
]
