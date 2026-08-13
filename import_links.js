const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importData(table, filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${table}: file not found`);
        return;
    }
    console.log(`Importing ${table}...`);
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                // Parse attachments from JSON string to actual Array
                if (data.attachments) {
                    try {
                        let parsed = JSON.parse(data.attachments);
                        // Ensure it's an array of strings
                        if (Array.isArray(parsed)) {
                            data.attachments = parsed;
                        } else {
                            data.attachments = [];
                        }
                    } catch (e) {
                        data.attachments = [];
                    }
                } else {
                    data.attachments = [];
                }
                
                // Parse dates
                if (data.sentAt) {
                    data.sentAt = new Date(data.sentAt);
                }

                results.push(data);
            })
            .on('end', async () => {
                try {
                    let successCount = 0;
                    for (const row of results) {
                        try {
                            await prisma[table].create({ data: row });
                            successCount++;
                        } catch (err) {
                            // Ignore unique constraint (already exists) errors
                            if (err.code !== 'P2002') { 
                                console.error(`Error inserting row in ${table}:`, err.message);
                            }
                        }
                    }
                    console.log(`✅ ${table} imported successfully! (${successCount} new rows added)`);
                    resolve();
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
    });
}

async function main() {
    console.log("Starting advanced import for ClassLink and ClassRecording...");
    await importData('classLink', '/var/www/pentapeaks/csv_data/ClassLink.csv');
    await importData('classRecording', '/var/www/pentapeaks/csv_data/ClassRecording.csv');
    console.log("Done!");
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
