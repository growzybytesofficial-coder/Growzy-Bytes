import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    service: { type: String, default: "" },
    budget: { type: String, default: "" },
    message: { type: String, default: "" },
    status: { type: String, enum: ["new", "contacted", "won", "lost"], default: "new" }
  },
  { timestamps: true }
);

export default mongoose.model("Lead", LeadSchema);
