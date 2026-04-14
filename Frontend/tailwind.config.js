/** @type {import('tailwindcss').Config} */
export default {
  // Esta es la línea clave para que el botón funcione
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Aquí podrías añadir colores personalizados para tu modo oscuro si quisieras
    },
  },
  plugins: [],
}