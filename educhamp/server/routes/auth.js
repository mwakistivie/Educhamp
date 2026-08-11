import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// This endpoint is now handled by the clerk.js routes
// Keeping this for reference

// Sync user from Clerk (called from frontend on signup)
router.post('/sync', async (req, res) => {
  try {
    const { clerkUserId, email, firstName, lastName } = req.body;

    let user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      user = new User({
        clerkId: clerkUserId,
        email,
        firstName,
        lastName,
        role: 'parent'
      });
      await user.save();
    }

    res.json({ user, message: 'User synced' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
