#!/bin/bash

if [[ -z "$1" ]]; then
        echo "usage: runinenv.sh env cmds..."
        exit 1
fi

source $(which virtualenvwrapper.sh)
workon "$1"

shift 1
exec "$@"

deactivate
