import uuid
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User
from django.db import models

class Goal(models.Model):
    goal_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    name = models.TextField(blank=False, null=False)
    deadline = models.DateTimeField(default=timezone.now() + timedelta(days=180))
    created_at = models.DateTimeField(auto_now_add=True)