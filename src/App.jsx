import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { currentUser } = useAuth();
  
  return currentUser ? <Dashboard /> : <AuthForm />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
