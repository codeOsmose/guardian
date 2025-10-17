
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // Replace with your backend API endpoint
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming your backend returns a token
        // In a real app, you'd save this securely (e.g., AsyncStorage)
        console.log('Login successful:', data);
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        onLoginSuccess();
      } else {
        Alert.alert('Erro no Login', data.message || 'Email ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
      Alert.alert('Erro', 'Não foi possível conectar com o servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/shield.png')} // Certifique-se de ter um ícone de escudo em assets
        style={styles.logo}
      />
      <Text style={styles.title}>GuardianApp</Text>
      <Text style={styles.subtitle}>Gerencie suas assinaturas com segurança</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSwitchToRegister}>
        <Text style={styles.registerText}>
          Não tem uma conta? <Text style={styles.registerLink}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    tintColor: '#6a5acd', // Cor do ícone, se for SVG ou PNG com transparência
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#6a5acd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    fontSize: 16,
    color: '#666',
  },
  registerLink: {
    color: '#6a5acd',
    fontWeight: 'bold',
  },
});

export default Login;

