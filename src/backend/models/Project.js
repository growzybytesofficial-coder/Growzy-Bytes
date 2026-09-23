import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: String,
    description: String,
    image: String,
    liveUrl: String,
    featured: { type: Boolean, default: false },
    status: { type: String, default: 'published' },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);