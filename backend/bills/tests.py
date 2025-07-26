import json

from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import date, timedelta
from .models import BillReminder

class BillReminderAPITests(APITestCase):
    def authenticate(self, username, password):
        login_url = '/api/users/login'
        login_data = {'username': username, 'password': password}
        response = self.client.post(login_url, login_data, format='json')
        response_data = json.loads(response.content.decode('utf-8'))
        token = response_data.get('access_token')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def setUp(self):
        self.user = User.objects.create_user(username='alice', password='pw123456')
        self.other_user = User.objects.create_user(username='bob', password='pw123456')
        self.client = APIClient()
        self.authenticate('alice', 'pw123456')
        self.bill_data = {
            "name": "Electricity Bill",
            "amount": 100.0,
            "due_date": (date.today() + timedelta(days=3)).isoformat(),
        }

    def test_create_bill_reminder(self):
        url = reverse('create_bill_reminder')
        response = self.client.post(url, self.bill_data, format='json')
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['bill']['name'], "Electricity Bill")
        self.assertEqual(BillReminder.objects.count(), 1)

    def test_get_all_bill_reminders(self):
        BillReminder.objects.create(user=self.user, name="A", amount=10, due_date=date.today())
        BillReminder.objects.create(user=self.user, name="B", amount=20, due_date=date.today())
        BillReminder.objects.create(user=self.other_user, name="C", amount=30, due_date=date.today())
        url = reverse('get_all_bill_reminders')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['bills']), 2)
        self.assertTrue(all(b['name'] in ("A", "B") for b in data['bills']))

    def test_get_bill_reminder(self):
        bill = BillReminder.objects.create(user=self.user, name="Single", amount=99, due_date=date.today())
        url = reverse('get_bill_reminder', args=[bill.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['bill']['name'], "Single")
        # Non-owner cannot access
        self.authenticate('bob', 'pw123456')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_update_bill_reminder(self):
        bill = BillReminder.objects.create(user=self.user, name="ToUpdate", amount=1, due_date=date.today())
        url = reverse('update_bill_reminder', args=[bill.pk])
        data = {"amount": 123.45, "name": "Updated Name"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        bill.refresh_from_db()
        self.assertEqual(float(bill.amount), 123.45)
        self.assertEqual(bill.name, "Updated Name")

    def test_delete_bill_reminder(self):
        bill = BillReminder.objects.create(user=self.user, name="ToDelete", amount=5, due_date=date.today())
        url = reverse('delete_bill_reminder', args=[bill.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(BillReminder.objects.filter(pk=bill.pk).exists())

    def test_get_upcoming_bill_reminders(self):
        today = date.today()
        in_five_days = today + timedelta(days=5)
        in_eight_days = today + timedelta(days=8)
        BillReminder.objects.create(user=self.user, name="Soon", amount=1, due_date=in_five_days)
        BillReminder.objects.create(user=self.user, name="Later", amount=1, due_date=in_eight_days)
        BillReminder.objects.create(user=self.user, name="Inactive", amount=1, due_date=in_five_days)
        url = reverse('get_upcoming_bill_reminders')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        bill_names = [b['name'] for b in data['bills']]
        self.assertIn("Soon", bill_names)
        self.assertNotIn("Later", bill_names)
        self.assertNotIn("Inactive", bill_names)