import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "File Translator",
  description: "Translate PDF files words to Arabic",
  keywords: ["PDF", "Translation", "Arabic"],
  creator: "Mahmud Alzhrawy",
  openGraph: {
    title: "File Translator",
    description: "Translate PDF files words to Arabic",
    url: "https://z-translator.vercel.app",
    siteName: "File Translator",
    images: [
      {
        url: "./favicon.ico",
        alt: "File Translator",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
