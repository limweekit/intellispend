from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
import json


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    # View for registering a new user
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already taken'}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already taken'}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        return JsonResponse({'message': 'User created successfully'})
    return JsonResponse({'error': 'Invalid method'}, status=405)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    # View for logging in a user
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'message': 'Logged in successfully',
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    # View to get all users
    if request.method == 'GET':
        users = User.objects.all()
        users_list = [{
            "username": user.username,
            "password": user.password,
            "email": user.email
        } for user in users]
        return JsonResponse({'users': users_list})
    return JsonResponse({'error': 'Invalid method'}, status=405)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, username):
    # View to get a user by their username
    if request.method == 'GET':
        try:
            user = User.objects.get(username=username)
            user_data = {
                "username": user.username,
                "password": user.password,
                "email": user.email
            }
            return JsonResponse({'user': user_data})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'error': 'Invalid method'}, status=405)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    # View for updating user details
    data = request.data

    if request.method == 'PUT':
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if username:
            request.user.username = username
        if email:
            request.user.email = email
        if password:
            request.user.set_password(password)

        request.user.save()
        return JsonResponse({'message': 'User updated successfully'})

    return JsonResponse({'error': 'Invalid method'}, status=405)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    # View for deleting user
    if request.method == 'DELETE':
        request.user.delete()
        return JsonResponse({'message': 'User deleted successfully'})
    return JsonResponse({'error': 'Invalid method'}, status=405)