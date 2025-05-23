import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import UserModel from "@/models/User";

export async function GET(req, { params }) {
  const { verifytoken } = await params;
  const hashedToken = crypto
    .createHash("sha256")
    .update(verifytoken)
    .digest("hex");

  const user = await UserModel.findOne({
    verificationToken: hashedToken,
    verificationExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or Expired token",
      },
      { status: 400 }
    );
  }
  user.isVerified = true;
  user.verificationExpiry = undefined;
  user.verificationToken = undefined;
  await user.save();
  return NextResponse.json({
    success: true,
    message: "User verified successfully",
  });
}
