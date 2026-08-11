import { verifyToken } from '@clerk/backend';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateClerk = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    const decoded = await verifyToken(token, {
      secretKey: clerkSecretKey,
    });

    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    req.userRole = decoded.org_role || 'member';
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
