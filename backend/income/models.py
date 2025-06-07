import uuid

from django.contrib.auth.models import User
from django.db import models
from categories.models import Category

class Income(models.Model):
    income_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incomes')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='incomes')
    name = models.TextField(blank=False, null=False)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)