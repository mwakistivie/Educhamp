import express from 'express';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

// Get or create user from Clerk
router.post('/sync-user', async (req, res) => {
  try {
    const { clerkUserId, email, firstName, lastName, role } = req.body;

    let user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      user = new User({
        clerkId: clerkUserId,
        email,
        firstName,
        lastName,
        role: role || 'parent',
        createdAt: new Date()
      });
      await user.save();
    }

    res.json({ user, message: 'User synced successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user role
router.patch('/update-role/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const { role } = req.body;

    if (!['admin', 'parent'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    let user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ user, message: 'Role updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
