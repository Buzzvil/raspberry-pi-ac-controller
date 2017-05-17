from django.conf.urls import url

from api import views

urlpatterns = [
    url(r'^hello/', views.hello),
    url(r'^ac/on/', views.ac_on),
    url(r'^ac/off/', views.ac_off),
    url(r'^light/on/', views.light_on),
    url(r'^light/off/', views.light_on),
    url(r'^light/color/(?P<color>[A-Z])', views.light_color),
]
