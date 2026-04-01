/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f6f9fc", // Stripe's signature subtle slate background
        surface: "#ffffff", // Pure white for floating cards
        border: "#e2e8f0", // Very soft gray boundaries
        primary: "#635BFF", // Stripe bold Indigo
        primaryHover: "#4f46e5", // Slightly deeper indigo
        textMain: "#0f172a", // Very dark slate for headers
        textDim: "#475569", // Medium slate for secondary text
        easy: "#10b981", // Vibrant, clean green
        medium: "#f59e0b", // Warm amber
        hard: "#ef4444", // Bright red
      },
      boxShadow: {
        'stripe': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'stripe-focus': '0 0 0 3px rgba(99, 91, 255, 0.25)',
      },
      fontFamily: {
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
