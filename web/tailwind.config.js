/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'spotify-dark': '#121212',
        'spotify-dark-elevated': '#1a1a1a',
        'spotify-highlight': '#1ed760',
        'spotify-purple': '#7f5af0',
        'spotify-blue': '#2d46b9',
        'spotify-pink': '#f72585',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-blue': 'linear-gradient(135deg, #2d46b9 0%, #00d4ff 100%)',
        'gradient-pink': 'linear-gradient(135deg, #f72585 0%, #b5179e 100%)',
        'gradient-green': 'linear-gradient(135deg, #1ed760 0%, #12a150 100%)',
        'gradient-orange': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)',
      },
    },
  },
  plugins: [],
}


