const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },

    reminderSent: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Prevent duplicate registration for the same event + email
 */
eventRegistrationSchema.index(
  { eventId: 1, email: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);
