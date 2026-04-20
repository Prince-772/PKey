export default function Layout({ children }) {
  return <>{children}</>;
}

export const metadata = {
  title: "Password Strength Analyzer | PKey Security",
  description:
    "Test your password's resilience against brute-force attacks. 100% client-side, offline-capable, and zero-knowledge. Your passwords never leave your device.",
  keywords: [
    "Password Strength",
    "Brute Force Checker",
    "Security Tool",
    "zxcvbn",
    "Cybersecurity",
    "PKey Analyzer",
  ],
  openGraph: {
    title: "Is Your Password Truly Secure? | PKey Analyzer",
    description:
      "Check the estimated time to crack your password using standard or supercomputer attacks. 100% private.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PKey Password Strength Analyzer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Strength Test | PKey",
    description:
      "Type your password, even offline. See how long a hacker would take to crack it.",
    images: ["/og.png"],
  },
};
