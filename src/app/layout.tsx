import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Quraan Shareef",
    template: "%s | Quraan Shareef",
  },
  description: "Read and explore the Holy Quran with translations and audio recitations",
  keywords: ["Quran", "Islam", "Holy Book", "Surah", "Ayah", "Recitation"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name or Organization",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quran-shareef.pages.dev/",
    siteName: "Quraan Shareef",
    images: [
      {
        url: "https://quran-shareef.pages.dev/quran_7337555.png", // Replace with your actual Open Graph image
        width: 1200,
        height: 630,
        alt: "Quraan Shareef",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourtwitter", // Replace with your Twitter handle
    creator: "@yourtwitter", // Replace with your Twitter handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest", // Make sure to create this file in your public folder
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
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="KEFnhFSHJewJRRzfWnTjsmHd4hkOV1_2_KF4SoGwaBY" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

