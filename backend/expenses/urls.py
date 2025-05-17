from django.urls import path
from . import views

urlpatterns = [
    path('create', views.create_expense, name='create_expense'),
    path('<uuid:expenseId>/update', views.update_expense, name='update_expense'),
    path('<uuid:expenseId>/delete', views.delete_expense, name='delete_expense'),
    path('', views.get_all_expenses, name='get_all_expenses'),
    path('<uuid:expenseId>', views.get_expense, name='get_expense'),
]
