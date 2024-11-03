import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRoles from "../middlewares/Role.js";
import { 
    getPosts,
    createPost,
    approvePost,
    getSinglePost,
    deletePost
} from '../controllers/postController.js';

const router = express.Router();

// 1. Get All Posts with Date Filter
router.get('/get-post', isAuthenticated, getPosts);

// 2. Create Post (Roles: Admin, Staff, Alumnus)
router.post('/create-post', isAuthenticated, authorizeRoles('admin', 'staff', 'alumnus'), createPost);

// 3. Approve Post by ID (Admin Only)
router.put('/approve/:postId', isAuthenticated, authorizeRoles('admin'), approvePost);

// 4. Get Specific Post by ID
router.get('/:postId', isAuthenticated, getSinglePost);

// 5. Delete Post by ID
router.delete('/delete/:postId', isAuthenticated, authorizeRoles('admin', 'staff', 'alumnus'), deletePost);

export default router;