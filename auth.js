import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const bcrypt = require("bcrypt");

//local imports
import ConnectToDB from "./lib/dbConnect";
import UserModel from "./models/User";

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
          const { email, password } = credentials;

          // validation
          if (!email) throw new Error("Email is required");
          if (!password) throw new Error("Password is required");

          // check if user exists in the database
          await ConnectToDB();
          const findUser = await UserModel.findOne({ email }).select(
            "email name password isVerified"
          );

          if (!findUser) throw new Error("No user found with this email");

          if (!findUser.password)
            throw new Error(
              "This account was created using a different sign-in method. Please use the same method to log in."
            );

          const isMatch = await bcrypt.compare(password, findUser.password);
          if (!isMatch) throw new Error("Invalid Password");

          if (!findUser.isVerified) {
            throw new Error("EMAIL_NOT_VERIFIED");
          }
          

          // if user exists, return user object
          return {
            id: findUser._id.toString(),
            name: findUser.name,
            email: findUser.email,
          };
        } catch (err) {
          throw new Error(err || "Authentication failed");
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
      if (account.provider === "credentials") {
        return true;
      } else if (
        account.provider === "google" ||
        account.provider === "github"
      ) {
        try {
          const { email, name } = user;
          await ConnectToDB();
          const alreadyExist = await UserModel.findOne({ email });
          if (!alreadyExist) {
            const newUser = new UserModel({
              name,
              email,
              isVerified: true,
            });
            await newUser.save();
          }
          return true;
        } catch (error) {
          throw new Error(error.message || "Error while creating user");
        }
      } else return false;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
};

export default NextAuth(authOptions);
