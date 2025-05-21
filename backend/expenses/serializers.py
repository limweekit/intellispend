from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['user', 'expense_id', 'created_at']

        # check if user owns the category
        def validate_category(self, value):
            request = self.context.get('request')
            if value and value.user != request.user:
                raise serializers.ValidationError("You do not own this category.")
            return value