/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#E74C3C !important',
        'secondary-btn': '#FFFFFF !important',
        'secondary-text': '#000000 !important',
      },
    },
  },
  plugins: [],
}