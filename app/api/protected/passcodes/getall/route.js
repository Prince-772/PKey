import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import PasscodeModel from "@/models/Passcode";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session.user.email;

    await ConnectToDB();
    const user = await UserModel.findOne({ email }).select(
      "_id remainingMasPassAtempts"
    );
    if (!user) throw new Error("User not found");
    if (user.remainingMasPassAtempts <= 0) throw new Error("BLOCKED_ACCOUNT");

    const PasscodeDocs = await PasscodeModel.find({ userID: user._id })
      .select("siteName userNames pin isFavorite strength createdAt updatedAt")
      .sort("-createdAt");

    return NextResponse.json({
      success: true,
      data: PasscodeDocs,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
