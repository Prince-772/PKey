import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import crypto from "crypto";
import errorHandler from "@/lib/handlers/errorhandler";
import UserModel from "@/models/User";
import { sendEmail } from "@/lib/managers/mailManager";
import { verifyEmailHtml } from "@/lib/html/Emails";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) throw new Error("Email is required");

    await ConnectToDB();

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found");
    if (user.isVerified) throw new Error("User already verified. Please sign in");

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verifyToken).digest('hex');

    user.verificationToken = hashedToken;
    user.verificationExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    await sendEmail ({
      to: email,
      subject: "Verify your email",
      text: `Hello ${user.name}, please verify your email by clicking on the link below: ${process.env.NEXT_PUBLIC_BASE_URL}/auth/verifyemail/${verifyToken}`,
      html: verifyEmailHtml(user.name,verifyToken)});

    return NextResponse.json({ success: true, message: "Verification email resent" });
  } catch (err) {
    return errorHandler(err);
  }
}
