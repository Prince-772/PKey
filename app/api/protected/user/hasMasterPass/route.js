import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    await ConnectToDB();
    const { email } = session.user;
    const user = await UserModel.findOne({ email }).select(
      "masPass remainingMasPassAtempts"
    );
    if (!user) throw new Error("User not found!");
    if (user.remainingMasPassAtempts <= 0)
      throw new Error("Your account was blocked!");
    if (user.masPass) {
      return NextResponse.json(
        {
          success: true,
          hasMasterPass: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          hasMasterPass: false,
        },
        { status: 200 }
      );
    }
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
