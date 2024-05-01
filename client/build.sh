#!/bin/bash
set -e

bunx next build "$@"

if [ -z "$CI" ]; then
cp -r ./public ./.next/standalone/public
cp -r ./.next/static ./.next/standalone/.next/static
fi