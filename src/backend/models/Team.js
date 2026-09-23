import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String }, // Image URL
  bio: { type: String }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);