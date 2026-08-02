import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import PasscodeModel from "@/models/Passcode";
import UserModel from "@/models/User";
import { isMasPassLocked } from "@/lib/masterpassword/lockout";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await req.json();
    if (!id) throw new Error("ID is required");

    await ConnectToDB();
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "_id masPassLockUntil"
    );
    if (!user) throw new Error("User not found");
    if (isMasPassLocked(user)) throw new Error("BLOCKED_ACCOUNT");

    const doc = await PasscodeModel.findOne({ userID: user._id, _id: id });
    if (!doc) throw new Error("Entry not found in your account");

    await doc.deleteOne();

    return NextResponse.json(
      {
        success: true,
        message: "Passcode deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete!",
      },
      { status: 400 }
    );
  }
}
