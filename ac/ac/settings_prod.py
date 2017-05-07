# -*- coding:utf-8 -*-
from ac.settings import *

DEBUG = False

DYNAMODB_DATABASES = {
    'REGION': 'us-east-1',
    'HOST': None,
    'TABLE_PREFIX': 'prod_ac_',
}
