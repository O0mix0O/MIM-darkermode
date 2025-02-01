const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, ".."); // Move up one level to project root
const distDir = path.join(rootDir, "dist");

// Check if dist/ exists before attempting to delete files
if (fs.existsSync(distDir)) {
    const files = fs.readdirSync(distDir);
    
    files.forEach(file => {
        const filePath = path.join(distDir, file);
        fs.unlinkSync(filePath);
    });

    console.log(`Deleted ${files.length} file(s) from ${distDir}`);
} else {
    console.log(`Nothing to clean. ${distDir} does not exist.`);
}
