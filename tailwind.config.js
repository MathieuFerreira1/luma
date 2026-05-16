/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand colors from Luma chart
        background: '#FFFFFF',
        card: '#F5F5F7',
        'primary-text': '#1D2235',
        'secondary-text': '#667085',
        brand: '#6E6AE8',
        'brand-light': '#8A84F0',
        'brand-glow': 'rgba(110, 106, 232, 0.3)',
        // Category colors
        'sleep-blue': '#AFCBFF',
        'nutrition-green': '#9DB8A1',
        'brain-yellow': '#F4C95D',
        'movement-orange': '#E8A87C',
        'longevity-purple': '#B8A9C9',
        // Status colors
        success: '#9DB8A1',
        warning: '#F4C95D',
        locked: '#D0D5DD',
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
        'glow': '0px 0px 20px rgba(110, 106, 232, 0.4)',
      },
    },
  },
  plugins: [],
}
