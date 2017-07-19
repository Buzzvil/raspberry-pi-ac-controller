#!/bin/bash
# This will be called from docker entry point
set -ex

# For running celery as a root
export C_FORCE_ROOT="true"

source /master_env.sh
exec /usr/bin/supervisord -c /ac/supervisord.conf
