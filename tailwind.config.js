/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minWidth: {
        '64': '16rem',
        '128': '32rem',
        '256': '64rem',
      },
      minHeight: {
        '32': '8rem',
        '64': '16rem',
        '128': '32rem',
        '256': '64rem',
      }
    },
  },
  plugins: [],
}