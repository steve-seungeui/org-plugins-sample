#!/bin/bash
# 회의실 예약 프로젝트 저장소를 작업 디렉터리에 복제하고 의존 패키지를 설치한다.
set -e
git clone -q https://github.com/steve-seungeui/meeting-room-booking-sample.git .
git checkout -q 5dee326
npm ci --include=dev --no-audit --no-fund > /dev/null
