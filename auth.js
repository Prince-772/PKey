import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const bcrypt = require("bcryptjs");

//local imports
import ConnectToDB from "./lib/dbConnect";
import UserModel from "./models/User";
import { WelcomeHtml } from "./lib/html/Emails";
import { sendEmail } from "./lib/managers/mailManager";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials || {};

          // Basic validation
          if (!email) throw new Error("Email is required");
          if (!password) throw new Error("Password is required");

          await ConnectToDB();

          const user = await UserModel.findOne({ email }).select(
            "email name password isVerified version salt loginAttempts loginLockUntil",
          );

          if (!user) throw new Error("Invalid email or password");

          if (user.loginLockUntil && user.loginLockUntil < new Date()) {
            user.loginAttempts = 0;
            user.loginLockUntil = null;
          }

          // Check if account is locked
          if (user.loginLockUntil && user.loginLockUntil > new Date()) {
            throw new Error(
              "Account locked due to too many failed attempts. Try again aftre 30 minutes.",
            );
          }

          // OAuth account
          if (!user.password) {
            throw new Error(
              "This account uses a different sign-in method. Please use that.",
            );
          }

          // Compare password
          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            user.loginAttempts = (user.loginAttempts || 0) + 1;

            if (user.loginAttempts >= 5) {
              user.loginLockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
            }

            await user.save();
            throw new Error("Invalid email or password");
          }

          if (!user.isVerified) {
            throw new Error("EMAIL_NOT_VERIFIED");
          }

          user.loginAttempts = 0;
          user.loginLockUntil = null;
          await user.save();

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            version: user.version,
            salt: user.salt,
          };
        } catch (err) {
          throw new Error(err.message || "Authentication failed");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 15 * 60,
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account.provider === "credentials") return true;

      if (account.provider === "google" || account.provider === "github") {
        try {
          const { email, name } = user;
          await ConnectToDB();
          const alreadyExist = await UserModel.findOne({ email });

          if (alreadyExist) {
            if (alreadyExist.password) {
              throw new Error("Please sign in using your password.");
            }
          } else {
            const newUser = new UserModel({
              name,
              email,
              isVerified: true,
            });
            await newUser.save();

            await sendEmail({
              to: email,
              subject: "Welcome to PKey! 🚀 Your Secure Vault is Ready",
              text: `Hello ${name || "User"}, welcome to PKey! Your secure, zero-knowledge vault is ready...`,
              html: WelcomeHtml(name || "User"),
            });
          }
          return true;
        } catch (error) {
          console.error("Sign-in Error:", error);
          throw error;
        }
      }
      return false;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user && account) {
        token.id = user.id || user._id;
        token.email = user.email;
        token.name = user.name;
        token.provider = account.provider;

        if (account.provider !== "credentials") {
          await ConnectToDB();
          const dbUser = await UserModel.findOne({ email: user.email }).select(
            "version salt",
          );
          if (dbUser) {
            token.version = dbUser.version;
            token.salt = dbUser.salt;
          }
        } else {
          token.version = user.version;
          token.salt = user.salt;
        }
      }
      if (trigger === "update" && session?.user) {
        token.version = session.user.version;
        token.salt = session.user.salt;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.provider = token.provider;
        session.user.version = token.version;
        session.user.salt = token.salt;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
