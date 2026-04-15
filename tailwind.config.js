/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kawaii: {
          pink: '#FFD1DC',
          sakura: '#FFB7C5',
          lilac: '#E0BBE4',
          mint: '#957DAD',
          blue: '#D291BC',
          cream: '#FEC8D8',
          bg: '#FFF5F8',
          earth: '#4A3525',
          earthLight: '#7A593E',
          yellow: '#FFF3CD'
        }
      },
      fontFamily: {
        sticker: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        cursive: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'sticker': '0 4px 6px rgba(0,0,0,0.1)',
        'glow': '0 0 15px rgba(255, 183, 197, 0.4)',
        'soft': '0 10px 40px rgba(0,0,0,0.03)',
      },
      borderRadius: {
        'ultra': '40px',
      }
    },
  },
  plugins: [],
}
