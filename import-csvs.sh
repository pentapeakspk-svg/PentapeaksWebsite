#!/bin/bash
# import-csvs.sh
# Script to import Supabase CSV exports into your local PostgreSQL database
# Usage: ./import-csvs.sh /path/to/csv/folder

set -e

if [ -z "$1" ]; then
    echo "Usage: ./import-csvs.sh /path/to/csv/folder"
    echo "Please provide the path to the folder containing your CSV files."
    exit 1
fi

CSV_DIR=$1
DB_NAME="pentapeaks"
DB_USER="pentapeaks_user"

# Ensure the script runs as root or postgres to avoid permission issues
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (sudo)"
  exit 1
fi

echo "=========================================="
echo "PostgreSQL CSV Import Script"
echo "=========================================="
echo "Directory: $CSV_DIR"
echo ""

# The order matters because of foreign key constraints!
# We define the correct insertion order based on the Prisma schema
# 1. Independent tables (No foreign keys pointing to other tables)
# 2. Dependent tables (Contains foreign keys)

TABLES=(
    "User"
    "Batch"
    "RollNoCounter"
    "Supplier"
    "BuyerInquiry"
    "ContactInquiry"
    "BlogPost"
    "DemoClassConfig"
    "DemoClassEnrollment"
    "Document"
    # Dependent tables
    "Student"
    "Attendance"
    "ClassLink"
    "ClassRecording"
    "BatchEnrollment"
)

for TABLE in "${TABLES[@]}"; do
    # Convert table name to match potential CSV filenames 
    # (Supabase might export them in lowercase or exact match)
    
    # Check for Exact Match (e.g. User.csv)
    if [ -f "$CSV_DIR/$TABLE.csv" ]; then
        CSV_FILE="$CSV_DIR/$TABLE.csv"
    # Check for Lowercase Match (e.g. user.csv)
    elif [ -f "$CSV_DIR/${TABLE,,}.csv" ]; then
        CSV_FILE="$CSV_DIR/${TABLE,,}.csv"
    else
        echo "⚠️  Skipping $TABLE: No CSV file found ($TABLE.csv or ${TABLE,,}.csv)"
        continue
    fi

    echo "📥 Importing $TABLE from $CSV_FILE..."
    
    # We use psql \copy command which is highly efficient for CSV imports
    # DELIMITER ',' and CSV HEADER tells it to ignore the first row and use commas
    sudo -u postgres psql -d $DB_NAME -c "\copy \"$TABLE\" FROM '$CSV_FILE' WITH (FORMAT csv, HEADER true, DELIMITER ',');"
    
    echo "✅ Successfully imported $TABLE"
done

echo "=========================================="
echo "Import process completed!"
echo "If you saw any foreign key errors, ensure your CSV files contain all related records."
echo "=========================================="
