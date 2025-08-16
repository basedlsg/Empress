// Central theme configuration for Empress MVP
// Inspired by EmpressNaturals.co luxury aesthetic
export const empressTheme = {
  colors: {
    // Primary brand colors - luxury purple palette
    primary: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7", // Main brand purple
      600: "#9333ea",
      700: "#7c3aed",
      800: "#6b21a8",
      900: "#581c87",
    },
    // Secondary accent - elegant gold
    secondary: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b", // Elegant gold
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    // Neutral grays with purple undertones
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
    // Success green for achievements
    success: {
      50: "#f0fdf4",
      500: "#22c55e",
      600: "#16a34a",
    },
    // Warning amber
    warning: {
      50: "#fffbeb",
      500: "#f59e0b",
      600: "#d97706",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      serif: ["Playfair Display", "Georgia", "serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
    },
    lineHeight: {
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "5rem",
  },
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
} as const

export type EmpressTheme = typeof empressTheme

// Theme utilities
export const getThemeColor = (color: keyof typeof empressTheme.colors, shade = 500) => {
  return empressTheme.colors[color][shade as keyof (typeof empressTheme.colors)[typeof color]]
}

export const getThemeSpacing = (size: keyof typeof empressTheme.spacing) => {
  return empressTheme.spacing[size]
}
