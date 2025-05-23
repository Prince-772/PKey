const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    // only saves the hashed master password
    masPass: {
      type: String,
    },
    remainingMasPassAtempts: {
      type: Number,
      default: 5,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationExpiry: Date,
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.models.users || mongoose.model("users", userSchema);

module.exports = UserModel;
