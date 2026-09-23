import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, default: "" },
    tags: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("BlogPost", BlogPostSchema);
