import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // Check if we are already connected to avoid multiple connections
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: "vintagevault",
    });
    console.log("✅ MongoDB Connected Successfully");
    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
}

// Keep dbConnect for backward compatibility
export const dbConnect = connectDB;
export default connectDB;
