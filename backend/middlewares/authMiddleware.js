import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from './asyncHandler.js';

const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    //read jwt from 'jwt' cookie
    token = req.cookies.jwt;

    if (token) {
        try {
            //decode jwt token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //get user from jwt token
            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, no token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

// check if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

export { authenticate, admin };