import uuid
import json
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from categories.models import Category


class CategoryAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password456')

        self.category1 = Category.objects.create(user=self.user1, name='Groceries')
        self.category2 = Category.objects.create(user=self.user2, name='Travel')

        login_data = {'username': 'user1', 'password': 'password123'}
        response = self.client.post('/api/users/login', login_data, format='json')
        response_data = json.loads(response.content.decode('utf-8'))
        token = response_data.get('access_token')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)


    def test_create_category_success(self):
        url = '/api/categories/create'
        data = {'name': 'Health'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response_data['category']['name'], 'Health')
        self.assertEqual(response_data['category']['user_id'], self.user1.id)


    def test_create_duplicate_category(self):
        url = '/api/categories/create'
        data = {'name': 'Groceries'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content.decode('utf-8'))
        self.assertIn("Category could not be created", json.dumps(response_data))


    def test_get_all_categories(self):
        url = '/api/categories/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(len(response_data['categories']), 1)
        self.assertEqual(response_data['categories'][0]['name'], 'Groceries')


    def test_get_category_success(self):
        url = f'/api/categories/{self.category1.category_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response_data['category']['name'], 'Groceries')


    def test_get_category_not_found(self):
        fake_id = uuid.uuid4()
        url = f'/api/categories/{fake_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)


    def test_update_category_success(self):
        url = f'/api/categories/update/{self.category1.category_id}'
        data = {'name': 'Updated Groceries'}
        response = self.client.put(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response_data['category']['name'], 'Updated Groceries')


    def test_delete_category_success(self):
        url = f'/api/categories/delete/{self.category1.category_id}'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Category.objects.filter(pk=self.category1.category_id).exists())


    def test_access_control_other_user_category(self):
        login_data = {'username': 'user2', 'password': 'password456'}
        response = self.client.post('/api/users/login', login_data, format='json')
        token = json.loads(response.content.decode('utf-8')).get('access_token')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        url = f'/api/categories/{self.category1.category_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
