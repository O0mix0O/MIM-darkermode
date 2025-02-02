const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const rootDir = path.resolve(__dirname, ".."); // Move up one level to project root
const packageJsonPath = path.join(rootDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const version = packageJson.version;

const outputDir = path.join(rootDir, "dist"); // Ensure zip goes inside dist/
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }); // Create dist/ if it doesn't exist
}

const zipFileName = `muteddarkmode_${version}.zip`;
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

const srcDir = path.join(rootDir, "src"); // Source folder remains the same
archive.directory(srcDir, false);

archive.finalize();
