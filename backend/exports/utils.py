import csv
import os
from datetime import datetime
from django.conf import settings
from expenses.models import Expense
from income.models import Income
from goals.models import Goal


EXPORT_DIR = os.path.join(settings.MEDIA_ROOT, 'exports', 'downloads')
os.makedirs(EXPORT_DIR, exist_ok=True)

def export_data_to_csv(user):
    filename = f"intellispend_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    filepath = os.path.join(EXPORT_DIR, filename)

    with open(filepath, 'w', newline='') as f:
        writer = csv.writer(f)

        writer.writerow(['--- Expenses ---'])
        writer.writerow(['Amount', 'Date'])
        for e in Expense.objects.filter(user=user):
            writer.writerow([e.amount, e.date])

        writer.writerow([])

        writer.writerow(['--- Income ---'])
        writer.writerow(['Amount', 'Date'])
        for i in Income.objects.filter(user=user):
            writer.writerow([i.amount, i.date])

        writer.writerow([])

        writer.writerow(['--- Goals ---'])
        writer.writerow(['Name', 'Target Amount', 'Current Progress', 'Deadline'])
        for g in Goal.objects.filter(user=user):
            writer.writerow([g.name, g.amount, g.current_progress, g.deadline])

    return filepath
