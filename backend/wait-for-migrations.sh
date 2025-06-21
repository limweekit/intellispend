#!/bin/sh

echo "Waiting for django_celery_beat_intervalschedule table..."

while :
do
  if echo "SELECT 1 FROM django_celery_beat_intervalschedule LIMIT 1;" | python manage.py dbshell >/dev/null 2>&1; then
    break
  fi
  echo "Table not ready yet. Sleeping..."
  sleep 2
done

echo "Beat table exists. Starting Celery..."
exec "$@"