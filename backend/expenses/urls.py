from django.urls import path
from . import views

urlpatterns = [
    path('create', views.create_expense, name='create_expense'),
    path('update/<uuid:expenseId>', views.update_expense, name='update_expense'),
    path('delete/<uuid:expenseId>', views.delete_expense, name='delete_expense'),
    path('', views.get_all_expenses, name='get_all_expenses'),
    path('<uuid:expenseId>', views.get_expense, name='get_expense'),
    path('category/<uuid:categoryId>', views.get_expenses_by_category, name='get_expenses_by_category'),
]
