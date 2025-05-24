import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import PasswordsModel from "@/models/Passwords";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await req.json();
    if(!id) throw new Error("ID is required")
    await ConnectToDB();
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "_id remainingMasPassAtempts"
    );
    if (!user) throw new Error("User not found");
    if (user.remainingMasPassAtempts <= 0) throw new Error("BLOCKED_ACCOUNT");
    const Doc = await PasswordsModel.findOne({ userID: user._id, _id: id });
    if (!Doc) throw new Error("Entry not found in your account");
    await Doc.deleteOne()
    return NextResponse.json({
      success: true,
      message:"Entry deleted successfully!"
    },{status:200})
  } catch (error) {
    return NextResponse.json({
      success: false,
      message:error.message || "Failed to delete!"
    },{status:400})
  }
}
