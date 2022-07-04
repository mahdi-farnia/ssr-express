import { spawnSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();

const argv = process.argv.slice(2);

if (argv.includes('clean')) {
  console.log('Cleaning Database...');
  const output = spawnSync(
    'mongo',
    [path.basename(process.env.DATABASE_URL), '--eval', 'db.dropDatabase()'],
    {
      stdio: 'pipe'
    }
  )
    .stdout.toString('utf-8')
    .split('\n')
    .at(-2);

  try {
    const result = JSON.parse(output || 'null');
    if (!result || !result.ok) throw void 0;

    console.log('✅ Database Cleaned');
  } catch (err) {
    console.log('❌ Error cleaning database!');
  }
}
