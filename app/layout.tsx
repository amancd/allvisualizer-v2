import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "90 DSA Patterns – Notes & Code Templates | AllVisualizer",
  description: "All 90 DSA patterns with notes, explanations, and ready-to-use Python code templates. Two Pointers, Sliding Window, Binary Search, Trees, Graphs, Dynamic Programming and more.",
  keywords: ["dsa patterns", "coding interview patterns", "leetcode patterns", "algorithm templates", "two pointers", "sliding window", "dynamic programming", "data structures notes", "coding interview prep"],
  authors: [{ name: "AllVisualizer" }],
  openGraph: {
    title: "90 DSA Patterns – Notes & Code Templates",
    description: "All 90 DSA patterns with notes and ready-to-use code templates for coding interviews.",
    url: "https://allvisualizer.com",
    siteName: "AllVisualizer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AllVisualizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "90 DSA Patterns – Notes & Code Templates",
    description: "All 90 DSA patterns with notes and ready-to-use code templates for coding interviews.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1582736832298841"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
