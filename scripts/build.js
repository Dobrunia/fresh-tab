const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const EXTENSION_FILES = [
  "manifest.json",
  "background.js",
  "icons/icon-48.png",
  "icons/icon-96.png",
];

function readVersion() {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8")
  );
  return manifest.version;
}

function createArchive(filename) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(DIST, { recursive: true });

    const outputPath = path.join(DIST, filename);
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`${filename} (${archive.pointer()} bytes)`);
      resolve(outputPath);
    });

    archive.on("error", reject);
    archive.pipe(output);

    for (const file of EXTENSION_FILES) {
      const absolutePath = path.join(ROOT, file);

      if (!fs.existsSync(absolutePath)) {
        reject(new Error(`Missing file: ${file}`));
        return;
      }

      archive.file(absolutePath, { name: file });
    }

    archive.finalize();
  });
}

async function main() {
  const version = readVersion();
  const baseName = `fresh-tab-${version}`;

  await createArchive(`${baseName}.zip`);
  await createArchive(`${baseName}.xpi`);

  console.log(`\nReady for AMO upload: dist/${baseName}.zip`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
