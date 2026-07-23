import NextAuth from "next-auth";
import { after } from "next/server";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const bcrypt = require("bcryptjs");

//local imports
import ConnectToDB from "./lib/dbConnect";
import UserModel from "./models/User";
import { accountTemporarilyLockedHtml, WelcomeHtml } from "./lib/html/Emails";
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
          console.log(email, password);

          // Basic validation
          if (!email) throw new Error("Email is required");
          if (!password) throw new Error("Password is required");
          if (password.length < 6)
            throw new Error("Invalid email or password");

          await ConnectToDB();

          const user = await UserModel.findOne({ email }).select(
            "email name password isVerified version provider salt loginAttempts loginLockUntil",
          );

          if (!user) {
            // Dummy hash
            await bcrypt.compare(
              password,
              "$2b$10$DummyHashForTimingConsistencyOnly",
            );
            throw new Error("Invalid email or password");
          }

          // OAuth account
          if (user.provider !== "credentials") {
            await bcrypt.compare(
              password,
              "$2b$10$DummyHashForTimingConsistencyOnly",
            );
            throw new Error("Invalid email or password");
          }

          if (user.loginLockUntil && user.loginLockUntil < new Date()) {
            user.loginAttempts = 0;
            user.loginLockUntil = null;
          }

          // Check if account is locked
          if (user.loginLockUntil && user.loginLockUntil > new Date()) {
            await bcrypt.compare(
              password,
              "$2b$10$DummyHashForTimingConsistencyOnly",
            );
            throw new Error("Invalid email or password");
          }

          // Compare password
          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            const updatedUser = await UserModel.findOneAndUpdate(
              { _id: user._id },
              { $inc: { loginAttempts: 1 } },
              { new: true },
            );

            if (updatedUser.loginAttempts >= 5) {
              const lockResult = await UserModel.findOneAndUpdate(
                { _id: user._id, loginLockUntil: null },
                { loginLockUntil: new Date(Date.now() + 30 * 60 * 1000) },
                { new: true },
              );

              if (lockResult) {
                after(async () => {
                  try {
                    await sendEmail({
                      to: user.email,
                      subject: "Account Temporarily Locked",
                      text: `Your account was locked due to multiple failed login attempts.`,
                      html: accountTemporarilyLockedHtml(user?.name || "User"),
                    });
                  } catch (err) {
                    console.error("Async Email Error:", err);
                  }
                });
              }
            }
            throw new Error("Invalid email or password");
          }

          if (!user.isVerified) {
            throw new Error("EMAIL_NOT_VERIFIED"); // This is not an email enumeration risk, as the correct passwrod is required to reach this block.
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
          const alreadyExist = await UserModel.findOne({ email }).select(
            "provider",
          );

          if (alreadyExist) {
            if (alreadyExist.provider === account.provider) {
              return true;
            }
            throw new Error("OAUTH_ACCOUNT_EXISTS");
          } else {
            const newUser = new UserModel({
              name,
              email,
              provider: account.provider,
              isVerified: true,
            });

            after(async () => {
              try {
                await sendEmail({
                  to: email,
                  subject: "Welcome to PKey! 🚀 Your Secure Vault is Ready",
                  text: `Hello ${name || "User"}, welcome to PKey! Your secure, zero-knowledge vault is ready...`,
                  html: WelcomeHtml(name || "User"),
                });
              } catch (err) {
                console.error("Async Email Error:", err);
              }
            });
            await newUser.save();
          }
          return true;
        } catch (error) {
          // console.error("Sign-in Error:", error);
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
