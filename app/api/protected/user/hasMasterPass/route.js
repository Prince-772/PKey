import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    await ConnectToDB();
    const { email } = session.user;
    const user = await UserModel.findOne({ email }).select(
      "masPass"
    );
    if (!user) throw new Error("User not found!");
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
        error: err.message || "Something went wrong!",
      },
      { status: 400 }
    );
  }
}
