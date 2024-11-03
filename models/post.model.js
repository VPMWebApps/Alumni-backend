import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    postedBy: {
      type: {
          id: {
              type: Number,
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
    datePosted: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      enum: ["job", "internship"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const POST = mongoose.model("Post", postSchema);

export default POST;