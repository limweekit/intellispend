import json
import uuid
from datetime import date
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from categories.models import Category
from expenses.models import Expense


class ExpenseAPITestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password456')

        self.category1 = Category.objects.create(user=self.user1, name="Food")
        self.category2 = Category.objects.create(user=self.user2, name="Travel")

        self.expense1 = Expense.objects.create(
            user=self.user1,
            amount=20.50,
            category=self.category1,
            description="Lunch",
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


    def test_create_expense_success(self):
        self.authenticate('user1', 'password123')

        url = '/api/expenses/create'
        data = {
            "amount": "15.00",
            "category": str(self.category1.category_id),
            "description": "Dinner",
            "date": str(date.today())
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response_data['expense']['description'], "Dinner")
        self.assertEqual(response_data['expense']['user'], self.user1.id)


    def test_create_expense_invalid_category(self):
        self.authenticate('user1', 'password123')

        url = '/api/expenses/create'
        data = {
            "amount": "15.00",
            "category": str(self.category2.category_id),
            "description": "Invalid category",
            "date": str(date.today())
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertIn('You do not own this category.', json.dumps(response_data))


    def test_get_all_expenses(self):
        self.authenticate('user1', 'password123')

        url = '/api/expenses/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(len(response_data['expenses']), 1)
        self.assertEqual(response_data['expenses'][0]['description'], "Lunch")


    def test_get_expense_success(self):
        self.authenticate('user1', 'password123')

        url = f'/api/expenses/{self.expense1.expense_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response_data['expense']['description'], "Lunch")


    def test_get_expense_not_found(self):
        self.authenticate('user1', 'password123')

        fake_id = uuid.uuid4()
        url = f'/api/expenses/{fake_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)


    def test_update_expense_success(self):
        self.authenticate('user1', 'password123')

        url = f'/api/expenses/update/{self.expense1.expense_id}'
        data = {"description": "Updated lunch"}

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response_data['expense']['description'], "Updated lunch")


    def test_delete_expense_success(self):
        self.authenticate('user1', 'password123')

        url = f'/api/expenses/delete/{self.expense1.expense_id}'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

        self.assertFalse(Expense.objects.filter(pk=self.expense1.expense_id).exists())


    def test_access_control_other_user_expense(self):
        self.authenticate('user2', 'password456')

        url = f'/api/expenses/{self.expense1.expense_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)


    def test_get_expenses_by_category(self):
        self.authenticate('user1', 'password123')

        url = f'/api/expenses/category/{self.category1.category_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(len(response_data['expenses']), 1)
        self.assertEqual(response_data['expenses'][0]['category'], str(self.category1.category_id))
