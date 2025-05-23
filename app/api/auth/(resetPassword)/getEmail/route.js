import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) throw new Error("Token is required");

    await ConnectToDB();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    }).select("email");
    if (!user) throw new Error("Invalid or expired token");

    return NextResponse.json(
      {
        success: true,
        data: { email: user.email },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err.message || "Something went wrong!",
      },
      { status: 400 }
    );
  }
}
