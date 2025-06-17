from django.apps import AppConfig
import json

class ExportsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'exports'

    def ready(self):
        from django_celery_beat.models import PeriodicTask, IntervalSchedule

        schedule, _ = IntervalSchedule.objects.get_or_create(
            every=1,
            period=IntervalSchedule.DAYS,
        )

        PeriodicTask.objects.update_or_create(
            name='Clean up old CSVs every 24 hours',
            defaults={
                'interval': schedule,
                'task': 'exports.tasks.cleanup_old_exports',
                'args': json.dumps([1]),
            }
        )
