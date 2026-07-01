import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import crypto from "crypto";
import errorHandler from "@/lib/handlers/errorhandler";
import UserModel from "@/models/User";
import { sendEmail } from "@/lib/managers/mailManager";
import { forgotPasswordHtml, oauthLoginHtml } from "@/lib/html/Emails";
import { after } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) throw new Error("Email is required");

    await ConnectToDB();

    const user = await UserModel.findOne({ email });

    const response = NextResponse.json({
      success: true,
      message:
        "If that email exists in our system, a reset link has been sent.",
    });

    if (!user) {
      return response;
    }

    if (!user.password) {
      after(async () => {
        try {
          await sendEmail({
            to: email,
            subject: "PKey - Password Reset Request Information",
            text: `Hello ${user?.name || "User"}, we received a password reset request, but you registered using a social provider. Please log in using your provider.`,
            html: oauthLoginHtml(user?.name),
          });
        } catch (err) {
          console.error("Async Email Error (OAuth Notice):", err);
        }
      });

      return response;
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpiry = Date.now() + 1000 * 60 * 10; // 10 minutes
    await user.save();

    after(async () => {
      try {
        await sendEmail({
          to: email,
          subject: "Reset Your Password",
          text: `Hello ${
            user?.name || "User"
          }, click the link to reset your password: ${
            process.env.NEXT_PUBLIC_BASE_URL
          }/auth/resetpassword/${verifyToken}`,
          html: forgotPasswordHtml(user?.name, verifyToken),
        });
      } catch (err) {
        console.error("Async Email Error:", err);
      }
    });

    return response;
  } catch (err) {
    return errorHandler(err);
  }
}
