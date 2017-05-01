# Create your tasks here
import logging

import requests
from celery import shared_task


logger = logging.getLogger(__name__)


@shared_task
def update_public_url():
    response = requests.get('http://localhost:4040/api/tunnels')
    public_url = response.json()['tunnels'][0]['public_url']
    logger.info(public_url)
