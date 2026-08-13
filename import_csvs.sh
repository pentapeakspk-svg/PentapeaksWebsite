#!/bin/bash
# Script to import Supabase CSV data into the local PostgreSQL database

echo "=========================================="
echo "Starting Data Import from CSV files"
echo "=========================================="

DB_NAME="pentapeaks_db"
CSV_DIR="/var/www/pentapeaks/csv_data"

import_table() {
    local table_name=$1
    local csv_file="${CSV_DIR}/${table_name}.csv"
    
    if [ -f "$csv_file" ]; then
        echo "Importing $table_name..."
        # Using sudo -u postgres to avoid password prompts
        sudo -u postgres psql -d $DB_NAME -c "\copy \"$table_name\" FROM '$csv_file' DELIMITER ',' CSV HEADER;"
        
        if [ $? -eq 0 ]; then
            echo "✅ $table_name imported successfully!"
        else
            echo "❌ Failed to import $table_name!"
        fi
    else
        echo "⚠️  Skipping $table_name - File not found: $csv_file"
    fi
}

# The ORDER is critical to respect Foreign Key constraints!
import_table "User"
import_table "Batch"
import_table "Student"
import_table "BatchEnrollment"
import_table "Attendance"
import_table "ClassLink"
import_table "ClassRecording"
import_table "BlogPost"
import_table "BuyerInquiry"
import_table "ContactInquiry"
import_table "DemoClassConfig"
import_table "DemoClassEnrollment"
import_table "Document"
import_table "RollNoCounter"
import_table "Supplier"

echo "=========================================="
echo "Data Import Process Complete! 🚀"
echo "=========================================="
