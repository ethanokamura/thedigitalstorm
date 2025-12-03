import type { Metadata } from "next";
import { Geist, Geist_Mono, Luckiest_Guy } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const luckyGuy = Luckiest_Guy({
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DigitalStorm",
  description: "Digital Safety in Current Era",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${luckyGuy.variable} antialiased`}
      >
        <div className="hidden opacity-50 sm:block fixed inset-0 z-0 pointer-events-none animate-gradient-shift">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(136,117,224,0.15)_0%,transparent_50%)]
                      md:bg-[radial-gradient(ellipse_at_50%_0%,rgba(136,117,224,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_80%_50%,rgba(112,212,224,0.1)_0%,transparent_50%),radial-gradient(ellipse_at_20%_80%,rgba(216,150,255,0.1)_0%,transparent_50%)]"
          />
        </div>
        {children}
      </body>
    </html>
  );
}
