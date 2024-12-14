/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'primary': '#6f8b8d;',
      'mypink': '#FF6666',
      'secondary': '#BAD3D4',
      'lightgray': '#ededed',
      'gray': '#D2D2D2',
      'white': '#ffffff',
      'vegetables': '#b2d9b0',
      'fruits': '#f3f4b3',
      'meat': '#ff8585',
      'dairy': '#bcb2a1',
      'grains': '#FFC3A2',
      'red' : '#FF0000',
    },
    fontSize: {
      'amount': '0.85rem',
      'sm': '1.2rem',
    },
  },
  plugins: [],
}

