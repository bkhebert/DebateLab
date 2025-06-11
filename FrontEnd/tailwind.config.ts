import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
      primary: '#6813F1',
      primarydark: '#21133C',
      primarylight: '#A128E3',
      cstmbackground: '#191229',
      cstmdarkaccent: '#412476',
      cstmgold: '#FFD700',
      cstmgray: '#4A4E69',
      cstmgreen: '#A8FF60',
      cstmred: '#FF4F58',
      cstmblack: '#111016',
      cstmneutral: '#E0E0E3',
      cstmblue: '#00D9FF',
      cstmwhite: '#F7F6F9', 
    },
    fontFamily: {
         mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
         exo: ['"Exo 2"', 'ui-sans-serif', 'system-ui']
      },
    },
  },
  plugins: [],
} satisfies Config