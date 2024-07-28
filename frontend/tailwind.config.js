/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        boxShadow: {
          'red': 'rgba(255, 0, 0, 0.8) 0px 1px 4px'
        }
      },
    },
    plugins: [],
  }
  
  