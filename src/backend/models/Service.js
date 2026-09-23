import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    category: { type: String, default: "Specialized Service", trim: true }, 
    shortDesc: { type: String, default: "" }, 
    fullDesc: { type: String, default: "" },  
    features: [{ type: String }], 
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Auto-generate slug from title
ServiceSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.model("Service", ServiceSchema);