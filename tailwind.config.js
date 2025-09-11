/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Manolo': ['Manolo Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
