from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from datetime import date
import json
import uuid
from .models import Income, Category


class IncomeAPITestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password456')

        self.category1 = Category.objects.create(user=self.user1, name="Salary", type="income")
        self.category2 = Category.objects.create(user=self.user2, name="Investment", type="income")

        self.income1 = Income.objects.create(
            user=self.user1,
            amount=1000.00,
            category=self.category1,
            name="Monthly Salary",
            date=date.today()
        )
        self.client = APIClient()


    def authenticate(self, username, password):
        login_url = '/api/users/login'
        login_data = {'username': username, 'password': password}
        response = self.client.post(login_url, login_data, format='json')
        response_data = json.loads(response.content.decode('utf-8'))
        token = response_data.get('access_token')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)


    def test_create_income_success(self):
        self.authenticate('user1', 'password123')
        url = '/api/income/create'
        data = {
            "amount": "500.00",
            "category": str(self.category1.category_id),
            "name": "Bonus",
            "date": str(date.today())
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response_data['income']['name'], "Bonus")
        self.assertEqual(response_data['income']['user'], self.user1.id)


    def test_create_income_invalid_category(self):
        self.authenticate('user1', 'password123')
        url = '/api/income/create'
        data = {
            "amount": "200.00",
            "category": str(self.category2.category_id),
            "name": "Invalid Category Income",
            "date": str(date.today())
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertIn('You do not own this category.', json.dumps(response_data))


    def test_get_all_incomes(self):
        self.authenticate('user1', 'password123')
        url = '/api/income/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertTrue(len(response_data['income']) >= 1)
        self.assertEqual(response_data['income'][0]['name'], "Monthly Salary")


    def test_get_income_success(self):
        self.authenticate('user1', 'password123')
        url = f'/api/income/{self.income1.income_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response_data['income']['name'], "Monthly Salary")


    def test_get_income_not_found(self):
        self.authenticate('user1', 'password123')
        fake_id = uuid.uuid4()
        url = f'/api/income/{fake_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)


    def test_update_income_success(self):
        self.authenticate('user1', 'password123')
        url = f'/api/income/update/{self.income1.income_id}'
        data = {"name": "Updated salary"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response_data['income']['name'], "Updated salary")


    def test_delete_income_success(self):
        self.authenticate('user1', 'password123')
        url = f'/api/income/delete/{self.income1.income_id}'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Income.objects.filter(pk=self.income1.income_id).exists())


    def test_access_control_other_user_income(self):
        self.authenticate('user2', 'password456')
        url = f'/api/income/{self.income1.income_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)


    def test_get_incomes_by_category(self):
        self.authenticate('user1', 'password123')
        url = f'/api/income/category/{self.category1.category_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertTrue(len(response_data['income']) >= 1)
        self.assertEqual(response_data['income'][0]['category'], str(self.category1.category_id))
