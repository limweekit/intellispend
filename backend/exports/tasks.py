import os
import time
from celery import shared_task
from django.conf import settings

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
