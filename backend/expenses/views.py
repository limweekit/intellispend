from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
from .models import Expense
from .serializers import ExpenseSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_expense(request):
    data = json.loads(request.body)
    data['user'] = request.user.id
    serializer = ExpenseSerializer(data=data, context={'request': request})

    if serializer.is_valid():
        serializer.save(user=request.user)
        return JsonResponse({'expense': serializer.data}, status=201)

    return JsonResponse({'errors': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_expenses(request):
    expenses = Expense.objects.filter(user=request.user)
    serializer = ExpenseSerializer(expenses, many=True, context={'request': request})
    return JsonResponse({'expenses': serializer.data}, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expense(request, expenseId):
    try:
        expense = Expense.objects.get(pk=expenseId, user=request.user)
    except Expense.DoesNotExist:
        return JsonResponse({'error': 'Expense not found'}, status=404)

    serializer = ExpenseSerializer(expense, context={'request': request})
    return JsonResponse({'expense': serializer.data})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_expense(request, expenseId):
    try:
        expense = Expense.objects.get(pk=expenseId, user=request.user)
    except Expense.DoesNotExist:
        return JsonResponse({'error': 'Expense not found'}, status=404)

    data = json.loads(request.body)
    serializer = ExpenseSerializer(
        expense,
        data=data,
        partial=True,
        context={'request': request}
    )

    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'expense': serializer.data})

    return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_expense(request, expenseId):
    try:
        expense = Expense.objects.get(pk=expenseId, user=request.user)
    except Expense.DoesNotExist:
        return JsonResponse({'error': 'Expense not found'}, status=404)

    expense.delete()
    return JsonResponse({'message': 'Expense deleted successfully'}, status=204)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expenses_by_category(request, categoryId):
    expenses = Expense.objects.filter(
        user=request.user,
        category__category_id=categoryId
    )
    serializer = ExpenseSerializer(expenses, many=True, context={'request': request})
    return JsonResponse({'expenses': serializer.data}, safe=False)
