from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
from .models import BudgetGroup, SharedExpense
from .serializers import BudgetGroupSerializer, SharedExpenseSerializer
from django.contrib.auth.models import User

# BudgetGroup

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_budget_group(request):
    data = json.loads(request.body)
    members = data.get('members', [])

    if request.user.id not in members:
        members.append(request.user.id)

    payload = {
        'name': data.get('name'),
        'members': members,
    }

    serializer = BudgetGroupSerializer(data=payload)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'group': serializer.data}, status=201)
    return JsonResponse({'errors': serializer.errors}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_budget_groups(request):
    groups = BudgetGroup.objects.filter(members=request.user)
    serializer = BudgetGroupSerializer(groups, many=True)
    return JsonResponse({'groups': serializer.data}, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_budget_group(request, groupId):
    try:
        group = BudgetGroup.objects.get(pk=groupId, members=request.user)
    except BudgetGroup.DoesNotExist:
        return JsonResponse({'error': 'Group not found'}, status=404)
    serializer = BudgetGroupSerializer(group)
    return JsonResponse({'group': serializer.data})

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_budget_group(request, groupId):
    try:
        group = BudgetGroup.objects.get(pk=groupId, members=request.user)
    except BudgetGroup.DoesNotExist:
        return JsonResponse({'error': 'Group not found'}, status=404)
    data = json.loads(request.body)
    serializer = BudgetGroupSerializer(group, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'group': serializer.data})
    return JsonResponse({'errors': serializer.errors}, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_budget_group(request, groupId):
    try:
        group = BudgetGroup.objects.get(pk=groupId, members=request.user)
    except BudgetGroup.DoesNotExist:
        return JsonResponse({'error': 'Group not found'}, status=404)
    group.delete()
    return JsonResponse({'message': 'Group deleted'}, status=204)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_member_to_group(request, groupId):
    try:
        group = BudgetGroup.objects.get(pk=groupId, members=request.user)
    except BudgetGroup.DoesNotExist:
        return JsonResponse({'error': 'Group not found'}, status=404)
    data = json.loads(request.body)
    user_id = data.get('user_id')
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    group.members.add(user)
    group.save()
    return JsonResponse({'message': 'Member added'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_member_from_group(request, groupId):
    try:
        group = BudgetGroup.objects.get(pk=groupId, members=request.user)
    except BudgetGroup.DoesNotExist:
        return JsonResponse({'error': 'Group not found'}, status=404)
    data = json.loads(request.body)
    user_id = data.get('user_id')
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    group.members.remove(user)
    group.save()
    return JsonResponse({'message': 'Member removed'})



# SharedExpense

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_shared_expense(request):
    data = json.loads(request.body)
    group_id = data.get('group')
    try:
        group = BudgetGroup.objects.get(pk=group_id, members=request.user)
    except BudgetGroup.DoesNotExist:
        return JsonResponse({'error': 'Group not found or not a member'}, status=404)
    data['created_by'] = request.user.id
    serializer = SharedExpenseSerializer(data=data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return JsonResponse({'expense': serializer.data}, status=201)
    return JsonResponse({'errors': serializer.errors}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_shared_expenses(request, groupId):
    try:
        group = BudgetGroup.objects.get(pk=groupId, members=request.user)
    except BudgetGroup.DoesNotExist:
        return JsonResponse({'error': 'Group not found or not a member'}, status=404)
    expenses = SharedExpense.objects.filter(group=group)
    serializer = SharedExpenseSerializer(expenses, many=True)
    return JsonResponse({'expenses': serializer.data}, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_shared_expense(request, groupId, expenseId):
    try:
        expense = SharedExpense.objects.get(pk=expenseId, group__pk=groupId)
        if request.user not in expense.group.members.all():
            raise SharedExpense.DoesNotExist
    except SharedExpense.DoesNotExist:
        return JsonResponse({'error': 'Expense not found'}, status=404)
    serializer = SharedExpenseSerializer(expense)
    return JsonResponse({'expense': serializer.data})

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_shared_expense(request, expenseId):
    try:
        expense = SharedExpense.objects.get(pk=expenseId)
        if request.user not in expense.group.members.all():
            raise SharedExpense.DoesNotExist
    except SharedExpense.DoesNotExist:
        return JsonResponse({'error': 'Expense not found'}, status=404)
    data = json.loads(request.body)
    serializer = SharedExpenseSerializer(expense, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'expense': serializer.data})
    return JsonResponse({'errors': serializer.errors}, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_shared_expense(request, expenseId):
    try:
        expense = SharedExpense.objects.get(pk=expenseId)
        if request.user not in expense.group.members.all():
            raise SharedExpense.DoesNotExist
    except SharedExpense.DoesNotExist:
        return JsonResponse({'error': 'Expense not found'}, status=404)
    expense.delete()
    return JsonResponse({'message': 'Expense deleted'}, status=204)