import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { adsenseClient } from "@/config/ads";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
});

export const metadata: Metadata = {
  title: "AllVisualizer - Interactive Learning Through Visualization",
  description: "Learn Data Structures, Algorithms, Mathematics, Physics, and AI through interactive visualizations.",
  keywords: ["DSA visualizer", "algorithm visualization", "data structures", "interactive learning", "programming education"],
  authors: [{ name: "AllVisualizer Team" }],
  openGraph: {
    title: "AllVisualizer - Interactive Learning Through Visualization",
    description: "Master complex concepts through engaging visual learning",
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
    title: "AllVisualizer - Interactive Learning Through Visualization",
    description: "Master complex concepts through engaging visual learning",
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
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased bg-canvas text-ink">
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
