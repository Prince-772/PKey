import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const { authHash, salt } = await req.json();
    await ConnectToDB();
    const { email } = session.user;
    const user = await UserModel.findOne({ email }).select(
      "masPass version salt",
    );
    if (!user) throw new Error("User not found!");
    if (!user.masPass)
      throw new Error("Please create a master password to proceed");

    const finalHash = await bcrypt.hash(authHash, 12);
    // saves only hashed verison of authHash
    user.masPass = finalHash;
    user.salt = salt;
    user.version = 2; // Version Update
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Secured!",
      },
      {
        status: 200,
      },
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
