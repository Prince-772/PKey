import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import crypto from "crypto"

//users model
import UserModel from "@/models/User";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!newPassword) throw new Error("New password is required");
    if (!token) throw new Error("Token is required");

    await ConnectToDB();
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    console.log(hashedToken,"hashed token");
    const user = await UserModel.findOne({ resetPasswordToken: hashedToken });
    if (!user) throw new Error("Invalid token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    const response = NextResponse.json({
      success: true,
      message: "Password Reset successfully",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 400 }
    );
  }
}
