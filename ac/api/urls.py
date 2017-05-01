from django.conf.urls import url

from api import views

urlpatterns = [
    url(r'^hello/', views.hello),
    url(r'^ac/on/', views.ac_on),
    url(r'^ac/off/', views.ac_off),
]
