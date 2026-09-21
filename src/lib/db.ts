import mongoose, { type Mongoose } from 'mongoose';

/**
 * Next.js hot-reloads modules in dev and may cold-start many serverless instances in
 * production. Without this cache each one opens its own pool and Atlas hits its
 * connection cap. The promise is cached too, so concurrent callers await one connect.
 */
type ConnCache = { conn: Mongoose | null; promise: Promise<Mongoose> | null };

const globalForMongoose = globalThis as unknown as { _mongoose?: ConnCache };
const cached: ConnCache = globalForMongoose._mongoose ?? { conn: null, promise: null };
globalForMongoose._mongoose = cached;

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // Read lazily: at module-eval time a dotenv preload may not have run yet.
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.');
    }

    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
      // Index builds can lock a collection; run `npm run db:indexes` deliberately instead.
      autoIndex: process.env.NODE_ENV !== 'production',
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

/** True when the deployment target supports multi-document transactions. */
export async function supportsTransactions(): Promise<boolean> {
  const conn = await connectDB();
  const topology = conn.connection.db?.admin();
  if (!topology) return false;
  try {
    const info = await topology.command({ hello: 1 });
    return Boolean(info.setName || info.msg === 'isdbgrid');
  } catch {
    return false;
  }
}
