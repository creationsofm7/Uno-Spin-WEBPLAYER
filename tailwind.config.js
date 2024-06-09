/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spinGrow: {
          '0%': { transform: 'scale(0) rotate(0deg)' },
          '100%': { transform: 'scale(1) rotate(360deg)' },
        },
      },
      fontFamily: {
        bangers: ["Bangers", "ui-sans-serif", "system-ui"],
      },
    },

  },
  plugins: [],
};
