# -*- coding:utf-8 -*-
import logging

from django.urls import reverse

logger = logging.getLogger(__name__)
pytest_plugins = ['tests.fixtures']


def test_ac_off(client, mocker):

    # Test samsung-ac failure
    with mocker.patch('subprocess.call', side_effect=[1, 0]) as call_mock:
        response = client.post(reverse('ac_off'))
        assert response.status_code == 500
        # TODO 왜 안되는지 찾기 - zune
        # assert call_mock.call_count == 2

    # Test lg-ac failure
    with mocker.patch('subprocess.call', side_effect=[0, 1]) as call_mock:
        response = client.post(reverse('ac_off'))
        assert response.status_code == 500

    # Test succeed
    with mocker.patch('subprocess.call', side_effect=[0, 0]) as call_mock:
        response = client.post(reverse('ac_off'))
        assert response.status_code == 200
