import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    namespace NodeJS {
        interface Global {
            mongoose?: MongooseCache;
        }
    }
}

const globalWithMongoose = global as typeof globalThis & { mongoose?: MongooseCache };

let cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

globalWithMongoose.mongoose = cached;


async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;