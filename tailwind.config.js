/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // ──────────────────────────────────────────────────────────────────────
      // Otrum Design System — Material-You dark palette (matches reference UI)
      // ──────────────────────────────────────────────────────────────────────
      colors: {
        // Surface layers (darkest → brightest)
        "surface-dim":               "#0f131d",
        "surface":                   "#0f131d",
        "surface-container-lowest":  "#0a0e18",
        "surface-container-low":     "#171b26",
        "surface-container":         "#1c1f2a",
        "surface-container-high":    "#262a35",
        "surface-container-highest": "#313540",
        "surface-variant":           "#313540",
        "surface-bright":            "#353944",

        // Primary / accent (sky-blue brand)
        "primary":                   "#89ceff",
        "primary-container":         "#0ea5e9",
        "primary-fixed":             "#c9e6ff",
        "primary-fixed-dim":         "#89ceff",
        "on-primary":                "#00344d",
        "on-primary-container":      "#003751",
        "on-primary-fixed":          "#001e2f",
        "on-primary-fixed-variant":  "#004c6e",
        "inverse-primary":           "#006591",

        // Secondary (lighter blue)
        "secondary":                 "#7bd0ff",
        "secondary-container":       "#00a6e0",
        "secondary-fixed":           "#c4e7ff",
        "secondary-fixed-dim":       "#7bd0ff",
        "on-secondary":              "#00354a",
        "on-secondary-container":    "#00374d",
        "on-secondary-fixed":        "#001e2c",
        "on-secondary-fixed-variant":"#004c69",

        // Tertiary (green accent)
        "tertiary":                  "#4edea3",
        "tertiary-container":        "#00b17b",
        "tertiary-fixed":            "#6ffbbe",
        "tertiary-fixed-dim":        "#4edea3",
        "on-tertiary":               "#003824",
        "on-tertiary-container":     "#003b26",
        "on-tertiary-fixed":         "#002113",
        "on-tertiary-fixed-variant": "#005236",

        // Error
        "error":                     "#ffb4ab",
        "error-container":           "#93000a",
        "on-error":                  "#690005",
        "on-error-container":        "#ffdad6",

        // Neutral text / outline
        "background":                "#0f131d",
        "on-background":             "#dfe2f1",
        "on-surface":                "#dfe2f1",
        "on-surface-variant":        "#bec8d2",
        "outline":                   "#88929b",
        "outline-variant":           "#3e4850",
        "inverse-surface":           "#dfe2f1",
        "inverse-on-surface":        "#2c303b",
        "surface-tint":              "#89ceff",
      },

      // ──────────────────────────────────────────────────────────────────────
      // Typography scale
      // ──────────────────────────────────────────────────────────────────────
      fontSize: {
        "display-lg":   ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md":   ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg":  ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md":  ["18px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm":  ["15px", { lineHeight: "20px", fontWeight: "600" }],
        "body-default": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "body-compact": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "metric-default":["13px",{ lineHeight: "18px", fontWeight: "500" }],
        "label-mono-sm":["10px", { lineHeight: "14px", letterSpacing: "0.03em", fontWeight: "500" }],
        "label-badge":  ["11px", { lineHeight: "14px", letterSpacing: "0.02em", fontWeight: "600" }],
      },

      // ──────────────────────────────────────────────────────────────────────
      // Spacing tokens
      // ──────────────────────────────────────────────────────────────────────
      spacing: {
        "space-xs": "4px",
        "space-sm": "8px",
        "space-md": "12px",
        "space-lg": "20px",
        "space-xl": "32px",
        "margin":   "16px",
        "gutter":   "12px",
      },

      // ──────────────────────────────────────────────────────────────────────
      // Border radius
      // ──────────────────────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: "2px",
        lg: "4px",
        xl: "8px",
        "2xl": "12px",
        "3xl": "16px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
