from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from pipeline.pipeline import extract_data, transform_data
from pipeline.model import predict

import logging
import traceback

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def predict_goal_success(request):
    try:
        # filter out current user's data
        user = request.user
        user_id = user.id
        expenses_df, income_df, goals_df = extract_data()
        expenses_df = expenses_df[expenses_df['user_id'] == user_id]
        income_df = income_df[income_df['user_id'] == user_id]
        goals_df = goals_df[goals_df['user_id'] == user_id]

        if expenses_df.empty and income_df.empty and goals_df.empty:
            logger.info(f"No data found for user {user.username} (ID: {user_id})")
            return Response({
                'results': [],
                'message': 'This user has no data'
            }, status=status.HTTP_200_OK)

        df = transform_data(expenses_df, income_df, goals_df)

        if df.empty:
            logger.warning(f"Transformed data is empty for user {user.username} with id {user_id}")
            return Response({
                'results': [],
                'message': 'No usable data for prediction'
            }, status=status.HTTP_200_OK)

        # run trained random forest model
        preds = predict(df)
        df['goal_achieved_prob'] = preds.round(3)

        # extract relevant columns and return as JSON object
        result_data = df[['user_id', 'month', 'goal_amount', 'goal_achieved_prob']].fillna('').to_dict(orient='records')
        return Response({'results': result_data}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        logger.debug(traceback.format_exc())
        return Response({
            'error': str(e),
            'trace': traceback.format_exc()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
