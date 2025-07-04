from django.contrib.auth.models import User
from rest_framework import serializers

from budgeting.models import BudgetGroup, SharedExpense

class BudgetGroupSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all()
    )

    class Meta:
        model = BudgetGroup
        fields = ['id', 'name', 'created_at', 'members']

class SharedExpenseSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.id')
    group = serializers.PrimaryKeyRelatedField(queryset=BudgetGroup.objects.all())

    class Meta:
        model = SharedExpense
        fields = [
            'id', 'group', 'description', 'amount', 'created_by',
            'created_at', 'split_type', 'splits'
        ]