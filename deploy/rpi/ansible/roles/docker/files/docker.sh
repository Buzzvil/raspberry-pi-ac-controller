#!/bin/bash
set -ex

curl -sSL https://get.docker.com | sh
sudo usermod -aG docker pi
