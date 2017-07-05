# -*- coding:utf-8 -*-
import logging
from celery import shared_task

from api.utils import LightSensor
from api.views import ac_command

logger = logging.getLogger(__name__)

THRESHOLD_LIGHT_LEVEL = 10


@shared_task
def check_light():
    light_sensor = LightSensor()
    light_level = light_sensor.read_light()
    if light_level < 0:
        # Invalid - fail to read light
        return

    if light_level < THRESHOLD_LIGHT_LEVEL:
        # Turn Off
        logger.info('Light is off ({0} lx) - Turn off the AC'.format(light_level))
        ac_command("BTN_0")
    else:
        logger.info('Light is on ({0} lx)'.format(light_level))
