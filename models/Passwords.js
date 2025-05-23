const mongoose = require("mongoose");

const passwordsSchema = new mongoose.Schema(
  {
    // Reference to the user
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "UserId is required"],
    },
    siteName: {
      type: String,
      required:[true,"Site name is required"]
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    strength: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

const PasswordsModel = mongoose.models.passwords || mongoose.model("passwords", passwordsSchema)

module.exports = PasswordsModel
