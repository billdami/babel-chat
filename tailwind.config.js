module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        '108': '27rem',
        '116': '29rem',
        '120': '30rem',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
