import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Register User
router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            data: { coreValues: [], habits: [], tracking: {} }
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                data: user.data
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                data: user.data
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sync Data
router.post('/sync', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const incomingData = req.body.data;

        console.log('📥 Sync request received:', {
            userId: user._id,
            email: user.email,
            dataReceived: {
                coreValues: incomingData?.coreValues?.length || 0,
                habits: incomingData?.habits?.length || 0,
                trackingKeys: Object.keys(incomingData?.tracking || {}).length
            }
        });

        // Update user data
        user.data = incomingData;

        // Mark as modified (required for Mixed type in Mongoose)
        user.markModified('data');

        // Save to database
        const updatedUser = await user.save();

        console.log('✅ Data saved to MongoDB:', {
            userId: user._id,
            savedData: {
                coreValues: updatedUser.data?.coreValues?.length || 0,
                habits: updatedUser.data?.habits?.length || 0,
                trackingKeys: Object.keys(updatedUser.data?.tracking || {}).length
            }
        });

        res.json(updatedUser.data);
    } catch (error) {
        console.error('❌ Sync error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get Data
router.get('/data', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.data);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
