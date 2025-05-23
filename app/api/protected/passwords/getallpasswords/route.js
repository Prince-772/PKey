import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import PasswordsModel from "@/models/Passwords";
import { decrypt } from "@/lib/passwords/encryptPassword";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session.user.email;
    
    await ConnectToDB();
    const user = await UserModel.findOne({ email }).select("_id remainingMasPassAtempts");
    if (!user) throw new Error("User not found");
    if (user.remainingMasPassAtempts <= 0) throw new Error("Your account was blocked!")
    const PassDocs = await PasswordsModel.find({ userID: user._id }).select(
      "siteName userName password isFavorite strength"
    ).sort("-createdAt")
    return NextResponse.json({
      success: true,
      data: PassDocs
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
