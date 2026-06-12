import React from 'react'
import './App.css'
import './index.css'
import { Dashboard } from "./routes/Dashboard"
import AdminAssistant from './components/AdminAssitant'
import LoginPage from './components/LoginPage'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated, login, logout, loading, error, setError } = useAuth();

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={login}
        loading={loading}
        error={error}
        setError={setError}
      />
    );
  }

  return (
    <>
      <Dashboard onLogout={logout} />
      <AdminAssistant />
    </>
  );
}

export default App