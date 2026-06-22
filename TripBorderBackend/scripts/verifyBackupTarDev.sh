#!/bin/bash
# =============================================
# verify-postgres-volume-backup.sh
# Verifies the tar.gz backup created from a Postgres Docker volume
# =============================================

set -euo pipefail

BACKUP_FILE="${1:-$(pwd)/backup/tripborderbackend_postgres_data_dev.tar.gz}"
BACKUP_DIR="$(dirname "$BACKUP_FILE")"

echo "=== Postgres Volume Backup Verification ==="
echo "Backup file: $BACKUP_FILE"
echo "Timestamp  : $(date)"
echo "=========================================="

# 1. Check if file exists and has reasonable size
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

FILE_SIZE=$(stat -c %s "$BACKUP_FILE" 2>/dev/null || stat -f %z "$BACKUP_FILE")
echo "✅ File exists ($(numfmt --bytes "$FILE_SIZE"))"

if [ "$FILE_SIZE" -lt 1000000 ]; then
    echo "⚠️  Warning: Backup is very small (<1MB). Double-check it."
fi

# 2. Test tar.gz integrity (without extracting)
echo -n "Checking archive integrity... "
if tar -tzf "$BACKUP_FILE" >/dev/null 2>&1; then
    echo "✅ Archive is valid (gzip + tar OK)"
else
    echo "❌ CORRUPTED archive!"
    exit 1
fi

# 3. List important Postgres files
echo -e "\nKey files in backup:"
tar -tzf "$BACKUP_FILE" | head -20

echo -e "\nChecking for critical Postgres directories/files:"
for item in "PG_VERSION" "base/" "global/" "pg_wal/" "postgresql.conf"; do
    if tar -tzf "$BACKUP_FILE" | grep -q "^$item"; then
        echo "   ✅ $item"
    else
        echo "   ⚠️  $item not found"
    fi
done

# 4. Optional: Full test restore to a temporary volume
if [[ "${TEST_RESTORE:-false}" == "true" ]]; then
    echo -e "\n=== Performing Test Restore ==="
    TEMP_VOLUME="verify_temp_pgdata_$(date +%s)"
    
    docker volume create "$TEMP_VOLUME" >/dev/null
    
    echo "Restoring to temporary volume: $TEMP_VOLUME"
    docker run --rm \
      -v "$TEMP_VOLUME":/target \
      -v "$BACKUP_DIR":/backup:ro \
      alpine sh -c "cd /target && tar xzf /backup/$(basename "$BACKUP_FILE")"
    
    echo "✅ Restore completed. Contents:"
    docker run --rm -v "$TEMP_VOLUME":/data alpine ls -la /data | head -15
    
    echo -n "Do you want to remove the test volume? (y/N) "
    read -r answer
    if [[ "$answer" =~ ^[Yy]$ ]]; then
        docker volume rm "$TEMP_VOLUME" >/dev/null
        echo "Test volume removed."
    fi
fi

echo -e "\n🎉 Verification completed successfully!"
echo "Backup looks good and is ready for restore."