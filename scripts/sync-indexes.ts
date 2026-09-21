/* eslint-disable no-console */
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });
import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import * as models from '../src/models';

/**
 * Index builds can lock a collection, so they are never run on application boot.
 * Run this deliberately as part of a deploy.
 */
async function main() {
  await connectDB();

  for (const [name, model] of Object.entries(models)) {
    if (typeof model === 'function' && 'syncIndexes' in model) {
      const applied = await (model as mongoose.Model<unknown>).syncIndexes();
      console.log(`${name}: ${JSON.stringify(applied)}`);
    }
  }

  await mongoose.disconnect();
  console.log('\nindexes synced');
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
