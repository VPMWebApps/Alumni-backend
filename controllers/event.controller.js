import Event from '../models/event.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// GET all events

const getEvents = catchAsync( async (req, res,next) => {
    const { date, month, year } = req.query;

    let filter = {};
    if (date || month || year) {
        const startDate = new Date(year, month - 1, date || 1);
        const endDate = new Date(year, month - 1, date || 1);
        endDate.setDate(endDate.getDate() + (date ? 1 : 30));
        filter.eventDate = { $gte: startDate, $lt: endDate };
    }

    const events = await Event.find(filter);
    if (!events.length) {
        return next(new AppError("No events found", 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Event\'s found',
        data: {
            events
        }
    });
});

// POST a new event

const createEvent = catchAsync(async (req, res, next) => {
    
    const { title, description, eventDate, alumniWelcome } = req.body;
    console.log(req.user);
    

    const event = await Event.create({
        title: title,
        description: description,
        eventDate: eventDate,
        organizer: {
            id: req.user._id,
            name: req.user.username,
            role: req.user.role,
        },
        alumniWelcome: alumniWelcome || false,
        approved: false, // Default to not approved
    });

    await event.save({ validateBeforeSave: false });

    res.status(201).json({
        status:'success',
        message: 'Event created successfully. Pending admin approval',
        data: {
            event
        }
    });
});

// PUT approve event
const approveEvent = catchAsync( async (req, res, next) => {

    // const { title, description, eventDate } = req.body;
    const { eventId } = req.params;

    const event = await Event.findByIdAndUpdate(
        eventId,
        { 
            approved: true,
            approver: req.user.username 
        },
        { 
            new: true 
        }
    ).populate('User');

    if (!event) {
        return next(new AppError("Event not found", 404));
    }

    res.status(200).json({ 
        status: 'success',
        message: 'Event approved successfully.', 
        data: {
            event
        }
    });

});

// DELETE event

const deleteEvent = catchAsync(async (req, res, next) => {

    const { eventId } = req.params;

    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
        return next(new AppError("Event not found", 404));
    }

    res.status(200).json({ 
        status:'success',
        message: 'Event deleted successfully.',
        data: null
    });

});

// RSVP event

const rsvpEvent = catchAsync( async (req, res, next) => {

    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if the user has already RSVP'd
    const alreadyRSVPd = event.rsvps.some(rsvp => rsvp.userId.equals(req.user._id));
    if (alreadyRSVPd) {
        return next(new AppError("You have already RSVP\'d for this event.", 400));
    }

    // Add RSVP
    event.rsvps.push({ 
        userId: req.user._id, 
        name: req.user.username 
    });
    await event.save();

    res.status(200).json({ 
        status: 'success',
        message: 'RSVP successful.', 
        data: {
            event
        }
    });

});



export {
    getEvents,
    createEvent,
    approveEvent,
    deleteEvent,
    rsvpEvent,
};
