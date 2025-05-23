import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import crypto from "crypto";
import errorHandler from "@/lib/handlers/errorhandler";
import UserModel from "@/models/User";
import { sendEmail } from "@/lib/managers/mailManager";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) throw new Error("Email is required");

    await ConnectToDB();

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found");
    if (!user.password) throw new Error("This account was registered using a different login method.");
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verifyToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpiry = Date.now() + 1000 * 60 * 10; // 10 minutes
    await user.save();

    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      text: `Hello ${user?.name || "User"}, click the link to reset your password: ${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetpassword/${verifyToken}`,
      html: `<p style="font-family:sans-serif;">
               Hello <b>${user?.name || "User"}</b>,<br/>
               Click the link below to reset your password:
             </p>
             <a style="font-family:sans-serif;" href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetpassword/${verifyToken}">
               Reset Password
             </a>`,
    });
    
    console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetpassword/${verifyToken}`);

    return NextResponse.json({ success: true, message: "Reset link sent to your email!" });
  } catch (err) {
    return errorHandler(err);
  }
}
