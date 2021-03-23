#!/bin/bash

rm test.db

deno run \
  --allow-run \
  --allow-env \
  --allow-net \
  --allow-read \
  --allow-write \
  ./src/main.ts
