/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#F8F6F2',
        card: '#FFFFFF',
        'primary-text': '#1D2235',
        'secondary-text': '#667085',
        brand: '#6E6AE8',
        'sage-green': '#9DB8A1',
        'accent-yellow': '#F4C95D',
        'sleep-blue': '#AFCBFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'button': '16px',
        'pill': '32px',
      },
      boxShadow: {
        'card': '0px 4px 16px rgba(0, 0, 0, 0.06)',
        'button': '0px 2px 8px rgba(110, 106, 232, 0.25)',
      },
    },
  },
  plugins: [],
}
