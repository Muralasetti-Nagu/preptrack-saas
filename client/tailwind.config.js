/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f1115",
        surface: "#1a1d24",
        border: "#2b303b",
        primary: "#3b82f6", // blue-500
        primaryHover: "#2563eb", // blue-600
        textMain: "#f8fafc", // slate-50
        textDim: "#94a3b8", // slate-400
        easy: "#22c55e", // green-500
        medium: "#eab308", // yellow-500
        hard: "#ef4444", // red-500
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
