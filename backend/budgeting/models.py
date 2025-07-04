from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class BudgetGroup(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(User, related_name='budget_groups')

    def __str__(self):
        return self.name

class SharedExpense(models.Model):
    group = models.ForeignKey(BudgetGroup, on_delete=models.CASCADE, related_name='shared_expenses')
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    split_type = models.CharField(
        max_length=20,
        choices=[('equal', 'Equal'), ('custom', 'Custom')],
        default='equal'
    )
    splits = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.description} - {self.amount}"