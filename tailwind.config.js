module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
      },
      backgroundColor: {
        'note-yellow': '#fef08a',
        'note-blue': '#bfdbfe',
        'note-pink': '#fbcfe8',
        'note-green': '#bbf7d0',
        'note-purple': '#e9d5ff',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
