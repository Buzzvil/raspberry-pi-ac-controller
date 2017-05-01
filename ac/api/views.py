from subprocess import call
from django.http import JsonResponse

from ngrok.tasks import update_public_url

# Create your views here.

def hello(request):
    update_public_url.delay()
    res_dict = {'foo': 'testfwefwef'}
    return JsonResponse(res_dict)

def ac_on(request):
    call(["irsend", "SEND_ONCE", "ac_lg", "BTN_1"])
    return JsonResponse({})


def ac_off(request):
    call(["irsend", "SEND_ONCE", "ac_lg", "BTN_0"])
    return JsonResponse({})
