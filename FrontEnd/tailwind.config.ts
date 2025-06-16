import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

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
      primarydark: '#1E142E',
      primarylight: '#A128E3',
      primaryglow: '#D8ABF4',
      cstmbackground: '#2b263d',
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
          borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {height: "0"},
          to: {height: "var(--radix-accordion-content-height)"},
        },
        "accordion-up": {
          from: {height: "var(--radix-accordion-content-height)"},
          to: {height: "0"},
        },
        rainbow: {
          "0%": {"background-position": "0%"},
          "100%": {"background-position": "200%"},
        },
        ripple: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
      },
    fontFamily: {
         mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
         exo: ['"Exo 2"', 'ui-sans-serif', 'system-ui']
      },
            animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        rainbow: "rainbow var(--speed, 4s) infinite linear",
        ripple: "ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite",
        "spin-slow": "spin 1s linear infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config