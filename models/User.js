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
    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      required: true,
    },
    // only saves the hashed authHash (not master Password)
    masPass: {
      type: String,
    },
    salt: {
      type: String,
    },
    version: {
      type: Number,
      default: 3,
    },
    remainingMasPassAtempts: {
      type: Number,
      default: 5,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,

    verificationToken: String,
    verificationExpiry: Date,

    resetVaultToken: String,
    resetVaultTokenExpiry: Date,

    deleteAccountToken: String,
    deleteAccountTokenExpiry: Date,

    deleteAccountAttempts: {
      type: Number,
      default: 0,
    },
    deleteAccountResetDate: {
      type: Date,
      default: null,
    },

    resetVaultAttempts: {
      type: Number,
      default: 0,
    },
    resetVaultResetDate: {
      type: Date,
      default: null,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },
    loginLockUntil: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);
const UserModel = mongoose.models.users || mongoose.model("users", userSchema);

module.exports = UserModel;
