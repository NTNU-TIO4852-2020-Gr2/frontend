#!/bin/bash

# Run a dev server with hot reload. Uses either specified endpoint or localhost:8000 by default.

LOCAL_DIR=".local/venv"
MANAGE="manage/manage.sh"
SRC_DIR="src"

set -eu

HOST=${1:-"localhost"}
PORT=${2:-"9000"}

if [[ -z $(which browser-sync) ]]; then
    echo "Please install browser-sync: npm install -g browser-sync" 1>&2
    exit 1
fi

echo "Starting dev server from $SRC_DIR on $HOST:$PORT ..."
echo
cd $SRC_DIR
browser-sync start -s --no-notify --host "$HOST" --port "$PORT"
