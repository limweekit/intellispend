from django.core.management.base import BaseCommand
from pipeline.pipeline import run_pipeline

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        run_pipeline()
        self.stdout.write(self.style.SUCCESS('pipeline successfully executed'))
