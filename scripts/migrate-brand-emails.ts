/* eslint-disable no-console */
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import { User } from '../src/models';

/**
 * The MenuQR → QR4Blueprint rename changed SEED_ADMIN_EMAIL and the seeded owner
 * addresses in code, but existing user rows kept the old domain — which locked
 * every seeded account out. This moves them across.
 *
 * Only demo domains are touched. A real signup (any other domain) is left alone.
 */
const MOVES: [RegExp, string, string][] = [
  [/@menuqr\.local$/, '@menuqr.local', '@qr4blueprint.local'],
  [/@menuqr\.demo$/, '@menuqr.demo', '@qr4blueprint.demo'],
  [/@qr4menu\.local$/, '@qr4menu.local', '@qr4blueprint.local'],
  [/@qr4menu\.demo$/, '@qr4menu.demo', '@qr4blueprint.demo'],
];

async function main() {
  await connectDB();

  let moved = 0;
  for (const [match, from, to] of MOVES) {
    const users = await User.find({ email: match }).select('email');

    for (const user of users) {
      const next = user.email.replace(from, to);

      // Never overwrite an address that already exists.
      const clash = await User.findOne({ email: next, _id: { $ne: user._id } }).select('_id').lean();
      if (clash) {
        console.log(`skip ${user.email} → ${next} (target already exists)`);
        continue;
      }

      user.email = next;
      await user.save();
      moved += 1;
    }
  }

  const remaining = await User.countDocuments({ email: /@(menuqr|qr4menu)\./ });
  console.log(`moved ${moved} accounts; ${remaining} still on the old domain`);
  console.log('Passwords are unchanged.');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
