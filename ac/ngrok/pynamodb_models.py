from __future__ import unicode_literals

import arrow
from pynamodb.attributes import NumberAttribute, UnicodeAttribute
from pynamodb.models import Model

from ac import settings


class DateTimeAttribute(NumberAttribute):
    def serialize(self, value):
        return super(DateTimeAttribute, self).serialize(arrow.get(value).timestamp)

    def deserialize(self, value):
        return arrow.get(super(DateTimeAttribute, self).deserialize(value)).datetime


class PublicUrl(Model):
    machine_id = UnicodeAttribute(hash_key=True)
    location = UnicodeAttribute()
    public_url = UnicodeAttribute()
    updated_at = DateTimeAttribute()
    ttl = DateTimeAttribute()
    hostname = UnicodeAttribute()

    class Meta:
        table_name = settings.DYNAMODB_DATABASES['TABLE_PREFIX'] + 'public_url'
        host = settings.DYNAMODB_DATABASES['HOST']
        region = settings.DYNAMODB_DATABASES['REGION']
        read_capacity_units = 1
        write_capacity_units = 1
