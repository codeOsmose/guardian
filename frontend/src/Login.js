// frontend/src/Login.js

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
// 10.0.2.2 é o IP padrão para acessar o localhost da máquina hospedeira 
// quando rodando em um emulador Android. Se estiver em dispositivo físico, 
// use o IP real da sua máquina na rede.
const API_BASE_URL = 'http://10.0.2.2:8080';

const Login = ({ setAuthStatus, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // FUNÇÃO DE LOGIN COM CONEXÃO REAL AO BACKEND
    async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso na autenticação
        // Assumindo que o backend retorna um objeto com 'token'
        const { token } = data;

        if (token) {
          console.log('Login bem-sucedido! Token recebido:', token);

          // Se onLoginSuccess foi passado como prop, chame-o
          if (typeof onLoginSuccess === 'function') {
            onLoginSuccess(token);
          }
        } else {
          Alert.alert('Erro de Login', 'Resposta do servidor incompleta (Token ausente).');
        }
      } else {
        // Falha na autenticação (ex: 401 Unauthorized)
        const errorMessage = data.message || 'Credenciais inválidas ou erro no servidor.';
        Alert.alert('Falha no Login', errorMessage);
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
  }

    return (
        <View style={styles.container}>
            <Image source={require('./assets/shield.png')} style={styles.logo} />
            <Text style={styles.title}>GuardianApp Login</Text>
            
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

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                disabled={loading} // Desabilita o botão enquanto carrega
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>ENTRAR</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setAuthStatus('register')}>
                <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
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
        width: 100,
        height: 100,
        marginBottom: 30,
        tintColor: '#0056b3',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
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
        backgroundColor: '#007bff',
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
    registerText: {
        marginTop: 20,
        color: '#007bff',
    },
});

export default Login;