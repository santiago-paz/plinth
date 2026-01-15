import type { Metadata } from "next";
import localFont from "next/font/local";
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
  title: "Pedro Peña",
  description: "",
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
            <h2 className="text-xl font-medium">Solo versión de escritorio</h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Esta experiencia está diseñada para ser visualizada en pantallas grandes. 
              Por favor, accede desde un ordenador para ver el contenido correctamente.
            </p>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
