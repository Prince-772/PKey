import { NextRequest, NextResponse } from "next/server"; // Added NextRequest typing
import ConnectToDB from "@/lib/dbConnect";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import errorHandler from "@/lib/handlers/errorhandler";

import UserModel from "@/models/User";
import { sendEmail } from "@/lib/managers/mailManager";
import { verifyEmailHtml } from "@/lib/html/Emails";

export async function POST(req) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name) throw new Error("Name is required");
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (!confirmPassword) throw new Error("Confirm Password is required");

    if (password !== confirmPassword)
      throw new Error("Confirm Password does not match");

    await ConnectToDB();

    const response = NextResponse.json({
      success: true,
      message: "Please Check Your Email",
    });

    const isAlreadyExist = await UserModel.findOne({ email });

    if (isAlreadyExist) {
      // dummy hash
      await bcrypt.hash(password, 10);
      return response;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    await UserModel.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: hashedToken,
      verificationExpiry: Date.now() + 1000 * 60 * 60,
    });

    // SERVERLESS PROMISE TRACKING
    const emailPromise = sendEmail({
      to: email,
      subject: "Verify your email",
      text: `Hello ${name}, please verify your email...`,
      html: verifyEmailHtml(name, verifyToken),
    }).catch((err) => console.error("Async Email Error:", err));

    if (req.waitUntil) {
      req.waitUntil(emailPromise);
    }

    return response;
  } catch (err) {
    return errorHandler(err);
  }
}
