/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: 'var(--brand-ink)',
          surface: 'var(--brand-surface)',
          primary: 'var(--brand-primary)',
          'primary-soft': 'var(--brand-primary-soft)',
          accent: 'var(--brand-accent)',
          'accent-soft': 'var(--brand-accent-soft)'
        },
        welcome: {
          bg: 'var(--welcome-bg)'
        }
      },
      fontFamily: {
        brand: 'var(--font-brand)'
      }
    }
  },
  plugins: []
};
