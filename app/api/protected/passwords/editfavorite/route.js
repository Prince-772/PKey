import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import PasswordsModel from "@/models/Passwords";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const { isFav, id } = await req.json();
    if(!id) throw new Error("ID is required")
    if (isFav === undefined) throw new Error("New status is required!");
    await ConnectToDB();
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "_id remainingMasPassAtempts"
    );
    if (!user) throw new Error("User not found");
    if (user.remainingMasPass <= 0) throw new Error("BLOCKED_ACCOUNT");

    const oldDoc = await PasswordsModel.findOne({
      userID: user._id,
      _id: id,
    }).select("isFavorite");
    if (!oldDoc) throw new Error("Entry not found in your account");
    oldDoc.set({ isFavorite: isFav });
    await oldDoc.save();
    return NextResponse.json(
      {
        success: true,
        message: isFav?"Added to favorites!":"Removed from favorites!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong!",
      },
      { status: 400 }
    );
  }
}
