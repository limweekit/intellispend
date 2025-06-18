from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from categories.models import Category
from income.models import Income
from expenses.models import Expense
from goals.models import Goal

User = get_user_model()

class Command(BaseCommand):
    help = "Clear all data in DB"

    def handle(self, *args, **kwargs):
        Goal.objects.all().delete()
        Expense.objects.all().delete()
        Income.objects.all().delete()
        Category.objects.all().delete()
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("All data cleared"))
