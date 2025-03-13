import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  safelist: [
    "aspect-square",
    "h-4",
    "w-4",
    "rounded-full",
    "border",
    "border-primary",
    "text-primary",
    "shadow",
    "focus:outline-none",
    "focus-visible:ring-1",
    "focus-visible:ring-ring",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "flex",
    "items-center",
    "justify-center",
    "h-3.5",
    "w-3.5",
    "fill-primary",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "collapsible-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-collapsible-content-height)",
          },
        },
        "collapsible-up": {
          from: {
            height: "var(--radix-collapsible-content-height)",
          },
          to: {
            height: "0",
          },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-25%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        bounce: "bounce 1s infinite",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "var(--tw-prose-body)",
            lineHeight: "1.75",
            a: {
              color: "var(--tw-prose-links)",
              textDecoration: "underline",
              fontWeight: "500",
            },
            h1: {
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
            h2: {
              marginTop: "1.25em",
              marginBottom: "0.5em",
            },
            h3: {
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            p: {
              marginTop: "1em",
              marginBottom: "1em",
            },
            img: {
              marginTop: "1.5em",
              marginBottom: "1.5em",
            },
            table: {
              width: "100%",
              marginTop: "1.5em",
              marginBottom: "1.5em",
              borderCollapse: "collapse",
            },
            "thead th": {
              borderBottom: "1px solid var(--tw-prose-th-borders)",
              padding: "0.5em",
              textAlign: "left",
            },
            "tbody td": {
              padding: "0.5em",
              borderBottom: "1px solid var(--tw-prose-td-borders)",
            },
          },
        },
      },
    },
  },
  plugins: [animate, typography],
};

export default config;
