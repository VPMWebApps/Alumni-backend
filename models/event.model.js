import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true,
  },
  organizer: {
    type: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        name: {
            type: String
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'student', 'staff', 'alumnus'], 
        },
    },
    required: true,
},
  alumniWelcome: {
    type: Boolean,
    default: false,
  },
  approved: { 
    type: Boolean, 
    default: false 
    },
  rsvps: [{
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    name: {
      type: String,
      required: true
    }
  }],
  approver: { 
    type: String,
    default: null
    }
},{
    timestamps: true  
});

const EVENT = mongoose.model('Event', eventSchema);

export default EVENT;