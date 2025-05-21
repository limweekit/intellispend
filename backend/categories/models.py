from django.db import models
from django.contrib.auth.models import User
import uuid

class Category(models.Model):
    category_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    # ensure that each user's category names are unique
    class Meta:
        unique_together = ('user', 'name')
