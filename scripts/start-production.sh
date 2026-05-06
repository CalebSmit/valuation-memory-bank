#!/bin/sh
# Production startup script for Render
# Seeds the DB on first run (idempotent), then starts the server

echo "Running seed (idempotent)..."
npx tsx scripts/seed.ts

echo "Starting server..."
node dist/index.cjs
