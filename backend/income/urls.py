from django.urls import path
from . import views

urlpatterns = [
    path('create', views.create_income, name='create_income'),
    path('update/<uuid:incomeId>', views.update_income, name='update_income'),
    path('delete/<uuid:incomeId>', views.delete_income, name='delete_income'),
    path('', views.get_all_incomes, name='get_all_incomes'),
    path('<uuid:incomeId>', views.get_income, name='get_income'),
    path('category/<uuid:categoryId>', views.get_incomes_by_category, name='get_incomes_by_category'),
]
