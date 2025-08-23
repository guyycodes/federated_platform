import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { ClerkProvider, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { CssBaseline } from '@mui/material'
// import { registerSW } from 'virtual:pwa-register';
import { DataLayerProvider } from './Context/DataLayer.jsx';
import { ThemeProvider } from './Context/ThemeContext.jsx';
import { ShoppingCartProvider } from './Context/ShoppingCart.jsx';
import { PostHogProvider } from './Context/PostHogProvider.jsx';
import './Context/CartHelper.js'; // Initialize cart observer for localStorage sync

// Debug: Log all environment variables
console.log('Environment check:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  All_VITE_vars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  console.error('Missing Clerk Publishable Key');
  console.error('Available env vars:', import.meta.env);
  throw new Error("Missing Clerk Publishable Key");
}

const baseTheme = createTheme({
  typography: {
    // Custom font families that can be reused throughout the app
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    brand: '"Playfair Display", Georgia, serif',
    body: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '"Playfair Display", Georgia, serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `  
        * {
          -webkit-font-smoothing: antialiased;
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          height: 100%;
          font-family: Inter, Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        button:focus-visible {
          outline: 2px solid #4a90e2 !important;
          outline: -webkit-focus-ring-color auto 5px !important;
        }
        a {
          text-decoration: none;
        }
      `,
    },
  },
});

// Register the service worker
// const updateSW = registerSW({
//   onNeedRefresh() {
//     // Show a prompt to the user asking them if they want to refresh the page to use the new version
//     if (confirm("A new version is available, do you want to refresh?")) {
//       updateSW();
//     }
//   },
//   onOfflineReady() {
//     // Show a message when the app is ready to work offline
//     console.log("The app is ready to work offline!");
//   },
// });


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/login"
      signUpUrl="/register"
      // afterSignInUrl="/layout/dashboard"
      // afterSignUpUrl="/layout/dashboard"
      userProfile={{ 
        sessionPollingInterval: 300000 // 5 minutes instead of default
      }}
    >
      <PostHogProvider>
        <MuiThemeProvider theme={baseTheme}>
          <DataLayerProvider>
            <ThemeProvider>
              <ShoppingCartProvider>
                <BrowserRouter>
                  <CssBaseline /> 
                  <App />
                </BrowserRouter>
              </ShoppingCartProvider>
            </ThemeProvider>
          </DataLayerProvider>
        </MuiThemeProvider>
      </PostHogProvider>
    </ClerkProvider>
  </StrictMode>,
)
