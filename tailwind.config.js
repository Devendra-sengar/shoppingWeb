/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F7F3',
        surface: '#FFFFFF',
        primary: '#20221F',
        secondary: '#71736D',
        sand: {
          light: '#DFD6CB',
          DEFAULT: '#C8B8A5',
          dark: '#A99680',
        },
        olive: {
          light: '#7A8B73',
          DEFAULT: '#5B6955',
          dark: '#414D3C',
        },
        border: '#E5E3DD',
        error: '#B54848',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      aspectRatio: {
        '3/4': '3 / 4',
      },
      letterSpacing: {
        'luxury': '0.15em',
        'subtle': '0.05em',
      },
      boxShadow: {
        'subtle': '0 2px 12px -2px rgba(32, 34, 31, 0.05)',
        'lift': '0 12px 30px -4px rgba(32, 34, 31, 0.08)',
        'drawer': '-4px 0 24px -2px rgba(32, 34, 31, 0.1)',
      },
      maxWidth: {
        'store': '1440px',
      }
    },
  },
  plugins: [],
}
