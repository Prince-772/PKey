import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import crypto from "crypto";

//users model
import UserModel from "@/models/User";
import { passwordResetHtml } from "@/lib/html/Emails";
import { sendEmail } from "@/lib/managers/mailManager";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!newPassword) throw new Error("New password is required");
    if (!token) throw new Error("Token is required");

    await ConnectToDB();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await UserModel.findOne({ resetPasswordToken: hashedToken });
    if (!user) throw new Error("Invalid token");
    const { name, email } = user;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    const response = NextResponse.json({
      success: true,
      message: "Password Reset successfully",
    });

    await sendEmail({
      to: email,
      subject: "Password reset successfully!",
      text: `Hello ${name}, we have reset your account password, as per your request.`,
      html: passwordResetHtml(name),
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
