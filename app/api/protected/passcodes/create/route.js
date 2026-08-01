import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import PasscodeModel from "@/models/Passcode";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { siteName, userNames, pin, strength } = await request.json();

    const normalizedUsernames = userNames.map((u) => u.trim()).filter(Boolean);

    //validating
    if (!siteName) throw new Error("Service name is required");
    if (!normalizedUsernames.length) throw new Error("Username/ID is required");
    if (!pin) throw new Error("PIN is required");

    await ConnectToDB();
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "_id remainingMasPassAtempts"
    );
    if (user.remainingMasPassAtempts <= 0) throw new Error("BLOCKED_ACCOUNT");

    await PasscodeModel.create({
      userID: user._id,
      siteName: siteName,
      userNames: normalizedUsernames,
      pin: pin,
      strength,
    });

    return NextResponse.json(
      {
        message: "Passcode saved successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 400 }
    );
  }
}
