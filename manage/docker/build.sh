#!/bin/bash

# Build Docker image.

set -eu

docker build -t eit-frontend .
