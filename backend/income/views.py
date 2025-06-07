from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
from .models import Income
from .serializers import IncomeSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_income(request):
    data = json.loads(request.body)
    data['user'] = request.user.id
    serializer = IncomeSerializer(data=data, context={'request': request})

    if serializer.is_valid():
        serializer.save(user=request.user)
        return JsonResponse({'income': serializer.data}, status=201)

    return JsonResponse({'error': 'Income could not be created'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_incomes(request):
    incomes = Income.objects.filter(user=request.user)
    serializer = IncomeSerializer(incomes, many=True, context={'request': request})
    return JsonResponse({'incomes': serializer.data}, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_income(request, incomeId):
    try:
        income = Income.objects.get(pk=incomeId, user=request.user)
    except Income.DoesNotExist:
        return JsonResponse({'error': 'Income not found'}, status=404)

    serializer = IncomeSerializer(income, context={'request': request})
    return JsonResponse({'income': serializer.data})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_income(request, incomeId):
    try:
        income = Income.objects.get(pk=incomeId, user=request.user)
    except Income.DoesNotExist:
        return JsonResponse({'error': 'Income not found'}, status=404)

    data = json.loads(request.body)
    serializer = IncomeSerializer(
        income,
        data=data,
        partial=True,
        context={'request': request}
    )

    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'income': serializer.data})

    return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_income(request, incomeId):
    try:
        income = Income.objects.get(pk=incomeId, user=request.user)
    except Income.DoesNotExist:
        return JsonResponse({'error': 'Income not found'}, status=404)

    income.delete()
    return JsonResponse({'message': 'Income deleted successfully'}, status=204)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_incomes_by_category(request, categoryId):
    incomes = Income.objects.filter(
        user=request.user,
        category__category_id=categoryId
    )
    serializer = IncomeSerializer(incomes, many=True, context={'request': request})
    return JsonResponse({'incomes': serializer.data}, safe=False)
