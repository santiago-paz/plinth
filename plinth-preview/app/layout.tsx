import type { Metadata } from "next";
import localFont from "next/font/local";
import { brandConfig } from "@/config/brand";
import "./globals.css";

const avenir = localFont({
  src: "../public/fonts/Avenir LT 55 Roman.ttf",
  variable: "--font-avenir",
});

const didot = localFont({
  src: "../public/fonts/Didot.otf",
  variable: "--font-didot",
});

export const metadata: Metadata = {
  title: brandConfig.metadata.title,
  description: brandConfig.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${avenir.variable} ${didot.variable} antialiased select-none`}
      >
        {/* Mobile/Tablet blocker */}
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-8 text-center lg:hidden">
          <div className="max-w-md space-y-4">
            <h2 className="text-xl font-medium">{brandConfig.messages.desktopOnly.title}</h2>
            <p className="text-sm opacity-80 leading-relaxed">
              {brandConfig.messages.desktopOnly.message}
            </p>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
