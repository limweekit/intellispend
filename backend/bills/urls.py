from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_all_bill_reminders, name='get_all_bill_reminders'),
    path('create', views.create_bill_reminder, name='create_bill_reminder'),
    path('<int:billId>', views.get_bill_reminder, name='get_bill_reminder'),
    path('update/<int:billId>', views.update_bill_reminder, name='update_bill_reminder'),
    path('delete<int:billId>', views.delete_bill_reminder, name='delete_bill_reminder'),
    path('upcoming', views.get_upcoming_bill_reminders, name='get_upcoming_bill_reminders'),
]