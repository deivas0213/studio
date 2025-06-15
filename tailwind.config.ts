
import type {Config} from 'tailwindcss';

export default {
  darkMode: 'class', // Ensure dark mode is enabled via class
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
        body: ['Inter', 'sans-serif'], 
        headline: ['Inter', 'sans-serif'], 
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
          DEFAULT: 'hsl(var(--primary))', 
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))', 
          foreground: 'hsl(var(--secondary-foreground))', 
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', 
          foreground: 'hsl(var(--accent-foreground))', 
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))', 
          foreground: 'hsl(var(--destructive-foreground))', 
        },
        success: { 
          DEFAULT: 'hsl(var(--success))', 
          foreground: 'hsl(var(--success-foreground))', 
        },
        border: 'hsl(var(--border))', 
        input: {
          DEFAULT: 'hsl(var(--input))',
          border: 'hsl(var(--input-border))', // Renamed from 'input-border' for clarity
        },
        ring: 'hsl(var(--ring))', 
      },
      borderRadius: {
        lg: 'var(--radius)', // 12px
        md: 'calc(var(--radius) - 4px)', // 8px
        sm: 'calc(var(--radius) - 6px)', // 6px
        'xl': 'calc(var(--radius) + 4px)', // 16px
        '2xl': 'calc(var(--radius) + 8px)', // 20px
        '20px': '20px', // Custom 20px
      },
      fontSize: {
        '4.5xl': ['2.25rem', { lineHeight: '2.5rem' }], 
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
        // pulse-glow keyframe will be handled by globals.css for light/dark variants
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        "fadeIn": "fadeIn 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2.5s infinite ease-in-out", // References @keyframes pulse-glow from globals.css
      },
      boxShadow: { // General shadows, glow is specific
        'glow-primary': '0 0 8px 2px hsla(var(--primary-h,0), var(--primary-s,0%), var(--primary-l,0%), 0.3), 0 0 16px 4px hsla(var(--primary-h,0), var(--primary-s,0%), var(--primary-l,0%), 0.15)',
        'glow-destructive': '0 0 8px 2px hsla(var(--destructive-h,0), var(--destructive-s,0%), var(--destructive-l,0%), 0.3), 0 0 16px 4px hsla(var(--destructive-h,0), var(--destructive-s,0%), var(--destructive-l,0%), 0.15)',
         // Dark mode specific glows might be more intense, primarily controlled via globals.css with HSL variables
        'dark-glow-primary': '0 0 10px 3px hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.5), 0 0 20px 5px hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.3)',
        'dark-glow-destructive': '0 0 10px 3px hsla(var(--destructive-h), var(--destructive-s), var(--destructive-l), 0.5), 0 0 20px 5px hsla(var(--destructive-h), var(--destructive-s), var(--destructive-l), 0.3)',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
