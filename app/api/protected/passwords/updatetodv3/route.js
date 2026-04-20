import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import PasswordsModel from "@/models/Passwords";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const { newDocArray } = await req.json();

    if (!newDocArray?.length) throw new Error("No data provided for update.");

    await ConnectToDB();

    const user = await UserModel.findOne({ email: session.user.email }).select(
      "_id remainingMasPassAtempts version",
    );

    if (!user) throw new Error("Authentication failed: User not found.");
    if (user.remainingMasPassAtempts <= 0) throw new Error("BLOCKED_ACCOUNT");

    // Prepare Bulk Operations
    const bulkOps = newDocArray
      .filter(
        (doc) =>
          doc._id &&
          doc.siteName &&
          doc.userName &&
          doc.password &&
          doc.version,
      ) // Basic validation
      .map((doc) => ({
        updateOne: {
          filter: { _id: doc._id, userID: user._id },
          update: {
            $set: {
              siteName: doc.siteName,
              userName: doc.userName,
              password: doc.password,
              strength: doc.strength,
              version: doc.version,
            },
          },
        },
      }));

    if (bulkOps.length === 0) throw new Error("No valid records to update.");

    // Execute Bulk Write
    const result = await PasswordsModel.bulkWrite(bulkOps);

    const totalProcessed = result.matchedCount || result.modifiedCount;
    const failedCount = newDocArray.length - totalProcessed;
    const pendingDocs = await PasswordsModel.countDocuments({
        userID: user._id,
        version: { $ne: 3 },
      });
    let responseMessage;
    if (failedCount > 0) {
      responseMessage = `Secured ${totalProcessed} entries. ${failedCount} pending.`;
    } else {
      responseMessage = "All passwords secured successfully!";

      if (pendingDocs === 0) {
        user.version = 3;
        await user.save();
      }
    }

    return NextResponse.json(
      {
        success: true,
        isAllUpdated: !Boolean(pendingDocs),
        message: responseMessage,
        details: { updated: result.modifiedCount, failed: failedCount },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "An unexpected error occurred while securing your data.",
      },
      { status: 400 },
    );
  }
}
