#!/usr/bin/env bash
set -o errexit

apt-get update
apt-get install -y tesseract-ocr tesseract-ocr-hin
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
