const theme = require("@fili/tokens/tailwind");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "../../packages/react/src/**/*.{ts,tsx}", "../../packages/charts/src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: { extend: { ...theme } },
  plugins: [],
};
