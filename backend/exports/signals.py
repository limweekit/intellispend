import json
from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def create_periodic_task(sender, **kwargs):
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
