from __future__ import absolute_import, division, print_function, unicode_literals
import os
from celery import Celery

# set the default Django settings module for the 'celery' program.
from ac import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ac.settings')

app = Celery(
    'ac',
     broker='django://',
)

# Using a string here means the worker don't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
