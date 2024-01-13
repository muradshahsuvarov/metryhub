// App.js
import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './components/HomePage';
import VendorDashboard from './components/VendorDashboard'; // Import your VendorDashboard component
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
  // You will need to replace this with your actual logic for getting the user's role
  const userRole = 'vendor'; // This is just for demonstration purposes

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures the background color is applied globally */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vendor-dashboard" element={userRole === 'vendor' ? <VendorDashboard /> : <Navigate replace to="/" />} />
          {/* Add additional routes here */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
