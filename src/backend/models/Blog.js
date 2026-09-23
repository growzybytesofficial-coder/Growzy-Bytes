// backend/src/models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    default: 'GROWZYBYTES Team' 
  },
  imageUrl: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true }); // timestamps true karne se date aur time apne aap save hoga

export default mongoose.model('Blog', blogSchema);