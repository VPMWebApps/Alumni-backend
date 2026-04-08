const { handleImageUploadUtil } = require("../../helpers/Cloudinary");
const Event = require("../../models/Event.model");
const EventRegistration = require("../../models/RegisterEvent");

/* ===============================
   IMAGE UPLOAD
=============================== */
exports.handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await handleImageUploadUtil(
      req.file.buffer,
      req.file.mimetype
    );

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred during upload",
      error: error.message,
    });
  }
};

/* ===============================
   ADD EVENT (WITH LIMIT SUPPORT)
=============================== */
exports.addEvent = async (req, res) => {
  try {
    const {
      image,
      title,
      date,
      time,
      category,
      status,
      description,
      isVirtual,
      address,
      isLimited,
      capacity,
    } = req.body;

    // 🔒 Basic validation
    if (!title || !date || !time || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🔒 Address validation
    if (isVirtual === false && !address) {
      return res.status(400).json({
        success: false,
        message: "Address is required for physical events",
      });
    }

    // 🔒 Capacity validation
    if (isLimited === true) {
      if (!capacity || capacity < 1) {
        return res.status(400).json({
          success: false,
          message: "Capacity must be at least 1 for limited events",
        });
      }
    }

    const newEvent = new Event({
      image,
      title,
      date,
      time,
      category,
      status,
      description,
      isVirtual,
      address: isVirtual ? undefined : address,
      isLimited: isLimited ?? false,
      capacity: isLimited ? capacity : undefined,
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      data: newEvent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding event",
    });
  }
};

/* ===============================
   FETCH EVENTS
=============================== */
exports.fetchEvent = async (req, res) => {
  try {
    const listOfEvents = await Event.find({}).sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: listOfEvents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching events",
    });
  }
};

/* ===============================
   UPDATE EVENT (WITH LIMIT SUPPORT)
=============================== */
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      image,
      title,
      date,
      time,
      category,
      status,
      description,
      isVirtual,
      address,
      isLimited,
      capacity,
    } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 🔒 Address validation
    if (isVirtual === false && !address) {
      return res.status(400).json({
        success: false,
        message: "Address is required for physical events",
      });
    }

    // 🔒 Capacity validation
    if (isLimited === true) {
      if (!capacity || capacity < 1) {
        return res.status(400).json({
          success: false,
          message: "Capacity must be at least 1 for limited events",
        });
      }

      // prevent shrinking below current registrations
      if (event.registrationsCount > capacity) {
        return res.status(400).json({
          success: false,
          message:
            "Capacity cannot be less than current registrations",
        });
      }
    }

    // 🔄 Field updates
    event.image = image ?? event.image;
    event.title = title ?? event.title;
    event.date = date ?? event.date;
    event.time = time ?? event.time;
    event.category = category ?? event.category;
    event.status = status ?? event.status;
    event.description = description ?? event.description;

    if (typeof isVirtual === "boolean") {
      event.isVirtual = isVirtual;
      event.address = isVirtual ? undefined : address;
    }

    if (typeof isLimited === "boolean") {
      event.isLimited = isLimited;
      event.capacity = isLimited ? capacity : undefined;
    }

    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating event",
    });
  }
};

/* ===============================
   DELETE EVENT
=============================== */
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting event",
    });
  }
};

/* ===============================
   FETCH EVENT REGISTRATIONS
=============================== */
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await EventRegistration.find({ eventId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
    });
  }
};
