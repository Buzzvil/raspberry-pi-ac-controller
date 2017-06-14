import arrow
from django.core.management.base import BaseCommand

from ngrok.pynamodb_models import PublicUrl


class Command(BaseCommand):
    help = "My shiny new management command."

    # def add_arguments(self, parser):
    #     parser.add_argument('sample', nargs='+')

    def handle(self, *args, **options):
        PublicUrl(
            device_id='1',
            location='3rd',
            public_url='http://daum.net',
            updated_at=arrow.utcnow().datetime,
            ttl=arrow.utcnow().shift(days=1).datetime,
        ).save()
