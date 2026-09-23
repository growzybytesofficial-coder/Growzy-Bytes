import mongoose from 'mongoose';

export const connectDB = async (uri) => {
  try {
    const connectionUri = uri || process.env.MONGO_URI;
    if (!connectionUri) {
      console.warn('⚠️ No Mongo URI provided — skipping DB connection.');
      return;
    }
    await mongoose.connect(connectionUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ DB connection error:', error.message);
  }
};