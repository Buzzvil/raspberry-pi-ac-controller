# -*- coding:utf-8 -*-
import logging
from celery import shared_task

logger = logging.getLogger(__name__)

@shared_task
def check_light():
    pass
