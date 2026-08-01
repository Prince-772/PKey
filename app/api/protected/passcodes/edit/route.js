import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import PasscodeModel from "@/models/Passcode";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const { siteName, userNames, pin, strength, id } = await req.json();

    if (!id) throw new Error("ID is required");
    if (!siteName) throw new Error("Service name is required");
    if (!pin) throw new Error("PIN is required");
    if (!Array.isArray(userNames) || userNames.every((u) => !u?.trim())) {
      throw new Error("At least one username/ID is required");
    }

    await ConnectToDB();
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "_id remainingMasPassAtempts"
    );
    if (!user) throw new Error("User not found");
    if (user.remainingMasPassAtempts <= 0) throw new Error("BLOCKED_ACCOUNT");

    const oldDoc = await PasscodeModel.findOne({ userID: user._id, _id: id });
    if (!oldDoc) throw new Error("Entry not found in your account");

    const validStrengths = ["weak", "moderate", "strong"];
    oldDoc.set({
      siteName,
      userNames,
      pin,
      strength: validStrengths.includes(strength) ? strength : oldDoc.strength,
    });
    await oldDoc.save();

    return NextResponse.json(
      {
        success: true,
        message: "Passcode updated successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update passcode",
      },
      { status: 400 }
    );
  }
}
