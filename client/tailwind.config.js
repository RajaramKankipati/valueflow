/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f8',
          100: '#d9ebee',
          200: '#b7d9e0',
          300: '#89bfcb',
          400: '#6B8E96',
          500: '#557278',
          600: '#475f65',
          700: '#3d4f54',
          800: '#364347',
          900: '#31393d',
        },
        secondary: {
          50: '#f5f9f7',
          100: '#e7f1ed',
          200: '#d1e4dc',
          300: '#afd0c3',
          400: '#9FB8AD',
          500: '#79978c',
          600: '#607a71',
          700: '#4f635c',
          800: '#42514c',
          900: '#394440',
        },
        accent: {
          50: '#fef2f3',
          100: '#fde6e8',
          200: '#fbd0d6',
          300: '#f8aab4',
          400: '#E8B4B8',
          500: '#ed536d',
          600: '#da2f4d',
          700: '#b71e3f',
          800: '#991c3a',
          900: '#821b37',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
