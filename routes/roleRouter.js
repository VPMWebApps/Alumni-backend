import express from 'express';
import authorizeRoles from '../middlewares/Role.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import updateUserRole from '../controllers/roleController.js';

const router = express.Router();

router.patch('/', isAuthenticated, authorizeRoles('admin'), updateUserRole);

export default router;