import express from 'express';
import { forgotPassword, getAllUsers, login, logout, resendOTP, resetPassword, signup, verifyAccount } from '../controllers/authController.js'
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/verify', isAuthenticated, verifyAccount)
router.post('/resend', isAuthenticated, resendOTP)
router.post('/login', login)
router.post('/logout', logout)
router.post('/forget-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/', isAuthenticated, getAllUsers)

export default router;