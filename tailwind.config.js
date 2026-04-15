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
          pink: 'var(--kawaii-pink)',
          sakura: 'var(--kawaii-sakura)',
          lilac: 'var(--kawaii-lilac)',
          mint: 'var(--kawaii-mint)',
          blue: 'var(--kawaii-blue)',
          cream: 'var(--kawaii-cream)',
          bg: 'var(--kawaii-bg)',
          earth: 'var(--kawaii-earth)',
          earthLight: 'var(--kawaii-earthLight)',
          yellow: 'var(--kawaii-yellow)'
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
