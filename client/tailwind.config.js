/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf8ed",
          100: "#c7efcd",
          500: "#1B9425", // Primary Brand Accent
          600: "#157e1f",
          700: "#106318",
          dark: "#0a400f",
        },
        surface: "#F8F9FA",
        slateText: "#1E293B",
        borderSoft: "#E2E8F0",
      },
    },
  },
  plugins: [],
}
