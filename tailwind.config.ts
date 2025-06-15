import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'], // Explicitly keep dark mode, though new theme is dark by default
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem", // 20px padding
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'], // Maintained Inter
        headline: ['Inter', 'sans-serif'], // For titles, to be styled bold
        code: ['monospace', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))', // Cyan
          foreground: 'hsl(var(--primary-foreground))', // Black
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))', // Dark Teal
          foreground: 'hsl(var(--secondary-foreground))', // Cyan
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', // Cyan
          foreground: 'hsl(var(--accent-foreground))', // Black
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))', // AI Red
          foreground: 'hsl(var(--destructive-foreground))', // White
        },
        success: { // "REAL" indication, using Cyan
          DEFAULT: 'hsl(var(--success))', // Cyan
          foreground: 'hsl(var(--success-foreground))', // Black
        },
        border: 'hsl(var(--border))', // Cyan
        input: 'hsl(var(--input))', // Dark Gray
        ring: 'hsl(var(--ring))', // Cyan
        'dark-teal': '#011a1f', // Explicit dark teal for button backgrounds if needed
        'cyan': '#00FFFF', // Explicit cyan
        'ai-red': '#FF4C4C', // Explicit AI red
        'dark-card-bg': '#111111', // Explicit card background
      },
      borderRadius: {
        lg: 'var(--radius)', // 12px
        md: 'calc(var(--radius) - 4px)', // 8px
        sm: 'calc(var(--radius) - 6px)', // 6px
        'xl': 'calc(var(--radius) + 4px)', // 16px
        '2xl': 'calc(var(--radius) + 8px)', // 20px (matches rounded-20px)
        '20px': '20px', // Custom 20px
      },
      fontSize: {
        '4.5xl': ['2.75rem', { lineHeight: '1.2' }], // ~36pt (closer to 44px)
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        "fadeIn": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow-keyframe": { // Renamed to avoid conflict if 'pulse-glow' is used elsewhere
          '0%, 100%': {
            boxShadow: '0 0 5px 1px hsla(var(--glow-h, 0), var(--glow-s, 0%), var(--glow-l, 0%), 0.3), 0 0 10px 2px hsla(var(--glow-h, 0), var(--glow-s, 0%), var(--glow-l, 0%), 0.2)',
          },
          '50%': {
            boxShadow: '0 0 10px 3px hsla(var(--glow-h, 0), var(--glow-s, 0%), var(--glow-l, 0%), 0.5), 0 0 20px 5px hsla(var(--glow-h, 0), var(--glow-s, 0%), var(--glow-l, 0%), 0.3)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        "fadeIn": "fadeIn 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow-keyframe 2.5s infinite ease-in-out", // Applied to glow classes
      },
      boxShadow: {
        'glow-cyan': '0 0 8px 2px hsla(180, 100%, 50%, 0.4), 0 0 16px 4px hsla(180, 100%, 50%, 0.2)',
        'glow-red': '0 0 8px 2px hsla(0, 80%, 60%, 0.4), 0 0 16px 4px hsla(0, 80%, 60%, 0.2)',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
