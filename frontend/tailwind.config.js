/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Añadimos la fuente personalizada
        cinzel: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
}
