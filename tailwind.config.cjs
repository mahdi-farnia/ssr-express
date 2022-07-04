/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      screens: {
        mm: '412px'
      },
      colors: {
        system: {
          light: '#f7f7f7',
          blue: 'rgb(14, 122, 254)',
          dark: '#1f1f1f'
        },
        input: {
          light: '#ffffff',
          dark: '#333333'
        },
        placeholder: {
          light: '#ccc',
          dark: '#a0a0a0'
        }
      }
    }
  },
  plugins: []
};
