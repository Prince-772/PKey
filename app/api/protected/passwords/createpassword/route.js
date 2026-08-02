import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { isMasPassLocked } from "@/lib/masterpassword/lockout";
import PasswordsModel from "@/models/Passwords";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { site, usernames, password, strength } = await request.json();
    const normalizedUsernames = usernames.map((u) => u.trim()).filter(Boolean);
    //validating
    if (!site) throw new Error("Site is required");
    if (!normalizedUsernames.length) throw new Error("Username is required");
    if (!password) throw new Error("Password is required");

    await ConnectToDB();
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "_id masPassLockUntil",
    );
    if (isMasPassLocked(user)) throw new Error("BLOCKED_ACCOUNT");

    await PasswordsModel.create({
      userID: user._id,
      siteName: site,
      userNames: normalizedUsernames,
      password,
      strength,
      version: 3,
    });

    return NextResponse.json(
      {
        message: "Password saved successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || error || "Something went wrong",
      },
      { status: 400 },
    );
  }
}
