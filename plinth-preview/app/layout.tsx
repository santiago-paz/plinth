import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { primaryFont, secondaryFont } from "@/config/fonts";
import "./globals.css";

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
        className={`${primaryFont.variable} ${secondaryFont.variable} antialiased select-none`}
      >
        {children}
      </body>
    </html>
  );
}
