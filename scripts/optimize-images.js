/**
 * Build-time script: convert PNG/JPEG in public/assets to WebP.
 * Run before build to generate smaller assets; update component src to .webp.
 * Usage: node scripts/optimize-images.js
 */

const path = require("path");
const fs = require("fs");

const ASSETS_DIR = path.join(__dirname, "..", "public", "assets");
const EXTENSIONS = [".png", ".jpg", ".jpeg"];

async function optimizeImages() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.warn("scripts/optimize-images.js: sharp not installed. Run: npm install -D sharp");
    process.exit(0);
  }

  if (!fs.existsSync(ASSETS_DIR)) {
    console.log("scripts/optimize-images.js: public/assets not found, skipping.");
    process.exit(0);
  }

  const files = fs.readdirSync(ASSETS_DIR).filter((f) => EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)));
  if (files.length === 0) {
    console.log("scripts/optimize-images.js: no PNG/JPEG in public/assets, skipping.");
    process.exit(0);
  }

  for (const file of files) {
    const inputPath = path.join(ASSETS_DIR, file);
    const base = path.basename(file, path.extname(file));
    const outputPath = path.join(ASSETS_DIR, `${base}.webp`);
    try {
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);
      console.log(`  ${file} -> ${base}.webp`);
    } catch (err) {
      console.error(`  ${file}: ${err.message}`);
    }
  }
  console.log("scripts/optimize-images.js: done.");
}

optimizeImages();
