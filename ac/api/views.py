from subprocess import call
from django.http import JsonResponse

from ngrok.tasks import update_public_url


def hello(request):
    update_public_url.delay()
    res_dict = {'foo': 'testfwefwef'}
    return JsonResponse(res_dict)


def ac_on(request):
    call(["irsend", "SEND_ONCE", "ac_lg", "KEY_ON"])
    return JsonResponse({})


def ac_off(request):
    call(["irsend", "SEND_ONCE", "ac_lg", "KEY_OFF"])
    return JsonResponse({})


def ac_temp_up(request):
    call(["irsend", "SEND_ONCE", "ac_lg", "KEY_TEMP_UP"])
    return JsonResponse({})


def ac_temp_down(request):
    call(["irsend", "SEND_ONCE", "ac_lg", "KEY_TEMP_DOWN"])
    return JsonResponse({})


def light_on(request):
    call(["irsend", "SEND_ONCE", "light", "KEY_ON"])
    return JsonResponse({})


def light_color(request, color):
    if not color in ('R', 'G', 'B'):
        return JsonResponse({'error': 'Invalid color'})
    keyname = "KEY_" + color
    call(["irsend", "SEND_ONCE", "light", keyname])
    return JsonResponse({})
