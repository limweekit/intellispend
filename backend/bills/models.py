from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class BillReminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return f"{self.name} ({self.due_date})"