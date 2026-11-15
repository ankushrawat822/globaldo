import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        pine: 'var(--pine)',
        sun: 'var(--sun)',
        stone: 'var(--stone)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
      },
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.4' }],
        base: ['1rem', { lineHeight: '1.55' }],
        lg: ['1.125rem', { lineHeight: '1.55' }],
        xl: ['1.375rem', { lineHeight: '1.35' }],
        '2xl': ['1.75rem', { lineHeight: '1.25' }],
        '4xl': ['2.5rem', { lineHeight: '1.15' }],
      },
      borderRadius: {
        input: '6px',
        button: '6px',
        row: '10px',
      },
      boxShadow: {
        popover: '0 8px 24px rgba(29, 42, 39, 0.12)',
        dialog: '0 12px 32px rgba(29, 42, 39, 0.16)',
      },
      maxWidth: {
        page: '1100px',
        prose: '70ch',
      },
      spacing: {
        '2': '8px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config