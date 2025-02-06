import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin", "bengali"] })

export const metadata: Metadata = {
  title: {
    default: "বাংলা কুরআন শরীফ | Bangla Quran Shareef",
    template: "%s | বাংলা কুরআন শরীফ",
  },
  description: "পবিত্র কুরআন শরীফের বাংলা অনুবাদ পড়ুন এবং শুনুন। আরবি টেক্সট, বাংলা অনুবাদ এবং অডিও রেসিটেশন সহ।",
  keywords: [
    "কুরআন",
    "বাংলা কুরআন",
    "ইসলাম",
    "সূরা",
    "আয়াত",
    "তিলাওয়াত",
    "Quran",
    "Bangla Quran",
    "Islam",
    "Surah",
    "Ayah",
    "Recitation",
  ],
  authors: [{ name: "Saikothasan" }],
  creator: "saikothasan",
  publisher: "Saikothasan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://quran-shareef.pages.dev/",
    siteName: "বাংলা কুরআন শরীফ",
    images: [
      {
        url: "https://quran-shareef.pages.dev/splash.png",
        width: 1200,
        height: 630,
        alt: "বাংলা কুরআন শরীফ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourtwitter",
    creator: "@yourtwitter",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "google-site-verification": "KEFnhFSHJewJRRzfWnTjsmHd4hkOV1_2_KF4SoGwaBY",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

