import React, { createContext, useState, useContext, useEffect } from "react";
import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";

// Create a plain React context (no TypeScript types).
const ThemeContext = createContext();

// Our custom ThemeProvider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Fonts configuration
  const fonts = {
    brand: '"Playfair Display", "Georgia", serif',
    heading: '"Playfair Display", "Georgia", serif',
    body: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  // Gradients configuration
  const gradients = {
    brandOverlay: 'linear-gradient(rgba(113,122,144,0.8), rgba(26,34,56,0.9))',
    // Shopping cart inspired gradients
    darkGlass: 'linear-gradient(135deg, #1E1E22, #2A2A2E)',
    primaryGradient: 'linear-gradient(135deg, #F6511E, #902F12)',
    accentGradient: 'linear-gradient(90deg, #00FFFF, #1A6DED)',
    multiGradient: 'linear-gradient(135deg, #3B82F6, #9333EA, #EC4899)',
    glowGradient: 'linear-gradient(135deg,rgb(0, 180, 216), #FF6B6B)',
    shimmerGradient: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    blueGradient: 'linear-gradient(90deg, rgba(26, 109, 237, 0.2), rgba(0, 229, 255, 0.2))',
    // New hero overlay gradient matching the new color scheme
    heroOverlay: 'linear-gradient(135deg, rgba(246, 81, 30, 0.8), rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.7))'
  };

  // Glassmorphism utility styles for flexible reuse
  const glassmorphism = {
    // Subtle container effect
    container: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: 4,
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    // Strong glass effect for prominent elements
    strong: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 3,
    },
    // Card-style glass effect
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: 3,
    },
    // Overlay style for backgrounds
    overlay: {
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }
  };

  // Colors configuration
  const colors = {
    primary: '#F6511E', // Orange from shopping cart
    accent: '#00FFFF', // Cyan from shopping cart
    secondary: '#3B82F6', // Blue from shopping cart
    background: '#1E1E22', // Dark background from shopping cart
    surface: '#2A2A2E', // Dark surface from shopping cart
    // Original colors kept for backward compatibility
    lottieGreen: '#6FCF97',
    lottieTeal: '#59C5C5',
    // New shopping cart colors
    purple: '#9333EA',
    pink: '#EC4899',
    darkOrange: '#902F12',
    lightBlue: '#1A6DED',
    glassWhite: 'rgba(255,255,255,0.1)',
    glassBlack: 'rgba(0,0,0,0.3)'
  };  

  useEffect(() => {
    // This code will only run on the client side
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Create MUI theme based on our current state
  const muiTheme = createTheme({
    palette: {
      mode: theme === "dark" ? "dark" : "light",
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fonts, gradients, colors, glassmorphism }}>
      <MUIThemeProvider theme={muiTheme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

// Custom hook to consume the ThemeContext
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}