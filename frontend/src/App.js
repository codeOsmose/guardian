// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa o AsyncStorage

import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

// Chave para armazenar o token
const AUTH_TOKEN_KEY = 'userAuthToken';

export default function App() {
    // authStatus pode ser: 'loading', 'login', 'register', ou 'dashboard'
    const [authStatus, setAuthStatus] = useState('loading');
    const [token, setToken] = useState(null);

    // 1. Efeito para carregar o token ao iniciar o app
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
                if (storedToken) {
                    setToken(storedToken);
                    setAuthStatus('dashboard');
                } else {
                    setAuthStatus('login');
                }
            } catch (error) {
                console.error('Erro ao carregar token:', error);
                setAuthStatus('login'); // Em caso de erro, volta para o login
            }
        };
        loadToken();
    }, []);

    // 2. Função de Login (chamada pelo Login.js)
    const handleLoginSuccess = async (newToken) => {
        try {
            await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
            setToken(newToken);
            setAuthStatus('dashboard');
        } catch (error) {
            console.error('Erro ao salvar token:', error);
            // Poderíamos mostrar um alerta aqui, mas o login de UI já foi bem-sucedido
            setAuthStatus('dashboard'); 
        }
    };

    // 3. Função de Logout (chamada pelo Dashboard.js)
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
            setToken(null);
            setAuthStatus('login');
        } catch (error) {
            console.error('Erro ao remover token:', error);
            // Força a mudança de status mesmo que não remova do storage
            setAuthStatus('login'); 
        }
    };
    
    // Função para navegar entre Login e Register
    const navigateAuth = (status) => {
        if (status === 'login' || status === 'register') {
            setAuthStatus(status);
        } else {
            // Se o Login for bem-sucedido (vindo do Login.js), o componente chama handleLoginSuccess
            // Se for logout, o Dashboard.js chama handleLogout
            console.error("Status de autenticação inválido passado para navigateAuth:", status);
        }
    }


    // Renderiza a tela correta baseada no status de autenticação
    const renderScreen = () => {
        if (authStatus === 'loading') {
            return (
                <View style={[styles.container, styles.loading]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        
        if (authStatus === 'login') {
            // Passamos handleLoginSuccess para o Login.js
            return <Login 
                        setAuthStatus={navigateAuth} 
                        onLoginSuccess={handleLoginSuccess}
                    />;
        }
        
        if (authStatus === 'register') {
            return <Register 
                        setAuthStatus={navigateAuth} 
                    />;
        }
        
        if (authStatus === 'dashboard') {
            // Passamos o token e a função de logout para o Dashboard
            return <Dashboard 
                        authToken={token} 
                        onLogout={handleLogout} 
                    />;
        }
        
        return <Login setAuthStatus={navigateAuth} onLoginSuccess={handleLoginSuccess} />;
    };

    return (
        <View style={styles.container}>
            {renderScreen()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});