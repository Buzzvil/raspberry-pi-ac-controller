from subprocess import call

import logging
from django.http import JsonResponse
from django.utils import six

from ac import settings
from api.pynamodb_models import ACConfig
from ngrok.tasks import update_public_url


logger = logging.getLogger(__name__)

def hello(request):
    update_public_url.delay()
    res_dict = {'foo': 'testfwefwef'}
    return JsonResponse(res_dict)


def ac_command(btn_name):
    lg = call(["irsend", "SEND_ONCE", "lg-ac", btn_name])
    samsung = call(["irsend", "SEND_ONCE", "samsung-ac", btn_name])
    if lg != 0 or samsung != 0:
        return JsonResponse({'lg': lg, 'samsung': samsung}, status=500)
    return JsonResponse({})


def ac_on(request):
    STATE_BTN_MAP = {
        'low': 'BTN_3',
        'medium': 'BTN_5',
        'high': 'BTN_7',
    }

    config = six.next(ACConfig.query(hash_key=settings.AC_LOCATION))
    btn_name = STATE_BTN_MAP[config.state]
    logger.info('ac_on state {} btn_name {}'.format(config.state, btn_name))
    return ac_command(btn_name)


def ac_off(request):
    return ac_command("BTN_0")


def ac_temp_low(request):
    return ac_command("BTN_3")


def ac_temp_medium(request):
    return ac_command("BTN_5")


def ac_temp_high(request):
    return ac_command("BTN_7")


def light_on(request):
    res = call(["irsend", "SEND_ONCE", "light", "KEY_ON"])
    if res != 0:
        return JsonResponse({'res': res}, status=500)
    return JsonResponse({})


def light_color(request, color):
    if not color in ('R', 'G', 'B'):
        return JsonResponse({'error': 'Invalid color'})
    keyname = "KEY_" + color
    res = call(["irsend", "SEND_ONCE", "light", keyname])
    if res != 0:
        return JsonResponse({'res': res}, status=500)
    return JsonResponse({})
