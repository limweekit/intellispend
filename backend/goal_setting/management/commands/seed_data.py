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
        NUM_USERS = 1
        NUM_MONTHS = 6
        CATEGORY_NAMES = ['Food', 'Transport', 'Entertainment', 'Salary', 'Freelance']

        today = datetime.today()

        for i in range(NUM_USERS):
            username = f'testuser{i+1}'
            email = f'testuser{i+1}@example.com'
            user, created = User.objects.get_or_create(username=username, defaults={'email': email})
            if created:
                user.set_password('StrongPassword123!')
                user.save()
                self.stdout.write(f'Created user {username}')
            else:
                self.stdout.write(f'User {username} already exists')

            categories = []
            for name in CATEGORY_NAMES:
                cat, _ = Category.objects.get_or_create(user=user, name=name)
                categories.append(cat)
            cat_food, cat_transport, cat_entertain, cat_salary, cat_freelance = categories

            for month in range(NUM_MONTHS):
                salary_date = today - timedelta(days=30 * month + random.randint(0, 4))
                Income.objects.create(
                    user=user,
                    name=f"Salary ({salary_date.strftime('%b %Y')})",
                    amount=round(random.uniform(2800, 3500), 2),
                    category=cat_salary,
                    date=salary_date
                )
                if random.random() < 0.5:
                    freelance_date = today - timedelta(days=30 * month + random.randint(5, 20))
                    Income.objects.create(
                        user=user,
                        name=f"Freelance ({freelance_date.strftime('%b %Y')})",
                        amount=round(random.uniform(300, 1200), 2),
                        category=cat_freelance,
                        date=freelance_date
                    )

            for month in range(NUM_MONTHS):
                base_date = today - timedelta(days=30 * month)
                for _ in range(random.randint(8, 15)):
                    Expense.objects.create(
                        user=user,
                        amount=round(random.uniform(10, 45), 2),
                        category=cat_food,
                        description="Groceries/Meal",
                        date=base_date - timedelta(days=random.randint(0, 27))
                    )
                for _ in range(random.randint(5, 10)):
                    Expense.objects.create(
                        user=user,
                        amount=round(random.uniform(2, 30), 2),
                        category=cat_transport,
                        description="Commute/Travel",
                        date=base_date - timedelta(days=random.randint(0, 27))
                    )
                for _ in range(random.randint(3, 6)):
                    Expense.objects.create(
                        user=user,
                        amount=round(random.uniform(10, 120), 2),
                        category=cat_entertain,
                        description="Entertainment",
                        date=base_date - timedelta(days=random.randint(0, 27))
                    )

            NUM_GOALS_PER_USER = random.randint(1, 5)
            for g in range(NUM_GOALS_PER_USER):
                created_at = today - timedelta(days=random.randint(60, 180))
                duration_days = random.randint(90, 365)
                target_date = created_at + timedelta(days=duration_days)
                goal_amount = round(random.uniform(4000, 15000), 2)

                Goal.objects.create(
                    user=user,
                    name=f"Goal {g + 1}",
                    amount=goal_amount,
                    created_at=created_at,
                    deadline=target_date,
                    current_progress=round(random.uniform(0, goal_amount * 0.7), 2)
                )

            self.stdout.write(self.style.SUCCESS(f'Seeded data for {username}: 'f'{NUM_GOALS_PER_USER} goals.'))
