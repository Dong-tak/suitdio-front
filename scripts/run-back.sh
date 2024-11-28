#!/bin/bash

echo "🔄 기존 컨테이너 및 이미지 정리 중..."
docker-compose -f docker-compose.local.yml down -v
docker rmi tothedock/tothedocks:localfastapi

echo "🚀 컨테이너 실행 중..."
docker-compose -f docker-compose.local.yml up -d

echo "📝 앱 로그 출력 중..."
docker-compose -f docker-compose.local.yml logs -f app