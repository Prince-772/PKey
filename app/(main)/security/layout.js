export default function Layout({ children }) {
  return <>{children}</>;
}

export const metadata = {
  title: "Security Architecture & Zero-Knowledge | PKey",
  description:
    "Explore the security protocols behind PKey. Learn how AES-256 client-side encryption and Zero-Knowledge architecture keep your passwords unreadable even to us.",
  keywords: [
    "Security Architecture",
    "AES-256",
    "Zero-Knowledge Protocol",
    "Open Source Security",
    "Client-side Encryption",
    "PKey Security",
  ],
  openGraph: {
    title: "How PKey Protects Your Data | Security Architecture",
    description:
      "Deep dive into our encryption standards. We don't store your master password, and we don't have access to your vault.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PKey Security Architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PKey Security | Built for Privacy",
    description: "Understanding AES-256 and Zero-Knowledge encryption in PKey.",
    images: ["/og.png"],
  },
};
