#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
container="portfolio-db-test-$$"
docker run --rm -d --name "$container" -e POSTGRES_PASSWORD=local-test-only postgres:17-alpine >/dev/null
trap 'docker rm -f "$container" >/dev/null 2>&1' EXIT
for attempt in {1..30}; do
  if docker exec "$container" pg_isready -U postgres >/dev/null 2>&1; then break; fi
  sleep 1
done
{ cat tests/supabase-bootstrap.sql supabase/migrations/202610220001_portfolio_cms.sql; node_modules/.bin/tsx tests/database-fixture.ts; cat tests/database.sql; } | docker exec -i "$container" psql -U postgres -v ON_ERROR_STOP=1
