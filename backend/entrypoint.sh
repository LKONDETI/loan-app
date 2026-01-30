#!/bin/sh

# Wait for DB to be ready (optional, but good practice if not using depends_on strictly or for robust startup)
# For simplicity, we assume depends_on in docker-compose handles start order, 
# but migrations might need a retry mechanism if DB is initializing.

echo "Running migrations..."
prisma migrate deploy --schema=prisma/schema.prisma

echo "Starting server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
