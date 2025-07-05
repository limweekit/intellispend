from rest_framework import serializers
from .models import BillReminder

class BillReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillReminder
        fields = '__all__'
        read_only_fields = ['user']