const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    
    isVirtual: {
      type: Boolean,
      default: false,
    },

    address: {
      type: String,
      trim: true,
      required: function () {
        return !this.isVirtual;
      },
    },

    isLimited: {
      type: Boolean,
      default: false,
    },

    capacity: {
      type: Number,
      min: 1,
      required: function () {
        return this.isLimited;
      },
    },

    registrationsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

/* ===============================
   SAFETY VALIDATION
=============================== */
EventSchema.pre("save", function (next) {
  if (this.isLimited && this.registrationsCount > this.capacity) {
    return next(
      new Error("Registrations exceed event capacity")
    );
  }
  next();
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
