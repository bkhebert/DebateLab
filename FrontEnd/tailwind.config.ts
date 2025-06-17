import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    safelist: [
    { pattern: /bg-(red|blue|green|yellow|pink|purple|indigo|gray|black|white|zinc|slate|orange|lime|emerald|teal|cyan|fuchsia|violet|rose)-(50|100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /text-(red|blue|green|yellow|pink|purple|indigo|gray|black|white|zinc|slate|orange|lime|emerald|teal|cyan|fuchsia|violet|rose)-(50|100|200|300|400|500|600|700|800|900|950)/ },
    'bg-gradient-to-br',
    'from-red-500',
    'via-yellow-500',
    'via-green-500',
    'to-purple-500'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {    
            covenantDark: '#1a132d',
    covenantLight: '#3a2a5d',
    covenantAccent: '#7c4dff',
    neonBlue: '#00e5ff',
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
      boxShadow: {
    glow: '0 0 10px #7c4dff',
  },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        rainbow: {
          "0%": { "background-position": "0%" },
          "100%": { "background-position": "200%" },
        },
        ripple: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        marquee: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(-100% - var(--gap)))",
          },
        },
        "marquee-vertical": {
          from: {
            transform: "translateY(0)",
          },
          to: {
            transform: "translateY(calc(-100% - var(--gap)))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        rainbow: "rainbow var(--speed, 4s) infinite linear",
        ripple: "ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite",
        "spin-slow": "spin 1s linear infinite",
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        marquee: "marquee var(--duration) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration) infinite linear",
      },
      fontFamily: {
        mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        exo: ['"Exo 2"', 'ui-sans-serif', 'system-ui'],
         sans: ['Orbitron', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [animate],
} satisfies Config