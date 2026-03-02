import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * MaatWork Pre-Dev Script
 * Automates port clearing and environment validation for smoother DevX.
 */

const PORTS = [3000, 3001];
const ENV_FILE = '.env';
const ENV_EXAMPLE = '.env.example';

async function main() {
  console.log('🚀 Running pre-dev checks...');

  // 1. Port Clearing
  for (const port of PORTS) {
    try {
      const pid = execSync(`lsof -t -i :${port}`).toString().trim();
      if (pid) {
        console.log(`⚠️  Port ${port} is in use (PID: ${pid}). Terminating...`);
        execSync(`kill -9 ${pid}`);
        console.log(`✅ Port ${port} cleared.`);
      }
    } catch (e) {
      // Port is free or lsof failed (standard behavior if port is free on macOS/Linux)
    }
  }

  // 2. Env Validation
  const rootDir = process.cwd();
  const envPath = join(rootDir, ENV_FILE);
  const examplePath = join(rootDir, ENV_EXAMPLE);

  if (!existsSync(envPath)) {
    console.warn(`❌ Missing ${ENV_FILE}. Please copy ${ENV_EXAMPLE} to ${ENV_FILE} and configure it.`);
    process.exit(1);
  }

  const exampleContent = readFileSync(examplePath, 'utf8');
  const envContent = readFileSync(envPath, 'utf8');

  const requiredKeys = exampleContent
    .split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => line.split('=')[0].trim());

  const missingKeys = requiredKeys.filter(key => !envContent.includes(`${key}=`));

  if (missingKeys.length > 0) {
    console.error(`❌ Missing environment variables in ${ENV_FILE}:`);
    missingKeys.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }

  console.log('✅ Pre-dev checks passed. Ready to launch!');
}

main().catch(err => {
  console.error('💥 Pre-dev script failed:', err);
  process.exit(1);
});
