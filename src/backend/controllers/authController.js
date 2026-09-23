import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const jwtSecret = process.env.JWT_SECRET || "growzybytes_secret_key_2026";
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};