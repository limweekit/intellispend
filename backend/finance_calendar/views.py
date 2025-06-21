from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from expenses.models import Expense
from income.models import Income
from goals.models import Goal

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def calendar_events(request):
    user = request.user
    events = []

    # Expenses
    for exp in Expense.objects.filter(user=user):
        events.append({
            "id": f"expense-{exp.pk}",
            "title": f"{exp.category.name}: ${exp.amount:.2f}",
            "date": exp.date.isoformat(),
            "type": "expense",
        })

    # Incomes
    for inc in Income.objects.filter(user=user):
        events.append({
            "id": f"income-{inc.pk}",
            "title": f"{inc.name}: ${inc.amount:.2f}",
            "date": inc.date.isoformat(),
            "type": "income",
        })

    # Goal deadlines
    for goal in Goal.objects.filter(user=user):
        events.append({
            "id": f"goal-{goal.goal_id}",
            "title": f"{goal.name}'s Deadline",
            "date": goal.deadline.isoformat(),
            "type": "goal",
        })

    return Response(events)
