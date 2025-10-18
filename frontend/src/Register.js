// frontend/src/Register.js

import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Image, 
    Alert,
    ActivityIndicator 
} from 'react-native';

// URL base do seu backend Spring Boot. 
const API_BASE_URL = 'http://10.0.2.2:8080';

const Register = ({ setAuthStatus }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // FUNÇÃO DE REGISTRO COM CONEXÃO REAL AO BACKEND
    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Assumindo que o endpoint de registro espera 'username' e 'password'
                body: JSON.stringify({ username: email, password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Sucesso no registro
                Alert.alert(
                    'Sucesso!', 
                    'Usuário registrado com sucesso. Faça o login para continuar.'
                );
                
                // Redireciona para a tela de Login
                setAuthStatus('login'); 
            } else {
                // Falha no registro (ex: 409 Conflict se o usuário já existir)
                const errorMessage = data.message || 'Erro ao tentar registrar. O usuário pode já existir.';
                Alert.alert('Falha no Registro', errorMessage);
                console.error('Erro de resposta do servidor:', data);
            }
        } catch (error) {
            // Erro de rede ou servidor inacessível
            console.error('Erro de conexão:', error);
            Alert.alert(
                'Erro de Conexão', 
                'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://10.0.2.2:8080.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('./assets/shield.png')} style={styles.logo} />
            <Text style={styles.title}>Novo Usuário</Text>
            
            <TextInput
                style={styles.input}
                placeholder="E-mail (Username)"
                placeholderTextColor="#A9A9A9"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#A9A9A9"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <TextInput
                style={styles.input}
                placeholder="Confirme a Senha"
                placeholderTextColor="#A9A9A9"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>CADASTRAR</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setAuthStatus('login')}>
                <Text style={styles.loginText}>Já tem conta? Voltar para o Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
        tintColor: '#0056b3',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        color: '#333',
    },
    button: {
        width: '100%',
        backgroundColor: '#28a745', // Cor verde para cadastro
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        marginTop: 20,
        color: '#007bff',
    },
});

export default Register;