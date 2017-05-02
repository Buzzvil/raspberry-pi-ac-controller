#!/bin/bash
# This will be called from docker entry point
set -ex

# For running celery as a root
export C_FORCE_ROOT="true"

exec /usr/bin/supervisord -c /ac/supervisord.conf
