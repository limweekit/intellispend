from rest_framework import serializers
from .models import Income

class IncomeSerializer(serializers.ModelSerializer):
    def validate_category(self, value):
        request = self.context.get('request')
        if value and value.user != request.user:
            raise serializers.ValidationError("You do not own this category.")
        return value

    class Meta:
        model = Income
        fields = '__all__'
        read_only_fields = ['user', 'income_id', 'created_at']
