import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{vue,ts,js}',
    './app/components/**/*.{vue,ts,js}',
    './app/pages/**/*.{vue,ts,js}',
    './app/layouts/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          600: '#0d9488',
          700: '#0f766e',
          50: '#f0fdfa',
        },
        blue: {
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
