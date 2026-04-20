import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import MasterPassProvider from "@/context/MasterPassword";
import { Toaster } from "react-hot-toast";
// import NavBar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });

export const metadata = {
  title: {
    default: "PKey | Your Ultimate Zero-Knowledge Vault",
    template: "%s | PKey Security",
  },
  description:
    "PKey is a privacy-first, zero-knowledge password manager. Secure your digital life with AES-256 client-side encryption. Open-source, reliable, and built for humans.",
  metadataBase: new URL("https://p-key.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", type: "image/png" },
      { url: "/favicon-16x16.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    title: "PKey | Secure Zero-Knowledge Password Manager",
    description:
      "Take control of your passwords. PKey uses military-grade encryption to ensure only you can access your data. Simple, secure, and open-source.",
    url: "https://p-key.vercel.app",
    siteName: "PKey Security",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PKey - Zero-Knowledge Password Manager Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PKey | Secure Your Digital World",
    description:
      "Zero-knowledge password storage. Your data, your keys, your privacy.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            try {
              let savedTheme = localStorage.getItem('pKey-isDark');
              let isDark = savedTheme === 'true' || 
                (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);

              if (isDark) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })();
        `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${roboto.variable} bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <AuthProvider>
          <MasterPassProvider>{children}</MasterPassProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
