
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
// Em um projeto React Native real, você usaria algo como @react-native-async-storage/async-storage
// para armazenar o token de forma segura.
// Por simplicidade, estamos simulando um armazenamento local.

const App = () => {
  const [view, setView] = useState('login'); // 'login', 'register', 'dashboard'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de token ao iniciar o app
    const checkAuth = async () => {
      // Em um app real, você leria o token de um armazenamento seguro
      const token = null; // Simulação: sem token salvo inicialmente
      if (token) {
        setIsAuthenticated(true);
        setView('dashboard');
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    // Em um app real, o token seria salvo aqui
    setIsAuthenticated(true);
    setView('dashboard');
  };

  const handleLogout = () => {
    // Em um app real, o token seria removido daqui
    setIsAuthenticated(false);
    setView('login');
  };

  const handleSwitchToRegister = () => {
    setView('register');
  };

  const handleSwitchToLogin = () => {
    setView('login');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a5acd" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f8" />
      {view === 'login' && (
        <Login
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {view === 'register' && (
        <Register onSwitchToLogin={handleSwitchToLogin} />
      )}
      {view === 'dashboard' && isAuthenticated && (
        <Dashboard onLogout={handleLogout} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default App;

