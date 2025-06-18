from decimal import Decimal

from dateutil.relativedelta import relativedelta
from django.db.models import Sum
from expenses.models import Expense
from income.models import Income
from django.utils import timezone

from goal_setting.management.llm_client import get_llm_advice


class GoalAdvisor:
    def __init__(self, goal):
        self.goal = goal
        self.user = goal.user


    # find no of months left before deadline, min of 1 month
    def get_months_left(self):
        today = timezone.now()
        if self.goal.deadline < today:
            return 0
        delta = relativedelta(self.goal.deadline, today)
        months = delta.years * 12 + delta.months + (1 if delta.days > 0 else 0)
        return max(months, 1)


    # net income = average (total income - total expenses) over the past 3 months
    def get_monthly_net_income(self, months=3):
        today = timezone.now()
        start = today - relativedelta(months=months)

        income_sum = Income.objects.filter(user=self.user, date__gte=start).aggregate(total=Sum('amount'))['total'] or 0
        expense_sum = Expense.objects.filter(user=self.user, date__gte=start).aggregate(total=Sum('amount'))['total'] or 0

        avg_net_income = (income_sum - expense_sum) / months
        return float(avg_net_income)


    # estimate current progress based on monthly net income and the time passed since goal creation
    def get_current_progress(self):
        if self.goal.current_progress and self.goal.current_progress > 0:
            return float(self.goal.current_progress)
        today = timezone.now()
        temp = relativedelta(today, self.goal.created_at).years * 12 + relativedelta(today, self.goal.created_at).months
        months_passed = max(temp, 1)
        estimated_savings = self.get_monthly_net_income() * months_passed
        return min(estimated_savings, float(self.goal.amount))


    # calculate required monthly savings and current savings
    def calculate_savings(self):
        months_left = self.get_months_left()
        amount_left = float(self.goal.amount) - self.get_current_progress()

        if amount_left <= 0:
            return 0.0, float(self.get_monthly_net_income())

        if months_left <= 0:
            return amount_left, float(self.get_monthly_net_income())

        required_monthly_save = amount_left / months_left
        current_savings = max(float(self.get_monthly_net_income()), 0)

        return required_monthly_save, current_savings


    def generate_recommendations(self):
        required_monthly_save, current_savings = self.calculate_savings()
        gap = required_monthly_save - current_savings
        advice = []
        monthly_net_income = self.get_monthly_net_income()

        curr_expenses = Expense.objects.filter(
            user=self.user,
            date__gte=timezone.now().date().replace(day=1)
        ).values('category__name').annotate(total_spent=Sum('amount'))

        curr_expense_list = [(e['category__name'], Decimal(e['total_spent'] or 0)) for e in curr_expenses]

        if gap <= 0:
            advice.append("On track. Keep monitoring your expenses monthly to maintain your progress!")
            return advice

        total_expense = sum(amt for _, amt in curr_expense_list)
        if gap > total_expense * Decimal(0.5):
            advice.append(
                f"Your targeted monthly savings is ${gap:.2f}/month but your total monthly income is only ${monthly_net_income:.2f}. "
                "This goal might require increasing your income, extending the deadline or reducing the goal amount."
            )
            return advice

        llm_advice = get_llm_advice(self.goal.name, float(gap), curr_expense_list)
        advice.append(llm_advice)

        return advice


    def update_goal_advice(self):
        advice = self.generate_recommendations()
        self.goal.recommended_actions = advice
        self.goal.current_progress = self.get_current_progress()
        self.goal.save()