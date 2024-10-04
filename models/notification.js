const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assets", // Reference to the asset (Asset model)
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the asset owner (User model)
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assets", // Reference to the buyer showing interest (User model)
      required: true,
    },
    buyerContact: {
        type: String, // Assuming contact number is stored as a string
        required: true,
      },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "seen"],
      default: "pending",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Notification = mongoose.model("Notification", notificationSchema);
  
  module.exports = Notification;