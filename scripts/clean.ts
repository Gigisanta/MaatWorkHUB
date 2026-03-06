import { execSync } from "node:child_process";
import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * MaatWork Clean Script
 * Performs a deep cleanup of the monorepo to resolve cache issues.
 */

const DIRS_TO_CLEAN = [
  "node_modules",
  ".next",
  ".turbo",
  "dist",
  "out",
  ".vercel",
];

function main() {
  console.log("🧹 Starting deep cleanup...");
  const rootDir = process.cwd();

  // 1. Recursive cleanup using find (faster on macOS/Linux)
  for (const dirName of DIRS_TO_CLEAN) {
    try {
      console.log(`🗑️  Removing all ${dirName} directories...`);
      // We use a safe approach by finding all directories with the given name and removing them
      // This handles nested apps and packages
      execSync(`find . -name "${dirName}" -type d -prune -exec rm -rf '{}' +`, {
        stdio: "inherit",
      });
    } catch (e) {
      console.warn(
        `⚠️  Failed to clean some ${dirName} instances. Continuing...`,
      );
    }
  }

  // 2. Clean pnpm lock specifically if requested or as part of deep clean?
  // For now, let's keep the lockfile unless explicit.

  console.log(
    '✨ Cleanup complete! Run "pnpm install" to restore dependencies.',
  );
}

main();
