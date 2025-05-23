import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import PasswordsModel from "@/models/Passwords";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const { site, username, password, id, strength } = await req.json();

    if (!site) throw new Error("Site is required");
    if (!username) throw new Error("Username is required");
    if (!password) throw new Error("Password is required");
    if (!id) throw new Error("ID is required");
    if (!strength) throw new Error("Password strength is required!")
    await ConnectToDB();
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "_id remainingMasPassAtempts"
    );
    if (!user) throw new Error("User not found");
    if (user.remainingMasPassAtempts <= 0) throw new Error("Your account was blocked!")
    const isDuplicate =
      (await PasswordsModel.findOne({
        userID: user._id,
        _id: { $ne: id },
        siteName: site,
        userName: username,
      })) && true;
    if (isDuplicate)
      throw new Error(
        "You can't add two different passwords for same credendials."
      );

    const oldDoc = await PasswordsModel.findOne({ userID: user._id, _id: id });
    if (!oldDoc) throw new Error("Entry not found in your account");
    oldDoc.set({
      siteName: site,
      userName: username,
      password,
      strength
    });
    await oldDoc.save();
    return NextResponse.json(
      {
        success: true,
        message: "Entry updated successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update",
      },
      { status: 400 }
    );
  }
}
