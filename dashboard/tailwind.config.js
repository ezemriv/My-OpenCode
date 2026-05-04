/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'bg-primary': '#0f0f0f',
        'bg-secondary': '#1a1a1a',
        'bg-card': '#1e1e1e',
        'border-color': '#2a2a2a',
        'text-primary': '#e0e0e0',
        'text-secondary': '#a0a0a0',
        'accent-purple': '#a855f7',
        'accent-blue': '#3b82f6',
        'accent-green': '#22c55e',
        'accent-yellow': '#eab308',
        'accent-red': '#ef4444',
      }
    },
  },
  plugins: [],
}