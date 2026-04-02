/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "aqua-primary": "#00CED1",
        "aqua-dark": "#0B132B",
        "aqua-surface": "#1C2541",
        "aqua-glow": "rgba(0, 206, 209, 0.3)",
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
