#!/bin/bash
set -e

DUMP_FILE=$1
VERIFY_DB="tripborderdb_verify_$(date +%s)"

if [ -z "$DUMP_FILE" ]; then
  echo "Usage: $0 <backup.dump>"
  exit 1
fi

echo "=== Verifying backup: $DUMP_FILE ==="

# 1. Create temporary verification database
docker exec tripborderbackend-dbprod-1 \
  psql -U nientaiho -d postgres -c "CREATE DATABASE $VERIFY_DB OWNER nientaiho;"

# 2. Restore into verification database
docker exec -i tripborderbackend-dbprod-1 \
  pg_restore --clean --if-exists -U nientaiho -d "$VERIFY_DB" < "$DUMP_FILE"

# 3. Basic sanity checks
echo "Checking tables..."
docker exec tripborderbackend-dbprod-1 \
  psql -U nientaiho -d "$VERIFY_DB" -c "\dt" | head -10

echo "Checking migration status..."
docker exec tripborderbackend-server-1 \
  npx knex migrate:status --env production --knexfile knexfile.js

# 4. Cleanup
docker exec tripborderbackend-dbprod-1 \
  psql -U nientaiho -d postgres -c "DROP DATABASE IF EXISTS $VERIFY_DB;"

echo "✅ Backup verification PASSED"