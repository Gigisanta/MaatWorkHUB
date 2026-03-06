import fs from "fs";
import path from "path";

const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  ".gemini",
  ".turbo",
]);

const ALLOWED_EXTS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".sql",
  ".env",
  ".example",
  ".css",
  ".scss",
  ".yaml",
  ".yml",
  ".mjs",
  ".cjs",
  ".html",
  ".txt",
]);

function replaceText(content: string): string {
  let newContent = content;

  // Plural
  newContent = newContent.replace(/apps/g, "apps");
  newContent = newContent.replace(/Apps/g, "Apps");
  newContent = newContent.replace(/APPS/g, "APPS");

  // Singular
  newContent = newContent.replace(/app/g, "app");
  newContent = newContent.replace(/App/g, "App");
  newContent = newContent.replace(/APP/g, "APP");

  return newContent;
}

function processDirectory(dir: string) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    if (IGNORE_DIRS.has(item)) continue;

    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);

      const newBaseName = replaceText(item);
      if (newBaseName !== item) {
        const newPath = path.join(dir, newBaseName);
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed directory: ${fullPath} -> ${newPath}`);
      }
    } else {
      const ext = path.extname(item);
      // Only read text files
      if (
        ALLOWED_EXTS.has(ext) ||
        item.startsWith(".env") ||
        item === "Dockerfile" ||
        item === "Caddyfile"
      ) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const newContent = replaceText(content);

        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, "utf-8");
          console.log(`Updated contents: ${fullPath}`);
        }
      }

      const newBaseName = replaceText(item);
      if (newBaseName !== item) {
        const newPath = path.join(dir, newBaseName);
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed file: ${fullPath} -> ${newPath}`);
      }
    }
  }
}

const rootDir = process.cwd();
console.log(`Starting global rename in: ${rootDir}`);
processDirectory(rootDir);
console.log("Finished rename operation.");
