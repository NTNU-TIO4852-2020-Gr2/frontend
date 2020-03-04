#!/bin/bash

CONFIG_TEMPLATE_FILE="src/config.template.js"
CONFIG_FILE="src/config.js"

set -eu

# Add config file and exit if missing
if [[ ! -e $CONFIG_FILE ]]; then
    echo
    echo "Creating new config file ($CONFIG_FILE) ..."
    cp $CONFIG_TEMPLATE_FILE $CONFIG_FILE
fi

echo
echo "Done!"
