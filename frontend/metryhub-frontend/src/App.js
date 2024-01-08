// App.js
import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './components/HomePage';

// Define a custom theme with a global style override for the body element
const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'rgba(242, 245, 250, 1)', // Set the background color for the whole page
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures the background color is applied globally */}
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
