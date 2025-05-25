import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import PasswordsModel from "@/models/Passwords";
import { accountDeleteHtml } from "@/lib/html/Emails";
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
    const name = user.name;

    if (userPass && !password.trim()) throw new Error("Password is required!");
    if (userPass) {
      const isMatched = await bcrypt.compare(password, userPass);
      if (!isMatched) throw new Error("Password is incorrect!");
    }
    await PasswordsModel.deleteMany({ userID: user._id });
    await user.deleteOne();

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
