import mongoose from 'mongoose';

const pageContentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true },
    heroTitle: String,
    heroSubtitle: String,
    body: String,
    image: String,
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

export default mongoose.model('PageContent', pageContentSchema);