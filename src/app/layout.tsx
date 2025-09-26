import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Investment Assistant",
  description: "Professional AI-powered investment assistant for S&P 500 stock analysis and portfolio optimization",
  keywords: "investment, stocks, AI, portfolio, S&P 500, financial analysis",
  authors: [{ name: "AI Investment Assistant" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ResponsiveLayout>
          {children}
        </ResponsiveLayout>
      </body>
    </html>
  );
}
