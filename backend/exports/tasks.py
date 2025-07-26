import os
import time
from datetime import timedelta, datetime
from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from bills.models import BillReminder


EXPORT_DIR = os.path.join(settings.MEDIA_ROOT, 'exports', 'downloads')

@shared_task
def cleanup_old_exports(days_threshold=1):
    now = time.time()
    if not os.path.exists(EXPORT_DIR):
        return

    for fname in os.listdir(EXPORT_DIR):
        fpath = os.path.join(EXPORT_DIR, fname)
        if os.path.isfile(fpath):
            age_days = (now - os.path.getmtime(fpath)) / (60 * 60 * 24)
            if age_days > days_threshold:
                os.remove(fpath)

@shared_task
def send_upcoming_bill_reminders():
    today = datetime.now().date()
    soon = today + timedelta(days=3)
    bills = BillReminder.objects.filter(is_active=True, due_date__range=(today, soon))
    for bill in bills:
        subject = f"Upcoming Bill Due: {bill.name}"
        message = (
            f"Dear {bill.user.username},\n\n"
            f"This is a friendly reminder that your bill for '{bill.name}' in the amount of ${bill.amount:.2f} "
            f"is due on {bill.due_date}.\n\n"
            "Please ensure timely payment to avoid any late fees or service interruptions.\n\n"
            "Thank you for using Intellispend.\n\n"
            "Best regards,\n"
            "Intellispend"
        )
        recipient = bill.user.email
        send_mail(subject, message, 'intellispend0@gmail.com', [recipient])