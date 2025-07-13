from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name', 'created_at', 'user_id', 'type']
        read_only_fields = ['category_id', 'created_at', 'user_id']

    def validate(self, attrs):
        user = self.context['request'].user
        type = attrs.get('type')
        name = attrs.get('name')
        if Category.objects.filter(user=user, name=name, type=type).exists():
            raise serializers.ValidationError("You already have a category with this name")
        return attrs


    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)