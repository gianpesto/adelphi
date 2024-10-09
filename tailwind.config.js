/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin'

export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    container: {
      center: true,
      padding: '2rem'
    },
    fontFamily: {
      sans: ['Titillium Web', 'sans-serif']
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
