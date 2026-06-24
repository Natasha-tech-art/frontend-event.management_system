/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stage: {
          night: '#0B0B14',
          panel: '#15131F',
        },
        ticket: {
          red: '#FF2E63',
          violet: '#7C3AED',
          cyan: '#22D3EE',
          amber: '#FBBF24',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}