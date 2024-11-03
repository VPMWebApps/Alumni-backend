import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import authorizeRoles from "../middlewares/Role.js";
import { 
    getEvents,
    createEvent,
    approveEvent,
    deleteEvent,
    rsvpEvent,
} from '../controllers/event.controller.js';

const router = express.Router();

// 1. Get All Posts with Date Filter
router.get('/get-event', isAuthenticated, getEvents);

// 2. Create Post (Roles: Admin, Staff, Alumnus)
router.post('/create-event', isAuthenticated, authorizeRoles('admin', 'staff', 'alumnus'), createEvent);

// 3. Approve Post by ID (Admin Only)
router.put('/approve/:eventId', isAuthenticated, authorizeRoles('admin'), approveEvent);

// 4. Delete Post by ID
router.delete('/:eventId', isAuthenticated, authorizeRoles('admin', 'staff', 'alumnus'), deleteEvent);

// 5. Get Specific Post by ID
router.post('/rsvp/:eventId', isAuthenticated, rsvpEvent);

export default router;