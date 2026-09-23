import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const jwtSecret = process.env.JWT_SECRET || "growzybytes_secret_key_2026";
    const decoded = jwt.verify(token, jwtSecret);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};