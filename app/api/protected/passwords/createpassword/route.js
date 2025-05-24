import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import PasswordsModel from "@/models/Passwords";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { site, username, password, strength } = await request.json();
    //validating
    if (!site) throw new Error("Site is required");
    if (!username) throw new Error("Username is required");
    if (!password) throw new Error("Password is required");

    await ConnectToDB();
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "_id remainingMasPassAtempts"
    );
    if (user.remainingMasPassAtempts <= 0) throw new Error("BLOCKED_ACCOUNT");

    const isDuplicate =
      (await PasswordsModel.findOne({
        userID: user._id,
        siteName: site,
        userName: username,
      })) && true;

    if (isDuplicate)
      throw new Error("A password with these credentials already exists.");

    await PasswordsModel.create({
      userID: user._id,
      siteName: site,
      userName: username,
      password,
      strength,
    });

    return NextResponse.json(
      {
        message: "Password saved successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error || "Something went wrong" },
      { status: 400 }
    );
  }
}
