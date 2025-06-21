from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import logging
from rest_framework.response import Response
from goals.models import Goal
from goal_setting.goal_advisor import GoalAdvisor

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def goal_advice_view(request, goal_id):
    try:
        goal = Goal.objects.get(goal_id=goal_id, user=request.user)
    except Goal.DoesNotExist:
        return Response({"error": "Goal not found"}, status=404)

    advisor = GoalAdvisor(goal)
    goal.current_progress = advisor.get_current_progress()
    goal.save()
    advice_generator = advisor.generate_recommendations()
    return StreamingHttpResponse(advice_generator, content_type="text/plain")
