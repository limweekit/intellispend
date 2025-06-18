from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from goals.models import Goal
from uuid import UUID
from datetime import timedelta
from django.utils import timezone
import json


class GoalAPITestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password456')

        self.client = APIClient()
        self.goal1 = Goal.objects.create(
            user=self.user1,
            amount=1000,
            name="Buy laptop",
            deadline=timezone.now() + timedelta(days=15)
        )


    def authenticate(self, username, password):
        login_url = '/api/users/login'
        login_data = {'username': username, 'password': password}
        response = self.client.post(login_url, login_data, format='json')
        response_data = json.loads(response.content.decode('utf-8'))
        token = response_data.get('access_token')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)


    def test_create_goal_success(self):
        self.authenticate('user1', 'password123')
        url = '/api/goals/create'
        data = {
            'name': 'Travel fund',
            'amount': 500.00,
            'deadline': (timezone.now() + timedelta(days=20)).isoformat()
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        response_data = response.json()['goal']
        self.assertEqual(response_data['name'], 'Travel fund')


    def test_get_all_goals(self):
        self.authenticate('user1', 'password123')
        url = '/api/goals/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['goals']), 1)


    def test_get_single_goal_success(self):
        self.authenticate('user1', 'password123')
        url = f'/api/goals/{self.goal1.goal_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['goal']['goal_id'], str(self.goal1.goal_id))


    def test_update_goal_success(self):
        self.authenticate('user1', 'password123')
        url = f'/api/goals/update/{self.goal1.goal_id}'
        data = {'name': 'Updated goal', 'amount': 1200}
        response = self.client.put(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        updated = response.json()['goal']
        self.assertEqual(updated['name'], 'Updated goal')


    def test_update_goal_unauthorized(self):
        self.authenticate('user2', 'password456')
        url = f'/api/goals/update/{self.goal1.goal_id}'
        data = {'name': 'Unauthorized name'}
        response = self.client.put(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)


    def test_delete_goal_success(self):
        self.authenticate('user1', 'password123')
        url = f'/api/goals/delete/{self.goal1.goal_id}'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)


    def test_delete_goal_not_found(self):
        self.authenticate('user1', 'password123')
        fake_uuid = UUID("12345678-1234-5678-1234-567812345678")
        url = f'/api/goals/delete/{fake_uuid}'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 404)
