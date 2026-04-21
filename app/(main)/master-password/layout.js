export default function Layout({ children }) {
  return <>{children}</>;
}

export const metadata = {
  title: "Master Password Guide | PKey Security",
  description:
    "Learn about PKey's Zero-Knowledge architecture and how your Master Password keeps your vault mathematically uncrackable with memory-hard Argon2id and AES-256-GCM encryption.",
  keywords: [
    "Zero-Knowledge Architecture",
    "Password Security",
    "Argon2id",
    "AES-256-GCM",
    "HKDF Key Isolation",
    "WebAssembly Cryptography",
    "Client-Side Encryption",
    "PKey Vault",
    "Master Password",
  ],
  openGraph: {
    title: "Mastering Your Master Password | PKey",
    description:
      "Your data belongs only to you. Understand how PKey secures your digital world.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PKey Security Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PKey | Zero-Knowledge Security",
    description: "Why PKey doesn't have a 'Forgot Password' button.",
    images: ["/og.png"],
  },
};
