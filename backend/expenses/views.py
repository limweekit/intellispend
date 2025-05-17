from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
import json
from .models import Expense
from .serializers import ExpenseSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_expense(request):
    # View for creating a new expense
    if request.method == 'POST':
        data = json.loads(request.body)
        data['user'] = request.user.id
        serializer = ExpenseSerializer(data=data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return JsonResponse({'expense': serializer.data}, status=201)

    return JsonResponse({'error': 'Expense could not be created'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_expenses(request):
    # View to get all expenses
    if request.method == 'GET':
        expenses = Expense.objects.filter(user=request.user)
        serializer = ExpenseSerializer(expenses, many=True)
        return JsonResponse({'expenses': serializer.data}, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expense(request, expenseId):
    # View to get an expense by its Id
    if request.method == 'GET':
        try:
            expense = Expense.objects.get(pk=expenseId, user=request.user)
            serializer = ExpenseSerializer(expense)
            return JsonResponse({'expense': serializer.data})
        except Expense.DoesNotExist:
            return JsonResponse({'error': 'Expense not found'}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_expense(request, expenseId):
    # View for updating existing expense
    if request.method == 'PUT':
        try:
            expense = Expense.objects.get(pk=expenseId, user=request.user)
        except Expense.DoesNotExist:
            return JsonResponse({'error': 'Expense not found'}, status=404)

        data = json.loads(request.body)
        serializer = ExpenseSerializer(expense, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'expense': serializer.data})

        return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_expense(request, expenseId):
    # View for deleting existing expense
    if request.method == 'DELETE':
        try:
            expense = Expense.objects.get(pk=expenseId, user=request.user)
            expense.delete()
            return JsonResponse({'message': 'Expense deleted successfully'}, status=204)
        except Expense.DoesNotExist:
            return JsonResponse({'error': 'Expense not found'}, status=404)