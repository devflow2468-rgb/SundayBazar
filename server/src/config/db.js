import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20, // Connection pooling for high performance
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`[Sunday Bazar] MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Sunday Bazar] Database Connection Error: ${error.message}`);
    // Don't kill process immediately in dev so app can still serve frontend/errors gracefully
  }
};
