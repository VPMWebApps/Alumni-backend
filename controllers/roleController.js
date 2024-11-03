import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

// Assign or Update User Role (Admin Only)
const updateUserRole = async (req, res, next) => {
    const { userId, role } = req.body;
    if (!['student', 'admin', 'staff', 'alumnus'].includes(role)) {
        return next(new AppError("Invalid role", 400))
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    res.status(200).json({ 
        status: 'success',
        message: 'User role updated',
        data: {
            user
        } 
    });

};

export default updateUserRole;