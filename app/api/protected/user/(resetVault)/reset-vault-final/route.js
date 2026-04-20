import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import crypto from "crypto";

import { getServerSession } from "next-auth";
//users model
import UserModel from "@/models/User";
import { VaultResetHtml } from "@/lib/html/Emails";
import { sendEmail } from "@/lib/managers/mailManager";
import { authOptions } from "@/auth";
import PasswordsModel from "@/models/Passwords";

export async function DELETE(req) {
  try {
    const { token } = await req.json();

    if (!token) throw new Error("Token is required");

    const session = await getServerSession(authOptions);
    const { email } = session.user;

    await ConnectToDB();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await UserModel.findOne({
      resetVaultToken: hashedToken,
      email,
      resetVaultTokenExpiry: { $gt: new Date() },
    });
    if (!user) throw new Error("Invalid token");
    const { name } = user;

    await PasswordsModel.deleteMany({ userID: user._id });
    user.masPass = null;
    user.remainingMasPassAtempts = 5;
    user.salt = null;
    user.resetVaultToken = null;
    user.resetVaultTokenExpiry = null;
    await user.save();

    // notify email
    await sendEmail({
      to: email,
      subject: "Vault Erased successfully!",
      text: `Hello ${name}, we have reset your vault, including your master password, as per your request.`,
      html: VaultResetHtml(name),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Vault reset successfully! Please set your master password again.",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Something went wrong!",
      },
      { status: 400 },
    );
  }
}
