#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

args=()
for arg in "$@"; do
	if [[ "$arg" != "--" ]]; then
		args+=("$arg")
	fi
done

if [[ ${#args[@]} -gt 0 ]]; then
	./node_modules/.bin/prisma migrate dev --name "${args[*]}"
else
	./node_modules/.bin/prisma migrate dev
fi

./node_modules/.bin/prisma generate
