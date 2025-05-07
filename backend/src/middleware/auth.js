const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// 1. JWT Verification Middleware
const verifyToken = (req, res, next) => {
    // Get token from header, cookie, or query param
    const token = req.header('x-auth-token') || 
                 req.cookies?.token || 
                 req.query?.token;

    if (!token) {
        return res.status(401).json({ 
            success: false,
            msg: 'No authentication token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ 
            success: false,
            msg: 'Invalid or expired token' 
        });
    }
};

// 2. Role-Based Access Control
const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            
            if (!roles.includes(user.role)) {
                return res.status(403).json({ 
                    success: false,
                    msg: 'Unauthorized access' 
                });
            }
            
            next();
        } catch (err) {
            res.status(500).json({ 
                success: false,
                msg: 'Server error' 
            });
        }
    };
};

// 3. Current User Data
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
                              .select('-password -__v');
                              
        if (!user) {
            return res.status(404).json({ 
                success: false,
                msg: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            user 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            msg: 'Server error' 
        });
    }
};

// 4. Token Refresh (if implementing refresh tokens)
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
        return res.status(401).json({ 
            success: false,
            msg: 'No refresh token provided' 
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const accessToken = jwt.sign(
            { id: decoded.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );
        
        res.status(200).json({ 
            success: true,
            token: accessToken 
        });
    } catch (err) {
        res.status(401).json({ 
            success: false,
            msg: 'Invalid refresh token' 
        });
    }
};

module.exports = {
    verifyToken,
    checkRole,
    getCurrentUser,
    refreshToken
};