#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
container="portfolio-db-test-$$"
docker run --rm -d --name "$container" -e POSTGRES_PASSWORD=local-test-only postgres:17-alpine >/dev/null
trap 'docker rm -f "$container" >/dev/null 2>&1' EXIT
# The temporary Docker init server accepts only Unix sockets; wait for the final TCP server.
for attempt in {1..30}; do
  if docker exec "$container" pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; then break; fi
  sleep 1
done
{ cat tests/supabase-bootstrap.sql; for migration in supabase/migrations/*.sql; do cat "$migration"; done; cat supabase/migrations/202610230002_safe_publication_delete.sql; node_modules/.bin/tsx tests/database-fixture.ts; cat tests/database.sql; } | docker exec -i "$container" psql -U postgres -v ON_ERROR_STOP=1
