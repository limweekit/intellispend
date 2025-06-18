from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import logging
from rest_framework.response import Response
from goals.models import Goal
from pipeline.goal_advisor import GoalAdvisor

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def goal_advice_view(request, goal_id):
    try:
        goal = Goal.objects.get(goal_id=goal_id, user=request.user)
    except Goal.DoesNotExist:
        return Response({"error": "Goal not found"}, status=404)

    advisor = GoalAdvisor(goal)
    advisor.update_goal_advice()

    return Response({
        "goal_id": str(goal.goal_id),
        "current_progress": goal.current_progress,
        "recommended_actions": goal.recommended_actions or [],
    })