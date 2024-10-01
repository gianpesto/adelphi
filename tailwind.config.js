/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    container: {
      center: true
    },
    fontFamily: {
      sans: ['Titillium Web', 'serif']
    },
    extend: {}
  },
  plugins: []
}
