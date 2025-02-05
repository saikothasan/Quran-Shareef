import "@/styles/globals.css"
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
    url: "https://www.yourquranapp.com/",
    siteName: "Quraan Shareef",
    images: [
      {
        url: "https://www.yourquranapp.com/og-image.jpg", // Replace with your actual Open Graph image
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
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest", // Make sure to create this file in your public folder
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'