import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from categories.models import Category
from expenses.models import Expense
from income.models import Income
from goals.models import Goal

User = get_user_model()

# dummy data generator for smart goal setting feature

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        NUM_USERS = 5
        NUM_INCOMES_PER_USER = random.randint(30, 70)
        NUM_EXPENSES_PER_USER = 100
        NUM_GOALS_PER_USER = 50
        CATEGORY_NAMES = ['Food', 'Transport', 'Entertainment', 'Salary', 'Freelance']

        today = datetime.today()

        for i in range(NUM_USERS):
            username = f'testuser{i+1}'
            email = f'testuser{i+1}@example.com'
            user, created = User.objects.get_or_create(username=username, defaults={'email': email})
            if created:
                user.set_password('password')
                user.save()
                self.stdout.write(f'Created user {username}')
            else:
                self.stdout.write(f'User {username} already exists')

            categories = []
            for name in CATEGORY_NAMES:
                cat, _ = Category.objects.get_or_create(user=user, name=name)
                categories.append(cat)

            for _ in range(NUM_INCOMES_PER_USER):
                Income.objects.create(
                    user=user,
                    name=f"Income {_ + 1}",
                    amount=round(random.uniform(500, 2000), 2),
                    category=random.choice(categories[3:]),
                    date=today - timedelta(days=random.randint(1, 365))
                )

            for _ in range(NUM_EXPENSES_PER_USER):
                Expense.objects.create(
                    user=user,
                    amount=round(random.uniform(10, 2000), 2),
                    category=random.choice(categories[:3]),
                    description=f"Expense {_ + 1}",
                    date=today - timedelta(days=random.randint(1, 365))
                )

            for _ in range(NUM_GOALS_PER_USER):
                created_at = today - timedelta(days=random.randint(60, 365))
                duration_days = random.randint(30, 365)
                target_date = created_at + timedelta(days=duration_days)
                goal_amount = round(random.uniform(5000, 30000), 2)

                Goal.objects.create(
                    user=user,
                    name=f"Goal {_ + 1}",
                    amount=goal_amount,
                    created_at=created_at,
                    deadline=target_date,
                    current_progress=round(random.uniform(0, goal_amount * 0.5), 2)
                )

            self.stdout.write(self.style.SUCCESS(f'Seeded data for {username}: '
                                                 f'{NUM_INCOMES_PER_USER} incomes, '
                                                 f'{NUM_EXPENSES_PER_USER} expenses, '
                                                 f'{NUM_GOALS_PER_USER} goals.'))
