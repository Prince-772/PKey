import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { accountBlocked } from "@/lib/html/Emails";
import { sendEmail } from "@/lib/managers/mailManager";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { authHash } = await req.json();
    if (!authHash) throw new Error("authHash is required")
    await ConnectToDB();
    const { email } = session.user;
    const user = await UserModel.findOne({ email }).select(
      "name masPass remainingMasPassAtempts",
    );
    if (!user) throw new Error("User not found!");
    if (!user.masPass)
      throw new Error("Please create a master password to proceed");
    if (user.remainingMasPassAtempts <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "BLOCKED_ACCOUNT",
        },
        { status: 403 },
      );
    }
    const name = user.name;
    // No need to check version here as all Uv use same process
    const isMatched = await bcrypt.compare(authHash, user.masPass);
    if (!isMatched) {
      user.remainingMasPassAtempts = user.remainingMasPassAtempts - 1;
      await user.save();
      if (user.remainingMasPassAtempts === 0) {
        await sendEmail({
          to: email,
          subject: "Account blocked!",
          text: `Hello ${name}, we have permanently blocked your account due to too many incorrect master password attempts.`,
          html: accountBlocked(name),
        });
        throw new Error(
          `Wrong password. We have permanently blocked your account!`,
        );
      } else
        throw new Error(
          `Wrong password. After ${user.remainingMasPassAtempts} failed ${
            user.remainingMasPassAtempts === 1 ? "attempt" : "attempts"
          } your account will be blocked!`,
        );
    }
    user.remainingMasPassAtempts = 5;
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Matched",
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Something went wrong!",
      },
      { status: 400 },
    );
  }
}
