from __future__ import unicode_literals

from django.db import models

# Create your models here.

class LightStatus(models.Model):
    is_light_on = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
