/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'], 
      },
      colors: {
        spaceBlack: '#0b0c10', 
      },
    },
  },
  plugins: [],
}