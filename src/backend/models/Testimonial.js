import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  quote: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);