module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: 'Raleway, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    },
    extend: {
      backgroundImage: theme => ({
        'caret': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3e%3cpath fill=\'none\' stroke=\'%23343a40\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M2 5l6 6 6-6\'/%3e%3c/svg%3e")',
        'caret-light': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3e%3cpath fill=\'none\' stroke=\'%234b5563\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M2 5l6 6 6-6\'/%3e%3c/svg%3e")',
        'radio-active': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'-4 -4 8 8\'%3e%3ccircle r=\'2\' fill=\'%23fff\'/%3e%3c/svg%3e")',
        'check-active': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\'%3e%3cpath fill=\'none\' stroke=\'%23fff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'3\' d=\'M6 10l3 3l6-6\'/%3e%3c/svg%3e")',
        'check-indeterminate': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\'%3e%3cpath fill=\'none\' stroke=\'%23fff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'3\' d=\'M6 10h8\'/%3e%3c/svg%3e")',
      }),
      backgroundSize: {
        '4x3': '1rem 0.75rem',
      },
      backgroundPosition: {
        'right-3-center': 'right 0.75rem center',
      },
      width: {
        '108': '27rem',
        '116': '29rem',
        '120': '30rem',
      },
      minHeight: {
        'navbar': '3.625rem'
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      boxShadow: ['disabled', 'active'],
      backgroundColor: ['disabled', 'active', 'checked'],
      backgroundImage: ['checked', 'dark'],
      backgroundOpacity: ['active'],
      borderColor: ['checked'],
      textColor: ['disabled'],
      textDecoration: ['disabled'],
    },
  },
  plugins: [],
}
