const mongoose = require("mongoose");

const passwordsSchema = new mongoose.Schema(
  {
    // Reference to the user
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "userID is required"],
    },
    siteName: {
      type: String,
      required: [true, "Site name is required"],
    },
    userNames: { type: [String], required: true, default: [] },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    strength: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  },
);

const PasswordsModel =
  mongoose.models.passwords || mongoose.model("passwords", passwordsSchema);

module.exports = PasswordsModel;
