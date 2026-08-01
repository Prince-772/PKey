import mongoose from "mongoose";

const passcodeSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    siteName: {
      type: String,
      required: true,
    },
    userNames: {
      type: [String],
      required: true,
      default: [],
    },
    pin: {
      type: String,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    strength: {
      type: String,
    },
  },
  { timestamps: true }
);

const PasscodeModel =
  mongoose.models.passcode || mongoose.model("passcode", passcodeSchema);

export default PasscodeModel;
