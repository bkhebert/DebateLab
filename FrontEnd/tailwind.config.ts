import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      primary: '#2E1A47',
      accent: '#FF6B35',
      secondary: '#D5CFE1',
      neutral: '#4A4E69',
      success: '#7AC74F',
      error: '#FF4F58',
      background: '#F7F6F9',
    },
    },
  },
  plugins: [],
} satisfies Config