from django.urls import path
from . import views

urlpatterns = [
    # BudgetGroup
    path('groups', views.get_all_budget_groups, name='get_all_budget_groups'),
    path('groups/create', views.create_budget_group, name='create_budget_group'),
    path('groups/<int:groupId>', views.get_budget_group, name='get_budget_group'),
    path('groups/update/<int:groupId>', views.update_budget_group, name='update_budget_group'),
    path('groups/delete/<int:groupId>', views.delete_budget_group, name='delete_budget_group'),
    path('groups/add_member/<int:groupId>', views.add_member_to_group, name='add_member_to_group'),
    path('groups/remove_member/<int:groupId>', views.remove_member_from_group, name='remove_member_from_group'),

    # SharedExpense
    path('shared_expenses/create', views.create_shared_expense, name='create_shared_expense'),
    path('groups/<int:groupId>/shared_expenses', views.get_all_shared_expenses, name='get_all_shared_expenses'),
    path('groups/<int:groupId>/shared_expenses/<int:expenseId>', views.get_shared_expense, name='get_shared_expense'),
    path('shared_expenses/update/<int:expenseId>', views.update_shared_expense, name='update_shared_expense'),
    path('shared_expenses/delete/<int:expenseId>', views.delete_shared_expense, name='delete_shared_expense'),
]