/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './*.{js,ts,jsx,tsx,mdx}',
    ],
  theme: {
    extend: {
      colors: {
        'primary': '#1B80BF',
        'secondary': '#F2133C',
        'success': '#238C33',
        'danger': '#A60303',
        'dark': '#0D0D0D',
        'congo-green': '#238C33',
        'congo-yellow': '#FBDE4A',
        'congo-red': '#F2133C',
      },
    },
  },
    plugins: [],
}

