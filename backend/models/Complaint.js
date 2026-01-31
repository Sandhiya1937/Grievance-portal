// 

const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending"
    },

    // ✅ NEW FIELD: Admin reply when resolved
    adminReply: {
      type: String,
      default: ""
    },

    // ✅ NEW FIELD: Resolution timestamp
    resolvedAt: {
      type: Date
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
