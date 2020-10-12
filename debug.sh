#!/bin/bash

deno run \
  --allow-run \
  --allow-env \
  --allow-net \
  --allow-read \
  --allow-write \
  --watch \
  --unstable \
  ./src/main.ts
