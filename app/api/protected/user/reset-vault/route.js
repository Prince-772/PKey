import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import PasswordsModel from "@/models/Passwords";
import { VaultResetHtml } from "@/lib/html/Emails";
import { sendEmail } from "@/lib/managers/mailManager";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    await ConnectToDB();

    const { email } = session.user;
    const { password } = await req.json();

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found!");

    const userPass = user.password;
    const name = user.name
    if (userPass && !password.trim()) throw new Error("Password is required!");
    if (userPass) {
      const isMatched = await bcrypt.compare(password, userPass);
      if (!isMatched) throw new Error("Password is incorrect!");
    }
    await PasswordsModel.deleteMany({ userID: user._id });

    user.masPass = undefined;
    user.remainingMasPassAtempts = 5;
    await user.save();

    // notify email
        await sendEmail ({
          to: email,
          subject: "Vault Erased successfully!",
          text: `Hello ${name}, we have reset your vault, including your master password, as per your request.`,
          html: VaultResetHtml(name)
        });

    return NextResponse.json(
      {
        success: true,
        message:
          "Vault reseted successfully! Please Set your Master Password again!",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Something went wrong!",
      },
      { status: 400 }
    );
  }
}
