from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
import json

class UserAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='securepass123', email='test@gmail.com')


    def authenticate(self):
        login_data = {'username': 'testuser', 'password': 'securepass123'}
        response = self.client.post('/api/users/login', login_data, format='json')
        token = json.loads(response.content)['access_token']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)


    def test_register_user_success(self):
        data = {
            'username': 'newuser',
            'password': 'strongPassword!123',
            'email': 'newuser@gmail.com'
        }
        response = self.client.post('/api/users/register', data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())
        self.assertEqual(response.json()['user']['username'], 'newuser')


    def test_register_user_existing_email(self):
        data = {
            'username': 'anotheruser',
            'password': 'password1234',
            'email': 'test@gmail.com'
        }
        response = self.client.post('/api/users/register', data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('email', response.json())


    def test_login_user_success(self):
        data = {'username': 'testuser', 'password': 'securepass123'}
        response = self.client.post('/api/users/login', data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())


    def test_login_user_invalid_credentials(self):
        data = {'username': 'testuser', 'password': 'wrongpassword'}
        response = self.client.post('/api/users/login', data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())


    def test_get_all_users(self):
        self.authenticate()
        response = self.client.get('/api/users/', format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('users', response.json())


    def test_get_single_user_success(self):
        self.authenticate()
        response = self.client.get(f'/api/users/{self.user.username}', format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['user']['username'], 'testuser')


    def test_get_single_user_not_found(self):
        self.authenticate()
        response = self.client.get('/api/users/nonexistentuser', format='json')
        self.assertEqual(response.status_code, 404)


    def test_update_user_success(self):
        self.authenticate()
        data = {'username': 'updateduser', 'email': 'updated@gmail.com', 'password': 'Newpass123!'}
        response = self.client.put('/api/users/update', data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['user']['username'], 'updateduser')


    def test_delete_user_success(self):
        self.authenticate()
        response = self.client.delete('/api/users/delete', format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'User deleted successfully')
