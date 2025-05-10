from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
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


@csrf_exempt
def login_user(request):
    # View for logging in a user
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Logged in successfully'})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
def get_all_users(request):
    # View to get all users
    if request.method == 'GET':
        users = User.objects.all()
        users_list = [{
            "username": user.username,
            "password": user.password,
            "email": user.email} for user in users]
        return JsonResponse({'users': users_list})
    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
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


@csrf_exempt
def update_user(request):
    # View for updating user password/email
    if request.method == 'PUT':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if email:
            request.user.email = email
            request.user.save()
        if password:
            request.user.set_password(password)
            request.user.save()

        return JsonResponse({'message': 'User updated successfully'})
    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
def delete_user(request):
    # View for deleting user
    if request.method == 'DELETE':
        request.user.delete()
        return JsonResponse({'message': 'User deleted successfully'})
    return JsonResponse({'error': 'Invalid method'}, status=405)