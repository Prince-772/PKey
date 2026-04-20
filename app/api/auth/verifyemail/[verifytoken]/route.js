import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import UserModel from "@/models/User";
import ConnectToDB from "@/lib/dbConnect";
import { WelcomeHtml } from "@/lib/html/Emails";
import { sendEmail } from "@/lib/managers/mailManager";

export async function GET(req, { params }) {
  const { verifytoken } = await params;
  const hashedToken = crypto
    .createHash("sha256")
    .update(verifytoken)
    .digest("hex");
  await ConnectToDB();
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
      { status: 400 },
    );
  }
  user.isVerified = true;
  user.verificationExpiry = null;
  user.verificationToken = null;
  await user.save();
  
  await sendEmail({
    to: user.email,
    subject: "Welcome to PKey! 🚀 Your Secure Vault is Ready",
    text: `Hello ${
      user?.name || "User"
    }, welcome to PKey! Your secure, zero-knowledge vault is ready. Remember, we do not store your master password. Access your vault here: ${
      process.env.NEXT_PUBLIC_BASE_URL
    }/dashboard`,
    html: WelcomeHtml(user?.name || "User"),
  });
  return NextResponse.json({
    success: true,
    message: "User verified successfully",
  });
}
