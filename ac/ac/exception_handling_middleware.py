import json
import logging
import sys

from django.core.signals import got_request_exception
from django.http import HttpResponseServerError
from django.views.debug import CLEANSED_SUBSTITUTE

logger = logging.getLogger(__name__)


class StandardExceptionMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        got_request_exception.send(sender=self, request=request)
        exc_info = sys.exc_info()
        self.log_exception(request, exception, exc_info)
        return HttpResponseServerError(json.dumps({"code": 1000}), content_type='application/json')

    def log_exception(self, request, exception, exc_info):
        request.POST = self.get_post_parameters(request)
        try:
            request_repr = repr(request)
        except:
            request_repr = "Request repr() unavailable"
        message = "%s\n\n%s" % (_get_traceback(exc_info), request_repr)
        logger.info(message)

    def get_post_parameters(self, request):
        """
        Replaces the values of POST parameters marked as sensitive with
        stars (*********).
        """
        if request is None:
            return {}
        else:
            sensitive_post_parameters = ['password']
            if sensitive_post_parameters:
                cleansed = request.POST.copy()
                for param in sensitive_post_parameters:
                    if param in cleansed:
                        cleansed[param] = CLEANSED_SUBSTITUTE
                return cleansed
            else:
                return request.POST


def _get_traceback(self, exc_info=None):
    """Helper function to return the traceback as a string"""
    import traceback
    return '\n'.join(traceback.format_exception(*(exc_info or sys.exc_info())))
