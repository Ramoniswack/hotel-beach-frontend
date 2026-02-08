/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hotel-gold': '#c2a661',
        'hotel-dark': '#1a1a1a',
      },
    },
  },
  plugins: [],
};
