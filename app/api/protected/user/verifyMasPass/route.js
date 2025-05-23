import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { masPass } = await req.json();
    await ConnectToDB();
    const { email } = session.user;
    const user = await UserModel.findOne({ email }).select(
      "masPass remainingMasPassAtempts"
    );
    if (!user) throw new Error("User not found!");
    if (!user.masPass)
      throw new Error(
        "It seems like you haven't created a master password yet. Please create and then try again!"
      );
    if (user.remainingMasPassAtempts <= 0)
      throw new Error("Your account is blocked!");
    const isMatched = await bcrypt.compare(masPass, user.masPass);
    if (!isMatched) {
      user.remainingMasPassAtempts = user.remainingMasPassAtempts - 1;
      await user.save();
      throw new Error(
        `Wrong password. After ${user.remainingMasPassAtempts} unsuccessfull attemts your account will be blocked!`
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
      }
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
