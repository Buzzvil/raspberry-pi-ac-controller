# Create your tasks here
import logging

import arrow
import requests
from celery import shared_task

from ngrok.pynamodb_models import PublicUrl
from ngrok.services import get_machine_id

logger = logging.getLogger(__name__)


@shared_task
def update_public_url():
    response = requests.get('http://localhost:4040/api/tunnels')

    public_url = response.json()['tunnels'][0]['public_url']
    logger.info('public url {}'.format(public_url))

    PublicUrl(
        machine_id=get_machine_id(),
        location='3rd',
        public_url=public_url,
        updated_at=arrow.utcnow().datetime,
        ttl=arrow.utcnow().shift(days=1).datetime,
    ).save()
