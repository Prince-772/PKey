import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import crypto from "crypto";
import { sleep } from "@/lib/helperBackend";

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
    const errorMessage = "Invalid or expired password reset token.";
    if (!user) {
      await sleep(Math.floor(Math.random() * 300) + 200);
      throw new Error(errorMessage);
    }

    return NextResponse.json(
      {
        success: true,
        data: { email: user.email },
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Something went wrong!",
      },
      { status: 400 },
    );
  }
}
