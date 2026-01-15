import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        "project-title": "var(--project-title-color)",
      },
      fontFamily: {
        sans: ["var(--font-primary)", "sans-serif"],
        serif: ["var(--font-secondary)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
