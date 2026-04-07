/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2C2C2C'
        },
        accent: '#3B82F6' // Modern blue accent
      }
    },
  },
  plugins: [],
}
