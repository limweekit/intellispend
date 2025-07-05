from django.db import models
from django.contrib.auth.models import User

from categories.models import Category

# Create your models here.
RECURRENCE_CHOICES = [
    ('once', 'Once'),
    ('weekly', 'Weekly'),
    ('monthly', 'Monthly'),
    ('yearly', 'Yearly'),
]

class BillReminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    recurrence = models.CharField(max_length=20, choices=RECURRENCE_CHOICES, default='once')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    payment_method = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return f"{self.name} ({self.due_date})"