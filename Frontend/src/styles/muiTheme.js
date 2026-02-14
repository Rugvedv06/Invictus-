// theme configuration for MUI components
import { createTheme } from "@mui/material/styles";

// Tailwind-inspired colors
const colors = {
  primary: {
    50: "#caf0f8",
    100: "#90e0ef",
    // 200, 300 not defined in index.css, interpolating or omitting
    300: "#48cae4", // Interpolated/Approximate for MUI 'light' prop if needed
    500: "#0077b6",
    // 600 not defined
    700: "#03045e",
    // 800, 900 not defined
  },
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    // 400, 500 not defined in index.css
    500: "#64748b", // Kept for MUI mapping
    600: "#475569",
    // 700, 800 not defined
    700: "#334155", // Kept for MUI 'dark' mapping
    900: "#0f172a",
  },
  success: {
    500: "#10b981",
  },
  warning: {
    500: "#f59e0b",
  },
  danger: {
    500: "#ef4444",
  },
};

export function getMuiTheme(mode = "light") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",

      primary: {
        main: colors.primary[500],
        light: colors.primary[300],
        dark: colors.primary[700],
      },

      secondary: {
        main: colors.secondary[500],
        light: colors.secondary[300],
        dark: colors.secondary[700],
      },

      success: {
        main: colors.success[500],
      },

      warning: {
        main: colors.warning[500],
      },

      error: {
        main: colors.danger[500],
      },

      background: {
        default: isDark ? colors.secondary[900] : colors.secondary[50],
        paper: isDark ? colors.secondary[800] : "#fff",
      },

      text: {
        primary: isDark ? colors.secondary[50] : colors.secondary[900],
        secondary: isDark ? colors.secondary[300] : colors.secondary[500],
      },
    },

    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      h1: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
      h2: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
      h3: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
      h4: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
      h5: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
      h6: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
    },

    shape: {
      borderRadius: 8, // matches --radius-lg
    },

    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiIconButton: {
        defaultProps: {
          disableRipple: false,
        },
      },
    },
  });
}
