from django.conf.urls import url

from api import views

urlpatterns = [
    url(r'^hello/', views.hello),
    # Air conditioner
    url(r'^ac/on/', views.ac_on),
    url(r'^ac/off/', views.ac_off),
    url(r'^ac/temp/up', views.ac_temp_up),
    url(r'^ac/temp/down', views.ac_temp_down),
    url(r'^ac/temp/low', views.ac_temp_low),
    url(r'^ac/temp/medium', views.ac_temp_medium),
    url(r'^ac/temp/high', views.ac_temp_high),
    # Light
    url(r'^light/on/', views.light_on),
    url(r'^light/off/', views.light_on),
    url(r'^light/color/(?P<color>[A-Z])', views.light_color),
]
