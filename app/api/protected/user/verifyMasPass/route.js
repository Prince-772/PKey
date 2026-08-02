import { authOptions } from "@/auth";
import ConnectToDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { accountBlocked } from "@/lib/html/Emails";
import { sendEmail } from "@/lib/managers/mailManager";
import {
  isMasPassLocked,
  registerMasPassFailure,
  clearMasPassFailures,
  masPassLockRemainingMs,
  MAX_MAS_PASS_ATTEMPTS,
} from "@/lib/masterpassword/lockout";

const lockedResponse = (user) =>
  NextResponse.json(
    {
      success: false,
      message: "BLOCKED_ACCOUNT",
      retryAfterMs: masPassLockRemainingMs(user),
    },
    { status: 403 },
  );

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { authHash } = await req.json();
    if (!authHash) throw new Error("authHash is required")
    await ConnectToDB();
    const { email } = session.user;
    const user = await UserModel.findOne({ email }).select(
      "name masPass masPassAttempts masPassLockUntil masPassLockLevel",
    );
    if (!user) throw new Error("User not found!");
    if (!user.masPass)
      throw new Error("Please create a master password to proceed");

    // Expired lock: clear it so the user gets a fresh set of attempts.
    if (
      user.masPassLockUntil &&
      new Date(user.masPassLockUntil) <= new Date()
    ) {
      clearMasPassFailures(user);
      await user.save();
    }

    if (isMasPassLocked(user)) return lockedResponse(user);

    const name = user.name;
    // No need to check version here as all Uv use same process
    const isMatched = await bcrypt.compare(authHash, user.masPass);
    if (!isMatched) {
      const justLocked = registerMasPassFailure(user);
      await user.save();
      if (justLocked) {
        const minutes = Math.max(
          1,
          Math.round(masPassLockRemainingMs(user) / 60000),
        );
        await sendEmail({
          to: email,
          subject: "Vault locked temporarily!",
          text: `Hello ${name}, your vault was locked for ${minutes} minute(s) due to too many incorrect master password attempts. It will unlock automatically.`,
          html: accountBlocked(name, minutes),
        });
        return lockedResponse(user);
      }
      const remaining = MAX_MAS_PASS_ATTEMPTS - user.masPassAttempts;
      throw new Error(
        `Wrong password. After ${remaining} failed ${
          remaining === 1 ? "attempt" : "attempts"
        } your vault will be locked temporarily!`,
      );
    }
    clearMasPassFailures(user);
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Matched",
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Something went wrong!",
      },
      { status: 400 },
    );
  }
}
