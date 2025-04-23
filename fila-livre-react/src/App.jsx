import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { FirebaseProvider } from './contexts/FirebaseContext';
import theme from './theme';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Queue from './pages/Queue';
import QRCode from './pages/QRCode';
import Settings from './pages/Settings';
import Statistics from './pages/Statistics';

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  // Em um ambiente real, verificaríamos se o usuário está autenticado
  // Para este exemplo, vamos simular que o usuário está sempre autenticado
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <FirebaseProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/queue" 
              element={
                <ProtectedRoute>
                  <Queue />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/qrcode" 
              element={
                <ProtectedRoute>
                  <QRCode />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/statistics" 
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FirebaseProvider>
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;
