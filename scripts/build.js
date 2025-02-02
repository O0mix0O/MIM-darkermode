const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const rootDir = path.resolve(__dirname, ".."); // Move up one level
const packageJsonPath = path.join(rootDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const version = packageJson.version;

const outputDir = path.join(rootDir, "dist"); // Move up one level
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Get the next test number
const getNextTestNumber = () => {
    const files = fs.readdirSync(outputDir);
    const regex = new RegExp(`muteddarkmode_${version}-test-(\\d+)\\.zip`);

    let maxTestNumber = 0;
    for (const file of files) {
        const match = file.match(regex);
        if (match) {
            const testNumber = parseInt(match[1], 10);
            if (testNumber > maxTestNumber) {
                maxTestNumber = testNumber;
            }
        }
    }
    return maxTestNumber + 1;
};

const testNumber = getNextTestNumber();
const zipFileName = `muteddarkmode_${version}-test-${testNumber}.zip`;
const outputFilePath = path.join(outputDir, zipFileName);

const output = fs.createWriteStream(outputFilePath);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
    console.log(`Created zip file: ${outputFilePath} (${archive.pointer()} bytes)`);
});

archive.on("error", (err) => {
    throw err;
});

archive.pipe(output);

const srcDir = path.join(rootDir, "src"); // Move up one level
archive.directory(srcDir, false);

archive.finalize();
