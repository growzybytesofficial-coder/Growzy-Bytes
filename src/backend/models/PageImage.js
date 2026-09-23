// backend/src/models/PageImage.js
import mongoose from 'mongoose';

const pageImageSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    unique: true, // Ek page ke liye sirf ek hi main banner image allow karega (taaki duplicate na ho)
    enum: ['Home', 'About', 'Services', 'Projects', 'Blog', 'Contact'] // Sirf inhi pages par image set ho sakti hai
  },
  imageUrl: { 
    type: String, 
    required: true // Image ka URL aana zaroori hai
  }
}, { timestamps: true }); // timestamps automatically createdAt aur updatedAt add kar dega

export default mongoose.model('PageImage', pageImageSchema);