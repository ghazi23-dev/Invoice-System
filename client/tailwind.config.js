/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem" },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        // Kayan Voyage brand — teal from the logo
        brand: {
          50: "#effafc",
          100: "#d5f1f6",
          200: "#b0e3ed",
          300: "#79cee0",
          400: "#3cb1cb",
          500: "#1f8fa8",
          600: "#1b7a91",
          700: "#1a6376",
          800: "#1b5262",
          900: "#1a4553",
          950: "#0b2c37",
        },
        // Kayan Voyage brand — sun yellow from the logo
        sun: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fdf08b",
          300: "#fbe44d",
          400: "#f7d618",
          500: "#e2bd0b",
          600: "#c39306",
          700: "#9c6a09",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          muted: "hsl(var(--sidebar-muted))",
          accent: "hsl(var(--sidebar-accent))",
          border: "hsl(var(--sidebar-border))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 34 41 / 0.04), 0 1px 3px 0 rgb(15 34 41 / 0.06)",
        card: "0 1px 2px 0 rgb(15 34 41 / 0.04), 0 4px 16px -4px rgb(15 34 41 / 0.08)",
        pop: "0 10px 38px -10px rgb(15 34 41 / 0.25), 0 10px 20px -15px rgb(15 34 41 / 0.2)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("@headlessui/tailwindcss"), require("tailwindcss-animate")],
  // Preflight stays off so the PDF/print templates keep their browser defaults.
  // A minimal reset lives in src/App.css instead.
  corePlugins: {
    preflight: false,
  },
};
