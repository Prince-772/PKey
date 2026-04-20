import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import crypto from "crypto";

//users model
import UserModel from "@/models/User";
import { accountDeleteHtml } from "@/lib/html/Emails";
import { sendEmail } from "@/lib/managers/mailManager";
import PasswordsModel from "@/models/Passwords";
import { errorMonitor } from "stream";

export async function DELETE(req) {
  try {
    const { token } = await req.json();

    if (!token) throw new Error("Token is required");

    await ConnectToDB();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await UserModel.findOne({
      deleteAccountToken: hashedToken,
      deleteAccountTokenExpiry: { $gt: Date.now() },
    });
    if (!user) throw new Error("Invalid or expired token");
    const { name, email } = user;

    await PasswordsModel.deleteMany({ userID: user._id });
    await user.deleteOne();

    // notify email
    await sendEmail({
      to: email,
      subject: "Account Deleted Successfully!",
      text: `Hello ${name}, we have deleted your account, including all your saved data, as per your request.`,
      html: accountDeleteHtml(name),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account deleted successfully!",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error (err)
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Something went wrong!",
      },
      { status: 400 },
    );
  }
}
