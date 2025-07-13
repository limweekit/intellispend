from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
from .models import Category
from .serializers import CategorySerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_category(request):
    # View for creating a new category
    if request.method == 'POST':
        data = json.loads(request.body)
        data['user'] = request.user.id
        serializer = CategorySerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save(user=request.user)
            return JsonResponse({'category': serializer.data}, status=201)

    return JsonResponse({'error': 'Category could not be created'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_categories(request, category_type=None):
    # View to get all categories
    filters = {'user': request.user}
    if category_type in ['expense', 'income']:
        filters['type'] = category_type

    categories = Category.objects.filter(**filters)
    serializer = CategorySerializer(categories, many=True)
    return JsonResponse({'categories': serializer.data}, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_category(request, categoryId):
    # View to get a category by its id
    if request.method == 'GET':
        try:
            category = Category.objects.get(pk=categoryId, user=request.user)
            serializer = CategorySerializer(category)
            return JsonResponse({'category': serializer.data})
        except Category.DoesNotExist:
            return JsonResponse({'error': 'Category not found'}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_category(request, categoryId):
    # View for updating existing category
    if request.method == 'PUT':
        try:
            category = Category.objects.get(pk=categoryId, user=request.user)
        except Category.DoesNotExist:
            return JsonResponse({'error': 'Category not found'}, status=404)

        data = json.loads(request.body)
        serializer = CategorySerializer(category, data=data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'category': serializer.data})

        return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_category(request, categoryId):
    # View for deleting existing category
    if request.method == 'DELETE':
        try:
            category = Category.objects.get(pk=categoryId, user=request.user)
            category.delete()
            return JsonResponse({'message': 'Category deleted successfully'}, status=204)
        except Category.DoesNotExist:
            return JsonResponse({'error': 'Category not found'}, status=404)