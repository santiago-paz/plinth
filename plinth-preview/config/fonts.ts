import localFont from "next/font/local";

export const primaryFont = localFont({
  src: "../public/fonts/Didot.otf",
  variable: "--font-primary",
});

export const secondaryFont = localFont({
  src: "../public/fonts/Avenir LT 55 Roman.ttf",
  variable: "--font-secondary",
});
