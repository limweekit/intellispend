from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from .models import BudgetGroup, SharedExpense
import json

class BudgetGroupAPITests(APITestCase):
    def authenticate(self, username, password):
        login_url = '/api/users/login'
        login_data = {'username': username, 'password': password}
        response = self.client.post(login_url, login_data, format='json')
        response_data = json.loads(response.content.decode('utf-8'))
        token = response_data.get('access_token')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def setUp(self):
        self.user = User.objects.create_user(username='alice', password='password123')
        self.other_user = User.objects.create_user(username='bob', password='password123')
        self.client = APIClient()
        self.authenticate('alice', 'password123')

    def test_create_budget_group(self):
        url = reverse('create_budget_group')
        data = {'name': 'Trip'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['group']['name'], 'Trip')
        self.assertEqual(BudgetGroup.objects.count(), 1)
        self.assertIn(self.user, BudgetGroup.objects.first().members.all())

    def test_get_all_budget_groups(self):
        group1 = BudgetGroup.objects.create(name="Test Group 1")
        group1.members.add(self.user)
        response = self.client.get(reverse('get_all_budget_groups'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['groups']), 1)
        self.assertEqual(data['groups'][0]['name'], "Test Group 1")

    def test_get_budget_group(self):
        group = BudgetGroup.objects.create(name="Test Group 2")
        group.members.add(self.user)
        url = reverse('get_budget_group', args=[group.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['group']['name'], "Test Group 2")

        self.authenticate('bob', 'password123')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_update_budget_group(self):
        group = BudgetGroup.objects.create(name="Old Name")
        group.members.add(self.user)
        url = reverse('update_budget_group', args=[group.pk])
        data = {'name': 'New Name'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        group.refresh_from_db()
        self.assertEqual(group.name, 'New Name')

    def test_delete_budget_group(self):
        group = BudgetGroup.objects.create(name="Delete Group")
        group.members.add(self.user)
        url = reverse('delete_budget_group', args=[group.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(BudgetGroup.objects.filter(pk=group.pk).exists())

    def test_add_member_to_group(self):
        group = BudgetGroup.objects.create(name="Add Member")
        group.members.add(self.user)
        url = reverse('add_member_to_group', args=[group.pk])
        data = {'user_id': self.other_user.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        group.refresh_from_db()
        self.assertIn(self.other_user, group.members.all())

    def test_remove_member_from_group(self):
        group = BudgetGroup.objects.create(name="Remove Member")
        group.members.add(self.user, self.other_user)
        url = reverse('remove_member_from_group', args=[group.pk])
        data = {'user_id': self.other_user.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        group.refresh_from_db()
        self.assertNotIn(self.other_user, group.members.all())


class SharedExpenseAPITests(APITestCase):
    def authenticate(self, username, password):
        login_url = '/api/users/login'
        login_data = {'username': username, 'password': password}
        response = self.client.post(login_url, login_data, format='json')
        response_data = json.loads(response.content.decode('utf-8'))
        token = response_data.get('access_token')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def setUp(self):
        self.user = User.objects.create_user(username='alice', password='password123')
        self.other_user = User.objects.create_user(username='bob', password='password123')
        self.group = BudgetGroup.objects.create(name="Test Group")
        self.group.members.add(self.user)
        self.expense_data = {
            'group': str(self.group.pk),
            'description': 'Dinner',
            'amount': 100.0,
            'created_by': self.user.id
        }
        self.client = APIClient()
        self.authenticate('alice', 'password123')

    def test_create_shared_expense(self):
        url = reverse('create_shared_expense')
        response = self.client.post(url, self.expense_data, format='json')
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['expense']['description'], 'Dinner')
        self.assertEqual(SharedExpense.objects.count(), 1)

    def test_get_all_shared_expenses(self):
        SharedExpense.objects.create(group=self.group, description='Lunch', amount=50, created_by=self.user)
        url = reverse('get_all_shared_expenses', args=[self.group.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['expenses']), 1)
        self.assertEqual(data['expenses'][0]['description'], 'Lunch')

    def test_get_shared_expense(self):
        expense = SharedExpense.objects.create(group=self.group, description='Taxi', amount=25, created_by=self.user)
        url = reverse('get_shared_expense', args=[self.group.pk, expense.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['expense']['description'], 'Taxi')

        self.authenticate('bob', 'password123')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_update_shared_expense(self):
        expense = SharedExpense.objects.create(group=self.group, description='Food', amount=60, created_by=self.user)
        url = reverse('update_shared_expense', args=[expense.pk])
        data = {'amount': 80}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        expense.refresh_from_db()
        self.assertEqual(float(expense.amount), 80.0)

    def test_delete_shared_expense(self):
        expense = SharedExpense.objects.create(group=self.group, description='Snacks', amount=10, created_by=self.user)
        url = reverse('delete_shared_expense', args=[expense.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(SharedExpense.objects.filter(pk=expense.pk).exists())