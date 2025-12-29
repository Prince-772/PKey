import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import MasterPassProvider from "@/context/MasterPassword";
import { Toaster } from "react-hot-toast";
// import NavBar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });

export const metadata = {
  title: "PKey - Secure Password Manager",
  description:
    "PKey is a secure and easy-to-use password manager by PK. Protect your passwords with advanced encryption.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", type: "image/png" },
      { url: "/favicon-16x16.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
    android: [
      { url: "/android-chrome-192x192.png", type: "image/png" },
      { url: "/android-chrome-512x512.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "PKey - Secure Password Manager",
    description: "Store and manage your passwords securely with PKey. Privacy-first, open-source, and reliable.",
    url: "https://p-key.vercel.app",
    siteName: "PKey",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PKey Logo and preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PKey - Secure Password Manager",
    description: "Store and manage your passwords securely with PKey.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <AuthProvider>
          <MasterPassProvider>{children}</MasterPassProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
