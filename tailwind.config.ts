import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: 'hsl(220 60% 50%)',
          dark: 'hsl(220 60% 40%)',
        },
        accent: {
          DEFAULT: 'hsl(30 80% 50%)',
        },
        background: 'hsl(220 20% 95%)',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
export default config
