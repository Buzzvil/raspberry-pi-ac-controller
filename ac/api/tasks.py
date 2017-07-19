# -*- coding:utf-8 -*-
import logging
import os

import requests
from celery import shared_task

from api.models import LightStatus
from api.utils import LightSensor, PhotoSensorNotFound

logger = logging.getLogger(__name__)

THRESHOLD_LIGHT_LEVEL = 5
WINDOW_RANGE = 100
MIN_COUNT = 70

@shared_task
def check_light():
    light_sensor = LightSensor()
    count = 0
    for _ in range(WINDOW_RANGE):
        try:
            light_level = light_sensor.read_light()
        except PhotoSensorNotFound:
            return

        if light_level < THRESHOLD_LIGHT_LEVEL:
            count += 1

    light_status = LightStatus.objects.get(pk=1)
    if count > MIN_COUNT:
        logger.info('Light is off status (count : {0}/{1})'.format(count, WINDOW_RANGE))

        if light_status.is_light_on:
            requests.post(os.environ['SLACK_URL'], {
                'token': os.environ['SLACK_TOKEN'],
                'command': '/acoff',
            }, timeout=30)
            logger.info('update light status off with db')
            light_status.is_light_on = False
            light_status.save()
    else:
        logger.info('Light is on status')
        if not light_status.is_light_on:
            logger.info('update light status on with db')
            light_status.is_light_on = True
            light_status.save()
