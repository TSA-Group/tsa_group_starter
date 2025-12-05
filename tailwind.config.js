/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: false, // disables DaisyUI's default light/dark so your CSS wins
  },
};
