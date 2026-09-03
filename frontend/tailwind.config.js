/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F7F1DE',
        secondary: '#B0BA99',
        accent: '#9D6638',
        dark: '#4E220F',
        contrast: '#1A1A1A',
        gold: '#C5A880',
      },
      fontFamily: {
        sans: ['var(--font-assistant)', 'Assistant', 'sans-serif'],
        body: ['var(--font-assistant)', 'Assistant', 'sans-serif'],
        heading: ['var(--font-assistant)', 'Assistant', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(78, 34, 15, 0.07)',
        'glass-lg': '0 8px 32px 0 rgba(78, 34, 15, 0.15)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4)',
        'glass-border': '0 0 0 1px rgba(255, 255, 255, 0.2)',
        'glow': '0 0 40px rgba(157, 102, 56, 0.15)',
        'glow-lg': '0 0 80px rgba(157, 102, 56, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
