/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          bg: '#F7F9FC',
          primary: '#1E3A5F',
          accent: '#D4A017',
          'primary-light': '#2A4F7A',
          'primary-dark': '#152940',
          'accent-light': '#E4B845',
          'accent-dark': '#B0850A',
          surface: '#FFFFFF',
          'surface-alt': '#F1F4F8',
          border: '#E2E8F0',
          text: '#1E293B',
          'text-muted': '#64748B',
          success: '#059669',
          warning: '#D97706',
          danger: '#DC2626',
          info: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(30, 58, 95, 0.08), 0 4px 6px -2px rgba(30, 58, 95, 0.04)',
        'card': '0 4px 20px -4px rgba(30, 58, 95, 0.1)',
        'elevated': '0 10px 40px -10px rgba(30, 58, 95, 0.15)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
