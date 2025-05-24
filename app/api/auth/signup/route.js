import { NextResponse } from "next/server";
import ConnectToDB from "@/lib/dbConnect";
import crypto from "crypto";
import bcrypt from "bcrypt"
import errorHandler from "@/lib/handlers/errorhandler";

//users model
import UserModel from "@/models/User";
import { sendEmail } from "@/lib/managers/mailManager";

export async function POST(req) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    // Validate the inputs
    if (!name) throw new Error("Name is required");
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (!confirmPassword) throw new Error("Confirm Password is required");

    if (password !== confirmPassword)
      throw new Error("Confirm Password does not match");

    // Connect to the database
    await ConnectToDB();

    const isAlreadyExist = await UserModel.findOne({ email })
    
    if (isAlreadyExist) throw new Error("This user is already registered, Please Login")

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verifyToken).digest('hex');

    // Create user
    const createdUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      verificationToken:hashedToken,
      verificationExpiry: Date.now() + 1000 * 60 * 60,
    });
    
    //send verification email
    await sendEmail ({
      to: email,
      subject: "Verify your email",
      text: `Hello ${name}, please verify your email by clicking on the link below: ${process.env.NEXT_PUBLIC_BASE_URL}/verify/${createdUser._id}`,
      html: `<p style="font-family:sans-serif;">Hello <b>${name}</b>, please verify your email by clicking on the link below:</p>
             <a style="font-family:sans-serif;" href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/verifyemail/${verifyToken}">Verify Email</a>`,
    });

    const response = NextResponse.json({
      success: true,
      message:"User registered successfully",
      data: { name, email },
    });

    return response;
  } catch (err) {
    return errorHandler(err)
  }
}

