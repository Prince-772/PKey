import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import errorHandler from "@/lib/handlers/errorhandler";
import UserModel from "@/models/User";
import { sendEmail } from "@/lib/managers/mailManager";
import { resetVaultConfirmHtml } from "@/lib/html/Emails";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { email } = session.user;
    const { password } = await req.json();

    await ConnectToDB();

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found");
    if (user.password && !password) throw new Error("Password is required");

    if (user.password) {
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) throw new Error("Password is incorrect!");
    }

    // Rate limiting: 3 reset vault requests per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (!user.resetVaultResetDate) {
      user.resetVaultAttempts = 1;
      user.resetVaultResetDate = tomorrow;
    } else if (
      user.resetVaultResetDate.getTime() >= today.getTime() &&
      user.resetVaultAttempts >= 3
    ) {
      throw new Error(
        "Security Limit: You can only request to reset your vault 3 times a day. Please try again tomorrow.",
      );
    } else if (user.resetVaultResetDate.getTime() < today.getTime()) {
      user.resetVaultAttempts = 1;
      user.resetVaultResetDate = tomorrow;
    } else {
      user.resetVaultAttempts += 1;
      user.resetVaultResetDate = tomorrow;
    }
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    user.resetVaultToken = hashedToken;
    user.resetVaultTokenExpiry = Date.now() + 1000 * 60 * 10; // 10 minutes
    await user.save();

    await sendEmail({
      to: email,
      subject: "Reset Your Vault",
      text: `Hello ${
        user?.name || "User"
      }, click the link to clear your vault: ${
        process.env.NEXT_PUBLIC_BASE_URL
      }/auth/resetvault/${verifyToken}`,
      html: resetVaultConfirmHtml(user?.name, verifyToken),
    });

    return NextResponse.json({
      success: true,
      message:
        "A confirmation link to reset your vault has been sent to your email.",
    });
  } catch (err) {
    return errorHandler(err);
  }
}
