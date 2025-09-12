/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'dark-primary': '#0f0f23',
        'dark-secondary': '#16213e',
        'dark-card': '#1a1d3a',
        'dark-card-hover': '#242857',
        'dark-accent': '#60a5fa',
        'dark-text': '#e5e7eb',
        'dark-text-secondary': '#9ca3af',
        'dark-border': '#374151',
        'dark-border-hover': '#4b5563',
        gradient: {
          start: '#667eea',
          end: '#764ba2',
        }
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-card': 'linear-gradient(145deg, #1a1d3a 0%, #16213e 100%)',
        'gradient-form': 'linear-gradient(145deg, #16213e 0%, #0f0f23 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}