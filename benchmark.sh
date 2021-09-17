#!/usr/bin/env sh

BASE_URL="http://localhost:8000"

yarn clear
yarn build
yarn start 1>/dev/null &

SERVER_PID="$!"

yarn autocannon "$BASE_URL"
yarn autocannon "$BASE_URL/users/5"
yarn autocannon "$BASE_URL/users/1/friends/2"

kill "$SERVER_PID"