/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',   // ← enables dark: variant via class on <html>
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // "cosmic" repurposed as warm cream tones
        cosmic: {
          900: '#fdf6ee',   // cream (was black)
          800: '#faebd7',   // antique white
          700: '#f5deb3',   // wheat
          600: '#f0d0a0',   // warm sand
        },
        // "nebula" repurposed as rose-pink (was purple)
        // All .btn-primary, active states, links use nebula-* — one change covers all
        nebula: {
          400: '#e87a8c',   // soft rose (was #a78bfa purple)
          500: '#d4627a',   // rose (was #8b5cf6 purple)
          600: '#be4a68',   // deep rose (was #7c3aed purple)
        },
        // "aurora" repurposed as warm amber (was green)
        aurora: {
          400: '#f4a84a',   // warm amber (was #34d399 green)
          500: '#e8943a',   // deep amber (was #10b981 green)
        },
        // "stardust" stays as golden yellow — still fits warm theme
        stardust: {
          300: '#fcd34d',
          400: '#fbbf24',
        },
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
        'slide-up':   'slideUp 0.5s ease-out',
        'fade-in':    'fadeIn 0.6s ease-out',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px #e87a8c,  0 0 10px #e87a8c' },
          '100%': { boxShadow: '0 0 20px #e87a8c, 0 0 40px #e87a8c, 0 0 60px #e87a8c' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}