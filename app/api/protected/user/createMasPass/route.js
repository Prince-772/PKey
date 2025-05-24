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
    if (user.remainingMasPassAtempts <= 0) throw new Error("BLOCKED_ACCOUNT");
    if (user.masPass) throw new Error("You already have a master password!");
    const hashedMasPass = await bcrypt.hash(masPass, 12);

    // saves only hashed master password
    user.masPass = hashedMasPass;
    user.remainingMasPassAtempts = 5;
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Master Password Created successfylly!",
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
