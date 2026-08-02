import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import PasswordsModel from "@/models/Passwords";
import UserModel from "@/models/User";
import { isMasPassLocked } from "@/lib/masterpassword/lockout";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const { site, usernames, password, id, strength, version } =
      await req.json();

    const required = { site, password, id, strength };
    for (const [key, val] of Object.entries(required)) {
      if (!val?.trim()) throw new Error(`${key} is required`);
    }
    if (!Array.isArray(usernames) || usernames.every((u) => !u?.trim())) {
      throw new Error("At least one username is required");
    }
    await ConnectToDB();
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "_id masPassLockUntil",
    );
    if (!user) throw new Error("User not found");
    if (isMasPassLocked(user)) throw new Error("BLOCKED_ACCOUNT");

    const oldDoc = await PasswordsModel.findOne({ userID: user._id, _id: id });
    if (!oldDoc) throw new Error("Entry not found in your account");
    oldDoc.set({
      siteName: site,
      userNames: usernames,
      password,
      strength,
      version,
    });
    await oldDoc.save();
    return NextResponse.json(
      {
        success: true,
        message: "Entry updated successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update",
      },
      { status: 400 },
    );
  }
}
