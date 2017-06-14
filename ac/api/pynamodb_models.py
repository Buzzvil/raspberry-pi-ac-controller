from __future__ import unicode_literals

import arrow
from django.utils import timezone
from pynamodb.attributes import NumberAttribute, UnicodeAttribute
from pynamodb.models import Model

from ac import settings


class DateTimeAttribute(NumberAttribute):
    def serialize(self, value):
        return super(DateTimeAttribute, self).serialize(arrow.get(value).timestamp)

    def deserialize(self, value):
        return arrow.get(super(DateTimeAttribute, self).deserialize(value)).datetime


class ACConfig(Model):
    location = UnicodeAttribute(hash_key=True) # 3rd, 2nd
    state = UnicodeAttribute() # high, medium, low
    updated_at = DateTimeAttribute(default=timezone.now)

    class Meta:
        table_name = settings.DYNAMODB_DATABASES['TABLE_PREFIX'] + 'config'
        host = settings.DYNAMODB_DATABASES['HOST']
        region = settings.DYNAMODB_DATABASES['REGION']
        read_capacity_units = 1
        write_capacity_units = 1
