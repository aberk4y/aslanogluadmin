/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        darkbg: "#0f0f0f",
        cardbg: "#1c1c1c",
        borderc: "#2c2c2c"
      },
    },
  },
  plugins: [],
};