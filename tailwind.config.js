/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem'
    },
    fontFamily: {
      sans: ['Titillium Web', 'sans-serif']
    },
    colors: {
      magenta: {
        DEFAULT: 'rgb(var(--color-magenta))',
        90: 'rgba(var(--color-magenta) / 0.9)',
        70: 'rgba(var(--color-magenta) / 0.7)',
        50: 'rgba(var(--color-magenta) / 0.5)',
        30: 'rgba(var(--color-magenta) / 0.3)'
      },
      green: {
        DEFAULT: 'rgb(var(--color-green))',
        90: 'rgba(var(--color-green) / 0.9))',
        70: 'rgba(var(--color-green) / 0.7))',
        50: 'rgba(var(--color-green) / 0.5))',
        30: 'rgba(var(--color-green) / 0.3))'
      },
      'dark-gray': 'rgb(var(--color-dark-gray))',
      gray: 'rgb(var(--color-gray))',
      'light-gray': 'rgb(var(--color-light-gray))',
      white: 'rgb(var(--color-white) / <alpha-value>)',
      black: 'rgb(var(--color-black) / <alpha-value>)'
    },
    extend: {}
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        '.default-grid': {
          display: 'grid',
          'grid-template-columns': 'repeat(12, minmax(0, 1fr))',
          'column-gap': theme('spacing.3'),
          // 'grid-template-rows': 'minmax(0, auto)',
          [`@media only screen and (min-width: ${theme('screens.sm')})`]: {
            'column-gap': theme('spacing.4')
          }
        }
      })
    })
  ]
}
