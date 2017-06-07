from subprocess import call
from django.http import JsonResponse

from ngrok.tasks import update_public_url


def hello(request):
    update_public_url.delay()
    res_dict = {'foo': 'testfwefwef'}
    return JsonResponse(res_dict)


def ac_on(request):
    lg = call(["irsend", "SEND_ONCE", "lg-ac", "BTN_1"])
    samsung = call(["irsend", "SEND_ONCE", "samsung-ac", "BTN_1"])
    if lg != 0 or samsung != 0:
        return JsonResponse({'lg': lg, 'samsung': samsung}, status=500)
    return JsonResponse({})


def ac_off(request):
    lg = call(["irsend", "SEND_ONCE", "lg-ac", "BTN_0"])
    samsung = call(["irsend", "SEND_ONCE", "samsung-ac", "BTN_0"])
    if lg != 0 or samsung != 0:
        return JsonResponse({'lg': lg, 'samsung': samsung}, status=500)
    return JsonResponse({})


def ac_temp_up(request):
    lg = call(["irsend", "SEND_ONCE", "lg-ac", "KEY_TEMP_UP"])
    if lg != 0:
        return JsonResponse({'lg': lg}, status=500)
    return JsonResponse({})


def ac_temp_down(request):
    lg = call(["irsend", "SEND_ONCE", "lg-ac", "KEY_TEMP_DOWN"])
    if lg != 0:
        return JsonResponse({'lg': lg}, status=500)
    return JsonResponse({})


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
