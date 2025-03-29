/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable dark mode via class strategy
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        "3xl": "2000px", // Custom breakpoint at 2000px
      },
    },
  },
  plugins: [],
};
