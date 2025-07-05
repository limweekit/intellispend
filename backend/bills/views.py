from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
from .models import BillReminder
from .serializers import BillReminderSerializer
from django.utils import timezone
from datetime import timedelta

# Create your views here.


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_bill_reminder(request):
    data = json.loads(request.body)
    data['user'] = request.user.id
    serializer = BillReminderSerializer(data=data, context={'request': request})

    if serializer.is_valid():
        serializer.save(user=request.user)
        return JsonResponse({'bill': serializer.data}, status=201)

    return JsonResponse({'errors': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_bill_reminders(request):
    bills = BillReminder.objects.filter(user=request.user)
    serializer = BillReminderSerializer(bills, many=True, context={'request': request})
    return JsonResponse({'bills': serializer.data}, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bill_reminder(request, billId):
    try:
        bill = BillReminder.objects.get(pk=billId, user=request.user)
    except BillReminder.DoesNotExist:
        return JsonResponse({'error': 'Bill not found'}, status=404)

    serializer = BillReminderSerializer(bill, context={'request': request})
    return JsonResponse({'bill': serializer.data})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_bill_reminder(request, billId):
    try:
        bill = BillReminder.objects.get(pk=billId, user=request.user)
    except BillReminder.DoesNotExist:
        return JsonResponse({'error': 'Bill not found'}, status=404)

    data = json.loads(request.body)
    serializer = BillReminderSerializer(
        bill,
        data=data,
        partial=True,
        context={'request': request}
    )

    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'bill': serializer.data})

    return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_bill_reminder(request, billId):
    try:
        bill = BillReminder.objects.get(pk=billId, user=request.user)
    except BillReminder.DoesNotExist:
        return JsonResponse({'error': 'Bill not found'}, status=404)

    bill.delete()
    return JsonResponse({'message': 'Bill deleted successfully'}, status=204)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_upcoming_bill_reminders(request):
    today = timezone.now().date()
    soon = today + timedelta(days=7)
    bills = BillReminder.objects.filter(
        user=request.user,
        due_date__range=(today, soon),
        is_active=True
    )
    serializer = BillReminderSerializer(bills, many=True, context={'request': request})
    return JsonResponse({'bills': serializer.data}, safe=False)