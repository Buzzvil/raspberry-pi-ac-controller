# Create your tasks here
import logging
import uuid

logger = logging.getLogger(__name__)


def get_rpi_serial():
    with open('/proc/cpuinfo','r') as f:
        for line in f:
            if line.startswith('Serial'):
                return line.strip().split(' ')[-1]

    return None


def get_machine_id():
    machine_id = get_rpi_serial()
    if machine_id:
        return machine_id

    return str(uuid.getnode())
