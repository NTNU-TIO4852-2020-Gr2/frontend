#!/bin/bash

# Run Docker image.

# Must be relative
CONFIG_FILE="src/config.js"

set -eu

OPTS="-p 9000:80 --name=eit-frontend"

if [[ -f $CONFIG_FILE ]]; then
    echo
    echo "Using local config: $CONFIG_FILE"
    OPTS="${OPTS} -v $PWD/$CONFIG_FILE:/www/config.js:ro"
fi

echo
echo "Starting container ..."
echo
docker run --rm $OPTS eit-frontend
