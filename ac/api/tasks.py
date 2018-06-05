# -*- coding:utf-8 -*-
import logging
import os

import requests
from celery import shared_task

from api.models import LightStatus
from api.utils import LightSensor

logger = logging.getLogger(__name__)


@shared_task
def check_light():
    is_light_on = LightSensor().is_light_on()
    last_light_status = LightStatus.objects.get(pk=1)

    if last_light_status.is_light_on != is_light_on:
        if not is_light_on:
            requests.post(os.environ['SLACK_URL'], {
                'token': os.environ['SLACK_TOKEN'],
                'command': '/acoff',
            }, timeout=30)

        logger.info('update light status {} with db'.format(is_light_on))
        last_light_status.is_light_on = is_light_on
        last_light_status.save()