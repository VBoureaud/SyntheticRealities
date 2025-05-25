const fs = require('fs');
const path = require('path');

// Read the JSON file
const cardsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'new_cards.json'), 'utf8'));

// Function to rename files
async function renameImages(sourceDir) {
    // Create a mapping of original_name to new name
    const nameMapping = {};
    cardsData.forEach(card => {
        nameMapping[card.original_name] = card.name;
    });

    try {
        // Read the source directory
        const files = await fs.promises.readdir(sourceDir);
        console.log(`Found ${files.length} files in directory`);

        let processedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        // Process each file
        for (const file of files) {
            // Skip hidden files and files that start with a dot
            if (file.startsWith('.')) {
                console.log(`Skipping hidden file: ${file}`);
                skippedCount++;
                continue;
            }

            // Get the file name without extension
            const fileName = path.parse(file).name;
            const ext = path.extname(file);

            // Skip files that are just extensions
            if (!fileName) {
                console.log(`Skipping file with no name: ${file}`);
                skippedCount++;
                continue;
            }

            // Check if this file needs to be renamed
            if (nameMapping[fileName]) {
                const newName = nameMapping[fileName] + ext;
                const oldPath = path.join(sourceDir, file);
                const newPath = path.join(sourceDir, newName);

                try {
                    await fs.promises.rename(oldPath, newPath);
                    console.log(`Renamed: ${file} -> ${newName}`);
                    processedCount++;
                } catch (err) {
                    console.error(`Error renaming ${file}:`, err);
                    errorCount++;
                }
            } else {
                console.log(`No mapping found for: ${file}`);
                skippedCount++;
            }
        }

        console.log('\nSummary:');
        console.log(`Total files found: ${files.length}`);
        console.log(`Successfully renamed: ${processedCount}`);
        console.log(`Skipped: ${skippedCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (err) {
        console.error('Error processing directory:', err);
        process.exit(1);
    }
}

// Get the source directory from command line argument
const sourceDir = process.argv[2];

if (!sourceDir) {
    console.error('Please provide the source directory path as an argument');
    console.log('Usage: node renameImages.js <source_directory>');
    process.exit(1);
}

// Check if the directory exists
if (!fs.existsSync(sourceDir)) {
    console.error('Source directory does not exist:', sourceDir);
    process.exit(1);
}

// Execute the rename operation
console.log('Starting to rename files in:', sourceDir);
renameImages(sourceDir).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
}); 